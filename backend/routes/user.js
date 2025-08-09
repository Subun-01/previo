const express = require('express');
const router = express.Router();
const { generateRoadmapWithLLM } = require('../agents/roadmapAgent');

// Middleware to extract authenticated user from token (simplified)
const getUserFromToken = async (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
//   console.log(token);
    
  const { data, error } = await req.supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: 'Invalid token' });

  req.user = data.user;
//   console.log(`Authenticated user: ${req.user.id}`);
  
  next();
};

// Route to generate a personalized study roadmap
router.post('/generate-roadmap', getUserFromToken, async (req, res) => {
  const {durationWeeks } = req.body;
  const { user } = req;

  // Fetch latest user preferences (from roadmaps table)
  const { data: latestRoadmap, error: fetchError } = await req.supabase
    .from('roadmaps')
    .select('data')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();



    if (fetchError || !latestRoadmap) {
    return res.status(400).json({ error: "No preferences found. Please save preferences first." });
  }

  const { targetRole, weakTopics } = latestRoadmap.data;
  if (!targetRole || !weakTopics || !weakTopics.length) {
    return res.status(400).json({ error: "Incomplete preferences. Please provide target role and weak topics." });
  }

  try {
    // Generate roadmap using LLM
    const roadmap = await generateRoadmapWithLLM({
      targetRole,
      weakTopics,
      durationWeeks: durationWeeks || 6 // Default to 6 weeks if not provided
    });

    // Save generated roadmap to roadmaps table
    const { data, error: saveError } = await req.supabase
      .from('roadmaps')
      .insert([
        {
          user_id: user.id,
          data: roadmap
        }
      ])
      .select();

    if (saveError) return res.status(400).json({ error: saveError.message });

    res.json({ roadmap: data[0] });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ error: "Failed to generate roadmap. " + error.message });
  }

});

// Save preferences
router.post('/preferences', getUserFromToken, async (req, res) => {
  const { targetRole, weakTopics } = req.body;
  const { user } = req;

  // Save to roadmaps table (MVP: just store preferences, roadmap generation comes next)
  const { data, error } = await req.supabase
    .from('roadmaps')
    .insert([
      {
        user_id: user.id,
        data: { targetRole, weakTopics }
      }
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ roadmap: data[0] });
});

module.exports = router;
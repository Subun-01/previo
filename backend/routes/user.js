const express = require('express');
const router = express.Router();
const { generateRoadmapWithLLM } = require('../agents/roadmapAgent');
const { getInstantFeedbackLLM } = require('../agents/feedbackAgent');
const { saveAttempt } = require('../utils/saveAttempts');
const { generateQuestionsLLM } = require('../agents/questionGeneratorAgent');




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

// Route to get user preferences
router.post('/preferences', getUserFromToken, async (req, res) => {
  const { targetRole, weakTopics, durationWeeks } = req.body;
  const { user } = req;
  
    // Check for existing roadmap for this user and targetRole
    const { data: existingRows, error: fetchError } = await req.supabase
      .from('roadmaps')
      .select('id, preference')
      .eq('user_id', user.id);

    if (fetchError) {
      return res.status(400).json({ error: fetchError.message });
    }

    // Find if any row has the same targetRole
    let existing = null;
    if (Array.isArray(existingRows)) {
      existing = existingRows.find(row => row.preference && row.preference.targetRole === targetRole);
    }

  let result, error;
    if (existing) {
    // Update existing row if targetRole is the same
    ({ data: result, error } = await req.supabase
      .from('roadmaps')
      .update({ preference: { targetRole, weakTopics, durationWeeks } })
      .eq('id', existing.id)
      .select());
      // console.log("hit1");
  } else {
    // Insert new row if targetRole is different or no row exists
    ({ data: result, error } = await req.supabase
      .from('roadmaps')
      .insert([
        {
          user_id: user.id,
          preference: { targetRole, weakTopics, durationWeeks }
        }
      ])
      .select());
      // console.log("hit2");
  }

  if (error) return res.status(400).json({ error: error.message });
  res.json({ preference: result[0] });
});


/*
          AGENT-1 ROADMAP AGENT
*/

// Route to generate a personalized study roadmap
router.post('/generate-roadmap', getUserFromToken, async (req, res) => {
  const { targetRole, durationWeeks } = req.body;
  const { user } = req;
// console.log(targetRole);

    // Fetch user preferences for the given targetRole (from roadmaps table)
    const { data: prefRows, error: fetchError } = await req.supabase
      .from('roadmaps')
      .select('id,preference')
      .eq('user_id', user.id);

    if (fetchError) {
      return res.status(400).json({ error: "Error fetching preferences." });
    }

    // console.log(prefRows);
    
    // Find the row with the matching targetRole
    const latestRoadmap = Array.isArray(prefRows)
      ? prefRows.find(row => row.preference && row.preference.targetRole === targetRole)
      : null;

    if (!latestRoadmap) {
      return res.status(400).json({ error: "No preferences found for the given target role. Please save preferences first." });
    }

    const { weakTopics } = latestRoadmap.preference || {};
    if (!targetRole || !weakTopics || !weakTopics.length) {
      return res.status(400).json({ error: "Incomplete preferences. Please provide target role and weak topics." });
    }

    console.log(`Generating roadmap for target role: ${targetRole}, preferences: ${JSON.stringify(latestRoadmap.preference)}`);
    

  try {
    // Generate roadmap using LLM
    const roadmap = await generateRoadmapWithLLM({
      targetRole,
      weakTopics,
      durationWeeks: durationWeeks || 6 // Default to 6 weeks if not provided
    });
    // const roadmap = null;

    // Update the generated roadmap in the roadmaps table for the user
    const { data, error: saveError } = await req.supabase
      .from('roadmaps')
      .update({ data: roadmap })
      .eq('id', latestRoadmap.id)
      .select();

    if (saveError) return res.status(400).json({ error: saveError.message });

    res.json({ roadmap: data[0] });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ error: "Failed to generate roadmap. " + error.message });
  }

});




/*
          AGENT-2 Question generating AGENT
*/
// POST /api/agent2/generate-questions
router.post('/generate-questions', getUserFromToken, async (req, res) => {
  const { targetRole, topic, roadmap, day, numberOfQuestions, questionType } = req.body;
  console.log("calling generate questions with params:", { targetRole, topic, roadmap, day, numberOfQuestions, questionType });
  
  try {
    const questions = await generateQuestionsLLM({
      targetRole, topic, roadmap, day,
      count: numberOfQuestions, type: questionType
    });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/agent2/submit-answer
router.post('/submit-answer', getUserFromToken, async (req, res) => {
  const { question, answer, topic, day, questionType, roadmap, targetRole} = req.body;
  const { user } = req;
  try {
    const feedbackObj = await getInstantFeedbackLLM(targetRole,question, answer);
    
    await saveAttempt({
      userId: user.id,
      question,
      answer,
      topic,
      day,
      questionType,
      instantFeedback: feedbackObj.feedback,
      instantScore: feedbackObj.score,
      roadmap,
      targetRole
    });
    res.json({ feedback: feedbackObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
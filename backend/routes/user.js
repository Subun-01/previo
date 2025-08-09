const express = require('express');
const router = express.Router();

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
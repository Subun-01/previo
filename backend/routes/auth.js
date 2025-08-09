const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await req.supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await req.supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user, session: data.session });
});

module.exports = router;
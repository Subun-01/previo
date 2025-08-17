// Middleware to extract authenticated user from token (simplified)
getUserFromToken = async (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
//   console.log(token);
    
  const { data, error } = await req.supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: 'Invalid token' });

  req.user = data.user;
//   console.log(`Authenticated user: ${req.user.id}`);
  next();
};

module.exports = { getUserFromToken };
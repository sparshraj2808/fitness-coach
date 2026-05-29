import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fitcoach_ai_jwt_secret_key_2026_neon');
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Access Denied: Invalid or Expired Token' });
  }
}

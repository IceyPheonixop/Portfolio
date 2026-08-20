// server/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function sendToken(user, res) {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res
    .cookie('token', token, cookieOptions)
    .json({
      token, // <--- ADD THIS SO CLIENT RECEIVES THE TOKEN
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid email or password.' });

  sendToken(user, res);
}

export function logout(req, res) {
  res.clearCookie('token', cookieOptions).json({ message: 'Logged out successfully.' });
}

export function me(req, res) {
  res.json({
    user: {
      id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
}
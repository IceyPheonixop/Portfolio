import 'dotenv/config'; import { connectDB } from '../config/db.js'; import User from '../models/User.js';
const [name, email, password] = process.argv.slice(2); if (!name || !email || !password || password.length < 12) { console.error('Usage: npm run create-admin -- "Name" admin@example.com "a-strong-password" (minimum 12 characters)'); process.exit(1); } await connectDB(); if (await User.exists({ email: email.toLowerCase() })) throw new Error('An account with that email already exists.'); await User.create({ name, email, password }); console.log('Admin account created.'); process.exit(0);


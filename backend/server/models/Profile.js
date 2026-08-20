import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  { url: String, publicId: String },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Your Name' },
    title: { type: String, default: 'Software Developer' },
    tagline: { type: String, default: '' }, // <-- Home page short intro
    bio: { type: String, default: '' },     // <-- About me detailed story
    email: { type: String, trim: true, lowercase: true },
    phone: String,
    location: String,
    availability: { type: String, default: 'Open to opportunities' },
    image: assetSchema,        // <-- Sidebar Profile Avatar
    aboutImage: assetSchema,   // <-- About Me Page Photo
    resume: assetSchema,
    githubUsername: String,
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);

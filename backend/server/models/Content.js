import mongoose from 'mongoose';

const common = { order: { type: Number, default: 0 } };

export const Skill = mongoose.model(
  'Skill',
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      category: {
        type: String,
        required: true,
        trim: true,
        // Automatically capitalize first letter (e.g. 'database' -> 'Database', 'frontend' -> 'Frontend')
        set: (v) => {
          if (!v) return v;
          const trimmed = v.trim();
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        },
        enum: [
          'Programming',
          'Frontend',
          'Backend',
          'Database',
          'Data Analytics',
          'Tools',
        ],
      },
      icon: String,
      ...common,
    },
    { timestamps: true }
  )
);

export const Experience = mongoose.model(
  'Experience',
  new mongoose.Schema(
    {
      company: { type: String, required: true },
      role: { type: String, required: true },
      duration: { type: String, required: true },
      description: { type: String }, // <-- ADD THIS LINE
      responsibilities: [String],
      technologies: [String],
      ...common,
    },
    { timestamps: true }
  )
);

export const Education = mongoose.model(
  'Education',
  new mongoose.Schema(
    {
      degree: { type: String, required: true },
      institution: String,
      university: String,
      startYear: Number,
      endYear: Number,
      description: String,
      achievements: [String],
      ...common,
    },
    { timestamps: true }
  )
);

export const Achievement = mongoose.model(
  'Achievement',
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      type: { type: String },
      issuer: String,
      date: String,
      description: String,
      image: { url: String, publicId: String },
      ...common,
    },
    { timestamps: true }
  )
);

export const SocialLink = mongoose.model(
  'SocialLink',
  new mongoose.Schema(
    {
      platform: { type: String, required: true },
      username: String,
      url: { type: String, required: true },
      icon: String,
      ...common,
    },
    { timestamps: true }
  )
);
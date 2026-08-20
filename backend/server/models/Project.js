import mongoose from 'mongoose';
import slugify from 'slugify';
const assetSchema = new mongoose.Schema({ url: { type: String, required: true }, publicId: String }, { _id: false });
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 }, slug: { type: String, required: true, unique: true, index: true }, shortDescription: { type: String, required: true, maxlength: 300 }, description: String, problemStatement: String, solution: String, features: [String], technologies: [String], category: { type: String, required: true, enum: ['Web Development', 'Full Stack', 'MERN', 'Python', 'Data Analytics', 'AI/ML', 'IoT', 'Other'] }, githubUrl: String, liveDemoUrl: String, image: assetSchema, gallery: [assetSchema], featured: { type: Boolean, default: false }, status: { type: String, enum: ['published', 'draft'], default: 'draft', index: true }, order: { type: Number, default: 0 }
}, { timestamps: true });
projectSchema.index({ status: 1, order: 1 });
projectSchema.pre('validate', function () { if (this.isModified('title') && !this.slug) this.slug = slugify(this.title, { lower: true, strict: true }); });
export default mongoose.model('Project', projectSchema);

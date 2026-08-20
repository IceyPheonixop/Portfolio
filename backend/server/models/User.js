import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, password: { type: String, required: true, select: false, minlength: 12 }, role: { type: String, enum: ['admin'], default: 'admin' } }, { timestamps: true });
userSchema.pre('save', async function () { if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12); });
userSchema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.password); };
export default mongoose.model('User', userSchema);

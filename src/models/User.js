import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Course from './Course.js';

const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  imageId: { type: String },
  type: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
  deviceId: { type: String, default: '' },
  password: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Instructor who created this student
  paymentType: { type: String, enum: ['half', 'full', null], default: null }, // Payment type for students: 'half' or 'full'
}, { timestamps: true });

// Use Mongoose Middleware (pre Hook)
// To automatically delete related course when a user is deleted ( And we use Pre Hook also when delete course so all data about course will be deleted )
// use the pre("deleteOne") or pre("findOneAndDelete") middleware in Mongoose.
// OR 
// 
UserSchema.pre('findOneAndDelete', async function (next) {
  const userId = this.getQuery()._id;
  
  // Delete all courses linked to this user (if user is an instructor)
  const courses = await Course.find({ instructor: userId });
  for (const course of courses) {
    await Course.findByIdAndDelete(course._id);
  }
  // await Course.deleteMany({ instructor: userId });
  
  // Delete all enrollments linked to this user (if user is a student)
  // Dynamically import Enrollment to avoid circular dependencies
  const Enrollment = (await import('./Enrollment.js')).default;
  await Enrollment.deleteMany({ user: userId });
  
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password for login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);

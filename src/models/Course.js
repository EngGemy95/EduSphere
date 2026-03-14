import mongoose from 'mongoose';
import Section from './Section.js';
import Lecture from './Lecture.js';

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: '0' },
  description: { type: String, required: true, default: '' },
  imageId: { type: String },
  visible: { type: String, enum: ['ON', 'OFF'], required: true, default: 'OFF' },
  activationCode: { type: String, required: true, },
  nameColor: { type: String, default: null }, // Hex color code for course name (e.g., '#FF5733')
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
}, { timestamps: true });

// Use Mongoose Middleware (pre Hook)
// To automatically delete related sections and lectures when a course is deleted, use the pre("deleteOne") 
// or pre("findOneAndDelete") middleware in Mongoose.
// OR 
// 
CourseSchema.pre("findOneAndDelete", async function (next) {
  const courseId = this.getQuery()._id;

  // Delete all sections linked to this course
  const sections = await Section.find({ courseId });
  for (const section of sections) {
    // Delete all lectures linked to this section
    await Lecture.deleteMany({ sectionId: section._id });
  }

  // Delete sections after deleting lectures
  await Section.deleteMany({ courseId });

  next();
});

export default mongoose.model('Course', CourseSchema);

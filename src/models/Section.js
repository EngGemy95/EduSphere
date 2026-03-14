import mongoose from 'mongoose';
import Lecture from './Lecture.js';

const SectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    order: { type: Number, default: 0 }, // Order index for sorting sections
}, { timestamps: true });

SectionSchema.pre('findOneAndDelete', async function (next) {
    const sectionId = this.getQuery()._id;

    const lectures = await Lecture.find({ sectionId: sectionId });
    for (const lecture of lectures) {
        // Delete all lectures linked to this section
        await Lecture.findByIdAndDelete(lecture._id);
    }

    next();
});
export default mongoose.model('Section', SectionSchema);
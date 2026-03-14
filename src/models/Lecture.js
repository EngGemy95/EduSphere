import mongoose from 'mongoose';

const LectureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    visible: { type: String, enum: ['ON', 'OFF'], required: true, default: 'OFF' },
    type: { type: String, enum: ['video', 'pdf', 'quiz', 'lesson'], required: true, default: 'video' },
    order: { type: Number, default: 0 }, // Order index for sorting lectures
}, { timestamps: true });

export default mongoose.model('Lecture', LectureSchema);

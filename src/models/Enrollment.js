import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    // activationCode: { type: String, required: true },
    // activated: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Enrollment', EnrollmentSchema);

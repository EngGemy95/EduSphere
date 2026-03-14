import mongoose from 'mongoose';

const EnrollmentRequestSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    activationCode: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    instructor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Optional: Add reason for rejection
    rejectionReason: { 
        type: String 
    },
}, { timestamps: true });

// Index for faster queries
EnrollmentRequestSchema.index({ course: 1, status: 1 });
EnrollmentRequestSchema.index({ instructor: 1, status: 1 });
EnrollmentRequestSchema.index({ user: 1, course: 1 });

export default mongoose.model('EnrollmentRequest', EnrollmentRequestSchema);

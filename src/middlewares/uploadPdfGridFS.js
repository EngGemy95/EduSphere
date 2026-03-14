import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { uploadImageGridFS } from './uploadImageGridFS.js';

// Function to initialize GridFSBucket
const initGridFS = async () => {
    if (mongoose.connection.readyState === 1) {
        return new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    } else {
        throw new Error('Mongoose is not connected to MongoDB.');
    }
};

// Upload PDF to GridFS (reuse the same function as images)
const uploadPdfGridFS = async (file) => {
    if (!file) throw new Error("No PDF file provided");

    // Check file size (50MB for PDFs)
    const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_PDF_SIZE) {
        throw new Error("PDF file size exceeds limit (50MB)");
    }

    // Use the same upload function as images
    return await uploadImageGridFS(file);
};

// Download PDF from GridFS
const downloadPdfFromGridFS = async (req, res) => {
    try {
        const { fileId } = req.params;

        const bucket = await initGridFS();

        // Check if file exists
        const file = await bucket
            .find({ _id: new mongoose.Types.ObjectId(fileId) })
            .toArray();
        if (file.length === 0) {
            return res.status(404).json({ error: "PDF file not found" });
        }

        // Set the headers for PDF
        res.set("Content-Type", 'application/pdf');
        res.set("Content-Disposition", `inline; filename="${file[0].filename}"`);

        // Create a stream to read from the bucket
        const downloadStream = bucket.openDownloadStream(
            new mongoose.Types.ObjectId(fileId)
        );

        // Pipe the stream to the response
        downloadStream.pipe(res);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: { text: `Unable to download PDF file`, error } });
    }
};

// Delete PDF from GridFS
const deletePdfFromGridFS = async (fileId) => {
    const bucket = await initGridFS();
    const objectId = new mongoose.Types.ObjectId(fileId);
    await bucket.delete(objectId);
};

export { uploadPdfGridFS, downloadPdfFromGridFS, deletePdfFromGridFS };

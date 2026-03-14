import { uploadPdfGridFS } from "./uploadPdfGridFS.js";

const gridFsUploadPdfMiddleware = async (req, res, next) => {
    try {
        if (!req.file) {
            console.log('No PDF file in request, continuing without upload');
            return next();
        }

        console.log('PDF file received:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        const fileId = await uploadPdfGridFS(req.file);
        console.log('PDF uploaded to GridFS with fileId:', fileId);
        
        // Convert ObjectId to string for JSON response
        req.body.pdfFileId = fileId.toString ? fileId.toString() : fileId;
        
        next(); // Pass control to createLecture
    } catch (error) {
        console.error('Error uploading PDF to GridFS:', error);
        return res.status(500).json({ 
            error: error.message || 'Failed to upload PDF file',
            details: error.stack 
        });
    }
};

export default gridFsUploadPdfMiddleware;

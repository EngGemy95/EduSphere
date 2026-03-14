import { uploadImageGridFS } from "./uploadImageGridFS.js";

const gridFsUploadMiddleware = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const fileId = await uploadImageGridFS(req.file);
        req.body.fileId = fileId; // Attach fileId to request body
        next(); // Pass control to createUser
    } catch (error) {
        return res.status(500).json({ error: error.message});
    }
};

export default gridFsUploadMiddleware;
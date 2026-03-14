import multer from 'multer';


// This ( does not ) Save Files in folder in the project ( using diskStorage)

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Use memory storage to avoid saving files to disk
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  //limits: { fileSize: MAX_FILE_SIZE }, // Limit file size
});
const uploadMiddleware = upload.single('image')

export default uploadMiddleware;

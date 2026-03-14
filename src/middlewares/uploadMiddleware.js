import multer from 'multer';
import path from 'path';


// This Save Files in folder in the project ( using diskStorage)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Set up storage engine for Multer
const storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    if (file.size > MAX_FILE_SIZE) {
      return cb(new Error("File size exceeds limit (5MB)"));
    }
    cb(null, true);
  },
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Store uploaded files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp as filename
  },
});

// Create the Multer instance
const upload = multer({
  //limits: { fileSize: MAX_FILE_SIZE },
  storage: storage
});

export default upload;

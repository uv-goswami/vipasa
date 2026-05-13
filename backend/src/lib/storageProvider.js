import multer from 'multer';
import path from 'path';
import fs from 'fs';
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const localStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    console.log("DETECTED MIME TYPE:", file.mimetype);
    console.log("DETECTED FILE NAME:", file.originalname);
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type. Omly PDF and Images are allowed."));
    }
};
export const uploadProvider = multer({
    storage: localStorageEngine,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

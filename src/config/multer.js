const multer = require('multer');
const path = require('path');   
const fs = require('fs');
const uploadDir = 'uploads/';
const cvUploadDir = 'uploads/cvs/';

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(cvUploadDir)){
    fs.mkdirSync(cvUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },

});

const storageCV = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, cvUploadDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Multer for Images
const uploadImage = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    },
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

// Multer for CVs (PDF, DOC, DOCX)
const uploadCV = multer({ 
    storage: storageCV,
    fileFilter: function (req, file, cb) {
        // Allowed MIME types and extensions for documents
        const filetypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
        const extnames = /pdf|doc|docx/;

        const mimetype = filetypes.test(file.mimetype);
        const extname = extnames.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .pdf, .doc, and .docx format allowed for CVs!'));
    },
    limits: { fileSize: 1024 * 1024 * 10 } // 10MB limit for CVs
});

// Export both configurations
module.exports = {
    uploadImage,
    uploadCV
};
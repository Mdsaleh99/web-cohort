import multer from "multer";
import path from "path"
// first file we store on our server after that we pass to 3rd party

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // This storage needs public/images folder in the root directory
        // Else it will throw an error saying cannot find path public/images
        cb(null, `./public/images`);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Middleware responsible to read form data and upload the File object to the mentioned path
export const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1000 * 1000,
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true); // Accept the file
        } else {
            cb(
                new Error(
                    "Invalid file type. Only JPEG, PNG, and GIF are allowed.",
                ),
                false,
            );
        }
    },
});
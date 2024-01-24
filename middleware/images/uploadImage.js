import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import errConstructor from "../err/err.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "files/images");
    },
    filename: function (req, file, cb) {
        // Génération d'un nom de fichier unique
        const ext = path.extname(file.originalname);
        const filename = uuidv4() + ext;
        cb(null, `${filename}`);
    }
});

// Vérifie si le fichier est une image
const fileFilter = function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true); // Accepter le fichier
    } else {
        cb(new errConstructor("FileFormatError", "Le fichier doit être une image (JPEG, PNG ou JPG).", 400), false); // Rejeter le fichier
    }
};

// Middleware d'upload d'image
const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024 // Limiter la taille du fichier à 5 Mo
    },
    fileFilter: fileFilter
}).fields([
    { name: 'profil', maxCount: 1 },
    { name: 'couverture', maxCount: 1 }
]);

export default uploadImage;
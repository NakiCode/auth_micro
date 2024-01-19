import multer  from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { FileErrHandle } from "../../helpers/err/fileErr.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Fichiers/images");
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
    cb(new FileErrHandle('Le fichier doit être une image (JPEG, PNG ou JPG).'), false); // Rejeter le fichier
  }
};

// Middleware d'upload d'image
export const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024 // Limiter la taille du fichier à 5 Mo
  },
  fileFilter: fileFilter
}).fields([
    { name: 'profile', maxCount: 1 },
    { name: 'couverture', maxCount: 1 },
    { name: 'imageResto', maxCount: 1 },
    { name: 'couvertureResto', maxCount: 1 },
    { name: 'imageProduct', maxCount: 3 },
    {name: 'imageCategorie', mawCount: 1}

  ]);


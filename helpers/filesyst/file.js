import fs from 'fs';
import errConstructor from '../../middleware/err/err.js';

// Fonction pour créer un dossier de manière asynchrone
const createDirectory= async (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        reject(errConstructor('FileError', 'Impossible de créer le dossier initialement', 500));
      } else {
        resolve();
      }
    });
  });
}
// Fonction pour créer les dossiers en fonction du mode d'exécution
const createDirectories = async () => {
  const mode = process.env.NODE_ENV;
  if (mode === 'development') {
    try {
      await createDirectory('files/images');
      await createDirectory('files/videos');
    } catch (error) {
      errConstructor('FileError', 'Une erreur est survenue en mode développement', 500);
    }
  } else if (mode === 'production') {
    try {
      await createDirectory('client/build/images');
      await createDirectory('client/build/videos');
      await createDirectory('log');
    } catch (error) {
        errConstructor('FileError',`Une erreur est survenue en mode production\n ${error}` , 500);
    }
  } else {
    errConstructor('FileError','Mode d\'exécution non pris en charge.', 500);
  }
}

export default createDirectories;
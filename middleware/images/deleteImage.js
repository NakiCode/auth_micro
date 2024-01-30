import fs from 'fs';

const deleteOldImage = async (path) => {
  try {
    const pathArray = path?.split("/");
    const imageName = pathArray[pathArray.length - 1];
    let image = null;

    if (process.env.NODE_ENV === "production") {
      image = `client/build/images/${imageName}`;
    } else {
      image = `files/images/${imageName}`;
    }

    await fs.promises.unlink(image);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default deleteOldImage;
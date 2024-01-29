import fs from 'fs'
const deleteOldImage = (imagePath) =>{
    try {
        let image = null;
        const path = user.profil;
        const pathArray = path.split("/");
        const imageName = pathArray[pathArray.length - 1];
        if (process.env.NODE_ENV === "production") {
          image = `client/build/images/${imageName}`;
        } else {
          image = `files/images/${imageName}`;
        }
        fs.unlinkSync(image);
        return true
    } catch (error) {
        console.log(error)
    }
}
export default deleteOldImage;
import catchAsync from "../catch/catchAsync.js";
import { tbl_User } from "../../models/UserModel.js";
import deleteOldImage from "./deleteImage.js";

const dispatchImage = catchAsync(async (req, res, next) => {
  const user = await tbl_User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      success: false,
      data: [],
      message: "Veuillez recommencer ultérieurement !"
    });
  }
  if (!req.files) {
    return res.status(404).json({
      statusCode: 404,
      success: false,
      data: [],
      message: "Veuillez ajouter une photo"
    });
  }
  if (req.files["profil"] || req.files["couverture"]) {
    if (req.files["profil"]) {
      // delete the old image
      if (user.profil) {
        let imagePath = null;
        const path = user.profil;
        const pathArray = path.split("/");
        const imageName = pathArray[pathArray.length - 1];
        if (process.env.NODE_ENV === "production") {
          imagePath = `client/build/images/${imageName}`;
        } else {
          imagePath = `files/images/${imageName}`;
        }
        fs.unlinkSync(imagePath);
        user.profil = null;
      }
      let file = req.files["profil"].map((file) => {
        return file.path;
      });
      const formattedImagePath = file[0].replace(/\\/g, "/");
      user.profil = formattedImagePath;
    }
    if (req.files["couverture"]) {
      let file = req.files["couverture"].map((file) => {
        return file.path;
      });
      const formattedImagePath = file[0].replace(/\\/g, "/");
      user.couverture = formattedImagePath;
    }
    const profil = await user.save({ new: true, runValidators: true });
    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: profil,
      message: "Ajout avec succes !"
    });
  } else {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      data: [],
      message: "Veuillez ajouter une photo"
    });
  }
});

export default dispatchImage;

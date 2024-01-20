import catchAsync from "../../helpers/err/catchAsync.js";
import { tbl_User } from "../../models/UserModel.js";

const dispatchImage = catchAsync(async (req, res, next) => {
    const user = await tbl_User.findOne({ _id: req.user._id });
    if (!user) {
        return res.status(404).json({
            statusCode: 404,
            data: [],
            message: "Veuillez vous recommencer !"
        });
    };
    if (!req.files) {
        return res.status(404).json({
            statusCode: 404,
            data: [],
            message: "Veuillez ajouter une photo"
        });
    }
    if (req.files['profil'] || req.files['couverture']) {
        if (req.files['profil']) {
            let file = req.files['profil'].map((file) => { return file.path })
            const formattedImagePath = file[0].replace(/\\/g, "/")
            user.profile = formattedImagePath
        }
        if (req.files['couverture']) {
            let file = req.files['couverture'].map((file) => { return file.path })
            const formattedImagePath = file[0].replace(/\\/g, "/")
            user.couverture = formattedImagePath
        }
        const profil = await user.save({ new: true, runValidators: true });
        return res.status(200).json({
            statusCode: 200,
            data: profil,
            message: "Ajout avec succes !"
        });
    } else {
        return res.status(400).json({
            statusCode: 400,
            data: [],
            message: "Veuillez ajouter une photo"
        });
    }
})

export default dispatchImage
import catchAsync from "../../helpers/err/catchAsync.js";
import { tbl_Product } from "../../models/produit/produitModels.js";
import { tbl_Restaurent } from "../../models/restaurent/restoModel.js";
import { tbl_User } from "../../models/user/userModel.js";

const dispatchImage = catchAsync(async (req, res, next) => {
    const user = await tbl_User.findOne({ _id: req.user._id });
    const { product_id } = req.query;
    if (!user) {
        return res.status(404).json({
            statusCode: 404,
            data: [],
            message: "Veuillez vous connecter"
        });
    };
    if (!req.files) {
        return res.status(404).json({
            statusCode: 404,
            data: [],
            message: "Veuillez ajouter une photo"
        });
    }
    if (req.files['profile'] || req.files['couverture']) {
        if (req.files['profile']) {
            let file = req.files['profile'].map((file) => { return file.path })
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
            message: "Modification avec succes !"
        });
    } else if (req.files['imageResto'] || req.files['couvertureResto']) {
        const resto = await tbl_Restaurent.findOne({ user: req.user._id });
        if (!resto) {
            return res.status(404).json({
                statusCode: 404,
                data: [],
                message: "Veuillez vous connecter ou Reessayer plus tard"
            });
        }
        if (req.files['imageResto']) {
            let file = req.files['imageResto'].map((file) => { return file.path })
            const formattedImagePath = file[0].replace(/\\/g, "/")
            resto.imageResto = formattedImagePath
        }
        if (req.files['couvertureResto']) {
            let file = req.files['couvertureResto'].map((file) => { return file.path })
            const formattedImagePath = file[0].replace(/\\/g, "/")
            resto.couvertureResto = formattedImagePath
        }
        const restoUser = await resto.save({ new: true, runValidators: true });
        return res.status(200).json({
            statusCode: 200,
            data: restoUser,
            message: "Modification avec succes !"
        })
    } else if (req.files['imageProduct']) {
        const images = req.files['imageProduct']
            .filter((file) => file.fieldname === 'imageProduct')
            .map((file) => file.path.replace(/\\/g, "/"));
        // limit to 3 images only
        const checkLength = await tbl_Product.findOne({ _id: product_id });
        console.log(checkLength)
        if (checkLength?.image?.length >= 3) {
            return res.status(409).json({
                statusCode: 409,
                data: [],
                message: "Nombre d'images maximum est 3",
            });
        }
        const update = await tbl_Product.findOneAndUpdate(
            { _id: checkLength._id },
            { $push: { imageProduct: { $each: images } } },
            { new: true, runValidators: true }
        );
        const status = update ? 200 : 400;
        return res.status(status).json({
            statusCode: status,
            data: update ? update : [],
            message: update
                ? "Images ajoutées avec succès"
                : "Veuillez réessayer ultérieurement.",
        });
    }
    else {
        return res.status(400).json({
            statusCode: 400,
            data: [],
            message: "Veuillez ajouter une photo"
        });
    }
})

export default dispatchImage
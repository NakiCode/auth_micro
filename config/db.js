import mongoose from "mongoose";
// DATABASE CONFIG
const dbConnect = async () => {
    await mongoose.connect(`${process.env.MONGO_DB}`).then(() => {
        console.log("CONNEXION ETABLIE AVEC LA BASE DES DONNEES");
    }).catch((err) => {
        console.log(`ERREUR DE CONNECTION A LA BASE DES DONNEES\n ${err}`);
    })
};

export default dbConnect;
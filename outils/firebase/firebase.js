import admin from "firebase-admin";
import serviceAccount from "./bujafoodFirebase.json" assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://naki-bujafood-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "naki-bujafood.appspot.com"
});

export const createFirebaseToken = async (uid, token) => {
    // Validation des entrées
    if (!uid) {
        throw new Error("L'ID utilisateur est requis.");
    }
    if (!token) {
        throw new Error("Le token de l'appareil est requis.");
    }
    try {
        const options = {
            uid,
            token,
        };
        const token = await admin.messaging().getToken(options);
        return token;
    } catch (error) {
        console.error("Erreur lors de la génération du token d'inscription Firebase :", error);
        return null;
    }
};

export const sendPushNotification = async (token, title, body) => {
    if (!token) {
        throw new Error("Le token d'inscription est requis.");
    }
    if (!title) {
        throw new Error("Le titre de la notification est requis.");
    }
    if (!body) {
        throw new Error("Le corps de la notification est requis.");
    }
    try {
        const notification = {
            title,
            body,
        };
        await admin.messaging().send({
            to: token,
            notification,
        });
    } catch (error) {
        console.error("Erreur lors de l'envoi de la notification push :", error);
    }
};

export const createFirebaseTokenByUserId = async (userId) => {
    // Obtention du tokenId de Firebase
    const token = await admin.messaging().getToken(userId);
    // Création d'un nouveau tokenId de Firebase si nécessaire
    if (!token) {
        token = await admin.messaging().createToken();
    }
    // Enregistrement du tokenId de Firebase dans la base de données
    await db.collection("users").doc(userId).update({
        tokenId: token,
    });
    return token;
};
import admin from "./config.js";

// attach firebase to user
export const attachFirebaseToUser = async (user_id) => {
    try {
        const token = await admin.auth().createCustomToken(user_id);
        return token;
    } catch (err) {
        throw err;
    }
};

// send push notification to user
export const sendPushNotification = async (token, title, body) => {
    try {
        const response = await admin.messaging().send(token, {
            notification: {
                title: title,
                body: body,
            },
        });
        return response;
    } catch (err) {
        throw err;
    }
};
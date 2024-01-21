import admin from "firebase-admin";
import serviceAccount from "./naki-bujafood-firebase-adminsdk-bzqlj-0f8ff7579a.json" assert { type: "json" };

// https://firebase.google.com/docs/cloud-messaging/send-message?hl=fr
// https://console.firebase.google.com/u/0/project/naki-bujafood/settings/serviceaccounts/adminsdk?hl=fr
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

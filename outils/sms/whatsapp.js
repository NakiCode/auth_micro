import twilio from 'twilio';
import errConstructor from '../../middleware/err/err.js';
// Fonction pour envoyer un message WhatsApp
async function sendWhatsAppMessage(to, body) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    try {
        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_NUMBER,
            to: `whatsapp:${to}`
        });
        console.log('Message WhatsApp envoyé:', message);
        return message;
    } catch (error) {
        if (error instanceof twilio.TwilioError) {
            throw errConstructor('TwilioError', error.message, 400);
        }
        else {
            throw errConstructor("TwilioError", "Problème d'envoi de message WhatsApp", 400);
        }
    }
}

export default sendWhatsAppMessage;
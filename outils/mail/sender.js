import emailFormat from "./emailFormat.js";
import { sendEmail } from "./mailConfig.js";

// SEND EMAIL
const sender = async (email, format) => {
    const check = await sendEmail({
        email: email,
        subject: format.subject,
        html: emailFormat(format)
    });
    return check
};

export default sender;



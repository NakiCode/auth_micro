import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransport({
        pool: true,
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

export const sendEmail = async (options) => {
    try {
        // 1. Create a transporter
        const transporter = createTransporter();

        // 2. Define the email options
        const mailOptions = {
            from: process.env.EMAIL_FROM || "Nakicode Marketing Inc <nakicode07@yandex.com>",
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        // 3. Send the email
        const data = await transporter.sendMail(mailOptions);
        return data;
    } catch (err) {
        return { err: `Failed to send email: ${err}` };
    }
};
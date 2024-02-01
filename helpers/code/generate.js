import crypto from 'crypto';
export const generateCode = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomBytes = crypto.randomBytes(length);
    let code = '';
    for (let i = 0; i < randomBytes.length; i++) {
        const randomIndex = randomBytes[i] % characters.length;
        code += characters.charAt(randomIndex);
    }
    return code;
};
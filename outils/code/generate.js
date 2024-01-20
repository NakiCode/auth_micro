import crypto from 'crypto';
export const generateCode = (codeLength = 8) => {
    try {
        const randomBytes = crypto.randomBytes(codeLength);
        const code = parseInt(randomBytes.toString('hex'), 16).toString().slice(0, codeLength);
        return code;
    } catch (error) {
        return '0770';
    }
};
export const isVerifyCode = (payload, code) => {
    if (payload?.code === code) {
        return true;
    } else {
        return false;
    }
}
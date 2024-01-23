import crypto from 'crypto';

const generateCode = (codeLength = 8) => {
    try {
        if (typeof codeLength !== 'number' || codeLength <= 0) {
            throw new errGenerate('InvalidCodeLengthError', 'Invalid code length', 400);
        }
        const randomBytes = crypto.randomBytes(codeLength);
        const code = parseInt(randomBytes.toString('hex'), 16).toString().slice(0, codeLength);
        return code;
    } catch (error) {
        return '070070'; // Valeur par défaut en cas d'erreur
    }
};
export default generateCode;
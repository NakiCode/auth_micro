const signAccessToken = (payload) => {
    const privateKey = fs.readFileSync('./rsa/privateKey.pem'); // Lire la clé privée depuis le fichier
    return jwt.sign(
        { _id: payload._id, type: "access", role: payload.role, tokenId: payload.tokenId },
        privateKey,
        { algorithm: 'RS256', expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const signRefreshToken = (payload) => {
    const privateKey = fs.readFileSync('./rsa/privateKey.pem'); // Lire la clé privée depuis le fichier
    return jwt.sign(
        { _id: payload._id, type: "refresh", role: payload.role, tokenId: payload.tokenId },
        privateKey,
        { algorithm: 'RS256', expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );
};

const verifyToken = (token) => {
    const publicKey = fs.readFileSync('./rsa/publicKey.pem'); // Lire la clé publique depuis le fichier
    return new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

export const attachTokenToUser = (payload) => {
    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);
    return { access, refresh };
};

export const checkAccessToken = async (token) => {
    try {
        const data = {
            success: false,
            data: null,
            message: "Invalid Token",
        };

        try {
            const decodedToken = await verifyToken(token);
            data.success = true;
            data.data = decodedToken;
            data.message = "Valid Token";
            return data;
        } catch (err) {
            data.message = "Token is not valid";
            return data;
        }
    } catch (error) {
        throw error;
    }
};
import jwt from 'jsonwebtoken';

const signAccessToken = (payload) => {
    return jwt.sign(
        { _id: payload._id, type: "access", role: payload.role, tokenId: payload.tokenId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const signRefreshToken = (payload) => {
    return jwt.sign(
        { _id: payload._id, type: "refresh", role: payload.role, tokenId: payload.tokenId },
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET,  (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

export const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET,  (err, decoded) => {
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

export const checkToken = async (token) => {
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
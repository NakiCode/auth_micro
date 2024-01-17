import jwt from "jsonwebtoken"

const signAccessToken = (payload) => {
    return jwt.sign({ _id: payload._id, type: "access", role: payload.role, tokenId: payload.tokenId}, 
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}
const signRefreshToken = (payload) => {
    return jwt.sign({ _id: payload._id, type: "refresh", role: payload.role, tokenId: payload.tokenId}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES
    })
};

const createSendToken = (user, res) => {
    const token = signToken(user)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_TOKEN_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? 'strict' : "lax"
    }
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true
    res.cookie("jwt", token, cookieOptions)
};

const createSendToken = (user, res) => {
    const token = signToken(user)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_TOKEN_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? 'strict' : "lax"
    }
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true
    res.cookie("jwt", token, cookieOptions)
};

const attachTokenToUser = (payload) => {
    const access = signAccessToken(payload)
    const refresh = signRefreshToken(payload)
    const token = { access, refresh }
    return token;
}

// VERIFY REFRESH TOKEN
// ###############################################################################
export const isRefreshTokenValid = async (token) => {
    return await promisify(jwt.verify)(token, process.env.JWT_REFRESH_SECRET);
};
// VERIFY REFRESH TOKEN EXPIRED
export const isRefreshTokenExpired = (token) => {
    const decoded = jwt.decode(token)
    if (decoded.exp < Date.now() / 1000) {
        return true
    }
    return false
};
// ###############################################################################
import jwt from 'jsonwebtoken';
import errConstructor from '../../middleware/err/err.js';

const COOKIE_NAMES = {
    JWT: 'jwt',
    JWT_REFRESH: 'jwt_refresh',
};

const getCookieOptions = (expires) => {
    const cookieOptions = {
        expires: new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    return cookieOptions;
};

const createCookieToken = (name, value, expires, res) => {
    if (!value || !res) {
        throw new errConstructor("CookieError", 'Invalid parameters', 400);
    }

    const cookieOptions = getCookieOptions(expires);
    res.cookie(name, value, cookieOptions);
};

export const attachCookies = (accessToken, refreshToken, res) => {
    createCookieToken(COOKIE_NAMES.JWT, accessToken, process.env.JWT_COOKIE_TOKEN_EXPIRES_IN, res);
    createCookieToken(COOKIE_NAMES.JWT_REFRESH, refreshToken, process.env.JWT_COOKIE_REFRESH_EXPIRES_IN, res);
    return res;
};

const isCookieTokenExpired = (token) => {
    const decoded = jwt.decode(token);
    return decoded.exp < Date.now() / 1000;
};

export const isCookiesExpired = (req) => {
    if (req.cookies) {
        if (req.cookies[COOKIE_NAMES.JWT] && isCookieTokenExpired(req.cookies[COOKIE_NAMES.JWT])) {
            return true;
        }

        if (req.cookies[COOKIE_NAMES.JWT_REFRESH] && isCookieTokenExpired(req.cookies[COOKIE_NAMES.JWT_REFRESH])) {
            return true;
        }
    }

    return false;
};

export default {
    COOKIE_NAMES,
    attachCookies,
    isCookiesExpired
};
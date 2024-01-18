const getCookieOptions = (expires) => {
    const cookieOptions = {
        expires: new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? 'strict' : "lax"
    };
    if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
    }
    return cookieOptions;
};

const createAccessCookieToken = (access, res) => {
    if (!access || !res) {
        throw new Error("Invalid parameters");
    }
    const cookieOptions = getCookieOptions(process.env.JWT_COOKIE_TOKEN_EXPIRES_IN);
    res.cookie("jwt", access, cookieOptions);
};

const createRefreshCookieToken = (refresh, res) => {
    if (!refresh || !res) {
        throw new Error("Invalid parameters");
    }
    const cookieOptions = getCookieOptions(process.env.JWT_COOKIE_REFRESH_EXPIRES_IN);
    res.cookie("jwt_refresh", refresh, cookieOptions);
};

const attachCookies = (access, refresh, res) => {
    createAccessCookieToken(access, res);
    createRefreshCookieToken(refresh, res);

    return res;
};

export default attachCookies;
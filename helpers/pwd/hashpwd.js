import bcrypt from "bcrypt";

export const hashPwd = async (pwd) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(pwd, salt);
    return hashedPwd;
}

// compare if is match
export const isMatch = async (pwd, hashPwd) => {
    return await bcrypt.compare(pwd, hashPwd);
}

export const isStrengthPwd = (password, confirmpassword) => {
    const strong = {
        success: false,
        message: "",
        statusCode: 400
    };
    if (!password || !confirmpassword) {
        strong.message = "Veuillez renseigner les mot de passe";
        return strong;
    }
    const rules = [
        {
            regex: /[A-Z]/,
            message: "The password must contain at least one uppercase letter."
        },
        {
            regex: /[a-z]/,
            message: "The password must contain at least one lowercase letter."
        },
        {
            regex: /[0-9]/,
            message: "The password must contain at least one digit."
        },
        {
            regex: /[!@#$%^&*()\-_=+{};:,<.>]/,
            message: "The password must contain at least one special character."
        }
    ];
    if (password !== confirmpassword) {
        strong.success = false;
        strong.statusCode = 409;
        strong.message = "The passwords do not match.";
        return strong;
    }
    if (password.length < 6) {
        strong.message = "The password is too short. It must contain at least 6 characters.";
        return strong;
    }
    for (const rule of rules) {
        if (!rule.regex.test(password)) {
            strong.message = rule.message;
            return strong;
        }
    }
    // Successful validation
    strong.success = true;
    strong.statusCode = 200;
    strong.message = "The password is strong and recommended.";
    return strong;
};


// JWT_EXPIRES_IN = 1d
// JWT_REFRESH_EXPIRES_IN = 3d
// JWT_COOKIE_TOKEN_EXPIRES_IN = 1
// JWT_COOKIE_REFRESH_EXPIRES_IN = 1
// JWT_SECRET = @@@kabikaNakicode0707@@
// JWT_REFRESH_SECRET = @@@kabikaNakicode0707@@
// API_KEY_SECRET = @@@kabikaNakicode0707@@
// API_KEY_EXPIRES_IN = 90d

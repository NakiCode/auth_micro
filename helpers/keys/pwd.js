const checkPasswordStrength = (password, confirmPassword) => {
    const strong = {
        success: false,
        message: "",
        statusCode: 400
    };

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

    if (password !== confirmPassword) {
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

export default checkPasswordStrength;
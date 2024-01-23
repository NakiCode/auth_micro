const CodeSMS = (to, code, type) => {
    let body;

    switch (type) {
        case "VERIFICATION":
            body = "Veuillez utiliser le code ci-dessous pour confirmer votre adresse email";
            break;
        case "CHANGE_EMAIL":
            body = "Veuillez utiliser le code ci-dessous pour confirmer votre nouvelle adresse email";
            break;
        case "CHANGE_PHONE":
            body = "Veuillez utiliser le code ci-dessous pour confirmer votre nouveau numéro de téléphone";
            break;
        case "RESET_PWD":
            body = "Veuillez utiliser le code ci-dessous pour confirmer votre demande de changement de mot de passe";
            break;
        default:
            return null;
    }

    return {
        to,
        body: `${body}\nCode: ${code}`
    };
};

export default CodeSMS;
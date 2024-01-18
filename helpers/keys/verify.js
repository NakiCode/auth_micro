export const isEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}
// Vérification d'un numéro de téléphone
export const isPhoneNumber = (input) => {
    const phoneRegex = /^\d{10}$/; // Exemple : 1234567890
    return phoneRegex.test(input);
}
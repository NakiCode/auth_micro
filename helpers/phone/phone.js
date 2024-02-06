import * as libphonenumber from 'google-libphonenumber';

const validateFormatPhoneNumber = (phoneNumber) => {
    // Vérifie si le numéro de téléphone est valide et le formate
    if (!phoneNumber && !phoneNumber.startWiths('+')) {
        return null;
    }
    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    const possibleCountryCodes = phoneUtil.getSupportedRegions().filter((countryCode) => {
        // Filtre les codes de pays en vérifiant si le numéro de téléphone est valide avec chaque code de pays
        const parsedPhoneNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode);
        return phoneUtil.isValidNumber(parsedPhoneNumber);
    });
    if (possibleCountryCodes.length > 0) {
        // Choisissez le premier code de pays valide trouvé
        const countryCode = possibleCountryCodes[0];
        const parsedPhoneNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode);
        const formattedPhoneNumber = phoneUtil.format(parsedPhoneNumber, libphonenumber.PhoneNumberFormat.E164);
        return {isValid: true, countryCode, formattedPhoneNumber };
    }
    return {isValid: false, countryCode: null, formattedPhoneNumber: null };
};

export default validateFormatPhoneNumber;
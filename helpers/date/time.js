import moment from "moment";

export const DateNow = () => {
    const currentDate = moment().format("HH:mm:ss DD/MM/YYYY");
    return currentDate;
};

export const DefaultDateExpires = () => {
    const currentDate = moment().add(3, "hours").format("HH:mm:ss DD/MM/YYYY");
    return currentDate;
};

export const isDateTimeExpires = (currentDateTime, givenDateTime) => {
    const comparison = currentDateTime.diff(givenDateTime);
    return comparison > 0;
  };


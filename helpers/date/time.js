import moment from "moment";

export const DateNow = () => {
  const currentDate = moment().toDate();
  return currentDate;
};

export const DefaultDateExpires = () => {
  const currentDate = moment().add(30, "minutes").toDate();
  return currentDate;
};

export const isDateTimeExpires = (currentDateTime, givenDateTime) => {
  const currentDate = moment(currentDateTime);
  const givenDate = moment(givenDateTime);
  const comparison = currentDate.diff(givenDate);
  return comparison > 0;
};

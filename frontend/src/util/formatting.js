export const formatDate = (dateString, compact = false, dateOnly = false) => {
  const options = {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  if (!compact) {
    options.year = "numeric";
  }
  const date = new Date(dateString);
  // adjust for tz
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - userTimezoneOffset);
  const dateStringFormatted = localDate.toLocaleString(undefined, options);
  if (dateOnly) {
    if (compact) {
      const dateParts = dateStringFormatted.split(",")[0].split("/");
      return `${dateParts[0]}/${dateParts[1]}`;
    }
    return dateStringFormatted.split(",")[0];
  }
  return dateStringFormatted;
};

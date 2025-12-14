export const formatDate = (dateString, compact = false) => {
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
  return localDate.toLocaleString(undefined, options);
};

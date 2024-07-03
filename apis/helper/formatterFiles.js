const formatDate = (date) => {
  // Assuming date is in the "MM/DD/YYYY" format
  const [month, day, year] = date.split("/").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
module.exports.formatDate = formatDate;

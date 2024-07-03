const moment = require("moment-timezone");

const generateTimeSlots = (startTime, endTime, duration) => {
  // const timeSlots = [];
  // let currentTime = new Date(startTime);

  // while (currentTime <= endTime) {
  //   const hours = currentTime.getHours();
  //   const minutes = currentTime.getMinutes();
  //   const ampm = hours >= 12 ? "PM" : "AM";

  //   const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
  //   timeSlots.push(formattedTime);

  //   currentTime = new Date(currentTime.getTime() + duration * 60000); // Add duration in milliseconds
  // }

  // return timeSlots;

  const timeSlots = [];
  let currentTime = moment(startTime);
  const end = moment(endTime);

  while (currentTime.isBefore(end)) {
    timeSlots.push(currentTime.format("hh:mm A"));
    currentTime.add(duration, "minutes");
  }

  return timeSlots;
};

module.exports.generateTimeSlots = generateTimeSlots;

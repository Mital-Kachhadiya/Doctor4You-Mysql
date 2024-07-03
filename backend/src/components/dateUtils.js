// Function to convert 'YYYY-MM-DD' to 'DD/MM/YYYY' format
export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}
// Function to convert 'HH:mm:ss' to 'h:mm A' format
export const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(':')
  const formattedHour = parseInt(hour, 10) % 12 || 12
  const period = parseInt(hour, 10) < 12 ? 'AM' : 'PM'
  return `${formattedHour}:${minute} ${period}`
}

// Function to convert date string to 'DD MMM, YYYY Day' format
export const formatGMTDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' } //weekday: 'short'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', options)
}

export const convertTimeToAMPMFormat = (timeString) => {
  const date = new Date(timeString)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  let formattedHours = hours % 12 || 12 // Convert 0 to 12
  const period = hours < 12 ? 'AM' : 'PM'

  // Add leading zero to minutes if needed
  const formattedMinutes = (minutes < 10 ? '0' : '') + minutes

  return `${formattedHours}:${formattedMinutes}${period}`
}

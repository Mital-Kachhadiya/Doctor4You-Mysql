// formUtils.js
export const handleInputChange = (name, value, { clearErrors, setValue }) => {
  // Clear the error for the specific field when the value is not null
  clearErrors(name)
  // Set the value for the field
  setValue(name, value)
}

export const handleFileInputChange = (e, fieldname, { clearErrors, setValue, setPreviewImage }) => {
  const selectedFile = e.target.files[0]

  // Assuming you have a function to handle setting the selected image, e.g., setPreviewImage
  setPreviewImage(URL.createObjectURL(selectedFile))

  // Perform any additional actions you need, such as clearing errors or updating form values
  handleInputChange(fieldname, selectedFile, { clearErrors, setValue })
}

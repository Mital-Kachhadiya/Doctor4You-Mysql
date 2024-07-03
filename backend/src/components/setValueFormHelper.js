import dayjs from 'dayjs'
import noImg from '../assets/images/no_img.png'

const setValueFormHelper = ({
  setValue,
  setPreviewImage,
  state,
  fieldNames,
  imageField = null,
}) => {
  const { editdata, baseurl } = state
  fieldNames.forEach((fieldName) => {
    if (editdata[fieldName] !== undefined) {
      setValue(fieldName, editdata[fieldName])
    }
    if (fieldName == 'dob') {
      const newData = editdata[fieldName] ? dayjs(editdata[fieldName]) : null
      setValue(fieldName, newData)
    }
  })

  if (imageField) {
    setPreviewImage(editdata[imageField] ? baseurl + editdata[imageField] : noImg)
  }
}

export default setValueFormHelper

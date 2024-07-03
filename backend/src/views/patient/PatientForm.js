import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CFormLabel,
  CSpinner,
  CBreadcrumb,
  CBreadcrumbItem,
  CContainer,
  CFormInput,
  CFormFeedback,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import CustomInput from '../../components/CustomInput'
import CustomSelectInput from '../../components/CustomSelectInput'
import setValueFormHelper from '../../components/setValueFormHelper'
import { handleInputChange, handleFileInputChange } from '../../components/formUtils'
import { addPatient, updatePatient } from '../../ApiServices'
import { toast } from 'react-toastify'
import noImg from '../../assets/images/no_img.png'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const PatientForm = () => {
  const { state } = useLocation()
  const [selectedDate, setSelectedDate] = useState()
  // Handle date change
  const handleDateChange = (date) => {
    console.log(date) // You can perform any action with the selected date here
    setSelectedDate(date)
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    setError,
    reset,
    control,
  } = useForm()
  const navigate = useNavigate()
  var [isLoading, setIsLoading] = useState(false)
  const [isupdate, setisupdate] = useState('')
  const [previewImage, setPreviewImage] = useState(noImg)
  var [defaultLoading, setdefaultLoading] = useState(true)

  useEffect(() => {
    if (state) {
      const { editdata, baseurl } = state
      setisupdate(editdata.id)
      const fieldNames = ['name', 'email', 'mo_no', 'gender', 'dob', 'address']
      const imageField = 'image'
      setValueFormHelper({ setValue, setPreviewImage, state, fieldNames, imageField })
    }
    setdefaultLoading(false)
  }, [])

  const onSubmit = (data) => {
    console.log(data)
    setIsLoading(false)
    let formData = new FormData() //formdata object
    Object.keys(data).forEach(function (key) {
      if (key === 'image') {
        if (data[key] !== undefined) {
          formData.append(key, data[key])
        }
      } else {
        formData.append(key, data[key])
      }
    })

    isupdate === ''
      ? addPatient(formData)
          .then(() => {
            localStorage.setItem('redirectSuccess', 'true')
            localStorage.setItem('redirectMessage', 'Added successfully!')
            navigate('/patient')
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              Object.keys(err.response.data.message).forEach((key) => {
                // Set the error message for each field
                setError(key, {
                  type: 'manual',
                  message: err.response.data.message[key],
                })
              })
              setIsLoading(false)
            } else {
              toast.error('Something Went Wrong!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }
            setIsLoading(false)
          })
      : updatePatient(formData, isupdate)
          .then(() => {
            localStorage.setItem('redirectSuccess', 'true')
            localStorage.setItem('redirectMessage', 'Updated successfully!')
            navigate('/patient')
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              Object.keys(err.response.data.message).forEach((key) => {
                // Set the error message for each field
                setError(key, {
                  type: 'manual',
                  message: err.response.data.message[key],
                })
              })
              setIsLoading(false)
            } else {
              toast.error('Something Went Wrong!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }
            setIsLoading(false)
          })
  }

  return (
    <CRow>
      <CContainer fluid className="custom-header">
        <CBreadcrumb>
          <CBreadcrumbItem>
            <Link to="/dashboard">Home</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem>
            <Link to="/patient">Patient</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>{isupdate === '' ? 'Add' : 'Update'} Patient</CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12} md={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <CCol md={4}>
                <CustomInput
                  name="name"
                  type="text"
                  label="Name"
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name && errors.name.message}
                  defaultValue={getValues('name')}
                  onChange={(e) =>
                    handleInputChange('name', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={4}>
                <CustomInput
                  name="email"
                  type="email"
                  label="email"
                  {...register('email', { required: 'email is required' })}
                  error={!!errors.email}
                  helperText={errors.email && errors.email.message}
                  defaultValue={getValues('email')}
                  onChange={(e) =>
                    handleInputChange('email', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={4} className="d-fex">
                <CustomInput
                  name="image"
                  type="file"
                  label="image"
                  style={{ width: '100%' }}
                  {...register('image')}
                  defaultValue={getValues('image')}
                  onChange={(e) =>
                    handleFileInputChange(e, 'image', { clearErrors, setValue, setPreviewImage })
                  }
                />
                {previewImage ? <img src={previewImage} className="img-preview" /> : ''}
              </CCol>

              <CCol md={4}>
                <CustomInput
                  name="mo_no"
                  type="mo_no"
                  label="Mobile Number"
                  {...register('mo_no', { required: 'Mobile Number is required' })}
                  error={!!errors.mo_no}
                  helperText={errors.mo_no && errors.mo_no.message}
                  defaultValue={getValues('mo_no')}
                  onChange={(e) =>
                    handleInputChange('mo_no', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={4}>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue="" // Set your default value here if needed
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <CustomSelectInput
                      label="Gender"
                      options={[
                        { id: '1', title: 'Male' },
                        { id: '2', title: 'Female' },
                      ]}
                      onChange={(value) => field.onChange(value)}
                      value={field.value}
                      error={!!errors.gender}
                      helperText={errors.gender && errors.gender.message}
                    />
                  )}
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="dob" className="date-label">
                  Date of Birth
                </CFormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                  <Controller
                    name="dob"
                    control={control}
                    defaultValue={null}
                    rules={{ required: 'Date of Birth is required' }}
                    render={({ field, fieldState }) => (
                      <>
                        <DatePicker
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          renderInput={(startProps) => <input {...startProps} />}
                          className={`form-control ${fieldState.error ? 'is-invalid' : ''}`}
                        />
                        {fieldState.error && (
                          <CFormFeedback invalid>{fieldState.error.message}</CFormFeedback>
                        )}
                      </>
                    )}
                  />
                </LocalizationProvider>
              </CCol>

              <CCol md={12}>
                <CustomInput
                  name="address"
                  type="address"
                  label="Address"
                  {...register('address', { required: 'Address is required' })}
                  error={!!errors.address}
                  helperText={errors.address && errors.address.message}
                  defaultValue={getValues('address')}
                  onChange={(e) =>
                    handleInputChange('address', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol xs={12}>
                {isLoading ? (
                  <CSpinner className="theme-spinner-color" />
                ) : (
                  <CButton color="primary" type="submit" className="theme-btn-background">
                    Submit
                  </CButton>
                )}
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PatientForm

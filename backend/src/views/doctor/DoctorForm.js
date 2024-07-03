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
  CFormCheck,
  CFormInput,
  CInputGroup,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import CustomInput from '../../components/CustomInput'
import CustomInput2 from '../../components/CustomInput2'
import CustomSelectInput from '../../components/CustomSelectInput'
import TimePickerWithRef from '../../components/TimePickerWithRef'
import { handleInputChange, handleFileInputChange } from '../../components/formUtils'
import { addDoctor, updateDoctor, getAllSpecialistCategory } from '../../ApiServices'
import { toast } from 'react-toastify'
import noImg from '../../assets/images/no_img.png'
import ReactQuill from 'react-quill'
import '../../../node_modules/react-quill/dist/quill.snow.css'
import CIcon from '@coreui/icons-react'
import { cilHandPointRight } from '@coreui/icons'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import setValueFormHelper from '../../components/setValueFormHelper'
import moment from 'moment'

const DoctorForm = () => {
  const { state } = useLocation()
  const [value1, setValue1] = React.useState(dayjs('2022-04-17T15:30'))
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
    unregister,
  } = useForm()
  const navigate = useNavigate()
  var [isLoading, setIsLoading] = useState(false)
  const [isupdate, setisupdate] = useState('')
  const [previewImage, setPreviewImage] = useState(noImg)
  var [defaultLoading, setdefaultLoading] = useState(true)
  const [specialistCat, setSpecialistCat] = useState([])
  const [selectedValue, setSelectedValue] = useState('')
  const [morningShiftChecked, setMorningShiftChecked] = useState(false)
  const [eveningShiftChecked, setEveningShiftChecked] = useState(false)
  const [selectedDays, setSelectedDays] = useState([])
  useEffect(() => {
    getAllSpecialistCategory().then((response) => {
      setSpecialistCat(response.data.info.cat)
    })
    if (state) {
      console.log(state)
      const { editdata, baseurl } = state
      setisupdate(editdata.id)
      const fieldNames = [
        'name',
        'email',
        'mo_no',
        'wapp_no',
        'experience',
        'specialist_cat',
        'about',
        'work_place_name',
        'work_place_address',
        'patients_count',
        'call_msg_price',
        'house_visit_price',
        'bank_name',
        'acc_holder_name',
        'acc_number',
        'ifsc_code',
      ]
      const imageField = 'image'
      setValueFormHelper({ setValue, setPreviewImage, state, fieldNames, imageField })

      console.log(new Date(editdata.morning_start_time))
      if (editdata.morning_shift) {
        setValue('morning_duration', editdata.morning_duration ? editdata.morning_duration : null)
        setValue(
          'morning_end_time',
          editdata.morning_end_time ? dayjs(editdata.morning_end_time) : null,
        )

        setValue(
          'morning_start_time',
          editdata.morning_start_time ? dayjs(editdata.morning_start_time) : null,
        )
      }
      setMorningShiftChecked(editdata.morning_shift)

      if (editdata.evening_shift) {
        setValue('evening_duration', editdata.evening_duration ? editdata.evening_duration : null)
        setValue(
          'evening_end_time',
          editdata.evening_end_time ? dayjs(editdata.evening_end_time) : null,
        )
        setValue(
          'evening_start_time',
          editdata.evening_start_time ? dayjs(editdata.evening_start_time) : null,
        )
      }
      setEveningShiftChecked(editdata.evening_shift)

      let workingDaysString = editdata.working_days
      let workingDaysArray = workingDaysString ? workingDaysString.split(',') : []
      setSelectedDays(workingDaysArray)
    }
    setdefaultLoading(false)
  }, [])

  const handleMorningShiftChange = (event) => {
    setMorningShiftChecked(event.target.checked)
    if (!event.target.checked) {
      unregister('morning_duration')
      unregister('morning_start_time')
      unregister('morning_end_time')
    }
  }

  const handleEveningShiftChange = async (event) => {
    setEveningShiftChecked(event.target.checked)
    if (!event.target.checked) {
      unregister('evening_duration')
      unregister('evening_start_time')
      unregister('evening_end_time')
    }
  }

  const onSubmit = (data) => {
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
      ? addDoctor(formData)
          .then(() => {
            localStorage.setItem('redirectSuccess', 'true')
            localStorage.setItem('redirectMessage', 'Added successfully!')
            navigate('/doctor')
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              // Iterate through the error object to extract keys and values
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
      : updateDoctor(formData, isupdate)
          .then(() => {
            localStorage.setItem('redirectSuccess', 'true')
            localStorage.setItem('redirectMessage', 'Updated successfully!')
            navigate('/doctor')
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              // Iterate through the error object to extract keys and values
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

  // const handleDayChange = async (day) => {
  //   console.log(day)
  //   await setSelectedDays((prevSelectedDays) => {
  //     console.log(prevSelectedDays, 'prevSelectedDays')
  //     if (prevSelectedDays.includes(day)) {
  //       return prevSelectedDays.filter((selectedDay) => selectedDay !== day)
  //     } else {
  //       console.log([...prevSelectedDays, day], 'else')
  //       return [...prevSelectedDays, day]
  //     }
  //   })
  //   console.log(selectedDays, 'selectedDays')
  // }
  // const getDayLabel = (day) => {
  //   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  //   return days[day - 1]
  // }
  return (
    <CRow>
      <CContainer fluid className="custom-header">
        <CBreadcrumb>
          <CBreadcrumbItem>
            <Link to="/dashboard">Home</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem>
            <Link to="/doctor">Doctor</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>{isupdate === '' ? 'Add' : 'Update'} Doctor</CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <CCol md={12} className="form-header">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;PERSONAL INFO
                </div>
              </CCol>

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
                  label="Email"
                  {...register('email', { required: 'Email is required' })}
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
                  label="Image"
                  style={{ width: '100%' }}
                  {...register('image')}
                  defaultValue={getValues('image')}
                  onChange={(e) =>
                    handleFileInputChange(e, 'image', { clearErrors, setValue, setPreviewImage })
                  }
                />
                {previewImage ? <img src={previewImage} className="img-preview" /> : ''}
              </CCol>

              <CCol md={3}>
                <CustomInput
                  name="mo_no"
                  type="text"
                  label="Mobile Number"
                  {...register('mo_no', { required: 'Mobile No is required' })}
                  error={!!errors.mo_no}
                  helperText={errors.mo_no && errors.mo_no.message}
                  defaultValue={getValues('mo_no')}
                  onChange={(e) =>
                    handleInputChange('mo_no', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={3}>
                <CustomInput
                  name="wapp_no"
                  type="text"
                  label="Whatsapp Number"
                  {...register('wapp_no', { required: 'Whatsapp No is required' })}
                  error={!!errors.wapp_no}
                  helperText={errors.wapp_no && errors.wapp_no.message}
                  defaultValue={getValues('wapp_no')}
                  onChange={(e) =>
                    handleInputChange('wapp_no', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={2}>
                <CustomInput
                  name="experience"
                  type="number"
                  label="Experience"
                  {...register('experience', { required: 'Experience is required' })}
                  error={!!errors.experience}
                  helperText={errors.experience && errors.experience.message}
                  defaultValue={getValues('experience')}
                  onChange={(e) =>
                    handleInputChange('experience', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={4}>
                <Controller
                  name="specialist_cat"
                  control={control}
                  defaultValue="" // Set your default value here if needed
                  rules={{ required: 'Specialist category is required' }}
                  render={({ field }) => (
                    <CustomSelectInput
                      label="Specialist"
                      options={specialistCat}
                      onChange={(value) => field.onChange(value)}
                      value={field.value}
                      error={!!errors.specialist_cat}
                      helperText={errors.specialist_cat && errors.specialist_cat.message}
                    />
                  )}
                />
              </CCol>
              <CCol md={12}>
                <Controller
                  name="about"
                  control={control}
                  defaultValue={getValues('about')}
                  render={({ field }) => (
                    <>
                      <CFormLabel>about</CFormLabel>
                      <ReactQuill
                        value={field.value || ''}
                        onChange={field.onChange}
                        style={{ height: '100px', border: 'none' }}
                      />
                    </>
                  )}
                />
              </CCol>

              <CCol md={12} className="form-header mt-60">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;WORK PLACE INFO
                </div>
              </CCol>

              <CCol md={4}>
                <CustomInput
                  name="work_place_name"
                  type="text"
                  label="Work Place Name"
                  {...register('work_place_name', { required: 'Work Place Name is required' })}
                  error={!!errors.work_place_name}
                  helperText={errors.work_place_name && errors.work_place_name.message}
                  defaultValue={getValues('work_place_name')}
                  onChange={(e) =>
                    handleInputChange('work_place_name', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CustomInput
                  name="work_place_address"
                  type="text"
                  label="Work Place Address"
                  {...register('work_place_address', {
                    required: 'Work Place Address is required',
                  })}
                  error={!!errors.work_place_address}
                  helperText={errors.work_place_address && errors.work_place_address.message}
                  defaultValue={getValues('work_place_address')}
                  onChange={(e) =>
                    handleInputChange('work_place_address', e.target.value, {
                      clearErrors,
                      setValue,
                    })
                  }
                />
              </CCol>
              <CCol md={2}>
                <CustomInput
                  name="patients_count"
                  type="number"
                  label="Patient Count"
                  {...register('patients_count', { required: 'Patient Count is required' })}
                  error={!!errors.patients_count}
                  helperText={errors.patients_count && errors.patients_count.message}
                  defaultValue={getValues('patients_count')}
                  onChange={(e) =>
                    handleInputChange('patients_count', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;AVAILIBILITY & TIMING INFO
                </div>
              </CCol>

              <CCol md={12} className="mb-4">
                <CFormLabel className="mr-16">Working Days</CFormLabel>
                {/* {console.log(selectedDays.includes(1), 'sel')}
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <CFormCheck
                    key={`working_days_${day}`}
                    inline
                    value={day.toString()}
                    id={`working_days_${day}`}
                    label={getDayLabel(day)}
                    {...register('working_days')}
                    defaultChecked={selectedDays.includes(day.toString())}
                    // onChange={() => handleDayChange(day.toString())}
                  />
                ))} */}

                <CFormCheck
                  inline
                  value="1"
                  id="working_days_1"
                  label="Sunday"
                  {...register('working_days')}
                  defaultChecked={selectedDays.includes('1')}
                />
                <CFormCheck
                  inline
                  value="2"
                  id="working_days_2"
                  label="Monday"
                  {...register('working_days')}
                  defaultChecked={selectedDays.includes('2')}
                />
                <CFormCheck
                  inline
                  value="3"
                  id="working_days_3"
                  label="Tuesday"
                  {...register('working_days')}
                  defaultChecked={selectedDays.includes('3')}
                />
                <CFormCheck
                  inline
                  value="4"
                  id="working_days_4"
                  label="Wednesday"
                  {...register('working_days')}
                  defaultChecked={selectedDays.includes('4')}
                />
                <CFormCheck
                  inline
                  value="5"
                  id="working_days_5"
                  label="Thrusday"
                  {...register('working_days')}
                  defaultChecked={selectedDays.includes('5')}
                />
                <CFormCheck
                  inline
                  value="6"
                  id="working_days_6"
                  label="Friday"
                  {...register('working_days')}
                  defaultChecked={selectedDays.includes('6')}
                />
                <CFormCheck
                  inline
                  value="7"
                  id="working_days_7"
                  label="Saturday"
                  {...register('working_days')}
                  defaultChecked={selectedDays.includes('7')}
                />
              </CCol>

              <CCol md={6} className="shift-div">
                <CFormLabel className="mr-16 mb-3">
                  <b>Morning Shift</b>
                </CFormLabel>
                <CFormCheck
                  inline
                  id="morning_shift"
                  label="Available"
                  checked={morningShiftChecked}
                  value={morningShiftChecked ? '1' : '0'}
                  {...register('morning_shift', {
                    onChange: (e) => {
                      handleMorningShiftChange(e) // Call your custom onChange handler
                      return e.target.checked // Return the value for react-hook-form
                    },
                  })}
                />

                {morningShiftChecked && (
                  <CCol md={12} id="morning_div" className="morning_div">
                    <CCol md={12} className="display-flex align-items-center">
                      <div className="mr-2 ">
                        <CFormLabel className="mb-2">Start Time</CFormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Controller
                            name="morning_start_time"
                            control={control}
                            defaultValue={null}
                            rules={{
                              required: morningShiftChecked ? 'Start time is required' : false,
                            }}
                            render={({ field }) => (
                              <TimePickerWithRef
                                value={field.value}
                                onChange={(newValue) => field.onChange(newValue)}
                                ref={field.ref} // Pass the ref here
                                error={!!errors.morning_start_time}
                                helperText={
                                  errors.morning_start_time && errors.morning_start_time.message
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="ml-12 ">
                        <CFormLabel className="mb-2">End Time</CFormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Controller
                            name="morning_end_time"
                            control={control}
                            defaultValue={null}
                            rules={{
                              required: morningShiftChecked ? 'End time is required' : false,
                            }}
                            render={({ field }) => (
                              <TimePickerWithRef
                                value={field.value}
                                onChange={(newValue) => field.onChange(newValue)}
                                ref={field.ref} // Pass the ref here
                                error={!!errors.morning_end_time}
                                helperText={
                                  errors.morning_end_time && errors.morning_end_time.message
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="ml-12 ">
                        <CustomInput2
                          ref={register('morning_duration', {
                            required: morningShiftChecked
                              ? 'Appointment Duration is required'
                              : false,
                          })}
                          name="morning_duration"
                          type="text"
                          label="Appointment Duration (Minutes)"
                          error={!!errors.morning_duration}
                          helperText={errors.morning_duration && errors.morning_duration.message}
                          defaultValue={getValues('morning_duration')}
                          onChange={(e) =>
                            handleInputChange('morning_duration', e.target.value, {
                              clearErrors,
                              setValue,
                            })
                          }
                        />
                      </div>
                    </CCol>
                  </CCol>
                )}
              </CCol>
              <CCol md={6} className="shift-div">
                <CFormLabel className="mr-16 mb-3">
                  <b>Evening Shift</b>
                </CFormLabel>
                <CFormCheck
                  inline
                  id="evening_shift"
                  label="Available"
                  checked={eveningShiftChecked}
                  value={eveningShiftChecked ? '1' : '0'}
                  {...register('evening_shift', {
                    onChange: (e) => {
                      handleEveningShiftChange(e) // Call your custom onChange handler
                      return e.target.checked // Return the value for react-hook-form
                    },
                  })}
                />

                {eveningShiftChecked && (
                  <CCol md={12} id="evening_div" className="evening_div">
                    <CCol md={12} className="display-flex align-items-center">
                      <div className="mr-2 ">
                        <CFormLabel className="mb-2">Start Time</CFormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Controller
                            name="evening_start_time"
                            control={control}
                            defaultValue={null}
                            rules={{
                              required: eveningShiftChecked ? 'Start time is required' : false,
                            }}
                            render={({ field }) => (
                              <TimePickerWithRef
                                value={field.value}
                                onChange={(newValue) => field.onChange(newValue)}
                                ref={field.ref} // Pass the ref here
                                error={!!errors.evening_start_time}
                                helperText={
                                  errors.evening_start_time && errors.evening_start_time.message
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="ml-12 ">
                        <CFormLabel className="mb-2">End Time</CFormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Controller
                            name="evening_end_time"
                            control={control}
                            defaultValue={null}
                            rules={{
                              required: eveningShiftChecked ? 'End time is required' : false,
                            }}
                            render={({ field }) => (
                              <TimePickerWithRef
                                value={field.value}
                                onChange={(newValue) => field.onChange(newValue)}
                                ref={field.ref} // Pass the ref here
                                error={!!errors.evening_end_time}
                                helperText={
                                  errors.evening_end_time && errors.evening_end_time.message
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                      <div className="ml-12 ">
                        <CustomInput2
                          ref={register('evening_duration', {
                            required: eveningShiftChecked
                              ? 'Appointment Duration is required'
                              : false,
                          })}
                          name="evening_duration"
                          type="text"
                          label="Appointment Duration (Minutes)"
                          error={!!errors.evening_duration}
                          helperText={errors.evening_duration && errors.evening_duration.message}
                          defaultValue={getValues('evening_duration')}
                          onChange={(e) =>
                            handleInputChange('evening_duration', e.target.value, {
                              clearErrors,
                              setValue,
                            })
                          }
                        />
                      </div>
                    </CCol>
                  </CCol>
                )}
              </CCol>

              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;CHARGES INFO
                </div>
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="call_msg_price"
                  type="text"
                  label="Call/Message Charge Amount"
                  {...register('call_msg_price', {
                    required: 'Call/Message Charge Amount is required',
                  })}
                  error={!!errors.call_msg_price}
                  helperText={errors.call_msg_price && errors.call_msg_price.message}
                  defaultValue={getValues('call_msg_price')}
                  onChange={(e) =>
                    handleInputChange('call_msg_price', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CustomInput
                  name="house_visit_price"
                  type="text"
                  label="House Visit Charge Amount"
                  {...register('house_visit_price', {
                    required: 'House Visit Charge Amount is required',
                  })}
                  error={!!errors.house_visit_price}
                  helperText={errors.house_visit_price && errors.house_visit_price.message}
                  defaultValue={getValues('house_visit_price')}
                  onChange={(e) =>
                    handleInputChange('house_visit_price', e.target.value, {
                      clearErrors,
                      setValue,
                    })
                  }
                />
              </CCol>

              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;BANK ACCOUNT INFO
                </div>
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="bank_name"
                  type="text"
                  label="Bank name"
                  {...register('bank_name', {
                    required: 'Bank name is required',
                  })}
                  error={!!errors.bank_name}
                  helperText={errors.bank_name && errors.bank_name.message}
                  defaultValue={getValues('bank_name')}
                  onChange={(e) =>
                    handleInputChange('bank_name', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CustomInput
                  name="acc_holder_name"
                  type="text"
                  label="Account Holder Name"
                  {...register('acc_holder_name', {
                    required: 'Account Holder Name is required',
                  })}
                  error={!!errors.acc_holder_name}
                  helperText={errors.acc_holder_name && errors.acc_holder_name.message}
                  defaultValue={getValues('acc_holder_name')}
                  onChange={(e) =>
                    handleInputChange('acc_holder_name', e.target.value, {
                      clearErrors,
                      setValue,
                    })
                  }
                />
              </CCol>
              <CCol md={6}>
                <CustomInput
                  name="acc_number"
                  type="text"
                  label="Account Number"
                  {...register('acc_number', {
                    required: 'Account Number is required',
                  })}
                  error={!!errors.acc_number}
                  helperText={errors.acc_number && errors.acc_number.message}
                  defaultValue={getValues('acc_number')}
                  onChange={(e) =>
                    handleInputChange('acc_number', e.target.value, {
                      clearErrors,
                      setValue,
                    })
                  }
                />
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="ifsc_code"
                  type="text"
                  label="IFSC Code"
                  {...register('ifsc_code', {
                    required: 'IFSC Code is required',
                  })}
                  error={!!errors.ifsc_code}
                  helperText={errors.ifsc_code && errors.ifsc_code.message}
                  defaultValue={getValues('ifsc_code')}
                  onChange={(e) =>
                    handleInputChange('ifsc_code', e.target.value, {
                      clearErrors,
                      setValue,
                    })
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

export default DoctorForm

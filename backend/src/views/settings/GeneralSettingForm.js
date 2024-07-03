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
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import CustomInput from '../../components/CustomInput'
import { handleInputChange, handleFileInputChange } from '../../components/formUtils'
import { updateGeneralSetting, getGeneralSettings } from '../../ApiServices'
import { toast } from 'react-toastify'
import CIcon from '@coreui/icons-react'
import { cilHandPointRight } from '@coreui/icons'
import { useUserState } from '../../context/UserContext'

const FaqForm = () => {
  var [isLoading, setIsLoading] = useState(false)
  var [defaultLoading, setdefaultLoading] = useState(true)
  var [id, setid] = useState(true)
  const { userRole } = useUserState()

  const {
    register,
    getValues,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm()

  const DefaultData = async () => {
    await getGeneralSettings()
      .then((response) => {
        setValue('email', response.data.info.email)
        setValue('password', response.data.info.password)
        setValue('admin_charges', response.data.info.admin_charges)
        setValue('razorpay_key_id', response.data.info.razorpay_key_id)
        setValue('razorpay_key_secret', response.data.info.razorpay_key_secret)
        setid(response.data.info.id)
        setdefaultLoading(false)
      })
      .catch(() => {
        setdefaultLoading(false)
      })
  }
  useEffect(() => {
    DefaultData()
  }, [setValue, getValues])

  const onSubmit = (data) => {
    // if (userRole == 1) {
    // console.log(getValues());
    setIsLoading(true)
    updateGeneralSetting(data, id)
      .then((response) => {
        if (response.data.isSuccess && response.data.status === 200) {
          setIsLoading(false)
          toast.success('Updated successfully!')
        } else {
          if ((response.data.status === 202 || 400) && !response.data.isSuccess) {
            Object.keys(response.data.message).forEach((key) => {
              // Set the error message for each field
              setError(key, {
                type: 'manual',
                message: response.data.message[key],
              })
            })
            setIsLoading(false)
          }
        }
      })
      .catch((err) => {
        if ((err.response.data.status === 401 || 400) && !err.response.data.isSuccess)
          Object.keys(err.response.data.message).forEach((key) => {
            // Set the error message for each field
            setError(key, {
              type: 'manual',
              message: err.response.data.message[key],
            })
          })
        setIsLoading(false)
      })
    // } else {
    //   toast.error(
    //     'Sorry, you do not have permission to access this feature.Please contact your administrator for assistance.',
    //   )
    // }
  }

  return (
    <CRow>
      <CContainer fluid className="custom-header">
        <CBreadcrumb>
          <CBreadcrumbItem>
            <Link to="/dashboard">Home</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active> Settings</CBreadcrumbItem>
          <CBreadcrumbItem active>General Settings</CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;EMAIL INFO
                </div>
              </CCol>
              <CCol md={12}>
                <CustomInput
                  name="email"
                  type="text"
                  label="Email Id"
                  {...register('email', { required: 'Email Id is required' })}
                  error={!!errors.email}
                  helperText={errors.email && errors.email.message}
                  defaultValue={getValues('email')}
                  onChange={(e) =>
                    handleInputChange('email', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>
              <CCol md={12}>
                <CustomInput
                  name="password"
                  type="password"
                  label="Password"
                  {...register('password', { required: 'Password is required' })}
                  error={!!errors.password}
                  helperText={errors.password && errors.password.message}
                  defaultValue={getValues('password')}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>
              {userRole == 1 && (
                <>
                  <CCol md={12} className="form-header ">
                    <div>
                      <CIcon icon={cilHandPointRight} />
                      &nbsp;&nbsp;ADMIN CHARGES INFO
                    </div>
                  </CCol>
                  <CCol md={12}>
                    <CustomInput
                      name="admin_charges"
                      type="number"
                      label="Commission (%)"
                      {...register('admin_charges', { required: 'Commission is required' })}
                      error={!!errors.admin_charges}
                      helperText={errors.admin_charges && errors.admin_charges.message}
                      defaultValue={getValues('admin_charges')}
                      onChange={(e) =>
                        handleInputChange('admin_charges', e.target.value, {
                          clearErrors,
                          setValue,
                        })
                      }
                    />
                  </CCol>
                  <p className="text-danger f-10">
                    <small>
                      Note: The above commission percentage will be applied to every appointment.
                    </small>
                  </p>

                  <CCol md={12} className="form-header ">
                    <div>
                      <CIcon icon={cilHandPointRight} />
                      &nbsp;&nbsp;RAZORPAY PAYMENT GATEWAY INFO
                    </div>
                  </CCol>
                  <CCol md={12}>
                    <CustomInput
                      name="razorpay_key_id"
                      type="text"
                      label="Razorpay Key Id"
                      {...register('razorpay_key_id', { required: 'Razorpay Key Id is required' })}
                      error={!!errors.razorpay_key_id}
                      helperText={errors.razorpay_key_id && errors.razorpay_key_id.message}
                      defaultValue={getValues('razorpay_key_id')}
                      onChange={(e) =>
                        handleInputChange('razorpay_key_id', e.target.value, {
                          clearErrors,
                          setValue,
                        })
                      }
                    />
                  </CCol>
                  <CCol md={12}>
                    <CustomInput
                      name="razorpay_key_secret"
                      type="text"
                      label="Razorpay Key Secret"
                      {...register('razorpay_key_secret', {
                        required: 'Razorpay Key Secret is required',
                      })}
                      error={!!errors.razorpay_key_secret}
                      helperText={errors.razorpay_key_secret && errors.razorpay_key_secret.message}
                      defaultValue={getValues('razorpay_key_secret')}
                      onChange={(e) =>
                        handleInputChange('razorpay_key_secret', e.target.value, {
                          clearErrors,
                          setValue,
                        })
                      }
                    />
                  </CCol>
                </>
              )}
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

export default FaqForm

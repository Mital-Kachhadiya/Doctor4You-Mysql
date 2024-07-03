import React, { useState } from 'react'
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
} from '@coreui/react'
import { useForm, Controller } from 'react-hook-form'
import CustomInput from '../../components/CustomInput'
import { handleInputChange } from '../../components/formUtils'
import { changePassword } from '../../ApiServices'
import { toast } from 'react-toastify'
const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    setError,
    reset,
  } = useForm()
  var [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data) => {
    setIsLoading(true)

    changePassword(data)
      .then((response) => {
        if (response.data.status === 200 && response.data.isSuccess) {
          reset()
          toast.success(response.data.info)
          setIsLoading(false)
        } else {
          setError(response.data.messages)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if ((err.response.data.status === 401 || 400) && !err.response.data.isSuccess)
          // toast.error(err.response.data.message)
          Object.keys(err.response.data.message).forEach((key) => {
            // Set the error message for each field
            setError(key, {
              type: 'manual',
              message: err.response.data.message[key],
            })
          })
        setIsLoading(false)
      })
  }

  return (
    <CRow>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Change Password</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CCol md={12} className="mb-3">
                <CustomInput
                  name="old_password"
                  type="text"
                  label="Old Password"
                  {...register('old_password', { required: 'Old Password is required' })}
                  error={!!errors.old_password}
                  helperText={errors.old_password && errors.old_password.message}
                  defaultValue={getValues('old_password')}
                  onChange={(e) =>
                    handleInputChange('old_password', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>
              <CCol md={12} className="mb-3">
                <CustomInput
                  name="new_password"
                  type="text"
                  label="New Password"
                  {...register('new_password', { required: 'New Password is required' })}
                  error={!!errors.new_password}
                  helperText={errors.new_password && errors.new_password.message}
                  defaultValue={getValues('new_password')}
                  onChange={(e) =>
                    handleInputChange('new_password', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>
              <CCol md={12} className="mb-3">
                <CustomInput
                  name="confirm_password"
                  id="confirm_password"
                  type="text"
                  label="Confirm Password"
                  {...register('confirm_password', { required: 'Confirm Password is required' })}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password && errors.confirm_password.message}
                  defaultValue={getValues('confirm_password')}
                  onChange={(e) =>
                    handleInputChange('confirm_password', e.target.value, { clearErrors, setValue })
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

export default Profile

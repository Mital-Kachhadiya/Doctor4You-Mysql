import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed } from '@coreui/icons'
import { useForm, Controller } from 'react-hook-form'
import logo from 'src/assets/Vector.svg'
import { checkmailid } from '../../ApiServices'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()
  //   var userDispatch = useUserDispatch()
  let navigate = useNavigate()
  var [isLoading, setIsLoading] = useState(false)
  var [success, setSuccess] = useState()

  const onSubmit = async (data) => {
    setIsLoading(true)

    checkmailid(data)
      .then((response) => {
        if (response.data.isSuccess === 400 || response.data.isSuccess === false) {
          setIsLoading(false)
        } else {
          setIsLoading(false)
          setSuccess('Check your mail box.')
          toast.success(response.data.info)
        }
      })
      .catch((err) => {
        if (err.response.data.status === 401 || !err.response.data.isSuccess) {
          Object.keys(err.response.data.message).forEach((key) => {
            // Set the error message for each field
            setError(key, {
              type: 'manual',
              message: err.response.data.message[key],
            })
          })
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      })
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center login-bg">
      <CContainer>
        <ToastContainer />
        <CRow className="justify-content-center">
          <img src={logo} height={140} alt="logo" className="header-logo mb-4" />
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h3 className="theme-color mb-3">Forgot Password</h3>

                    <div in={success}>
                      <p className="success-msg">{success ? success : ''}</p>
                    </div>

                    <div className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <Controller
                          name="email"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Email is required' }}
                          render={({ field }) => (
                            <CFormInput
                              {...field}
                              placeholder="Email"
                              autoComplete="email"
                              variant="outlined" // Custom prop for the outlined variant
                            />
                          )}
                        />
                      </CInputGroup>
                      {errors.email && <div className="error-msg mb-3">{errors.email.message}</div>}
                    </div>

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="" className="theme-btn-background">
                          Submit
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        {' '}
                        <Link to="/">
                          <CButton color="link" className="px-0 forgot-link">
                            Back to Login?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </form>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword

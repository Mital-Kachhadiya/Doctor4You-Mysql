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
import { Typography, Fade } from '@mui/material'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed, cilLockLocked, cilUser } from '@coreui/icons'
import { useForm, Controller } from 'react-hook-form'
import { loginUser, useUserDispatch } from '../../context/UserContext'
import logo from 'src/assets/Vector.svg'
const Login = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()
  var userDispatch = useUserDispatch()
  let navigate = useNavigate()
  var [isLoading, setIsLoading] = useState(false)
  // var [error, setError] = useState('')

  const onSubmit = async (data) => {
    loginUser(userDispatch, data, navigate, setIsLoading, setError)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center login-bg">
      <CContainer>
        <CRow className="justify-content-center">
          <img src={logo} height={140} alt="logo" className="header-logo mb-4" />
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="theme-color">Login</h1>
                    <p className="text-medium-emphasis ">Sign In to your account</p>
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
                            <>
                              <CFormInput
                                {...field}
                                placeholder="Email"
                                autoComplete="email"
                                variant="outlined"
                              />
                            </>
                          )}
                        />
                      </CInputGroup>
                      {errors.email && <div className="error-msg mb-3">{errors.email.message}</div>}
                    </div>
                    <div className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <Controller
                          name="password"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Password is required' }}
                          render={({ field }) => (
                            <>
                              <CFormInput
                                {...field}
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                variant="outlined" // Custom prop for the outlined variant
                              />
                            </>
                          )}
                        />
                      </CInputGroup>
                      {errors.password && (
                        <div className="error-msg mb-2">{errors.password.message}</div>
                      )}
                    </div>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="" className="theme-btn-background">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/forgot-password">
                          <CButton color="link" className="px-0 forgot-link">
                            Forgot password?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </form>
                </CCardBody>
              </CCard>
              <CCard className="text-white theme-background py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Join our community of healthcare providers to enhance patient care,
                      collaborate with peers, and streamline your practice.
                    </p>
                    <Link to="/register">
                      <CButton
                        color=""
                        className="mt-3 theme-btn-background sign-up-btn"
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

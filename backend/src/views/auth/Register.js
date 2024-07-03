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
import {
  cilEnvelopeClosed,
  cilEnvelopeLetter,
  cilLockLocked,
  cilPhone,
  cilUser,
} from '@coreui/icons'
import { useForm, Controller } from 'react-hook-form'
import { registerUser, useUserDispatch } from '../../context/UserContext'
import logo from 'src/assets/Vector.svg'

const Register = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()
  var userDispatch = useUserDispatch()
  let navigate = useNavigate()
  var [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data) => {
    registerUser(userDispatch, data, navigate, setIsLoading, setError)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center login-bg">
      <CContainer>
        <CRow className="justify-content-center">
          <img src={logo} height={140} alt="logo" className="header-logo mb-4" />
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <img src={logo} height={80} className="header-logo pb-2" /> */}
                    <h3 className="theme-color">Sign up</h3>
                    {/* <p className="text-medium-emphasis ">Sign Sign up to your account</p> */}
                    <div className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Name is required' }}
                          render={({ field }) => (
                            <CFormInput
                              {...field}
                              placeholder="Name"
                              variant="outlined" // Custom prop for the outlined variant
                            />
                          )}
                        />
                      </CInputGroup>
                      {errors.name && <div className="error-msg mb-3">{errors.name.message}</div>}
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
                    <div className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilPhone} />
                        </CInputGroupText>
                        <Controller
                          name="mo_no"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Mobile Number is required' }}
                          render={({ field }) => (
                            <CFormInput
                              {...field}
                              placeholder="Mobile Number"
                              autoComplete="email"
                              variant="outlined" // Custom prop for the outlined variant
                            />
                          )}
                        />
                      </CInputGroup>
                      {errors.mo_no && <div className="error-msg mb-3">{errors.mo_no.message}</div>}
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
                            <CFormInput
                              {...field}
                              type="password"
                              placeholder="Password"
                              autoComplete="current-password"
                              variant="outlined" // Custom prop for the outlined variant
                            />
                          )}
                        />
                      </CInputGroup>
                      {errors.password && (
                        <div className="error-msg mb-3">{errors.password.message}</div>
                      )}
                    </div>
                    <Controller
                      name="role"
                      control={control}
                      defaultValue="2"
                      rules={{ required: 'Role is required' }}
                      render={({ field }) => <CFormInput {...field} type="hidden" />}
                    />

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="" className="theme-btn-background">
                          Register
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        {' '}
                        <Link to="/">
                          <CButton color="link" className="px-0 forgot-link">
                            Already have an account?
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

export default Register

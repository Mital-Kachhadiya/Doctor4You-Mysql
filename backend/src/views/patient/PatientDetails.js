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
  CFormCheck,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'
import { useForm, Controller } from 'react-hook-form'
import noImg from '../../assets/images/no_img.png'

import CIcon from '@coreui/icons-react'
import {
  cilArrowCircleRight,
  cilArrowCircleTop,
  cilArrowRight,
  cilAsteriskCircle,
  cilCalendar,
  cilCircle,
  cilEnvelopeClosed,
  cilHandPointRight,
  cilLocationPin,
  cilMobile,
  cilMoney,
  cilMoon,
  cilPhone,
  cilPin,
  cilPlus,
  cilStar,
  cilSun,
  cilUser,
  cilUserFemale,
  cilWatch,
} from '@coreui/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { formatGMTDate } from '../../components/dateUtils'

const PatientDetails = () => {
  var [defaultLoading, setdefaultLoading] = useState(true)
  var [userImg, setUserImg] = useState(noImg)

  const { state } = useLocation()
  console.log(state)
  useEffect(() => {
    const user_Img = state.patientData.image ? `${state.baseurl}/${state.patientData.image}` : noImg
    setUserImg(user_Img)
    setdefaultLoading(false)
  }, [])

  return (
    <CRow>
      <CCol xs={12} md={12}>
        <CCard className="mb-4">
          {defaultLoading ? (
            <CSpinner className="theme-spinner-color" />
          ) : (
            <CCardBody>
              {' '}
              <CCol md={12} xs={12} className="mb-4">
                <div className="form-header">
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;PATIENT INFO
                </div>
                <div className="appdetail-div">
                  {' '}
                  <CRow>
                    <CCol xs={12} md={2} className="mb-2 text-center">
                      {' '}
                      <img src={userImg} className="img-preview" alt="Patient Image" />
                    </CCol>
                    <CCol xs={12} md={10} className="mb-2 text-center">
                      <CRow>
                        <CCol xs={12} md={6} className="mb-2">
                          <p className="mb-2 appdatediv">
                            {' '}
                            <span>
                              <CIcon icon={cilUser} /> &nbsp; Name :&nbsp;
                            </span>
                            <span>{state.patientData.name}</span>
                          </p>
                        </CCol>
                        <CCol xs={12} md={6} className="mb-2">
                          <p className="mb-2 appdatediv">
                            <span>
                              <CIcon icon={cilEnvelopeClosed} /> &nbsp; Email :&nbsp;
                            </span>
                            <span>{state.patientData.email}</span>
                          </p>
                        </CCol>
                        <CCol xs={12} md={4} className="mb-2">
                          <p className="mb-2 appdatediv">
                            <span>
                              <CIcon icon={cilPhone} /> &nbsp;Mobile No : &nbsp;
                            </span>
                            <span>{state.patientData.mo_no}</span>
                          </p>
                        </CCol>
                        <CCol xs={12} md={3} className="mb-2">
                          <p className="mb-2 appdatediv">
                            {state.patientData.gender == 1 ? (
                              <>
                                <span>
                                  <CIcon icon={cilUser} /> &nbsp; Gender: &nbsp;
                                </span>
                                <span>MALE</span>
                              </>
                            ) : (
                              <>
                                {' '}
                                <span>
                                  <CIcon icon={cilUserFemale} /> &nbsp; Gender: &nbsp;
                                </span>
                                <span>FEMALE</span>
                              </>
                            )}
                          </p>
                        </CCol>
                        <CCol xs={12} md={5} className="mb-2">
                          <p className="mb-2 appdatediv">
                            <span>
                              <CIcon icon={cilCalendar} /> &nbsp; Date Of Birth : &nbsp;
                            </span>
                            <span>{formatGMTDate(state.patientData.dob)}</span>
                          </p>
                        </CCol>
                        <CCol xs={12} md={12} className="mb-2">
                          <p className="mb-2 appdatediv">
                            <span>
                              <CIcon icon={cilPin} /> &nbsp; Address : &nbsp;
                            </span>
                            <span>{state.patientData.address}</span>
                          </p>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </div>
              </CCol>
            </CCardBody>
          )}
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PatientDetails

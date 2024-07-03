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
import { useUserState, useUserDispatch, updateUser } from '../../context/UserContext'
import CIcon from '@coreui/icons-react'
import * as Icons from '@mui/icons-material'
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
  cilPlus,
  cilStar,
  cilSun,
  cilUser,
  cilUserFemale,
  cilWatch,
} from '@coreui/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { formatDate, formatTime } from '../../components/dateUtils'
import { getDoctorByid, getPatientByid } from '../../ApiServices'

const AppointmentDetails = () => {
  var [defaultLoading, setdefaultLoading] = useState(true)
  var [userImg, setUserImg] = useState(noImg)
  var [drImg, setDrImg] = useState(noImg)
  const navigate = useNavigate()
  const { state } = useLocation()
  const { userRole } = useUserState()
  useEffect(() => {
    const user_Img = state.appData.user.image
      ? `${state.appData.user_baseUrl}/${state.appData.user.image}`
      : noImg
    setUserImg(user_Img)

    const dr_Img = state.appData.doctor.image
      ? `${state.appData.doc_baseUrl}/${state.appData.doctor.image}`
      : noImg
    setDrImg(dr_Img)
    setdefaultLoading(false)
  }, [])

  const goDrPage = async () => {
    await getDoctorByid(state.appData.dr_id)
      .then((response) => {
        navigate('/doctor/view', {
          state: {
            doctorData: response.data.info.doctors,
            baseurl: response.data.info.baseUrl,
          },
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const goUserPage = async () => {
    await getPatientByid(state.appData.user_id)
      .then((response) => {
        navigate('/patient/view', {
          state: {
            patientData: response.data.info.patients,
            baseurl: response.data.info.baseUrl,
          },
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <CRow>
      <CCol xs={12} md={12}>
        <CCard className="mb-4">
          {defaultLoading ? (
            <CSpinner className="theme-spinner-color" />
          ) : (
            <CCardBody>
              <CRow>
                <CCol md={3} xs={12} className="mb-4">
                  <div className="app-header">
                    APPOINTMENT ID : &nbsp;{state.appData.appointment_id}{' '}
                  </div>
                </CCol>
                <CCol md={6} xs={12}>
                  {' '}
                  <div className="app-header">
                    APPOINTMENT DATE : &nbsp;{state.appData.app_date_time}{' '}
                  </div>
                </CCol>

                <CCol md={3} xs={12}>
                  {state.appData.status == 0 ? (
                    <div className="app_pending_style">Pending</div>
                  ) : state.appData.status == 1 ? (
                    <div className="app_complete_style">Completed</div>
                  ) : (
                    <div className="app_cancel_style">Cancelled</div>
                  )}
                </CCol>
              </CRow>

              <CRow>
                <CCol xs={12} md={4} className="mb-4">
                  <div className="form-header">
                    <CIcon icon={cilHandPointRight} />
                    &nbsp;&nbsp;PATIENT INFO
                  </div>
                  <div className="appdetail-div">
                    <CRow>
                      <CCol xs={12} md={8}>
                        <p className="mb-2">
                          {' '}
                          <CIcon icon={cilUser} /> &nbsp;<span>{state.appData.name}</span>
                        </p>
                        <p className="mb-2">
                          <CIcon icon={cilPhone} /> &nbsp;<span>{state.appData.mo_no}</span>
                        </p>
                      </CCol>
                      <CCol xs={12} md={4}>
                        <p className="mb-2">
                          <CIcon icon={cilCalendar} /> &nbsp;
                          <span>{state.appData.age} Year</span>
                        </p>
                        <p className="mb-2">
                          {state.appData.gender == 1 ? (
                            <>
                              <CIcon icon={cilUser} /> &nbsp;
                              <span>MALE</span>
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilUserFemale} /> &nbsp;
                              <span>FEMALE</span>
                            </>
                          )}
                        </p>
                      </CCol>
                      <CCol xs={12} md={12} className="mb-2">
                        <p className="mb-2">
                          {' '}
                          <CIcon icon={cilLocationPin} /> &nbsp;
                          <span>{state.appData.current_location}</span>
                        </p>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>

                <CCol xs={12} md={4} className="mb-4">
                  <div className="form-header left-data">
                    <div className="text-container">
                      <CIcon icon={cilHandPointRight} />
                      &nbsp;&nbsp;DOCTOR INFO
                    </div>
                    {userRole == '1' ? (
                      <Icons.RemoveRedEye className="viewIcon" onClick={goDrPage} />
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="appdetail-div">
                    <CRow>
                      <CCol xs={12} md={4} className="mb-2 text-center">
                        {' '}
                        <img src={drImg} className="img-preview" />
                      </CCol>
                      <CCol xs={12} md={6} className="mb-2">
                        <p className="mb-2">
                          {' '}
                          <CIcon icon={cilUser} /> {state.appData.doctor.name}
                        </p>
                        <p className="mb-2">
                          <CIcon icon={cilEnvelopeClosed} /> {state.appData.doctor.email}
                        </p>
                        <p className="mb-2">
                          <CIcon icon={cilPhone} /> {state.appData.doctor.mo_no}
                        </p>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>

                <CCol xs={12} md={4} className="mb-4">
                  <div className="form-header left-data">
                    <div className="text-container">
                      <CIcon icon={cilHandPointRight} />
                      &nbsp;&nbsp;ACCOUNT HOLDER INFO
                    </div>
                    <Icons.RemoveRedEye className="viewIcon" onClick={goUserPage} />
                  </div>

                  <div className="appdetail-div">
                    <CRow>
                      <CCol xs={12} md={4} className="mb-2 text-center">
                        {' '}
                        <img src={userImg} className="img-preview" />
                      </CCol>
                      <CCol xs={12} md={6} className="mb-2">
                        <p className="mb-2">
                          {' '}
                          <CIcon icon={cilUser} /> &nbsp;<span>{state.appData.user.name}</span>
                        </p>
                        <p className="mb-2">
                          <CIcon icon={cilEnvelopeClosed} /> &nbsp;
                          <span>{state.appData.user.email}</span>
                        </p>
                        <p className="mb-2">
                          <CIcon icon={cilPhone} /> &nbsp;<span>{state.appData.user.mo_no}</span>
                        </p>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>
              </CRow>

              <CCol md={12} className="mb-4">
                <div className="form-header">
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;APPOINTMENT DATE & TIME INFO
                </div>
                <div className="appdetail-div">
                  <CRow>
                    <CCol xs={12} md={3}>
                      <p className="mb-2 appdatediv">
                        {' '}
                        <span>
                          <CIcon icon={cilCalendar} /> &nbsp; Date :{' '}
                        </span>
                        <span>{formatDate(state.appData.app_date)}</span>
                      </p>
                    </CCol>
                    <CCol xs={12} md={3}>
                      <p className="mb-2 appdatediv">
                        <span>
                          {' '}
                          <CIcon icon={cilWatch} /> &nbsp; Time:{' '}
                        </span>
                        <span>{formatTime(state.appData.app_time)}</span>
                      </p>
                    </CCol>
                    <CCol xs={12} md={3}>
                      <p className="mb-2 appdatediv">
                        {state.appData.shift == 1 ? (
                          <>
                            <span>
                              <CIcon icon={cilSun} /> &nbsp; Shift:{' '}
                            </span>
                            <span>MORNING</span>
                          </>
                        ) : (
                          <>
                            <span>
                              <CIcon icon={cilMoon} /> &nbsp; Shift:{' '}
                            </span>
                            <span>EVENING</span>
                          </>
                        )}
                      </p>
                    </CCol>
                    <CCol xs={12} md={3}>
                      <p className="mb-2 appdatediv">
                        <span>
                          {' '}
                          {state.appData.treatment_type == 1 ? (
                            <>
                              <span>
                                {' '}
                                <CIcon icon={cilAsteriskCircle} /> &nbsp; Type:
                              </span>{' '}
                              <span>HOME VISIT</span>
                            </>
                          ) : (
                            <>
                              <span>
                                <CIcon icon={cilAsteriskCircle} /> &nbsp; Type:
                              </span>{' '}
                              <span>CALL & MESSAGES</span>
                            </>
                          )}{' '}
                        </span>
                      </p>
                    </CCol>
                  </CRow>
                </div>
              </CCol>

              <CCol md={12} className="mb-4">
                <div className="form-header">
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;SYMPTOMS INFO
                </div>
                <div className="appdetail-div">
                  <CAccordion>
                    <CAccordionItem itemKey={1}>
                      <CAccordionHeader>
                        {' '}
                        <CIcon icon={cilArrowCircleRight} /> &nbsp;&nbsp;Symptoms Description
                      </CAccordionHeader>
                      <CAccordionBody>{state.appData.symptoms}</CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem itemKey={2}>
                      <CAccordionHeader>
                        {' '}
                        <CIcon icon={cilArrowCircleRight} /> &nbsp;&nbsp;How long have patient been
                        having these symptoms?
                      </CAccordionHeader>
                      <CAccordionBody>{state.appData.symptoms_time}</CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem itemKey={3}>
                      <CAccordionHeader>
                        <CIcon icon={cilArrowCircleRight} /> &nbsp;&nbsp;Patient currently under any
                        other medication?
                      </CAccordionHeader>
                      <CAccordionBody>
                        {state.appData.other_medicine == 1 ? 'YES' : 'NO'}
                      </CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem itemKey={4}>
                      <CAccordionHeader>
                        <CIcon icon={cilArrowCircleRight} /> &nbsp;&nbsp;Patient have any known drug
                        allergies?
                      </CAccordionHeader>
                      <CAccordionBody>
                        {state.appData.drug_allergies == 1 ? 'YES' : 'NO'}
                      </CAccordionBody>
                    </CAccordionItem>
                    <CAccordionItem itemKey={5}>
                      <CAccordionHeader>
                        <CIcon icon={cilArrowCircleRight} /> &nbsp;&nbsp;List out known allergens
                      </CAccordionHeader>
                      <CAccordionBody>{state.appData.allergie_list}</CAccordionBody>
                    </CAccordionItem>
                  </CAccordion>
                </div>
              </CCol>

              <CCol md={12} className="mb-4">
                <div className="form-header">
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;PAYMENT INFO (Transaction ID: {state.appData.trasactionId})
                </div>
                <div className="appdetail-div">
                  <CRow>
                    <CCol xs={12} md={3}>
                      <p className="mb-2 appdatediv">
                        {' '}
                        <span>
                          <CIcon icon={cilMoney} /> &nbsp; Total Amount :{' '}
                        </span>
                        <span> ₹ {state.appData.payment_amount}</span>
                      </p>
                    </CCol>
                    <CCol xs={12} md={3}>
                      <p className="mb-2 appdatediv">
                        {' '}
                        <span>
                          <CIcon icon={cilMoney} /> &nbsp; Admin Charges (
                          {state.appData.admin_charges}%):{' '}
                        </span>
                        <span> ₹ {state.appData.admin_amount}</span>
                      </p>
                    </CCol>

                    <CCol xs={12} md={3}>
                      <p className="mb-2 appdatediv">
                        {' '}
                        <span>
                          <CIcon icon={cilMoney} /> &nbsp; Net amount :{' '}
                        </span>
                        <span> ₹ {state.appData.doctor_amount}</span>
                      </p>
                    </CCol>

                    <CCol xs={12} md={3}>
                      {state.appData.payment_status == 1 ? (
                        <p className="mb-2 appdatediv apppaysuccessdiv">
                          <span>
                            <CIcon icon={cilSun} /> &nbsp; Payment Status:{' '}
                          </span>
                          <span>COMPLETED</span>
                        </p>
                      ) : (
                        <p className="mb-2 appdatediv apppayfaildiv">
                          <span>
                            <CIcon icon={cilMoon} /> &nbsp; Payment Status:{' '}
                          </span>
                          <span>PENDING</span>
                        </p>
                      )}
                    </CCol>
                  </CRow>
                </div>
              </CCol>

              <CCol md={12} className="mb-4">
                <div className="form-header">
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;REVIEW & RATING
                </div>
                <div className="appdetail-div">
                  <CRow>
                    <CCol xs={12} md={12}>
                      <p className="mb-2">
                        {' '}
                        <span>{state.appData.review ? state.appData.review : 'No Review'}</span>
                      </p>
                      <p className="mb-2">
                        {' '}
                        <span>
                          {state.appData.star_rating
                            ? Array.from({ length: state.appData.star_rating }, (_, index) => (
                                <CIcon icon={cilStar} key={index} className="starStyle" />
                              ))
                            : ''}
                        </span>
                      </p>
                    </CCol>
                    <CCol xs={12} md={12}>
                      <p className="mb-2 appdatediv">
                        Patient Would recommend {state.appData.doctorName} to{' '}
                        {state.appData.gender == '1' ? 'his' : 'her'} friends? &nbsp;&nbsp;&nbsp;
                        <span>
                          <b>{state.appData.recommend_status == '1' ? 'YES' : 'NO'}</b>
                        </span>
                      </p>
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

export default AppointmentDetails

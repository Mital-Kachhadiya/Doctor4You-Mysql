import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CListGroup,
  CListGroupItem,
  CImage,
  CBadge,
} from '@coreui/react'
import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import { formatTime, convertTimeToAMPMFormat } from '../../components/dateUtils'
import noImg from '../../assets/images/no_img.png'

const DoctorDeatils = () => {
  var [defaultLoading, setdefaultLoading] = useState(true)
  var [drImg, setDrImg] = useState(noImg)
  var [wDays, setWDays] = useState(null)

  const { state } = useLocation()
  console.log(state)
  useEffect(() => {
    const user_Img = state.doctorData.image ? `${state.baseurl}/${state.doctorData.image}` : noImg
    setDrImg(user_Img)
    const workingDaysString = state.doctorData.working_days
    const workingDaysArray = workingDaysString.split(',').map(Number)

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    const workingDaysNames = workingDaysArray.map((dayNumber) => daysOfWeek[dayNumber - 1])
    setWDays(workingDaysNames.join(', '))

    setdefaultLoading(false)
  }, [])
  return (
    <CRow>
      <CCol lg={4}>
        <CCard className="mb-2">
          <CCardHeader>
            <h4 className="mb-0">{state.doctorData.name}</h4>
            <p className="text-muted mb-0">
              {state.doctorData.category.title} ({state.doctorData.experience} Years of Experience)
            </p>
          </CCardHeader>
          <CCardBody className="text-center">
            <CImage
              src={drImg}
              alt="Doctor Profile"
              className="img-fluid rounded-circle mb-3 dr_img"
            />
          </CCardBody>
        </CCard>
        <CCard className="mb-2">
          <CCardHeader className="dr_header_bg">Contact Information</CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <strong>
                  <FaEnvelope /> &nbsp; Email:
                </strong>{' '}
                {state.doctorData.email}
              </CListGroupItem>
              <CListGroupItem>
                <strong>
                  <FaPhone /> Mobile: &nbsp;
                </strong>{' '}
                {state.doctorData.mo_no}
              </CListGroupItem>
              <CListGroupItem>
                <strong>
                  <FaWhatsapp /> WhatsApp: &nbsp;
                </strong>{' '}
                {state.doctorData.wapp_no}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={8}>
        <CCard className="mb-2">
          <CCardHeader className="dr_header_bg">About</CCardHeader>
          <CCardBody>
            <div dangerouslySetInnerHTML={{ __html: state.doctorData.about }} />
          </CCardBody>
        </CCard>
        <CCard className="mb-2">
          <CCardHeader className="dr_header_bg">Workplace Information</CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <strong>Workplace Name:</strong> {state.doctorData.work_place_name}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Address:</strong> &nbsp;{state.doctorData.work_place_address}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Working Days:</strong> &nbsp;{wDays}
              </CListGroupItem>
              {state.doctorData.morning_shift ? (
                <CListGroupItem>
                  <strong>Morning Shift:</strong> &nbsp;
                  {convertTimeToAMPMFormat(state.doctorData.morning_start_time)} to{' '}
                  {convertTimeToAMPMFormat(state.doctorData.morning_end_time)}
                  <div>
                    <strong>Duration:</strong> &nbsp;{state.doctorData.morning_duration}{' '}
                    min/appointment
                  </div>
                </CListGroupItem>
              ) : null}
              {state.doctorData.evening_shift ? (
                <CListGroupItem>
                  <strong>Evening Shift:</strong> &nbsp;
                  {convertTimeToAMPMFormat(state.doctorData.evening_start_time)} to{' '}
                  {convertTimeToAMPMFormat(state.doctorData.evening_end_time)}
                  <div>
                    <strong>Duration:</strong> &nbsp;{state.doctorData.evening_duration}{' '}
                    min/appointment
                  </div>
                </CListGroupItem>
              ) : null}
              <CListGroupItem>
                <strong>Patient Count:</strong> &nbsp;
                {state.doctorData.patients_count}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>

        <CCard className="mb-2">
          <CCardHeader className="dr_header_bg">Charges</CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <strong>Call/Message Charge:</strong> {state.doctorData.call_msg_price}
              </CListGroupItem>
              <CListGroupItem>
                <strong>House Visit Charge:</strong> {state.doctorData.house_visit_price}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>

        <CCard className="mb-2">
          <CCardHeader className="dr_header_bg">Bank Account Details</CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <strong>Bank Name:</strong> {state.doctorData.bank_name}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Account Holder Name:</strong> {state.doctorData.acc_holder_name}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Account Number:</strong> {state.doctorData.acc_number}
              </CListGroupItem>
              <CListGroupItem>
                <strong>IFSC Code:</strong> {state.doctorData.ifsc_code}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DoctorDeatils

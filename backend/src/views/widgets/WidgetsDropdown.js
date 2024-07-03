import React, { useState, useEffect } from 'react'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsF,
  CLink,
} from '@coreui/react'
import {
  cilArrowRight,
  cilBasket,
  cilBell,
  cilChartPie,
  cilMoon,
  cilLaptop,
  cilPeople,
  cilSettings,
  cilSpeech,
  cilSpeedometer,
  cilUser,
  cilUserFollow,
  cilUserPlus,
  cilPlus,
  cilBoltCircle,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { dashboardCountData } from '../../ApiServices'
import { Grid, CircularProgress } from '@mui/material'
import { useUserState } from '../../context/UserContext'

const WidgetsDropdown = () => {
  var [defaultLoading, setdefaultLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [doctors, setDoctors] = useState(null)
  const [patients, setPatients] = useState(null)
  const [appointments, setAppointments] = useState(null)
  const [specialistCat, setSpecialistCat] = useState(null)
  const { userRole } = useUserState()

  const countData = async () => {
    setIsLoading(true)
    await dashboardCountData()
      .then((response) => {
        setDoctors(response.data.info.doctors)
        setPatients(response.data.info.patients)
        setAppointments(response.data.info.appointments)
        setSpecialistCat(response.data.info.specialistCat)
        setIsLoading(false)
      })
      .catch((err) => {
        if (!err.response.data.isSuccess) {
          if (err.response.data.status === 401) {
            setIsLoading(false)
          } else {
            console.log(err.response.data, 'else')
          }
        }
      })
  }

  useEffect(() => {
    countData()
  }, [])

  return (
    <CRow>
      {isLoading ? (
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <CircularProgress size={26} fullWidth />
        </Grid>
      ) : (
        <>
          {userRole == 1 && (
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3"
                icon={<CIcon width={24} icon={cilUserPlus} size="xl" />}
                title="Total Doctors"
                value={doctors}
                color="primary"
                footer={
                  <CLink
                    className="font-weight-bold font-xs text-medium-emphasis"
                    href="doctor"
                    rel="noopener norefferer"
                    target="_blank"
                  >
                    View more
                    <CIcon icon={cilArrowRight} className="float-end" width={16} />
                  </CLink>
                }
              />
            </CCol>
          )}
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              icon={<CIcon width={24} icon={cilUser} size="xl" />}
              title="Total Patients"
              value={patients}
              color="info"
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="patient"
                  rel="noopener norefferer"
                  target="_blank"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
            />
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              icon={<CIcon width={24} icon={cilPlus} size="xl" />}
              title="Total Appointments"
              value={appointments}
              color="warning"
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="appointment"
                  rel="noopener norefferer"
                  target="_blank"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
            />
          </CCol>
          {userRole == 1 && (
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3"
                icon={<CIcon width={24} icon={cilBoltCircle} size="xl" />}
                title="Specialist Categories"
                value={specialistCat}
                color="danger"
                footer={
                  <CLink
                    className="font-weight-bold font-xs text-medium-emphasis"
                    href="specialist-category"
                    rel="noopener norefferer"
                    target="_blank"
                  >
                    View more
                    <CIcon icon={cilArrowRight} className="float-end" width={16} />
                  </CLink>
                }
              />
            </CCol>
          )}
        </>
      )}
    </CRow>
  )
}

export default WidgetsDropdown

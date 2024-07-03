import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import UpcomingAppointments from '../dashboard/UpcomingAppointments'
import PastAppointments from '../dashboard/PastAppointments'
import TodayAppointments from '../dashboard/TodayAppointment'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { CChartBar } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getDatewiseAppointments } from '../../ApiServices'

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [sumOfPayAmt, setSumOfPayAmt] = useState(0)

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Revenue (₹)',
        backgroundColor: '#00989926',
        data: [],
      },
    ],
  })

  useEffect(() => {
    // Set default start and end dates to the last 7 days
    const defaultEndDate = new Date()
    const defaultStartDate = new Date()
    defaultStartDate.setDate(defaultEndDate.getDate() - 7)

    setStartDate(defaultStartDate)
    setEndDate(defaultEndDate)

    // Fetch data for the default date range
    fetchData(defaultStartDate, defaultEndDate)
  }, []) // Empty dependency array ensures the effect runs only once on mount

  const fetchData = async (start, end) => {
    try {
      const response = await getDatewiseAppointments(formatDate(start), formatDate(end))
      const labels = response.data.info.map((item) => item.formattedDate)
      const paymentAmounts = response.data.info.map((item) => item.totalPaymentAmount)

      // Calculate the sum using the reduce function
      const sumOfPaymentAmounts = paymentAmounts.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      )
      setSumOfPayAmt(sumOfPaymentAmounts)
      setChartData({
        labels,
        datasets: [
          {
            label: 'Revenue (₹)',
            backgroundColor: '#00989926',
            data: paymentAmounts,
          },
        ],
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleSubmit = () => {
    fetchData(startDate, endDate)
  }

  return (
    <>
      <WidgetsDropdown />

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="appointment-header">
              <b>Today Appointments</b>
            </CCardHeader>
            <TodayAppointments />
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="appointment-header">
              <b>UpComing Appointments</b>
            </CCardHeader>
            <UpcomingAppointments />
          </CCard>
        </CCol>

        {/* <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="appointment-header">
              <b>Past Appointments</b>
            </CCardHeader>
            <PastAppointments />
          </CCard>
        </CCol> */}
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="theme-bg">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Revenue Report </h5>
                </div>
                <div className="col-md-6">
                  <div className="row align-items-center">
                    <div className="col-md-5 d-flex">
                      <label htmlFor="startDate" className="mb-0 mr-8 f-12">
                        FROM DATE
                      </label>
                      <DatePicker
                        id="startDate"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-5 d-flex">
                      <label htmlFor="endDate" className="mb-0 mr-8 f-12">
                        TO DATE
                      </label>
                      <DatePicker
                        id="endDate"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="End Date"
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-2">
                      <CButton
                        color="primary"
                        onClick={handleSubmit}
                        className="white-btn-background"
                      >
                        SUBMIT
                      </CButton>
                    </div>
                  </div>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <p className="revenue-text">Total Revenue Amount ₹ {sumOfPayAmt}</p>
              <CChartBar data={chartData} labels="days" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard

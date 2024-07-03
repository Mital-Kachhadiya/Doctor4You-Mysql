import {
  getAllDoctors,
  deleteDoctor,
  deleteMultDoctor,
  updateDoctorStatus,
  updateTopDoctorStatus,
} from '../../ApiServices'
import React, { useEffect, useState } from 'react'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as Icons from '@mui/icons-material'
import { useNavigate, Link } from 'react-router-dom'
import { Grid, CircularProgress, IconButton } from '@mui/material'
import swal from 'sweetalert'
import Switch from '@mui/material/Switch'
import { useUserState } from '../../context/UserContext'
import PropTypes from 'prop-types'
import { CBreadcrumb, CBreadcrumbItem, CContainer, CButton } from '@coreui/react'
import noImg from '../../assets/images/no_img.png'
import { getUpcomingAppointment } from '../../ApiServices'

const UpcomingAppointments = () => {
  const [datatableData, setdatatableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { userRole } = useUserState()

  const list = async () => {
    setIsLoading(true)
    await getUpcomingAppointment()
      .then((response) => {
        setIsLoading(false)
        const listData = response.data.info
        // Combine the appointment data with user and doctor data
        const enhancedAppointments = listData.map((appointment) => ({
          ...appointment, // Assuming appointment already contains necessary properties
          app_date_time:
            appointment.app_date && appointment.app_time
              ? `${new Date(appointment.app_date).toLocaleDateString()} ${new Date(
                  `1970-01-01T${appointment.app_time}`,
                ).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}`
              : '',
          userName: appointment.user ? appointment.user.name : '',
          doctorName: appointment.doctor ? appointment.doctor.name : '',
        }))
        console.log(enhancedAppointments)
        setdatatableData(enhancedAppointments)
      })
      .catch((err) => {
        if (!err.response.data.isSuccess) {
          if (err.response.data.status === 401) {
            toast.error(err.response.data.message)
            setIsLoading(false)
          } else {
            setIsLoading(false)
          }
        }
      })
  }

  useEffect(() => {
    const redirectSuccess = localStorage.getItem('redirectSuccess')

    if (redirectSuccess === 'true') {
      // The value was found in local storage, perform actions as needed
      toast.success(localStorage.getItem('redirectMessage'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      // Remove the value from local storage
      localStorage.removeItem('redirectSuccess')
    }
    list()
  }, [])
  const columns = [
    {
      name: 'index', // Use the name 'index' to represent the index column
      label: '#', // Label for the index column
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return tableMeta.rowIndex + 1 // Add 1 to start numbering from 1
        },
      },
    },
    {
      name: 'appointment_id', // Use the name 'index' to represent the index column
      label: 'Appointment ID', // Label for the index column
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'name',
      label: 'Patient Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'doctorName',
      label: 'Doctor',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'userName',
      label: 'Account Holder Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'app_date_time',
      label: 'Appointment DateTime',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (_, { rowIndex }) => {
          const { status } = datatableData[rowIndex]
          return (
            <div>
              {status === '0' && (
                <p className="pending_app">
                  <b>Pending</b>
                </p>
              )}
              {status === '1' && (
                <p className="completed_app">
                  <b>Completed</b>
                </p>
              )}
              {status === '2' && (
                <p className="cancelled_app">
                  <b>Cancelled</b>
                </p>
              )}
            </div>
          )
        },
      },
    },
  ].filter(Boolean)

  return (
    <>
      {isLoading ? (
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <CircularProgress size={26} fullWidth />
        </Grid>
      ) : (
        <MUIDataTable
          data={datatableData}
          columns={columns}
          options={{
            selectableRows: false, // This removes the checkbox column
            // filter: false, //  This removes the toolbar filters
          }}
        />
      )}
    </>
  )
}

export default UpcomingAppointments

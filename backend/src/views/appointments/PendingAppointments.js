import {
  getPendingAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from '../../ApiServices'
import React, { useEffect, useState } from 'react'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as Icons from '@mui/icons-material'
import { useNavigate, Link } from 'react-router-dom'
import { Grid, CircularProgress, IconButton } from '@mui/material'
import swal from 'sweetalert'
import { useUserState } from '../../context/UserContext'
import PropTypes from 'prop-types'
import { CBreadcrumb, CBreadcrumbItem, CContainer, CButton } from '@coreui/react'

const Appointment = () => {
  const [datatableData, setdatatableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { userRole } = useUserState()

  const list = async () => {
    setIsLoading(true)
    await getPendingAppointment()
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
    {
      name: 'id',
      label: 'Action',
      options: {
        filter: false,
        customBodyRender: (value, { rowIndex }) => {
          const { status } = datatableData[rowIndex]
          return (
            <div>
              {status === '0' && (
                <>
                  <Icons.CheckBox
                    className="completedIcon"
                    onClick={async () => {
                      if (userRole == 1) {
                        const confirm = await swal({
                          title: 'Are you sure?',
                          text: 'Are you sure that you want to complete this Appointment?',
                          icon: 'success',
                          buttons: ['No, cancel it!', 'Yes, I am sure!'],
                          dangerMode: true,
                        })
                        if (confirm) {
                          const data = { status: '1' }
                          updateAppointmentStatus(data, value)
                            .then(() => {
                              toast.success('Appointment completed successfully!', {
                                key: data.id,
                              })
                              list()
                            })
                            .catch(() => {
                              toast.error('something went wrong!', {
                                key: data.id,
                              })
                            })
                        }
                      } else {
                        toast.error(
                          'Sorry, you do not have permission to access this feature.Please contact your administrator for assistance.',
                        )
                      }
                    }}
                  />
                  <Icons.Cancel
                    className="deleteIcon"
                    onClick={async () => {
                      if (userRole == 1) {
                        const confirm = await swal({
                          title: 'Are you sure?',
                          text: 'Are you sure that you want to cancel this Appointment?',
                          icon: 'warning',
                          buttons: ['No, cancel it!', 'Yes, I am sure!'],
                          dangerMode: true,
                        })
                        if (confirm) {
                          const data = { status: '2' }
                          updateAppointmentStatus(data, value)
                            .then(() => {
                              toast.success('Appointment cancelled successfully!', {
                                key: data.id,
                              })
                              list()
                            })
                            .catch(() => {
                              toast.error('something went wrong!', {
                                key: data.id,
                              })
                            })
                        }
                      } else {
                        toast.error(
                          'Sorry, you do not have permission to access this feature.Please contact your administrator for assistance.',
                        )
                      }
                    }}
                  />

                  <Icons.Delete
                    className="deleteIcon"
                    onClick={async () => {
                      if (userRole == 1) {
                        const confirm = await swal({
                          title: 'Are you sure?',
                          text: 'Are you sure that you want to delete this Appointment?',
                          icon: 'warning',
                          buttons: ['No, cancel it!', 'Yes, I am sure!'],
                          dangerMode: true,
                        })
                        if (confirm) {
                          deleteAppointment(value)
                            .then(() => {
                              toast.success('deleted successfully!', {
                                key: value,
                              })
                              list()
                            })
                            .catch(() => {
                              toast.error('something went wrong!', {
                                key: value,
                              })
                            })
                        }
                      } else {
                        toast.error(
                          'Sorry, you do not have permission to access this feature.Please contact your administrator for assistance.',
                        )
                      }
                    }}
                  />
                </>
              )}

              <Icons.RemoveRedEye
                className="viewIcon"
                onClick={() => {
                  const appointmentData = datatableData.find((data) => data.id === value)
                  navigate('/appointment/view', {
                    state: { appData: appointmentData },
                  })
                }}
              />
            </div>
          )
        },
      },
    },
  ]

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ToastContainer />
          <CContainer fluid className="custom-header">
            <CBreadcrumb>
              <CBreadcrumbItem>
                <Link to="/dashboard">Home</Link>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>Pending Appointments</CBreadcrumbItem>
            </CBreadcrumb>
          </CContainer>
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
        </Grid>
      </Grid>
    </div>
  )
}

export default Appointment

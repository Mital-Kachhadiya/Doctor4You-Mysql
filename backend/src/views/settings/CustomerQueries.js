import { customerIssue, updateCustomerIssueStatus } from '../../ApiServices'
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

const CustomerQueries = () => {
  const [datatableData, setdatatableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { userRole } = useUserState()

  const list = async () => {
    setIsLoading(true)
    await customerIssue()
      .then((response) => {
        console.log(response)
        setIsLoading(false)
        setdatatableData(response.data.info)
      })
      .catch((err) => {
        if (!err.response.data.isSuccess) {
          if (err.response.data.status === 401) {
            toast.error(err.response.data.message)
            setIsLoading(false)
          } else {
            console.log(err.response.data, 'else')
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
      name: 'user',
      label: 'User',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, { rowIndex }) => {
          // Extract user details from the userid object
          console.log(datatableData[rowIndex].user_id, 'sdfsdf')
          const { name, email } = datatableData[rowIndex].user

          return (
            <div style={{ maxWidth: '20%' }}>
              <div>{name}</div>
              <div>{email}</div>
            </div>
          )
        },
      },
    },
    {
      name: 'question',
      label: 'Issue',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (_, { rowIndex }) => {
          const issueText = datatableData[rowIndex].question

          return <div>{issueText}</div>
        },
      },
    },

    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const { status, id } = datatableData[rowIndex]
          return (
            <Switch
              checked={status}
              onChange={() => {
                if (userRole == 1) {
                  const data = { id: id, status: !status }
                  updateCustomerIssueStatus(data, id)
                    .then(() => {
                      toast.success('status changed successfully!', {
                        key: data.id,
                      })
                      list()
                    })
                    .catch(() => {
                      toast.error('something went wrong!', {
                        key: data.id,
                      })
                    })
                } else {
                  toast.error(
                    'Sorry, you do not have permission to access this feature.Please contact your administrator for assistance.',
                  )
                }
              }}
            />
          )
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const { status } = datatableData[rowIndex]
          return (
            <div>
              {status ? (
                <p className="pending_app">
                  <b>Pending</b>
                </p>
              ) : (
                <p className="completed_app">
                  <b>Completed</b>
                </p>
              )}
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
              <CBreadcrumbItem active>Settings</CBreadcrumbItem>
              <CBreadcrumbItem active>Customer Queries</CBreadcrumbItem>
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
              }}
            />
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default CustomerQueries

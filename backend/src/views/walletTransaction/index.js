import { getAllTransactions } from '../../ApiServices'
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

const WalletTransaction = () => {
  const [datatableData, setdatatableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [baseurl, setbaseurl] = useState([])
  const { userRole } = useUserState()

  const list = async () => {
    setIsLoading(true)
    await getAllTransactions()
      .then((response) => {
        console.log(response)
        setIsLoading(false)
        setdatatableData(response.data.info.transactions)
        setbaseurl(response.data.info.baseUrl)
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
      name: 'transaction_id',
      label: 'Transaction ID',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (_, { rowIndex }) => {
          const { transaction_id } = datatableData[rowIndex]
          return <div>#{transaction_id}</div>
        },
      },
    },
    {
      name: 'doctor_name',
      label: 'Doctor',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'app_id',
      label: 'Appointment ID',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (_, { rowIndex }) => {
          const { app_id } = datatableData[rowIndex]
          return <div>#{app_id}</div>
        },
      },
    },
    {
      name: 'amount',
      label: 'Amount(Rs.)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'createdAt',
      label: 'Date',
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
              {status === 1 && (
                <p className="completed_app">
                  <b>Credited</b>
                </p>
              )}
              {status === 2 && (
                <p className="cancelled_app">
                  <b>Debited</b>
                </p>
              )}
            </div>
          )
        },
      },
    },
  ]

  const options = {
    selectableRows: false, // Disable checkbox selection
  }
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
              <CBreadcrumbItem active>Wallet Transactions</CBreadcrumbItem>
            </CBreadcrumb>
            <CButton
              className="theme-btn mt-minus-10"
              onClick={() => {
                if (userRole == 1) {
                  navigate('/specialist-category/manage')
                } else {
                  toast.error(
                    'Sorry, you do not have permission to access this feature.Please contact your administrator for assistance.',
                  )
                }
              }}
            >
              Withdraw
            </CButton>
          </CContainer>
          {isLoading ? (
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <CircularProgress size={26} fullWidth />
            </Grid>
          ) : (
            <MUIDataTable data={datatableData} columns={columns} options={options} />
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default WalletTransaction

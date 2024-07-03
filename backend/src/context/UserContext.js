import React from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { adminLogin, adminRegister, UpdateProfile, updateDoctor } from '../ApiServices'
var UserStateContext = React.createContext()
var UserDispatchContext = React.createContext()

function userReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log('first')
      return {
        ...state,
        isAuthenticated: true,
        userRole: action.payload.userRole,
        user: action.payload.user,
      }
    case 'SIGN_OUT_SUCCESS':
      return { ...state, isAuthenticated: false, userRole: null, user: null }
    case 'PROFILE_UPDATE_SUCCESS':
      console.log(action.payload)
      return {
        ...state,
        user: action.payload.user,
      }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
// eslint-disable-next-line react/prop-types
function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem('token'),
    userRole: localStorage.getItem('role') ? localStorage.getItem('role') : 1, // Set the default userRole here
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, // Set the default userRole here
  })

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

function useUserState() {
  var context = React.useContext(UserStateContext)

  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider')
  }
  return context
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext)

  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider')
  }
  return context
}

// Add propTypes validation
// UserProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut, registerUser, updateUser }

// ###########################################################

function loginUser(dispatch, data, navigate, setIsLoading, setError) {
  // setError(false)
  setIsLoading(true)
  adminLogin(data)
    .then((response) => {
      if (response.data.status === 401 || !response.data.isSuccess) {
        // setError(response.data.message)
        setIsLoading(false)
      } else {
        localStorage.setItem('token', response.data.info.token)
        localStorage.setItem('refreshToken', response.data.info.refresh_token)
        localStorage.setItem('role', response.data.info.admin.role)

        const userObject = {
          username: response.data.info.admin.name,
          useremail: response.data.info.admin.email,
          userimage: response.data.info.admin.image
            ? response.data.info.baseUrl + response.data.info.admin.image
            : null,
          userbank_name: response.data.info.admin.bank_name,
          useracc_holder_name: response.data.info.admin.acc_holder_name,
          useracc_number: response.data.info.admin.acc_number,
          userifsc_code: response.data.info.admin.ifsc_code,
          userwallet: response.data.info.admin.wallet_amount,
        }
        localStorage.setItem('user', JSON.stringify(userObject))

        setIsLoading(false)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { userRole: response.data.info.admin.role, user: userObject },
        })
        navigate('/dashboard')
      }
    })
    .catch((err) => {
      if (err.response.data.status === 401 || !err.response.data.isSuccess) {
        // setError(err.response.data.message)

        // Iterate through the error object to extract keys and values
        Object.keys(err.response.data.message).forEach((key) => {
          // Set the error message for each field
          setError(key, {
            type: 'manual',
            message: err.response.data.message[key],
          })
        })

        setIsLoading(false)
      } else {
        // setError('Something is wrong!')
        setIsLoading(false)
      }
    })
}

function registerUser(dispatch, data, navigate, setIsLoading, setError) {
  // setError(false)
  setIsLoading(true)
  adminRegister(data)
    .then((response) => {
      if (response.data.status === 401 || !response.data.isSuccess) {
        // setError(response.data.message)
        setIsLoading(false)
      } else {
        localStorage.setItem('token', response.data.info.token)
        localStorage.setItem('refreshToken', response.data.info.refresh_token)
        localStorage.setItem('role', response.data.info.admin.role)
        const userObject = {
          username: response.data.info.admin.name,
          useremail: response.data.info.admin.email,
          userimage: response.data.info.admin.image
            ? response.data.info.baseUrl + response.data.info.admin.image
            : null,
          userwallet: response.data.info.admin.wallet_amount,
        }

        localStorage.setItem('user', JSON.stringify(userObject))
        // setError('')
        setIsLoading(false)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { userRole: response.data.info.admin.role, user: userObject },
        })
        navigate('/dashboard')
      }
    })
    .catch((err) => {
      if (err.response.data.status === 401 || !err.response.data.isSuccess) {
        // setError(err.response.data.message)

        // Iterate through the error object to extract keys and values
        Object.keys(err.response.data.message).forEach((key) => {
          // Set the error message for each field
          setError(key, {
            type: 'manual',
            message: err.response.data.message[key],
          })
        })

        setIsLoading(false)
      } else {
        // setError('Something is wrong!')
        setIsLoading(false)
      }
    })
}

function signOut(dispatch, navigate) {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('redirectMessage')
  localStorage.removeItem('user')
  dispatch({ type: 'SIGN_OUT_SUCCESS' })
  navigate('/')
}

function updateUser(dispatch, data, setIsLoading, userRole, isupdate) {
  setIsLoading(true)
  let formData = new FormData() //formdata object
  Object.keys(data).forEach(function (key) {
    if (key === 'image') {
      formData.append(key, data[key])
    } else {
      formData.append(key, data[key])
    }
  })

  if (userRole == 1) {
    UpdateProfile(formData)
      .then((response) => {
        if (response.data.isSuccess && response.data.status === 200) {
          setIsLoading(false)
          toast.success('Updated successfully!')
          const userObject = {
            username: response.data.info.admin.name,
            useremail: response.data.info.admin.email,
            userimage: response.data.info.admin.image
              ? response.data.info.baseUrl + response.data.info.admin.image
              : null,
            userbank_name: response.data.info.admin.bank_name,
            useracc_holder_name: response.data.info.admin.acc_holder_name,
            useracc_number: response.data.info.admin.acc_number,
            userifsc_code: response.data.info.admin.ifsc_code,
          }
          dispatch({
            type: 'PROFILE_UPDATE_SUCCESS',
            payload: {
              user: userObject,
            },
          })

          localStorage.setItem('user', JSON.stringify(userObject))
        } else {
          if ((response.data.status === 202 || 400) && !response.data.isSuccess) {
            toast.error(response.data.message)
            setIsLoading(false)
          }
        }
      })
      .catch((err) => {
        toast.error(err.response.data)
        if (!err.response.data.isSuccess) {
          if (err.response.data.status === 400) {
            toast.error(err.response.data.message)
            setIsLoading(false)
          } else {
            toast.error('Something is wrong in an input.')
            setIsLoading(false)
          }
        } else {
          toast.error('Something Went Wrong! aaa')
          setIsLoading(false)
        }
      })
  } else {
    updateDoctor(formData, isupdate)
      .then((response) => {
        if (response.data.isSuccess && response.data.status === 200) {
          setIsLoading(false)
          const userObject = {
            username: response.data.info.doctors.name,
            useremail: response.data.info.doctors.email,
            userimage: response.data.info.doctors.image
              ? response.data.info.baseUrl + response.data.info.doctors.image
              : null,
          }
          dispatch({
            type: 'PROFILE_UPDATE_SUCCESS',
            payload: {
              user: userObject,
            },
          })

          localStorage.setItem('user', JSON.stringify(userObject))
          toast.success('Updated successfully!')
        } else {
          if ((response.data.status === 202 || 400) && !response.data.isSuccess) {
            toast.error(response.data.message)
            setIsLoading(false)
          }
        }
      })
      .catch((err) => {
        toast.error(err.response.data)
        if (!err.response.data.isSuccess) {
          if (err.response.data.status === 400) {
            toast.error(err.response.data.message)
            setIsLoading(false)
          } else {
            toast.error('Something is wrong in an input.')
            setIsLoading(false)
          }
        } else {
          toast.error('Something Went Wrong! aaa')
          setIsLoading(false)
        }
      })
  }
}

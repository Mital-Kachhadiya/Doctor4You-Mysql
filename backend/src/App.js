import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import { useUserState } from './context/UserContext'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const LoginLayout = React.lazy(() => import('./layout/LoginLayout'))

// Pages
const Login = React.lazy(() => import('./views/auth/Login'))
const Register = React.lazy(() => import('./views/auth/Register'))
const ForgotPassword = React.lazy(() => import('./views/auth/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./views/auth/ResetPassword'))

// const specCategory = React.lazy(() => import('./views/specialistCategory/specialistCategory.js'))

const App = () => {
  // global
  const { isAuthenticated } = useUserState()

  const PublicRoute = () => {
    return isAuthenticated || Boolean(localStorage.getItem('token')) ? (
      <Navigate to="/dashboard" />
    ) : (
      <LoginLayout />
    )
  }

  const PrivateRoute = () => {
    return isAuthenticated || Boolean(localStorage.getItem('token')) ? (
      <DefaultLayout />
    ) : (
      <Navigate to="/" />
    )
  }

  return (
    <BrowserRouter basename="/doctor4you/backend">
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route exact path="/" index element={<Login />} />
            <Route exact path="/register" name="Register" element={<Register />} />
            <Route
              exact
              path="/forgot-password"
              name="Forgot Password"
              element={<ForgotPassword />}
            />
            <Route
              path="/reset-password/:token/:userid"
              name="Reset Password"
              element={<ResetPassword />}
            />
          </Route>

          <Route path="/" element={<PrivateRoute />}>
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

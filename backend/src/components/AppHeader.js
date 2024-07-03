import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu, cilWallet } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
// import { logo } from 'src/assets/brand/logo'
import logo from 'src/assets/Frame.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUserState } from '../context/UserContext'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { user } = useUserState()
  const userRole = localStorage.getItem('role')
  return (
    <CHeader position="sticky" className="mb-4">
      <ToastContainer />
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none " to="/" style={{ display: 'flex' }}>
          <img src={logo} height={45} className="header-logo" />
          <div>
            <h4 className="pb-0 mb-0 mt-2">Doctor4You</h4>
            <p className="pb-0 mb-2 header-logo-subtitle">Doctor Appointment</p>
          </div>
        </CHeaderBrand>
        {userRole == 2 ? (
          <>
            <CHeaderNav className="d-none d-md-flex me-auto"></CHeaderNav>
            <CHeaderNav>
              <CNavItem>
                <Link to="/walletTransaction" className="wallet-div">
                  {/* <CNavLink href="" className="wallet-div"> */}
                  <CIcon icon={cilWallet} size="lg" /> &nbsp;₹&nbsp;
                  {user.userwallet ? user.userwallet : 0}
                  {/* </CNavLink> */}
                </Link>
              </CNavItem>
            </CHeaderNav>
          </>
        ) : (
          ''
        )}
        <CHeaderNav className="ms-3 name-header ">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/* <CHeaderDivider /> */}
      {/* <CContainer fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader

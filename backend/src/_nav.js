import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilBoltCircle,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUserPlus,
  cilUser,
  cilSettings,
  cilPlus,
  cilWallet,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const userRole = localStorage.getItem('role')

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  userRole === '1' && {
    component: CNavItem,
    name: 'Doctors',
    to: '/doctor',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Patients',
    to: '/patient',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Appointments',
  //   to: '/appointment',
  //   icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  // },
  {
    component: CNavGroup,
    name: 'Appointments',
    to: '/appointment',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Appointments',
        to: '/appointment',
      },
      {
        component: CNavItem,
        name: 'Pending Appointments',
        to: '/appointment/pending',
      },
      {
        component: CNavItem,
        name: 'Completed Appointments',
        to: '/appointment/completed',
      },
      {
        component: CNavItem,
        name: 'Cancelled Appointments',
        to: '/appointment/cancelled',
      },
    ],
  },
  userRole === '1' && {
    component: CNavItem,
    name: 'Specialist Category',
    to: '/specialist-category',
    icon: <CIcon icon={cilBoltCircle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Wallet Transactions',
    to: '/walletTransaction',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },
  userRole === '1' && {
    component: CNavGroup,
    name: 'Settings',
    to: '/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'FAQs',
        to: '/settings/faq',
      },
      {
        component: CNavItem,
        name: 'Customer Queries',
        to: '/settings/customerQueries',
      },
      {
        component: CNavItem,
        name: 'General Settings',
        to: '/settings/generalSettings',
      },
    ],
  },
].filter(Boolean)

export default _nav

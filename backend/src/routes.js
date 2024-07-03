import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Profile = React.lazy(() => import('./views/auth/Profile'))
const ChangePassword = React.lazy(() => import('./views/auth/ChangePassword'))
const SpecialistCategory = React.lazy(() => import('./views/specialistCategory'))
const SpecialistCategoryForm = React.lazy(() =>
  import('./views/specialistCategory/SpecialistCategoryForm'),
)
const Doctor = React.lazy(() => import('./views/doctor'))
const DoctorForm = React.lazy(() => import('./views/doctor/DoctorForm'))
const DoctorDetails = React.lazy(() => import('./views/doctor/DoctorDetails'))
const Patient = React.lazy(() => import('./views/patient'))
const PatientForm = React.lazy(() => import('./views/patient/PatientForm'))
const PatientDetails = React.lazy(() => import('./views/patient/PatientDetails'))

const Appointment = React.lazy(() => import('./views/appointments'))
const PendingAppointments = React.lazy(() => import('./views/appointments/PendingAppointments'))
const CompletedAppointments = React.lazy(() => import('./views/appointments/CompletedAppointments'))
const CancelledAppointments = React.lazy(() => import('./views/appointments/CancelledAppointments'))
const AppointmentDetails = React.lazy(() => import('./views/appointments/AppointmentDetails'))

const WalletTransaction = React.lazy(() => import('./views/walletTransaction'))

const Faq = React.lazy(() => import('./views/settings/Faq'))
const FaqForm = React.lazy(() => import('./views/settings/FaqForm'))
const GeneralSettingForm = React.lazy(() => import('./views/settings/GeneralSettingForm'))
const CustomerQueries = React.lazy(() => import('./views/settings/CustomerQueries'))
const routes = [
  { path: '/', exact: true, name: 'Home', access: 1 },
  { path: '/profile', name: 'Profile', element: Profile, access: 1 },
  { path: '/changePassword', name: 'Change Password', element: ChangePassword, access: 1 },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, access: 1 },
  {
    path: '/specialist-category',
    name: 'Specialist Category',
    element: SpecialistCategory,
    access: localStorage.getItem('role') === '1' ? 1 : 0,
  },
  {
    path: '/specialist-category/manage',
    name: 'Manage Specialist Category',
    element: SpecialistCategoryForm,
    access: localStorage.getItem('role') === '1' ? 1 : 0,
  },
  {
    path: '/doctor',
    name: 'Doctors',
    element: Doctor,
    access: localStorage.getItem('role') === '1' ? 1 : 0,
  },
  {
    path: '/doctor/manage',
    name: 'Doctors',
    element: DoctorForm,
    access: localStorage.getItem('role') === '1' ? 1 : 0,
  },
  {
    path: '/patient',
    name: 'Patients',
    element: Patient,
    access: 1,
  },
  {
    path: '/patient/manage',
    name: 'Patients',
    element: PatientForm,
    access: 1,
  },
  {
    path: '/walletTransaction',
    name: 'Wallet Transactions',
    element: WalletTransaction,
    access: 1,
  },
  {
    path: '/settings/faq',
    name: 'Faq',
    element: Faq,
    access: localStorage.getItem('role') === '1' ? 1 : 0,
  },
  {
    path: '/settings/faq/manage',
    name: 'Faq',
    element: FaqForm,
    access: localStorage.getItem('role') === '1' ? 1 : 0,
  },
  {
    path: '/settings/customerQueries',
    name: 'Customer Queries',
    element: CustomerQueries,
    access: localStorage.getItem('role') === '1' ? 1 : 0,
  },
  {
    path: '/settings/generalSettings',
    name: 'General Settings',
    element: GeneralSettingForm,
    access: localStorage.getItem('role') === '1' ? 1 : 0,
  },
  {
    path: '/appointment',
    name: 'Appointments',
    element: Appointment,
    access: 1,
  },
  {
    path: '/appointment/pending',
    name: 'Pending Appointments',
    element: PendingAppointments,
    access: 1,
  },
  {
    path: '/appointment/completed',
    name: 'Completed Appointments',
    element: CompletedAppointments,
    access: 1,
  },
  {
    path: '/appointment/cancelled',
    name: 'Cancelled Appointments',
    element: CancelledAppointments,
    access: 1,
  },
  {
    path: '/appointment/view',
    name: 'Appointment Details',
    element: AppointmentDetails,
    access: 1,
  },
  {
    path: '/patient/view',
    name: 'Patient Details',
    element: PatientDetails,
    access: 1,
  },
  {
    path: '/doctor/view',
    name: 'Doctor Details',
    element: DoctorDetails,
    access: 1,
  },
]

export default routes

import axios from 'axios'

const mainUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5056'
    : 'https://idea2codeinfotech.com/doctor4you/apis'

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 402 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${mainUrl}/admin/refreshToken`, { refreshToken })
        const token = response.data.info
        // console.log(response.data.info);
        localStorage.setItem('token', token)
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`
        // console.log(originalRequest);
        return axios(originalRequest)
      } catch (error) {
        // Handle refresh token error or redirect to login
        localStorage.removeItem('token')
        window.location.reload()
      }
    }

    if (error.response.status === 405) {
      localStorage.removeItem('token')
      window.location.reload()
    }

    return Promise.reject(error)
  },
)
//Admin Login
export const adminLogin = (data) => axios.post(`${mainUrl}/admin/login`, data)

//Admin Register
export const adminRegister = (data) => axios.post(`${mainUrl}/admin/register`, data)

//Forgot Password - Check Email Id
export const checkmailid = (data) => axios.post(`${mainUrl}/admin/checkmailid`, data)

//Forgot Password - Reset Password
export const resetPassword = (data) => axios.post(`${mainUrl}/admin/resetPassword`, data)

//Update Admin Profile
export const UpdateProfile = (data) =>
  axios.post(`${mainUrl}/admin/UpdateProfile`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Change Password
export const changePassword = (data) =>
  axios.post(`${mainUrl}/admin/changePassword`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get All Specialist Category
export const getAllSpecialistCategory = () =>
  axios.get(`${mainUrl}/admin/specialistCategory/getAllSpecialistCategory`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Add Specialist Category
export const addSpecialistCategory = (data) =>
  axios.post(`${mainUrl}/admin/specialistCategory/addSpecialistCategory`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Specialist Category
export const updateSpecialistCategory = (data, id) =>
  axios.put(`${mainUrl}/admin/specialistCategory/updateSpecialistCategory/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Specialist Category Status
export const updateSpeCatStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/specialistCategory/updateSpeCatStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Specialist Category
export const deleteSpecialistCategory = (id) =>
  axios.delete(`${mainUrl}/admin/specialistCategory/deleteSpecialistCategory/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Multiple Specialist Category
export const deleteMultSpecialistCategory = (data) => {
  return axios.delete(`${mainUrl}/admin/specialistCategory/deleteMultSpecialistCategory`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    data: { Ids: data },
  })
}

//Get All Doctor
export const getAllDoctors = () =>
  axios.get(`${mainUrl}/admin/doctor/getAllDoctors`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Single Doctor
export const getSingleDoctor = () =>
  axios.get(`${mainUrl}/admin/doctor/getSingleDoctor`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Single Doctor
export const getDoctorByid = (id) =>
  axios.get(`${mainUrl}/admin/doctor/getDoctorByid/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Add Doctor
export const addDoctor = (data) =>
  axios.post(`${mainUrl}/admin/doctor/addDoctor`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Doctor
export const updateDoctor = (data, id) =>
  axios.put(`${mainUrl}/admin/doctor/updateDoctor/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Doctor Status
export const updateDoctorStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/doctor/updateDoctorStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Doctor Top Status
export const updateTopDoctorStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/doctor/updateTopDoctorStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Doctor
export const deleteDoctor = (id) =>
  axios.delete(`${mainUrl}/admin/doctor/deleteDoctor/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Multiple Doctor
export const deleteMultDoctor = (data) => {
  return axios.delete(`${mainUrl}/admin/doctor/deleteMultDoctor`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    data: { Ids: data },
  })
}

//Add Faq
export const addfaqs = (data) =>
  axios.post(`${mainUrl}/admin/settings/addfaqs`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Faq
export const getAllFaqs = () =>
  axios.get(`${mainUrl}/admin/settings/getAllFaqs`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Faq
export const updateFaq = (data, id) =>
  axios.put(`${mainUrl}/admin/settings/updateFaq/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Faq Status
export const updateFaqStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/settings/updateFaqStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Faq
export const deletefaq = (id) =>
  axios.delete(`${mainUrl}/admin/settings/deletefaq/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Multiple Faq
export const deleteMultFaq = (data) => {
  return axios.delete(`${mainUrl}/admin/settings/deleteMultFaq`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    data: { Ids: data },
  })
}

//Get General Settings
export const getGeneralSettings = () =>
  axios.get(`${mainUrl}/admin/settings/getGeneralSettings`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update General Settings
export const updateGeneralSetting = (data, id) =>
  axios.put(`${mainUrl}/admin/settings/updateGeneralSetting/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get All Patient
export const getAllPatient = () =>
  axios.get(`${mainUrl}/admin/patient/getAllPatient`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Patient BY id
export const getPatientByid = (id) =>
  axios.get(`${mainUrl}/admin/patient/getPatientByid/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Add Patient
export const addPatient = (data) =>
  axios.post(`${mainUrl}/admin/patient/addPatient`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Patient
export const updatePatient = (data, id) =>
  axios.put(`${mainUrl}/admin/patient/updatePatient/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Patient Status
export const updatePatientStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/patient/updatePatientStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Patient
export const deletePatient = (id) =>
  axios.delete(`${mainUrl}/admin/patient/deletePatient/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Multiple Patient
export const deleteMultPatient = (data) => {
  return axios.delete(`${mainUrl}/admin/patient/deleteMultPatient`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    data: { Ids: data },
  })
}

//Get All Appointment
export const getAllAppointment = () =>
  axios.get(`${mainUrl}/admin/appointment/getAllAppointment`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get All Pending Appointment
export const getPendingAppointment = () =>
  axios.get(`${mainUrl}/admin/appointment/getPendingAppointment`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get All Completed Appointment
export const getCompletedAppointment = () =>
  axios.get(`${mainUrl}/admin/appointment/getCompletedAppointment`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get All Cancelled Appointment
export const getCancelledAppointment = () =>
  axios.get(`${mainUrl}/admin/appointment/getCancelledAppointment`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Appointment Status
export const updateAppointmentStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/appointment/updateAppointmentStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Delete Appointment
export const deleteAppointment = (id) =>
  axios.delete(`${mainUrl}/admin/appointment/deleteAppointment/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Update Customer Issue Status
export const updateCustomerIssueStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/settings/updateCustomerIssueStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get All Customer Issues
export const customerIssue = () =>
  axios.get(`${mainUrl}/admin/settings/customerIssue`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Dashboard Count
export const dashboardCountData = () =>
  axios.get(`${mainUrl}/admin/dashboard/dashboardCountData`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Today Appointment
export const getTodayAppointment = () =>
  axios.get(`${mainUrl}/admin/dashboard/getTodayAppointment`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Upcoming Appointment
export const getUpcomingAppointment = () =>
  axios.get(`${mainUrl}/admin/dashboard/getUpcomingAppointment`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Past Appointment
export const getPastAppointment = () =>
  axios.get(`${mainUrl}/admin/dashboard/getPastAppointment`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

//Get Datewise Appointment
export const getDatewiseAppointments = (start, end) =>
  axios.get(`${mainUrl}/admin/dashboard/getDatewiseAppointments`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    params: { start, end },
  })

//Get Wallet Transactions
export const getAllTransactions = (start, end) =>
  axios.get(`${mainUrl}/admin/walletTransaction/getAllTransactions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    params: { start, end },
  })

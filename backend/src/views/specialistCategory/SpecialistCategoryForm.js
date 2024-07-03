import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CFormLabel,
  CSpinner,
  CBreadcrumb,
  CBreadcrumbItem,
  CContainer,
  CFormInput,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import CustomInput from '../../components/CustomInput'
import { handleInputChange, handleFileInputChange } from '../../components/formUtils'
import { addSpecialistCategory, updateSpecialistCategory } from '../../ApiServices'
import { toast } from 'react-toastify'
import noImg from '../../assets/images/no_img.png'
import setValueFormHelper from '../../components/setValueFormHelper'

const SpecialistCategoryForm = () => {
  const { state } = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    setError,
    reset,
  } = useForm()
  const navigate = useNavigate()
  var [isLoading, setIsLoading] = useState(false)
  const [isupdate, setisupdate] = useState('')
  const [previewImage, setPreviewImage] = useState(noImg)
  var [defaultLoading, setdefaultLoading] = useState(true)

  useEffect(() => {
    if (state) {
      const { editdata, baseurl } = state
      setisupdate(editdata.id)
      const fieldNames = ['title']
      const imageField = 'icon'
      setValueFormHelper({ setValue, setPreviewImage, state, fieldNames, imageField })
    }
    setdefaultLoading(false)
  }, [])

  const onSubmit = (data) => {
    setIsLoading(false)
    let formData = new FormData() //formdata object
    Object.keys(data).forEach(function (key) {
      if (key === 'icon') {
        formData.append(key, data[key])
      } else {
        formData.append(key, data[key])
      }
    })

    isupdate === ''
      ? addSpecialistCategory(formData)
          .then(() => {
            localStorage.setItem('redirectSuccess', 'true')
            localStorage.setItem('redirectMessage', 'Added successfully!')
            navigate('/specialist-category')
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              toast.error(err.response.data.message)
            } else {
              toast.error('Something Went Wrong!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }
            setIsLoading(false)
          })
      : updateSpecialistCategory(formData, isupdate)
          .then(() => {
            localStorage.setItem('redirectSuccess', 'true')
            localStorage.setItem('redirectMessage', 'Updated successfully!')
            navigate('/specialist-category')
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              toast.error(err.response.data.message)
            } else {
              toast.error('Something Went Wrong!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }
            setIsLoading(false)
          })
  }

  return (
    <CRow>
      <CContainer fluid className="custom-header">
        <CBreadcrumb>
          <CBreadcrumbItem>
            <Link to="/dashboard">Home</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem>
            <Link to="/specialist-category">Specialist Category</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>
            {isupdate === '' ? 'Add' : 'Update'} Specialist Category
          </CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <CCol md={12}>
                <CustomInput
                  name="title"
                  type="text"
                  label="Title"
                  {...register('title', { required: 'Title is required' })}
                  error={!!errors.title}
                  helperText={errors.title && errors.title.message}
                  defaultValue={getValues('title')}
                  onChange={(e) =>
                    handleInputChange('title', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={12} className="d-fex">
                <CustomInput
                  name="icon"
                  type="file"
                  label="Icon"
                  style={{ width: '100%' }}
                  {...register('icon', { required: isupdate ? false : 'Icon is required' })}
                  error={!!errors.icon}
                  helperText={errors.icon && errors.icon.message}
                  defaultValue={getValues('icon')}
                  onChange={(e) =>
                    handleFileInputChange(e, 'icon', { clearErrors, setValue, setPreviewImage })
                  }
                />
                {previewImage ? <img src={previewImage} className="img-preview" /> : ''}
              </CCol>

              <CCol xs={12}>
                {isLoading ? (
                  <CSpinner className="theme-spinner-color" />
                ) : (
                  <CButton color="primary" type="submit" className="theme-btn-background">
                    Submit
                  </CButton>
                )}
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SpecialistCategoryForm

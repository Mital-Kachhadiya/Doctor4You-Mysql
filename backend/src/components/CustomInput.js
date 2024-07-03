// CustomInput.js
import React from 'react'
import PropTypes from 'prop-types'
import { CInputGroup, CFormLabel, CFormInput, CFormFeedback } from '@coreui/react'

const CustomInput = ({
  name,
  id,
  type,
  label,
  error,
  helperText,
  defaultValue,
  onChange,
  ...rest
}) => {
  return (
    <div>
      <CFormLabel htmlFor={id}>{label}</CFormLabel>
      <CInputGroup>
        <CFormInput
          type={type}
          id={id}
          name={name}
          // placeholder={label}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          defaultValue={defaultValue}
          onChange={onChange} // Pass the onChange prop
          {...rest}
        />
        {error && <CFormFeedback invalid>{helperText}</CFormFeedback>}
      </CInputGroup>
    </div>
  )
}

CustomInput.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func, // Add the onChange prop
  // Add any other props you expect to receive
}

export default CustomInput

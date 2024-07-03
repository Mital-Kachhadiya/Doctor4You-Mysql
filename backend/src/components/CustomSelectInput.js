import React from 'react'
import { CFormLabel, CFormSelect, CFormFeedback } from '@coreui/react'
import PropTypes from 'prop-types'
const CustomSelectInput = ({ label, options, onChange, value, error, helperText, ...rest }) => {
  return (
    <>
      <CFormLabel>{label}</CFormLabel>
      <CFormSelect
        className={`form-control ${error ? 'is-invalid' : ''}`}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        {...rest}
      >
        <option value="">Choose Option....</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </CFormSelect>
      {error && <CFormFeedback invalid>{helperText}</CFormFeedback>}
    </>
  )
}

CustomSelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
}

export default CustomSelectInput

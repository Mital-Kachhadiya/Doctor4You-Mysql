import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { CInputGroup, CFormLabel, CFormInput, CFormFeedback } from '@coreui/react'

const CustomInput2 = forwardRef(
  ({ name, id, type, label, error, helperText, defaultValue, onChange, ...rest }, ref) => {
    return (
      <div>
        <CFormLabel htmlFor={id}>{label}</CFormLabel>
        <CInputGroup>
          <CFormInput
            type={type}
            id={id}
            name={name}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            defaultValue={defaultValue}
            onChange={onChange}
            ref={ref} // Pass the ref here
            {...rest}
          />
          {error && <CFormFeedback invalid>{helperText}</CFormFeedback>}
        </CInputGroup>
      </div>
    )
  },
)

CustomInput2.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  // Add any other props you expect to receive
}

// Set display name
CustomInput2.displayName = 'CustomInput2'

export default CustomInput2

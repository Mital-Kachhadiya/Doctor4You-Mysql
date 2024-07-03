import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { CFormFeedback } from '@coreui/react'
const TimePickerWithRef = forwardRef(function TimePickerWithRef(
  { value, onChange, error, helperText },
  ref,
) {
  return (
    <>
      <TimePicker
        className="is-invalid"
        value={value}
        onChange={(newValue) => onChange(newValue)}
        ref={ref}
      />
      {/* {error && <span style={{ color: 'red' }}>{helperText}</span>} */}
      {error && <CFormFeedback invalid>{helperText}</CFormFeedback>}
    </>
  )
})

TimePickerWithRef.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
}

export default TimePickerWithRef

import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate, Link } from 'react-router-dom'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { useUserDispatch, signOut, useUserState } from '../../context/UserContext'

const AppHeaderDropdown = () => {
  var userDispatch = useUserDispatch()
  let navigate = useNavigate()
  const { user } = useUserState()

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={user.userimage} size="md" />
        &nbsp; {user.username}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Manage Account</CDropdownHeader>
        <CDropdownItem>
          <Link to="/profile">
            <CIcon icon={cilUser} className="me-2" />
            Update Profile
          </Link>
        </CDropdownItem>
        <CDropdownItem>
          <Link to="/changePassword">
            <CIcon icon={cilSettings} className="me-2" />
            Change Password
          </Link>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={() => signOut(userDispatch, navigate)} className="cursor-pointer">
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

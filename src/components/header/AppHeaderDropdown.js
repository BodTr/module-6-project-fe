import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AppHeaderDropdown = () => {
  const [avatar, setAvatar] = useState('/default-avatar.png') // Đặt ảnh mặc định ban đầu
  const navigate = useNavigate()

  // Lấy avatar từ API khi ứng dụng tải
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (response.data.avatarPath) {
          setAvatar(`http://localhost:8080${response.data.avatarPath}`) // Gán đường dẫn đầy đủ của avatar
        } else {
          setAvatar('/default-avatar.png') // Nếu không có avatarPath, dùng ảnh mặc định
        }
      })
      .catch((error) => {
        console.error('Lỗi khi tải avatar:', error)
        setAvatar('/default-avatar.png') // Nếu lỗi, dùng ảnh mặc định
      })
  }, [])

  const handleProfileClick = () => {
    navigate('/update-profile') // Điều hướng đến trang Update Profile
  }

  const handleLogout = () => {
    localStorage.removeItem('token') // Xóa token
    localStorage.removeItem('user') // Xóa thông tin người dùng
    navigate('/login') // Điều hướng đến trang Login
  }

  const handleChangePasswordClick = () => {
    navigate('/change-password') // Điều hướng đến trang Đổi mật khẩu
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={handleProfileClick}>
          <CIcon icon={cilUser} className="me-2" />
          Hồ Sơ
        </CDropdownItem>
        <CDropdownItem onClick={handleChangePasswordClick}>
          <CIcon  className="me-2" />
          Đổi Mật Khẩu
        </CDropdownItem>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../../components'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'
import axios from 'axios'
import { toast } from 'react-toastify'

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    avatar: null,
    username: '',
    displayName: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: '',
    avatarPath: '/default-avatar.png',
  })

  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  if (!token) {
    console.error('Token không tồn tại!')
  }
  // Để hiển thị trạng thái tải dữ liệu

  // Fetch current user data when component loads
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('Token không tồn tại. Người dùng chưa đăng nhập.')
      toast.error('Bạn cần đăng nhập để thực hiện thao tác này.')
      window.location.href = '/login' // Điều hướng về trang login nếu token không tồn tại
      return
    }
    axios
      .get('http://localhost:8080/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,

          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data

        // Định dạng ngày sinh (nếu có)
        const formattedBirthDate = data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split('T')[0]
          : '' ;// Định dạng thành YYYY-MM-DD hoặc để trống nếu null
        setFormData({
          ...data,
          birthDate: formattedBirthDate,
          avatarPath: data.avatarPath
            ? `http://localhost:8080${response.data.avatarPath}`
            : '/default-avatar.png', // Thêm đường dẫn đầy đủ cho ảnh đại diện
        })
        setIsLoading(false) // Đặt trạng thái tải dữ liệu hoàn tất
      })
      .catch((error) => {
        toast.error('Lỗi khi tải thông tin người dùng!')
        setIsLoading(false)
      })
  }, [])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle file upload (Avatar)
  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const updateData = new FormData()

    // Kiểm tra nếu thiếu dữ liệu quan trọng
    if (!formData.birthDate || !formData.gender) {
      toast.error('Vui lòng điền đầy đủ thông tin ngày sinh và giới tính!')
      return
    }
    if (formData.avatar) {
      updateData.append('avatar', formData.avatar)
    }

    updateData.append('displayName', formData.displayName)
    updateData.append('dateOfBirth', formData.birthDate) // Đảm bảo đúng trường 'dateOfBirth'
    updateData.append('gender', formData.gender) // Đảm bảo đúng trường 'gender'
    updateData.append('phone', formData.phone)
    updateData.append('email', formData.email)
    console.log('Dữ liệu gửi đi:', {
      avatar: formData.avatar ? formData.avatar.name : null,
      displayName: formData.displayName,
      dateOfBirth: formData.birthDate,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
    })
    
      
    for (let [key, value] of updateData.entries()) {
      console.log(`${key}: ${value}`)
    }

    axios
      .put('http://localhost:8080/api/user/update-profile', updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        toast.success('Cập nhật thành công!')

        // Lưu avatarPath mới vào localStorage
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user')),
          avatarPath: `http://localhost:8080${response.data.avatarPath}`, // Đường dẫn avatar mới
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))

        navigate('/users/dashboard#/users')
      })
      .catch(() => {
        toast.error('Cập nhật thất bại!')
      })
  }

  return (
    <>
    <AppHeader/>
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardBody>
              <h3>Cập nhật thông tin cá nhân</h3>
              {isLoading ? ( // Hiển thị thông báo khi đang tải dữ liệu
                <p>Đang tải dữ liệu...</p>
              ) : (
                <CForm onSubmit={handleSubmit}>
                  {formData.avatarPath && (
                    <div className="mb-3">
                      <CFormLabel>Ảnh đại diện hiện tại</CFormLabel>
                      <img
                        src={formData.avatarPath}
                        alt="Avatar hiện tại"
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                      />
                    </div>
                  )}
                  {/* Avatar */}
                  <CFormLabel>Ảnh đại diện</CFormLabel>
                  <CFormInput
                    type="file"
                    name="avatar"
                    onChange={handleFileChange}
                    accept="image/*"
                  />

                  {/* Username (Read-only) */}
                  <CFormLabel>Username</CFormLabel>
                  <CFormInput
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled
                    readOnly
                  />

                  {/* Display Name */}
                  <CFormLabel>Tên hiển thị</CFormLabel>
                  <CFormInput
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                  />

                  {/* Birth Date */}
                  <CFormLabel>Ngày sinh</CFormLabel>
                  <CFormInput
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />

                  {/* Gender */}
                  <CFormLabel>Giới tính</CFormLabel>
                  <CFormSelect name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </CFormSelect>

                  {/* Email (Read-only) */}
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput type="email" name="email" value={formData.email} disabled readOnly />

                  {/* Phone */}
                  <CFormLabel>Số điện thoại</CFormLabel>
                  <CFormInput
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  {/* Submit Button */}
                  <CButton type="submit" color="primary" className="mt-3" onClick={handleSubmit}>
                    Lưu
                  </CButton>
                </CForm>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
    </>
  )
}

export default UpdateProfile

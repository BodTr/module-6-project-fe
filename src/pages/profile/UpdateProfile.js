import React, { useEffect, useState } from 'react'
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
  })

  // Fetch current user data when component loads
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      .then((response) => {
        setFormData(response.data)
      })
      .catch((error) => {
        toast.error('Lỗi khi tải thông tin người dùng!')
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

    updateData.append('avatar', formData.avatar)
    updateData.append('displayName', formData.displayName)
    updateData.append('birthDate', formData.birthDate)
    updateData.append('gender', formData.gender)
    updateData.append('phone', formData.phone)

    axios
      .put('http://localhost:8080/api/user/profile', updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        toast.success('Cập nhật thông tin thành công!')
      })
      .catch(() => {
        toast.error('Cập nhật thông tin thất bại!')
      })
  }

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardBody>
              <h3>Cập nhật thông tin cá nhân</h3>
              <CForm onSubmit={handleSubmit}>
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
                <CFormSelect
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
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
                <CButton type="submit" color="primary" className="mt-3">
                  Lưu
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default UpdateProfile

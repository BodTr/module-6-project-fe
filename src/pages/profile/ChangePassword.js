import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CForm, CFormInput, CFormLabel, CContainer, CRow, CCol } from '@coreui/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../../components'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Xử lý thay đổi giá trị của các trường input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Xử lý khi bấm nút Lưu
  const handleSubmit = (e) => {
    e.preventDefault()
    const { currentPassword, newPassword, confirmPassword } = formData

    if (newPassword.length < 6 || newPassword.length > 32) {
      toast.error('Mật khẩu mới phải có độ dài từ 6-32 ký tự.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và nhập lại mật khẩu không khớp.')
      return
    }

    axios
      .put('http://localhost:8080/api/user/change-password', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
        localStorage.removeItem('token')
        navigate('/login')
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(error.response.data)
        } else {
          toast.error('Có lỗi xảy ra, vui lòng thử lại.')
        }
      })
  }

  return (
    <>
    <AppHeader/>
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <h3>Đổi Mật Khẩu</h3>
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel htmlFor="currentPassword">Mật khẩu hiện tại</CFormLabel>
                  <CFormInput
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="newPassword">Mật khẩu mới</CFormLabel>
                  <CFormInput
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="confirmPassword">Nhập lại mật khẩu</CFormLabel>
                  <CFormInput
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <CButton type="submit" color="primary">
                  Đổi mật khẩu
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
    </>
  )
}

export default ChangePassword

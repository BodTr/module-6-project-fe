import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      const token = response.data.token // Lấy token từ phản hồi của backend
      if (!token) {
        throw new Error('Token k tồn tại.')
      }
      const decoded = jwtDecode(token)
      const role = decoded.roles[0]
      console.log("decoded token role: ", role)
      localStorage.setItem('token', token) // Lưu token vào localStorage
      localStorage.setItem('role', role)
      localStorage.setItem('username', response.data.displayName) // Lưu token vào localStorage
      toast.success('Đăng nhập thành công!')
      setTimeout(() => {
        if (role === 'ADMIN') {
          navigate('/users') // Điều hướng về trang chủ
        } else {
          navigate('/client')
        }
        
      }, 2000)
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data) // Hiển thị thông báo lỗi từ backend
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại.')
      }
    }
  }

  return (
    <div className=" bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 bg-custom">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Đăng Nhập</h1>
                    <p className=" text-white">Đăng nhập vào tài khoản của bạn</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="secondary" className="px-4">
                          Đăng Nhập
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0 text-warning">
                          Quên mật khẩu
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-dark py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Đăng ký</h2>
                    <p>
                      Hãy đăng ký là thành viên của Bích Bồ Bôn Music để lắng nghe những ca khúc hot
                      hit nhé!!
                    </p>
                    <Link to="/register">
                      <CButton color="success" className="mt-3" active tabIndex={-1}>
                        Đăng ký ngay!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

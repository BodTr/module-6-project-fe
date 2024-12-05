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

  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('token')
  if (!token) {
    console.error('Token không tồn tại!')
  }
  // Để hiển thị trạng thái tải dữ liệu

  // Fetch current user data when component loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token không tồn tại. Người dùng chưa đăng nhập.');
      toast.error('Bạn cần đăng nhập để thực hiện thao tác này.');
      window.location.href = '/login'; // Điều hướng về trang login nếu token không tồn tại
      return;
    }
    axios
      .get('http://localhost:8080/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,

          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setFormData(response.data) // Gán dữ liệu người dùng vào form
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
    e.preventDefault();
    const updateData = new FormData();
  
    // Kiểm tra nếu thiếu dữ liệu quan trọng
    if (!formData.birthDate || !formData.gender) {
      toast.error('Vui lòng điền đầy đủ thông tin ngày sinh và giới tính!');
      return;
    }
    if (formData.avatar) {
        updateData.append('avatar', formData.avatar);
      }
  
    
    
    updateData.append('displayName', formData.displayName);
    updateData.append('dateOfBirth', formData.birthDate); // Đảm bảo đúng trường 'dateOfBirth'
    updateData.append('gender', formData.gender); // Đảm bảo đúng trường 'gender'
    updateData.append('phone', formData.phone);
    updateData.append('email', formData.email);
    console.log('Dữ liệu gửi đi:', {
        avatar: formData.avatar ? formData.avatar.name : null,
        displayName: formData.displayName,
        dateOfBirth: formData.birthDate,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
      });
      for (let [key, value] of updateData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
    axios
      .put('http://localhost:8080/api/user/update-profile', updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        toast.success('Cập nhật thông tin thành công!');
        window.location.href = '/users/dashboard#/users'; // Điều hướng sau khi thành công
      })
      .catch((error) => {
        console.error('Lỗi khi gửi dữ liệu:', error.response?.data || error.message);
        toast.error('Cập nhật thông tin thất bại!');
      });
  };
  

  return (
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
  )
}

export default UpdateProfile

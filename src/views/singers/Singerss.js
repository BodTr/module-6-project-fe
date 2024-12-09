import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormInput,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Singers = () => {
  const [jwtToken, setJwtToken] = useState('')
  const [singersList, setSingersList] = useState([])
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({
    avatar: null,
    name: '',
  })

  const initSingerList = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/singer', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      console.log(res.data, 'res get singer api data')
      const data = res.data
      const updatedData = data.map((item) => ({
        ...item,
        avatarLinkString: `http://localhost:8080${item.avatarLinkString}`,
      }))
      setSingersList(updatedData)
    } catch (error) {
      console.log(error, 'get singer api error')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setJwtToken(token)
    if (!token) {
      console.error('Token không tồn tại. Người dùng chưa đăng nhập.')
      toast.error('Bạn cần đăng nhập để thực hiện thao tác này.')
      window.location.href = '/login'
    } else {
      initSingerList()
    }
  }, [])

  const handleChange = (e) => {
    // console.log(e.target)
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'avatar' ? e.target.files[0] : value,
    })
  }
  const onSubmit = async () => {
    try {
      let singerInfor = new FormData()
      singerInfor.append('name', formData.name)
      singerInfor.append('singerAvatar', formData.avatar)
      console.log("singer's name: " + formData.name)
      console.log("singer's avatar: " + formData.avatar)
      const res = await axios.post('http://localhost:8080/api/singer', singerInfor, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('create singer api result', res)
      if (res.status === 201) {
        toast.success('Tạo ca sĩ thành công')
        setVisible(false)
        initSingerList()
      }
    } catch (error) {
      console.log(error, 'create singer api error')
    }
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="page-header ">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Singer Page</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <CButton color="primary" onClick={() => setVisible(!visible)}>
                  Create new singer
                </CButton>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="row row-cards">
              <div className="col-12">
                <div className="card">
                  <CTable className="table-responsive">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Avatar</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {singersList.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan={4} className="text-center">
                            Chưa có data
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        singersList.map((singer, index) => (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">{singer.id}</CTableHeaderCell>
                            <CTableDataCell>{singer.name}</CTableDataCell>
                            <CTableDataCell>
                              <img
                                src={singer.avatarLinkString}
                                alt={singer.name}
                                style={{ width: '50px', height: '50px' }}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton color="success" variant="outline">
                                Success
                              </CButton>
                              <CButton color="danger" variant="outline">
                                Danger
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      )}
                    </CTableBody>
                  </CTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Create Singer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormInput
                type="text"
                name="name"
                id="exampleFormControlInput1"
                label="Name"
                placeholder="Enter singer's name"
                aria-describedby="exampleFormControlInputHelpInline"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <CFormInput
                name="avatar"
                onChange={handleChange}
                type="file"
                id="formFile"
                label="Avatar"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={onSubmit}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Singers

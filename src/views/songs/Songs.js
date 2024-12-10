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
  CFormLabel,
  CFormTextarea,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Songs = () => {
  const [jwtToken, setJwtToken] = useState('')
  const [songsList, setSongsList] = useState([])
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({
    song: null,
    title: '',
    description: '',
    singerIds: [1, 2, 3, 4],
  })

  const initSongList = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/song', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      console.log(res.data, 'res get song api data')
      const data = res.data
      const updatedData = data.map((item) => ({
        ...item,
        songStringLink: `http://localhost:8080${item.songStringLink}`,
      }))
      setSongsList(updatedData)
    } catch (error) {
      console.log(error, 'get song api error')
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
      initSongList()
    }
  }, [])

  const handleChange = (e) => {
    // console.log(e.target)
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'song' ? e.target.files[0] : value,
    })
  }
  const onSubmit = async () => {
    try {
      let songInfor = new FormData()
      songInfor.append('title', formData.title)
      songInfor.append('songFile', formData.song)
      songInfor.append('description', formData.description)
      songInfor.append('singerIds', formData.singerIds)
      console.log("song's title: " + formData.title)
      console.log("song's singers: " + formData.singerIds)
      console.log("song's description: " + formData.description)
      console.log("song's description: " + formData.song.name)
      const res = await axios.post('http://localhost:8080/api/song', songInfor, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('create song api result', res)
      if (res.status === 201) {
        toast.success('Tạo ca sĩ thành công')
        setVisible(false)
        initSongList()
      }
    } catch (error) {
      console.log(error, 'create song api error')
    }
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="page-header ">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Song Page</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <CButton color="primary" onClick={() => setVisible(!visible)}>
                  Create new song
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
                      {songsList.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan={4} className="text-center">
                            Chưa có data
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        songsList.map((song, index) => (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">{song.id}</CTableHeaderCell>
                            <CTableDataCell>{song.title}</CTableDataCell>
                            <CTableDataCell>{song.description}</CTableDataCell>
                            <CTableDataCell>Song singers</CTableDataCell>
                            <CTableDataCell>{song.songStringLink}</CTableDataCell>
                            <CTableDataCell>
                              <CButton color="success" variant="outline">
                                Edit
                              </CButton>
                              <CButton color="danger" variant="outline">
                                Delete
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
          <CModalTitle id="LiveDemoExampleLabel">Create Song</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormInput
                type="text"
                name="title"
                id="exampleFormControlInput1"
                label="title"
                placeholder="Enter song's title"
                aria-describedby="exampleFormControlInputHelpInline"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlTextarea1">Description</CFormLabel>
                  <CFormTextarea name="description" onChange={handleChange} id="exampleFormControlTextarea1" rows={3}></CFormTextarea>
                </div>
            <div className="mb-3">
              <CFormInput
                name="song"
                onChange={handleChange}
                type="file"
                id="formFile"
                label="Song File"
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

export default Songs

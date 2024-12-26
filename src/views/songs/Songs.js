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
import Select from 'react-select'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

const Songs = () => {
  const [jwtToken, setJwtToken] = useState('')
  const [songsList, setSongsList] = useState([])
  const [visible, setVisible] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    song: null,
    title: '',
    description: '',
    singers: [],
  })
  const [selectedSingers, setSelectedSingers] =useState([])
  const [singersList, setSingersList] = useState([])
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [deleteId, setDeleteId] = useState('')

  const handleClose = () => setVisible(false)
  const handleShow = () => setVisible(true)
  const handleClose1 = () => {
    setShowDeleteModal(false)
    setDeleteId("")
  }
  const handleShow1 = () => setShowDeleteModal(true)

  const initSongList = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/song', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      console.log(res.data, 'res get song api data')
      const data = res.data
      data.forEach((item) => {
        // Cập nhật songStringLink
        if (item.songStringLink) {
          item.songStringLink = `http://localhost:8080${item.songStringLink}`
        }

        // Cập nhật avatarLinkString cho từng singer
        if (item.singers && Array.isArray(item.singers)) {
          item.singers.forEach((singer) => {
            if (singer.avatarLinkString) {
              singer.avatarLinkString = `http://localhost:8080${singer.avatarLinkString}`
            }
          })
        }
      })
      console.log(data, 'updatedSongData')

      setSongsList(data)
    } catch (error) {
      console.log(error, 'get song api error')
    }
  }

  const initSingersList = async () => {
    const res = await axios.get('http://localhost:8080/api/singer', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const data = res.data
    const updatedData = data.map((item) => ({
      value: item.id,
      label: item.name,
    }))

    console.log(updatedData, 'updatedSingerData')
    setSingersList(updatedData)
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
      initSingersList()
      console.log(formData, 'formData')
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'song' ? e.target.files[0] : value,
    })
  }
  const handleSelectSingersChange = (selectedValues) => {
    const values = selectedValues.map((item) => item.value)
    setFormData({
      ...formData,
      singers: values,
    })
  }
  const onSubmit = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'multipart/form-data',
      }
      let songInfor = new FormData()
      songInfor.append('title', formData.title)
      
      songInfor.append('description', formData.description)
      songInfor.append('singers', formData.singers) // JSON.stringify()
      console.log("song's title: " + formData.title)
      console.log("song's singers: " + JSON.stringify(formData.singers))
      console.log("song's description: " + formData.description)
      console.log("singers: " + formData.singers)
      // console.log("isUpdateMode: ", isUpdateMode)
      if (!isUpdateMode) {
        songInfor.append('songFile', formData.song)
        const res = await axios.post('http://localhost:8080/api/song', songInfor, {
          headers: headers,
        })
        console.log('create song api result', res)
        if (res.status === 201) {
          toast.success('Tạo bài hát thành công')
        }
      } else {
        console.log(formData, 'update song formData')
        if (formData.song) {
          songInfor.append('songFileEdit', formData.song)
        } else {
          songInfor.append('songFileEdit', null)
        }
        
        const res = await axios.put(`http://localhost:8080/api/song/${formData.id}`, songInfor, {
          headers: headers,
        })
        if (res.status === 200) {
          toast.success('Sửa bài học thành công')
        }
      }
    } catch (error) {
      console.log(error, 'create song api error')
    } finally {
      setFormData({
        song: null,
        title: '',
        description: '',
        singers: [],
      })
      setVisible(false)
      initSongList()
    }
  }
  const onCreateSong = () => {
    handleShow()
    setSelectedSingers([])
    setFormData({
      song: null,
      title: '',
      description: '',
      singers: [],
    })
    setIsUpdateMode(false)
  }
  const editSong = (edSong) => {
    console.log(edSong, 'edSong')
    setIsUpdateMode(true)
    handleShow()
    const singersArr = edSong.singers.map(item => item.id)
    const selectedS = edSong.singers.map( item => ({
      value: item.id,
      label: item.name
    }))
    setSelectedSingers(selectedS)
    const mappedEdSong = {...edSong, singers: singersArr}
    setFormData(mappedEdSong)
  }
  const deleteSong = (songId) => {
    handleShow1()
    setDeleteId(songId)
  }
  const deleteS = async () => {
    try {
      console.log("delete song id: ", deleteId)
      const res = await axios.delete(`http://localhost:8080/api/song/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      })
      console.log(res, "delete song api res");
    } catch (error) {
      console.log(error, "delete book api error")
    } finally {
      initSongList()
      handleClose1()
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
                <CButton color="primary" onClick={onCreateSong}>
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
                        <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Singers</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Song Player</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {songsList.length === 0 || songsList === null ? (
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
                            <CTableDataCell>
                              {song.singers.length === 0 ? (
                                <p>Chưa liên kết với ca sĩ nào</p>
                              ) : (
                                <Stack direction="row" spacing={1}>
                                  {song.singers.map((singer, index) => (
                                    <Chip
                                      color="success"
                                      key={index}
                                      avatar={
                                        <Avatar alt={singer.name} src={singer.avatarLinkString} />
                                      }
                                      label={singer.name}
                                      variant="outlined"
                                    />
                                  ))}
                                </Stack>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              {song.songStringLink ? (
                                <audio controls>
                                  <source src={song.songStringLink} type="audio/mpeg" />
                                  Trình duyệt của bạn không hỗ trợ phát nhạc.
                                </audio>
                              ) : (
                                'Không có file nhạc'
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                onClick={() => editSong(song)}
                                color="success"
                                variant="outline"
                              >
                                Edit
                              </CButton>
                              <CButton color="danger" variant="outline" onClick={() => deleteSong(song.id)}>
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
        backdrop="static"
        visible={visible}
        onClose={handleClose}
        aria-labelledby="CreateEditModal"
      >
        <CModalHeader>
          <CModalTitle id="CreateEditModal">
            {isUpdateMode ? 'Update Song' : 'Add Song'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormInput
                value={formData.title}
                type="text"
                name="title"
                id="exampleFormControlInput1"
                label="Title"
                placeholder="Enter song's title"
                aria-describedby="exampleFormControlInputHelpInline"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="exampleFormControlTextarea1">Description</CFormLabel>
              <CFormTextarea
                value={formData.description}
                name="description"
                onChange={handleChange}
                id="exampleFormControlTextarea1"
                rows={3}
              ></CFormTextarea>
            </div>
            <div className="mb-3">
              <CFormLabel>Ca sĩ</CFormLabel>
              <Select
                defaultValue={selectedSingers}
                isMulti
                name="singers"
                // getOptionValue={formData.singers}
                onChange={handleSelectSingersChange}
                options={singersList}
                className="basic-multi-select"
                classNamePrefix="select"
                closeMenuOnSelect={false}
              />
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
          <CButton color="secondary" onClick={handleClose}>
            Close
          </CButton>
          <CButton color="primary" onClick={onSubmit}>
            {isUpdateMode ? 'Update' : 'Create'}
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        backdrop="static"
        visible={showDeleteModal}
        onClose={handleClose1}
        aria-labelledby="DeleteModal"
      >
        <CModalHeader>
          <CModalTitle id="DeleteModal">
            Delete Song
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you want to delete this song?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose1}>
            Close
          </CButton>
          <CButton color="danger" onClick={deleteS}>
            Delete
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  )
}

export default Songs

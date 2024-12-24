import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { CContainer, CRow, CCol } from '@coreui/react'
import Song from '../../components/userComponents/Song'
import SongsCarousel from '../../components/userComponents/SongsCarousel'

const SingerClient = () => {
  const location = useLocation()
  const { singerId } = useParams()
  const { token, singerName, singerAvatar } = location.state
  const [songsListBySinger, setSongsListBySinger] = useState([])
  const getSongsList = async () => {
    try {
      const id = singerId
      const res = await axios.get(`http://localhost:8080/api/singer/songs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = res.data
      
      data.forEach((item) => {
        if (item.songStringLink) {
          item.songStringLink = `http://localhost:8080${item.songStringLink}`
        }
      })
      console.log('res data: ', data)
      setSongsListBySinger(data)
    } catch (error) {
      console.log(error, 'get song api error')
    }
  }
  useEffect(() => {
    getSongsList()
    console.log(songsListBySinger, 'songsListBySinger')
  }, [])

  return (
    <>
      <CContainer fluid>
        <CRow style={{ backgroundImage:`url(${singerAvatar})`, height: '250px' }}>
          <h1 style={{ color: 'black', paddingTop: '140px', paddingLeft: '1rem', fontSize: '75px'  }}>{singerName}</h1>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            <CRow><p>Popular</p></CRow>
            <CRow>
              <Song  />
            </CRow>
          </CCol>
          <CCol xs={12} md={6}>
            <CRow><p>Artist pick</p></CRow>
            <CRow><SongsCarousel /></CRow>
          </CCol>
        </CRow>
      </CContainer>


    </>
  )
}

export default SingerClient

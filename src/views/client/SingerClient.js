import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { CContainer, CRow, CCol } from '@coreui/react'
import PopularSongsTable from '../../components/userComponents/PopularSongsTable'
import SongsCarousel from '../../components/userComponents/SongsCarousel'

const SingerClient = () => {
  const location = useLocation()
  const { singerId } = useParams()
  const { singerName, singerAvatar } = location.state
  

  return (
    <>
      <CContainer fluid>
        <CRow className='mb-3' style={{ backgroundImage:`url(${singerAvatar})`, height: '250px' }}>
          <h1 style={{ color: 'white', paddingTop: '140px', paddingLeft: '1rem', fontSize: '75px'  }}>{singerName}</h1>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            <CRow><p>Popular</p></CRow>
            <CRow>
              <PopularSongsTable singerId={singerId} singerAvatar={singerAvatar}  />
            </CRow>
          </CCol>
          <CCol xs={12} md={6}>
            <CRow><p>Artist pick</p></CRow>
            <CRow><SongsCarousel singerId={singerId} /></CRow>
          </CCol>
        </CRow>
      </CContainer>


    </>
  )
}

export default SingerClient

import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react'
import { CTable, CTableRow, CTableDataCell, CTableBody } from '@coreui/react'
import { CIcon } from '@coreui/icons-react';
import { cilMediaPlay } from '@coreui/icons'

const PopularSongsTable = (props) => {
  const [songsListBySinger, setSongsListBySinger] = useState([])
  const [hoveredSongId, setHoveredSongId] = useState('')
  const getSongsList = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = props.singerId
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
  }, [])

  const hoverSongId = (songId) => {
    setHoveredSongId(songId)
  }

  const outHoverSongId = () => {
    setHoveredSongId('')
  }

  return (
    <>
      <CTable hover borderless>
        <CTableBody>
          {songsListBySinger.length === 0 || songsListBySinger === null ? (
            <CTableRow>
              <CTableDataCell colSpan={4} className="text-center">
                Chưa có data
              </CTableDataCell>
            </CTableRow>
          ) : (
            songsListBySinger.map((song, index) => (
              <CTableRow key={index} onMouseOver={() => hoverSongId(song.id)} onMouseLeave={outHoverSongId}>
                <CTableDataCell>{song.id === hoveredSongId ? (<CIcon icon={cilMediaPlay} />) : (index + 1)}</CTableDataCell>
                <CTableDataCell>
                  <img src={props.singerAvatar} height={'40px'} />
                </CTableDataCell>
                <CTableDataCell>{song.title}</CTableDataCell>
                <CTableDataCell>1.234.567</CTableDataCell>
                <CTableDataCell>4:30</CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default PopularSongsTable

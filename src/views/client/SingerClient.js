import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

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
      <div>
        <h1>Trang chi tiết ca sĩ {singerName} </h1>
        <img src={singerAvatar} />
      </div>
    </>
  )
}

export default SingerClient

import axios from 'axios'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import { useNavigate } from 'react-router-dom'

const Clients = () => {
  const [jwtToken, setJwtToken] = useState('')
  const [songsList, setSongsList] = useState([])
  const [singersList, setSingersList] = useState([])
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
      initSingersList()
      initSongList()
      console.log(singersList, 'singersList')
    }
  }, [])
  const navigate = useNavigate()
  const preventDefault = (event) => event.preventDefault()
  const toSinger = (singerSelected) => {
    const singerId = singerSelected.id
    
    const data = {
        token: jwtToken,
        singerName: singerSelected.name,
        singerAvatar: singerSelected.avatarLinkString
    }
    navigate(`/client/singer/${singerId}`, {state: data})
  }
  return (
    <>
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'left',
                  typography: 'body1',
                  '& > :not(style) ~ :not(style)': {
                    ml: 0,
                  },
                }}
                onClick={preventDefault}
              >
                <Link href="#" underline="hover">
                  {'Danh sách ca sĩ'}
                </Link>
              </Box>
            </div>
            <div className="card-body">
              <div className="row">
                {singersList.length === 0 || singersList === null
                  ? 'Chưa có data'
                  : singersList.map((singer, index) => (
                      <Card key={index} className="col-md-4 col-xl-2 mb-3 p-3" onClick={() => toSinger(singer)}>
                        <CardActionArea>
                          <CardMedia
                            className='p-1'
                            style={{borderRadius: '50%'}}
                            component="img"
                            height="140"
                            image={singer.avatarLinkString}
                            alt={singer.name}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                              {singer.name}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Clients

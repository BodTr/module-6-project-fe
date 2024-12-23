import React from 'react'

//Project

const AdUsers = React.lazy(() => import('./views/users/AdUsers'))
const Singers = React.lazy(() => import('./views/singers/Singerss'))
const Songs = React.lazy(() => import('./views/songs/Songs'))
const Clients = React.lazy(() => import('./views/client/Clients'))
const SingerClient = React.lazy(() => import('./views/client/SingerClient'))


const routes = [
  {path: '/users', name: 'Users', element: AdUsers},
  {path: '/singers', name: 'Singers', element: Singers},
  {path: '/songs', name: 'Songs', element: Songs},
  { path: '/', exact: true, name: 'Home' },
  {path: '/client', name: 'Clients', element: Clients },
  {path: '/client/singer/:singerId', name: 'Singer', element: SingerClient}
]

export default routes

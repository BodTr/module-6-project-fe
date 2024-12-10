import React from 'react'

//Project

const AdUsers = React.lazy(() => import('./views/users/AdUsers'))
const Singers = React.lazy(() => import('./views/singers/Singerss'))
const Songs = React.lazy(() => import('./views/songs/Songs'))

const routes = [
  {path: '/users', name: 'Users', element: AdUsers},
  {path: '/singers', name: 'Singers', element: Singers},
  {path: '/songs', name: 'Songs', element: Songs},
  { path: '/', exact: true, name: 'Home' },

]

export default routes

import React from 'react'

//Project

const AdUsers = React.lazy(() => import('./views/users/AdUsers'))
const Singers = React.lazy(() => import('./views/singers/Singerss'))
const Songs = React.lazy(() => import('./views/songs/Songs'))

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

const routes = [
  {path: '/users', name: 'Users', element: AdUsers},
  {path: '/singers', name: 'Singers', element: Singers},
  {path: '/songs', name: 'Songs', element: Songs},
  { path: '/', exact: true, name: 'Home' },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },



]

export default routes

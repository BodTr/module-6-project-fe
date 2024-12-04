import { element } from 'prop-types'
import React from 'react'

//Project

const AdUsers = React.lazy(() => import('./views/users/AdUsers'))

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

const routes = [
  {path: '/users', name: 'Users', element: AdUsers},
  { path: '/', exact: true, name: 'Home' },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },



]

export default routes

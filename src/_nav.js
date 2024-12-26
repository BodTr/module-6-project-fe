import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const role = localStorage.getItem('role')

const AdminNav = [
  {
    component: CNavTitle,
    name: 'Menu',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users'
  },
  {
    component: CNavItem,
    name: 'Singers',
    to: '/singers'
  },
  {
    component: CNavItem,
    name: 'Songs',
    to: '/songs'
  }


]

let _nav = []

if (role === 'USER') {
  _nav = [
    {
      component: CNavTitle,
      name: 'Playlists'
    },
  ]
} else {
  _nav = AdminNav
}


export default _nav

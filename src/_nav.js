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
  cilGolf,
  cilHome,
  cilInstitution,
  cilNewspaper,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilTerrain
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavTitle,
    name: 'TDS 2026',
  },
  {
    component: CNavItem,
    name: 'Matches',
    to: '/matches',
    icon: <CIcon icon={cilGolf} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Scoring',
    to: '/scoring',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'News',
    to: '/news',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Past Tournaments',
  },
  {
    component: CNavGroup,
    name: 'TDS 2025',
    to: '/base',
    icon: <CIcon icon={cilTerrain} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Matches',
        to: '/matches',
      },
      {
        component: CNavItem,
        name: 'Scoring',
        to: '/scoring',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Congressional Cup 2025',
    to: '/buttons',
    icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Matches',
        to: '/matches',
      },
      {
        component: CNavItem,
        name: 'Scoring',
        to: '/scoring',
      }
    ],
  }
]

export default _nav

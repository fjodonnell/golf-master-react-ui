import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cifUs, cilPeople } from '@coreui/icons'

// ✅ Avatar imports
import Francis from 'src/assets/images/avatars/Francis.jpg'
import Zachary from 'src/assets/images/avatars/Zachary.jpg'
import Tommy from 'src/assets/images/avatars/Tommy.jpg'
import Robert from 'src/assets/images/avatars/Robert.jpg'

import MainChart from './MainChart'
import { WidgetsTeamLeaderboard } from '../widgets/WidgetsTeamLeaderboard'
import { MatchResultsTable } from './MatchResults'

const playersList = [
  { title: 'FJ', color: 'success' },
  { title: 'Zach', color: 'info' },
  { title: 'Tom', color: 'warning' },
  { title: 'Rob', color: 'danger' },
]

const avatarMap = {
  Francis: Francis,
  Zachary: Zachary,
  Tommy: Tommy,
  Robert: Robert,
}

const Dashboard = () => {
  const [playerTable, setPlayerTable] = useState([])
  const [scores, setScores] = useState([]) // ✅ scores state
  const [chartType, setChartType] = useState('Scores') // ✅ chart type toggle

  // ✅ Fetch leaderboard
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:8080/leaderboard/')
        const data = await response.json()

        const mappedPlayers = data.map((item) => {
          const firstName = item.firstName
          const lastName = item.lastName
          const city = item.city || 'Columbus'
          const state = item.state || 'Ohio'
          const avatarSrc = avatarMap[firstName] || null

          return {
            avatar: { src: avatarSrc },
            user: {
              name: `${firstName} ${lastName}`,
              city: city,
              state: state,
            },
            country: { name: 'USA', flag: cifUs },
            strokesToPar: item.totalPoints,
          }
        })

        mappedPlayers.sort((a, b) => a.strokesToPar - b.strokesToPar)
        setPlayerTable(mappedPlayers)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      }
    }

    fetchPlayers()
  }, [])

  // ✅ Fetch scores for MainChart
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/score/eventName/Congressional%20Cup%202025',
        )
        const data = await response.json()
        setScores(data)
      } catch (error) {
        console.error('Error fetching scores:', error)
      }
    }

    fetchScores()
  }, [])

  return (
    <>
      <WidgetsTeamLeaderboard className="mb-4" />

      <CCard className="mb-4">
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell className="bg-body-tertiary text-center">
                <CIcon icon={cilPeople} />
              </CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Player</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary text-center">
                Country
              </CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Strokes to Par</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {playerTable.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell className="text-center">
                  <CAvatar size="md" src={item.avatar.src} />
                </CTableDataCell>
                <CTableDataCell>
                  <div>{item.user.name}</div>
                  <div className="small text-body-secondary text-nowrap">
                    <span>
                      {item.user.city}, {item.user.state}
                    </span>
                  </div>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                </CTableDataCell>
                <CTableDataCell>
                  +{item.strokesToPar}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCard>

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Player Scoring Trend
              </h4>
              <div className="small text-body-secondary">Congressional Cup 2025</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButtonGroup className="float-end me-3">
                {['Scores', 'Pars', 'Birdies'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={chartType === value}
                    onClick={() => setChartType(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          {/* ✅ Fix: pass metric prop correctly */}
          <MainChart metric={chartType.toLowerCase()} />
        </CCardBody>
        {/* <CCardFooter>
          <CRow className="text-center">
            {playersList.map((player, index) => (
              <CCol key={index}>
                <div
                  style={{
                    display: 'inline-block',
                    width: '30px',
                    height: '4px',
                    backgroundColor: `var(--cui-${player.color})`,
                    marginRight: '8px',
                    verticalAlign: 'middle',
                  }}
                ></div>
                <span>{player.title}</span>
              </CCol>
            ))}
          </CRow>
        </CCardFooter> */}
      </CCard>
      <CCard className="mb-4">
        <MatchResultsTable eventName="Congressional Cup 2025" />
      </CCard>

    </>
  )
}

export default Dashboard

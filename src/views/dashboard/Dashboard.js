import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
  CFormSelect,
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
import fjodonnell from 'src/assets/images/avatars/fjodonnell.jpg'
import zhuston from 'src/assets/images/avatars/zhuston.jpg'
import acarpenter from 'src/assets/images/avatars/acarpenter.jpg'
import wghidotti from 'src/assets/images/avatars/wghidotti.jpg'
import rschuetz from 'src/assets/images/avatars/rschuetz.jpg'
import tfortunato from 'src/assets/images/avatars/tfortunato.jpg'
import zrobinson from 'src/assets/images/avatars/zrobinson.jpg'

import MainChart from './MainChart'
import { MatchResultsTable } from './MatchResults'


const avatarMap = {
  Francis: fjodonnell,
  Zachary: zhuston,
  Alexander: acarpenter,
  William: wghidotti,
  Robert: rschuetz,
  Tommy: tfortunato,
  ZRob: zrobinson
}

const Dashboard = () => {
  const [playerTable, setPlayerTable] = useState([])
  const [scores, setScores] = useState([]) // ✅ scores state
  const [chartType, setChartType] = useState('Scores') // ✅ chart type toggle

  // Fetch leaderboard
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('https://golf-master-backend.onrender.com/leaderboard/')
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
            totalPoints: item.totalPoints,
            strokesToPar: item.strokesToPar
          }
        })

        mappedPlayers.sort((a, b) => b.totalPoints - a.totalPoints)
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
          'https://golf-master-backend.onrender.com/score/eventName/Tournament%20du%20Sol%202025',
        )
        const data = await response.json()
        setScores(data)
      } catch (error) {
        console.error('Error fetching scores:', error)
      }
    }

    fetchScores()
  }, [])

  const formatScoreToPar = (value) =>
    value == null ? '-' : value === 0 ? 'E' : value > 0 ? `+${value}` : value;

  return (
    <>
      <CCard className="mb-4">
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell className="bg-body-tertiary text-center">
                <CIcon icon={cilPeople} />
              </CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Player</CTableHeaderCell>

              {/* 1. Hide Country on small screens (d-none) and show at Large (d-lg-table-cell) */}
              <CTableHeaderCell className="bg-body-tertiary text-center d-none d-lg-table-cell">
                Country
              </CTableHeaderCell>

              {/* 2. Use shorter header names or abbreviations for mobile if needed */}
              <CTableHeaderCell className="bg-body-tertiary text-center">Points</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary text-center">+/- Par</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {playerTable.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell className="text-center">
                  <CAvatar size="md" src={item.avatar.src} />
                </CTableDataCell>
                <CTableDataCell>
                  <div className="fw-semibold">{item.user.name}</div>
                  <div className="small text-body-secondary">
                    {item.user.city}, {item.user.state}
                  </div>
                </CTableDataCell>

                {/* Match the d-none logic for the Country data cell */}
                <CTableDataCell className="text-center d-none d-lg-table-cell">
                  <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                </CTableDataCell>

                <CTableDataCell className="text-center fw-bold">
                  {item.totalPoints}
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {formatScoreToPar(item.strokesToPar)}
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
              <div className="small text-body-secondary">Tournament du Sol 2025</div>
            </CCol>
            <CCol sm={7}>
              {/* DESKTOP: Button Group (Hidden on XS/SM screens) */}
              <CButtonGroup className="float-end me-3 d-none d-md-inline-flex">
                {['Scores', 'Pars', 'Birdies'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    active={chartType === value}
                    onClick={() => setChartType(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>

              {/* MOBILE: Select Dropdown (Visible only on XS/SM screens) */}
              <div className="d-md-none mt-2">
                <CFormSelect
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="border-secondary"
                >
                  <option value="Scores">Scores</option>
                  <option value="Pars">Pars</option>
                  <option value="Birdies">Birdies</option>
                </CFormSelect>
              </div>
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
        <MatchResultsTable eventName="Tournament du Sol 2025" />
      </CCard>

    </>
  )
}

export default Dashboard

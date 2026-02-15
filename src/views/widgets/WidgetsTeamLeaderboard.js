import React, { useEffect, useState } from 'react'
import { CCol, CRow, CWidgetStatsB } from '@coreui/react'
import axios from 'axios'

export const WidgetsTeamLeaderboard = () => {
  const [leaderboardItems, setLeaderboardItems] = useState([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('https://golf-master-backend.onrender.com/leaderboard/teamLeaderboard')
        setLeaderboardItems(response.data)
      } catch (error) {
        console.error('Error fetching leaderboard data:', error)
      }
    }

    fetchLeaderboard()
  }, [])

  // Helper: team color mapping
  const getColorForTeam = (teamName) => {
    switch (teamName) {
      case 'Cardinals':
        return 'danger'
      case 'Eagles':
        return 'warning'
      default:
        return 'primary'
    }
  }

  // Helper: progress value, where 4 points = 100%
  const getProgressValue = (points) => {
    const progress = (points / 4) * 100
    return Math.min(progress, 100) // Clamp to max 100%
  }

  return (
    <CRow>
      {leaderboardItems.map((item, index) => (
        <CCol xs={6} key={index}>
          <CWidgetStatsB
            className="mb-3"
            color={getColorForTeam(item.firstName)}
            inverse
            progress={{ value: getProgressValue(item.totalPoints) }}
            title={item.firstName}
            value={item.totalPoints}
          />
        </CCol>
      ))}
    </CRow>
  )
}

import React, { useEffect, useState, useCallback } from 'react'
import {
  CContainer,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'
import MatchCard from './MatchCard'

const Matches = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('Tournament du Sol 2026')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios
      .get('https://golf-master-backend.onrender.com/event/')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
  }, [])

  const fetchMatches = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `https://golf-master-backend.onrender.com/match/eventName/${selectedEvent}`
      )
      const sorted = res.data.sort((a, b) => a.matchNumber - b.matchNumber)
      setMatches(sorted)
    } catch (err) {
      console.error('Error refreshing matches:', err)
    }
    setLoading(false)
  }, [selectedEvent])

  useEffect(() => {
    fetchMatches()
  }, [selectedEvent, fetchMatches])

  const fetchRoundScores = useCallback(async (roundId) => {
    try {
      const res = await axios.get(
        `https://golf-master-backend.onrender.com/score/roundId/${roundId}`
      )
      return res.data
    } catch (err) {
      console.error('Error fetching round scores:', err)
      return []
    }
  }, [])

  return (
    // Increased maxWidth to 1100px to accommodate two columns on desktop
    <CContainer className="mt-4" style={{ maxWidth: '1100px' }}>
      
      {/* Event Selector - Full width on mobile, auto on desktop */}
      <div className="d-grid d-md-flex justify-content-md-start mb-4">
        <CDropdown className="w-100 w-md-auto">
          <CDropdownToggle color="primary" className="px-4 w-100">
            {selectedEvent}
          </CDropdownToggle>
          <CDropdownMenu className="w-100">
            {events.map((event) => (
              <CDropdownItem
                key={event.eventName}
                onClick={() => setSelectedEvent(event.eventName)}
                style={{ cursor: 'pointer' }}
              >
                {event.eventName}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
        </div>
      ) : (
        /* GRID LOGIC:
           xs="12" -> Single column on mobile
           lg="6"  -> Two columns on Large screens (approx 992px+)
        */
        <CRow className="gy-4">
          {matches.map((match) => (
            <CCol xs="12" lg="6" key={match.matchId}>
              <MatchCard
                match={match}
                fetchRoundScores={fetchRoundScores}
                refreshMatches={fetchMatches}
              />
            </CCol>
          ))}
        </CRow>
      )}
    </CContainer>
  )
}

export default Matches
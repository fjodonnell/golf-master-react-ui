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
  const [selectedEvent, setSelectedEvent] = useState('Tournament du Sol 2025')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false) // 🔹 new state

  // Fetch events (on load)
  useEffect(() => {
    axios
      .get('https://golf-master-backend.onrender.com/event/')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
  }, [])

  // 🔥 Define fetchMatches so MatchCard can call it
  const fetchMatches = useCallback(async () => {
    setLoading(true) // 🔹 start loading
    try {
      const res = await axios.get(
        `https://golf-master-backend.onrender.com/match/eventName/${selectedEvent}`
      )
      const sorted = res.data.sort((a, b) => a.matchNumber - b.matchNumber)
      setMatches(sorted)
      console.log(sorted);
    } catch (err) {
      console.error('Error refreshing matches:', err)
    }
    setLoading(false) // 🔹 stop loading
  }, [selectedEvent])

  // Fetch matches when selected event changes
  useEffect(() => {
    fetchMatches()
  }, [selectedEvent, fetchMatches])

  // Score fetch callback
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
    <CContainer className="mt-4" style={{ maxWidth: '900px' }}>
      {/* Event Selector */}
      <div className="d-flex justify-content-start mb-4">
        <CDropdown>
          <CDropdownToggle color="primary" className="px-4">
            {selectedEvent}
          </CDropdownToggle>
          <CDropdownMenu>
            {events.map((event) => (
              <CDropdownItem
                key={event.eventName}
                onClick={() => setSelectedEvent(event.eventName)}
              >
                {event.eventName}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
        </div>
      ) : (
        // Match Cards
        <CRow className="gy-4">
          {matches.map((match) => (
            <CCol xs="12" key={match.matchId}>
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

// PostScoreForm.js
import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CSpinner,
  CAlert,
  CFormSelect,
} from '@coreui/react'

const PostScoreForm = ({ selectedPlayer, onScorePosted }) => {
  const accordionRef = useRef(null)

  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [rounds, setRounds] = useState([])
  const [selectedRound, setSelectedRound] = useState('')
  const [scoreForm, setScoreForm] = useState({
    score: '',
    scoreToPar: '',
    pars: '',
    birdies: '',
    eagles: '',
    pointsEarned: '',
  })
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingRounds, setLoadingRounds] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  // Scroll accordion into view when a player is selected
  useEffect(() => {
    if (selectedPlayer && accordionRef.current) {
      accordionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedPlayer])

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('https://golf-master-backend.onrender.com/event/')
        const data = await res.json()
        setEvents(data)
      } catch (err) {
        console.error(err)
        setFeedback({ type: 'danger', message: 'Failed to load events.' })
      } finally {
        setLoadingEvents(false)
      }
    }
    fetchEvents()
  }, [])

  // Fetch rounds when event changes
  useEffect(() => {
    if (!selectedEvent) {
      setRounds([])
      setSelectedRound('')
      return
    }
    const fetchRounds = async () => {
      setLoadingRounds(true)
      try {
        const res = await fetch(
          `https://golf-master-backend.onrender.com/round/eventName/${encodeURIComponent(selectedEvent)}`
        )
        const data = await res.json()
        const sortedRounds = data.sort((a, b) => a.roundNumber - b.roundNumber)
        setRounds(sortedRounds)
      } catch (err) {
        console.error(err)
        setFeedback({ type: 'danger', message: 'Failed to load rounds for selected event.' })
      } finally {
        setLoadingRounds(false)
      }
    }
    fetchRounds()
  }, [selectedEvent])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setScoreForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formValid = useMemo(() => {
    const allFieldsFilled =
      selectedEvent &&
      selectedRound &&
      Object.values(scoreForm).every((v) => v !== '')
    return allFieldsFilled
  }, [selectedEvent, selectedRound, scoreForm])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formValid) return

    const payload = {
      player: { playerId: selectedPlayer.playerId },
      round: { roundId: selectedRound },
      score: Number(scoreForm.score),
      scoreToPar: Number(scoreForm.scoreToPar),
      pars: Number(scoreForm.pars),
      birdies: Number(scoreForm.birdies),
      eagles: Number(scoreForm.eagles),
      pointsEarned: Number(scoreForm.pointsEarned),
    }

    setSubmitting(true)
    setFeedback(null)

    try {
      const res = await fetch('https://golf-master-backend.onrender.com/score/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit score.')

        setFeedback({ type: 'success', message: 'Score posted successfully!' })

        // Keep success message visible for 5 seconds
        setTimeout(() => {
          // Reset form fields
          setScoreForm({
            score: '',
            scoreToPar: '',
            pars: '',
            birdies: '',
            eagles: '',
            pointsEarned: '',
          })
          setSelectedEvent('')
          setSelectedRound('')
          // Remove success message at the same time
          setFeedback(null)
        }, 5000)
        

      if (onScorePosted) onScorePosted()
    } catch (err) {
      console.error(err)
      setFeedback({ type: 'danger', message: err.message || 'Error submitting score.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div ref={accordionRef}>
      <CAccordion className="mt-3 mb-5">
        <CAccordionItem itemKey="postScore">
          <CAccordionHeader>Post a Score for {selectedPlayer.playerNickname}</CAccordionHeader>
          <CAccordionBody>
            <CForm onSubmit={handleSubmit}>
              {/* Event selection */}
              <div className="mb-3">
                <CFormLabel>Event</CFormLabel>
                {loadingEvents ? (
                  <div><CSpinner size="sm" /> Loading events...</div>
                ) : (
                  <CFormSelect
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                  >
                    <option value="">Select Event</option>
                    {events.map((ev) => (
                      <option key={ev.eventId} value={ev.eventName}>{ev.eventName}</option>
                    ))}
                  </CFormSelect>
                )}
              </div>

              {/* Round selection */}
              <div className="mb-3">
                <CFormLabel>Round</CFormLabel>
                {loadingRounds ? (
                  <div><CSpinner size="sm" /> Loading rounds...</div>
                ) : (
                  <CFormSelect
                    value={selectedRound}
                    onChange={(e) => setSelectedRound(e.target.value)}
                    disabled={!selectedEvent || rounds.length === 0}
                  >
                    <option value="">Select Round</option>
                    {rounds.map((r) => (
                      <option key={r.roundId} value={r.roundId}>{r.roundName}</option>
                    ))}
                  </CFormSelect>
                )}
              </div>

              {/* Score inputs */}
              {Object.keys(scoreForm).map((field) => (
                <div className="mb-3" key={field}>
                  <CFormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</CFormLabel>
                  <CFormInput
                    type="number"
                    name={field}
                    value={scoreForm[field]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}

              <CButton type="submit" color="primary" disabled={!formValid || submitting}>
                {submitting ? <><CSpinner size="sm" /> Posting...</> : 'Post Score'}
              </CButton>

              {/* Feedback at bottom */}
              {feedback && (
                <div className="mt-3">
                  <CAlert color={feedback.type}>{feedback.message}</CAlert>
                </div>
              )}
            </CForm>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </div>
  )
}

export default PostScoreForm

import React, { useEffect, useState, useMemo } from 'react'
import {
    CAvatar,
    CCard,
    CCardBody,
    CCol,
    CRow,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CSpinner,
    CAlert,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react'
import { cilArrowTop, cilArrowBottom } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import PostScoreForm from './PostScoreForm'

// ✅ Avatar imports
import Francis from 'src/assets/images/avatars/fjodonnell.jpg'
import Zachary from 'src/assets/images/avatars/zhuston.jpg'
import Alexander from 'src/assets/images/avatars/acarpenter.jpg'
import William from 'src/assets/images/avatars/wghidotti.jpg'

const avatarMap = {
    fjodonnell: Francis,
    zhuston: Zachary,
    zrobinson: Zachary,
    acarpenter: Alexander,
    wghidotti: William,
}

const Scoring = () => {
    const [players, setPlayers] = useState([])
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [playerScores, setPlayerScores] = useState([])
    const [loadingPlayers, setLoadingPlayers] = useState(true)
    const [loadingScores, setLoadingScores] = useState(false)
    const [refreshScores, setRefreshScores] = useState(0)
    const [error, setError] = useState(null)
    const [sortConfig, setSortConfig] = useState([
        { key: 'round.event.eventName', direction: 'asc' },
        { key: 'round.roundNumber', direction: 'asc' },
    ])


    // ✅ Fetch players on mount
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('https://golf-master-backend.onrender.com/player/')
                const data = await response.json()
                setPlayers(data)
            } catch (err) {
                setError('Failed to load players.')
                console.error(err)
            } finally {
                setLoadingPlayers(false)
            }
        }

        fetchPlayers()
    }, [])

    // ✅ Fetch player scores
    useEffect(() => {
        if (!selectedPlayer) return

        const fetchScores = async () => {
            setLoadingScores(true)
            try {
                const response = await fetch(
                    `https://golf-master-backend.onrender.com/score/playerId/${selectedPlayer.playerId}`
                )
                const data = await response.json()
                setPlayerScores(data)
            } catch (err) {
                setError('Failed to load player scores.')
                console.error(err)
            } finally {
                setLoadingScores(false)
            }
        }

        fetchScores()
    }, [selectedPlayer, refreshScores])

    const handleSelect = (player) => {
        setSelectedPlayer(player)
        setPlayerScores([])
        setError(null)
    }

    // ✅ Handle sort toggle (multi-column)
    const handleSort = (key) => {
        setSortConfig((prev) => {
            const existing = prev.find((s) => s.key === key)
            let newConfig = [...prev]

            if (existing) {
                // Toggle direction
                existing.direction = existing.direction === 'asc' ? 'desc' : 'asc'
            } else {
                // Add new primary sort and remove duplicates
                newConfig = [{ key, direction: 'asc' }, ...prev.filter((s) => s.key !== key)]
            }

            // ✅ Ensure when sorting by Event, Round Number is always the secondary key
            if (key === 'round.event.eventName') {
                const hasRoundSort = newConfig.some((s) => s.key === 'round.roundNumber')
                if (!hasRoundSort) {
                    newConfig.push({ key: 'round.roundNumber', direction: 'asc' })
                }
            }

            return newConfig
        })
    }

    // ✅ Sort scores
    const sortedScores = useMemo(() => {
        if (!sortConfig.length) return playerScores

        const getValue = (obj, path) => path.split('.').reduce((o, p) => o?.[p], obj)

        return [...playerScores].sort((a, b) => {
            for (let { key, direction } of sortConfig) {
                const valA = getValue(a, key)
                const valB = getValue(b, key)

                if (valA == null && valB == null) continue
                if (valA == null) return 1
                if (valB == null) return -1

                let comparison = 0
                if (typeof valA === 'number' && typeof valB === 'number') {
                    comparison = valA - valB
                } else {
                    comparison = valA.toString().localeCompare(valB.toString())
                }

                if (comparison !== 0) return direction === 'asc' ? comparison : -comparison
            }
            return 0
        })
    }, [playerScores, sortConfig])

    // ✅ Compute averages row
    const averages = useMemo(() => {
        if (!playerScores.length) return null
        const sum = { score: 0, scoreToPar: 0, pars: 0, birdies: 0, pointsEarned: 0 }
        playerScores.forEach((s) => {
            sum.score += s.score || 0
            sum.scoreToPar += s.scoreToPar || 0
            sum.pars += s.pars || 0
            sum.birdies += s.birdies || 0
            sum.pointsEarned += s.pointsEarned || 0
        })
        const count = playerScores.length
        return {
            score: (sum.score / count).toFixed(1),
            scoreToPar: (sum.scoreToPar / count).toFixed(1),
            pars: (sum.pars / count).toFixed(1),
            birdies: (sum.birdies / count).toFixed(1),
            pointsEarned: (sum.pointsEarned / count).toFixed(1),
        }
    }, [playerScores])

    const renderSortIcon = (key) => {
        const sort = sortConfig.find((s) => s.key === key)
        if (!sort) return null
        return sort.direction === 'asc' ? (
            <CIcon icon={cilArrowTop} size="sm" className="ms-1" />
        ) : (
            <CIcon icon={cilArrowBottom} size="sm" className="ms-1" />
        )
    }

    const formatScoreToPar = (value) =>
        value == null ? '-' : value === 0 ? 'E' : value > 0 ? `+${value}` : value;            

    return (
        <>
            <CCard className="mb-4 p-3 shadow-sm">
                <CCardBody>
                    <CRow className="align-items-center g-3">
                        <CCol md={12} className="text-center">
                            {selectedPlayer ? (
                                <>
                                    <CAvatar
                                        src={avatarMap[selectedPlayer.playerId] || ''}
                                        size="xl"
                                        className="border border-secondary shadow-sm mb-2"
                                    />
                                    <h5 className="mb-0">
                                        {selectedPlayer.playerFirstName} {selectedPlayer.playerLastName}
                                    </h5>
                                    <small className="text-muted">
                                        “{selectedPlayer.playerNickname}”
                                    </small>
                                </>
                            ) : (
                                <div className="text-muted mb-2">No player selected</div>
                            )}
                        </CCol>

                        <CCol md={12} className="text-center">
                            <CDropdown alignment="center">
                                <CDropdownToggle
                                    color="secondary"
                                    variant="outline"
                                    className="px-4 py-2"
                                    disabled={loadingPlayers}
                                >
                                    {loadingPlayers ? (
                                        <>
                                            <CSpinner size="sm" /> Loading Players...
                                        </>
                                    ) : selectedPlayer ? (
                                        <div className="d-inline-flex align-items-center">
                                            <CAvatar
                                                src={avatarMap[selectedPlayer.playerId] || ''}
                                                size="sm"
                                                className="me-2"
                                            />
                                            {selectedPlayer.playerFirstName}{' '}
                                            {selectedPlayer.playerLastName}
                                        </div>
                                    ) : (
                                        'Choose Player'
                                    )}
                                </CDropdownToggle>

                                <CDropdownMenu
                                    className="p-2"
                                    style={{ maxHeight: '250px', overflowY: 'auto' }}
                                >
                                    {players.map((player) => (
                                        <CDropdownItem
                                            key={player.playerId}
                                            onClick={() => handleSelect(player)}
                                            active={selectedPlayer?.playerId === player.playerId}
                                            className="d-flex align-items-center py-2"
                                        >
                                            <CAvatar
                                                src={avatarMap[player.playerId] || ''}
                                                size="sm"
                                                className="me-2"
                                            />
                                            <div className="text-start">
                                                <div className="fw-semibold">
                                                    {player.playerFirstName} {player.playerLastName}
                                                </div>
                                                <small className="text-muted">
                                                    “{player.playerNickname}”
                                                </small>
                                            </div>
                                        </CDropdownItem>
                                    ))}
                                    {!players.length && !loadingPlayers && (
                                        <div className="text-center text-muted py-2">
                                            No players available
                                        </div>
                                    )}
                                </CDropdownMenu>
                            </CDropdown>
                        </CCol>
                    </CRow>

                    {error && (
                        <CAlert color="danger" className="mt-3 text-center">
                            {error}
                        </CAlert>
                    )}

                    <div className="mt-4">
                        {loadingScores && (
                            <div className="text-center">
                                <CSpinner color="secondary" />{' '}
                                <span>Loading player stats...</span>
                            </div>
                        )}

                        {!loadingScores && selectedPlayer && sortedScores.length > 0 && (
                            <>
                                <h5 className="text-center mb-3">
                                    {selectedPlayer.playerNickname}’s Tournament Statistics
                                </h5>

                                <CTable striped hover responsive align="middle">
                                    <CTableHead color="dark">
                                        <CTableRow>
                                            <CTableHeaderCell onClick={() => handleSort('round.event.eventName')}>
                                                Event {renderSortIcon('round.event.eventName')}
                                            </CTableHeaderCell>
                                            <CTableHeaderCell onClick={() => handleSort('round.roundName')}>
                                                Round {renderSortIcon('round.roundName')}
                                            </CTableHeaderCell>
                                            <CTableHeaderCell onClick={() => handleSort('round.course.courseName')}>
                                                Course {renderSortIcon('round.course.courseName')}
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-end" onClick={() => handleSort('score')}>
                                                Score {renderSortIcon('score')}
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-end" onClick={() => handleSort('scoreToPar')}>
                                                To Par {renderSortIcon('scoreToPar')}
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-end" onClick={() => handleSort('pars')}>
                                                Pars {renderSortIcon('pars')}
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-end" onClick={() => handleSort('birdies')}>
                                                Birdies {renderSortIcon('birdies')}
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-end" onClick={() => handleSort('pointsEarned')}>
                                                Points {renderSortIcon('pointsEarned')}
                                            </CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>

                                    <CTableBody>
                                        {sortedScores.map((score, idx) => (
                                            <CTableRow key={idx}>
                                                <CTableDataCell>{score.round?.event?.eventName || 'Unknown'}</CTableDataCell>
                                                <CTableDataCell>{score.round?.roundName || 'N/A'}</CTableDataCell>
                                                <CTableDataCell>{score.round?.course?.courseName || 'N/A'}</CTableDataCell>
                                                <CTableDataCell className="text-end">{score.score ?? '-'}</CTableDataCell>
                                                <CTableDataCell className="text-end">{formatScoreToPar(score.scoreToPar)}</CTableDataCell>
                                                <CTableDataCell className="text-end">{score.pars ?? '-'}</CTableDataCell>
                                                <CTableDataCell className="text-end">{score.birdies ?? '-'}</CTableDataCell>
                                                <CTableDataCell className="text-end fw-semibold">{score.pointsEarned ?? '-'}</CTableDataCell>
                                            </CTableRow>
                                        ))}

                                        {/* ✅ Averages row */}
                                        {averages && (
                                            <CTableRow>
                                                <CTableDataCell colSpan={3} className="text-end fw-bold">
                                                    Averages:
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end fw-bold">{averages.score}</CTableDataCell>
                                                <CTableDataCell className="text-end fw-bold">{formatScoreToPar(averages.scoreToPar)}</CTableDataCell>
                                                <CTableDataCell className="text-end fw-bold">{averages.pars}</CTableDataCell>
                                                <CTableDataCell className="text-end fw-bold">{averages.birdies}</CTableDataCell>
                                                <CTableDataCell className="text-end fw-bold">{averages.pointsEarned}</CTableDataCell>
                                            </CTableRow>
                                        )}
                                    </CTableBody>
                                </CTable>
                            </>
                        )}

                        {!loadingScores && selectedPlayer && sortedScores.length === 0 && !error && (
                            <p className="text-center text-muted mt-3">No score data found for this player.</p>
                        )}
                    </div>
                </CCardBody>
            </CCard>

            {selectedPlayer && (
                <PostScoreForm
                    selectedPlayer={selectedPlayer}
                    onScorePosted={() => setRefreshScores(prev => prev + 1)}
                />
            )}

        </>
    )
}

export default Scoring

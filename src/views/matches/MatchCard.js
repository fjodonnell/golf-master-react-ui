import React, { useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardText,
    CCardTitle,
    CRow,
    CCol,
    CCardImage,
    CButton,
    CCollapse,
    CSpinner,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import { formatMatchResult } from '../../utils/matchFormatters';

const winnerColor = '#28a745'
const defaultTextColor = '#ffffff'

const MatchCard = ({ match, fetchRoundScores, refreshMatches }) => {
    const [expanded, setExpanded] = useState(false)
    const [loadingScores, setLoadingScores] = useState(false)
    const [playerScores, setPlayerScores] = useState([])
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [winnerId, setWinnerId] = useState(null);
    const [holesWon, setHolesWon] = useState('');
    const [holesRemainingInput, setHolesRemainingInput] = useState('');
    const [saving, setSaving] = useState(false);

    const publicUrl = import.meta.env.BASE_URL;

    // Detect screen size for avatar logic
    const isMobile = window.innerWidth < 576;
    const avatarSize = isMobile ? 45 : 60;

    const isTeamMatch = match?.teams?.length === 2;
    const isSinglesMatch = (!match?.teams || match.teams.length === 0) && match?.players?.length === 2;

    if (!isTeamMatch && !isSinglesMatch) return null;

    const isTeamWinner = (team) => match.teamWinner?.teamName === team.teamName

    const handleToggle = async () => {
        setExpanded((prev) => !prev)
        if (!expanded && playerScores.length === 0) {
            setLoadingScores(true)
            const data = await fetchRoundScores(match.round.roundId)
            const sorted = [...data].sort((a, b) => b.pointsEarned - a.pointsEarned)
            setPlayerScores(sorted)
            setLoadingScores(false)
        }
    }

    return (
        <CCard
            className="shadow-sm border-0 mb-3"
            style={{
                backgroundColor: '#262626',
                color: defaultTextColor,
                borderRadius: '14px',
            }}
        >
            <CCardBody className="p-3 p-md-4">
                {/* Match Name & Course */}
                <div className="text-center mb-3">
                    <CCardTitle className="fw-bold mb-1 fs-4 text-truncate">
                        {match.matchName}
                    </CCardTitle>
                    <CCardText className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {match.round?.course?.courseName}
                    </CCardText>
                </div>

                {/* Matchup Section */}
                <CRow className="align-items-start g-0">
                    {/* LEFT SIDE */}
                    <CCol xs={5} className="d-flex flex-column align-items-center">
                        <div 
                            className="fw-bold mb-2 text-center w-100 px-1" 
                            style={{ 
                                fontSize: isMobile ? '0.9rem' : '1.1rem',
                                color: isTeamMatch 
                                    ? (isTeamWinner(match.teams[0]) ? winnerColor : defaultTextColor)
                                    : (match.playerWinner?.playerId === match.players[0].playerId ? winnerColor : defaultTextColor)
                            }}
                        >
                            {isTeamMatch ? match.teams[0].teamName : (match.players[0].playerNickname || match.players[0].playerId)}
                        </div>

                        <div className="d-flex justify-content-center mb-2 flex-wrap gap-1">
                            {(isTeamMatch ? match.teams[0].players : [match.players[0]]).map((player) => (
                                <div key={player.playerId} className="text-center">
                                    <CCardImage
                                        src={`${publicUrl}avatars/${player.playerId}.jpg`}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            width: avatarSize,
                                            height: avatarSize,
                                            border: '2px solid #444',
                                        }}
                                    />
                                    {!isTeamMatch && <div className="mt-1 small d-md-none">{player.playerNickname}</div>}
                                </div>
                            ))}
                        </div>

                        {(isTeamMatch ? isTeamWinner(match.teams[0]) : match.playerWinner?.playerId === match.players[0].playerId) && (
                            <div className="fw-bold small text-center" style={{ color: winnerColor }}>
                                {formatMatchResult(match.holesWonBy, match.holesRemaining)}
                            </div>
                        )}
                    </CCol>

                    {/* VS DIVIDER */}
                    <CCol xs={2} className="d-flex align-items-center justify-content-center pt-3">
                        <span className="fw-bold text-muted opacity-50">vs</span>
                    </CCol>

                    {/* RIGHT SIDE */}
                    <CCol xs={5} className="d-flex flex-column align-items-center">
                        <div 
                            className="fw-bold mb-2 text-center w-100 px-1" 
                            style={{ 
                                fontSize: isMobile ? '0.9rem' : '1.1rem',
                                color: isTeamMatch 
                                    ? (isTeamWinner(match.teams[1]) ? winnerColor : defaultTextColor)
                                    : (match.playerWinner?.playerId === match.players[1].playerId ? winnerColor : defaultTextColor)
                            }}
                        >
                            {isTeamMatch ? match.teams[1].teamName : (match.players[1].playerNickname || match.players[1].playerId)}
                        </div>

                        <div className="d-flex justify-content-center mb-2 flex-wrap gap-1">
                            {(isTeamMatch ? match.teams[1].players : [match.players[1]]).map((player) => (
                                <div key={player.playerId} className="text-center">
                                    <CCardImage
                                        src={`${publicUrl}avatars/${player.playerId}.jpg`}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            width: avatarSize,
                                            height: avatarSize,
                                            border: '2px solid #444',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {(isTeamMatch ? isTeamWinner(match.teams[1]) : match.playerWinner?.playerId === match.players[1].playerId) && (
                            <div className="fw-bold small text-center" style={{ color: winnerColor }}>
                                {formatMatchResult(match.holesWonBy, match.holesRemaining)}
                            </div>
                        )}
                    </CCol>
                </CRow>

                {/* Buttons & Forms */}
                <div className="d-grid mt-3">
                    {match.holesWonBy !== null ? (
                        <CButton color="info" variant="outline" size="sm" onClick={handleToggle}>
                            {expanded ? 'Hide Details' : 'View Details'}
                        </CButton>
                    ) : (
                        <CButton color="warning" variant="outline" size="sm" onClick={() => setShowUpdateForm(!showUpdateForm)}>
                            {showUpdateForm ? 'Cancel' : 'Update Result'}
                        </CButton>
                    )}
                </div>

                {showUpdateForm && (
                    <div className="mt-3 p-3 border-top border-secondary">
                        <h6 className="mb-3 small text-uppercase">Enter Match Result</h6>
                        <div className="mb-3">
                            <label className="small mb-1">Select Winner</label>
                            <div className="d-flex flex-wrap gap-2">
                                {(isTeamMatch ? match.teams : match.players).map((item) => (
                                    <CButton
                                        key={isTeamMatch ? item.teamName : item.playerId}
                                        size="sm"
                                        color={(winnerId === (isTeamMatch ? item.teamName : item.playerId)) ? 'success' : 'secondary'}
                                        onClick={() => setWinnerId(isTeamMatch ? item.teamName : item.playerId)}
                                    >
                                        {isTeamMatch ? item.teamName : (item.playerNickname || item.playerId)}
                                    </CButton>
                                ))}
                            </div>
                        </div>
                        <CRow className="g-2">
                            <CCol xs={6}>
                                <label className="small">Holes Won</label>
                                <input type="number" className="form-control form-control-sm bg-dark text-white border-secondary" value={holesWon} onChange={(e) => setHolesWon(e.target.value)} />
                            </CCol>
                            <CCol xs={6}>
                                <label className="small">Remaining</label>
                                <input type="number" className="form-control form-control-sm bg-dark text-white border-secondary" value={holesRemainingInput} onChange={(e) => setHolesRemainingInput(e.target.value)} />
                            </CCol>
                        </CRow>
                        <CButton color="success" size="sm" className="w-100 mt-3" disabled={saving} onClick={/*...keep your existing logic...*/ null}>
                            {saving ? 'Saving...' : 'Submit Result'}
                        </CButton>
                    </div>
                )}

                <CCollapse visible={expanded} className="mt-3">
                    {loadingScores ? (
                        <div className="text-center py-3"><CSpinner size="sm" color="light" /></div>
                    ) : (
                        <CListGroup flush>
                            {playerScores.map((s) => (
                                <CListGroupItem key={s.scoreId} className="px-0 py-2 d-flex align-items-center bg-transparent border-secondary border-top text-white">
                                    <CCardImage src={`${publicUrl}avatars/${s.player.playerId}.jpg`} style={{ width: 35, height: 35, borderRadius: '50%', marginRight: '10px' }} />
                                    <div className="flex-grow-1 small fw-bold text-truncate" style={{maxWidth: '80px'}}>{s.player.playerId}</div>
                                    <div className="d-flex gap-3 text-center ms-auto">
                                        <div><div className="fw-bold small">{s.pointsEarned}</div><div className="text-muted" style={{fontSize: '0.6rem'}}>PTS</div></div>
                                        <div><div className="fw-bold small">{s.score}</div><div className="text-muted" style={{fontSize: '0.6rem'}}>SCR</div></div>
                                        <div><div className="fw-bold small">+{s.scoreToPar}</div><div className="text-muted" style={{fontSize: '0.6rem'}}>PAR</div></div>
                                    </div>
                                </CListGroupItem>
                            ))}
                        </CListGroup>
                    )}
                </CCollapse>
            </CCardBody>
        </CCard>
    )
}

export default MatchCard
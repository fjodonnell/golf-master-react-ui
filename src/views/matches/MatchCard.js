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
const avatarSize = 60

const MatchCard = ({ match, fetchRoundScores, refreshMatches }) => {
    const [expanded, setExpanded] = useState(false)
    const [loadingScores, setLoadingScores] = useState(false)
    const [playerScores, setPlayerScores] = useState([])
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [winnerId, setWinnerId] = useState(null);
    const [holesWon, setHolesWon] = useState('');
    const [holesRemainingInput, setHolesRemainingInput] = useState('');
    const [saving, setSaving] = useState(false);

    // Determine if it's a valid match type
    const isTeamMatch = match?.teams?.length === 2;
    const isSinglesMatch =
        (!match?.teams || match.teams.length === 0) &&
        match?.players?.length === 2;

    // If neither format applies, don't render
    if (!isTeamMatch && !isSinglesMatch) return null;

    const isTeamWinner = (team) => match.teamWinner?.teamName === team.teamName
     

    // Load scores on first expand
    const handleToggle = async () => {
        setExpanded((prev) => !prev)

        if (!expanded && playerScores.length === 0) {
            setLoadingScores(true)
            const data = await fetchRoundScores(match.round.roundId)
            // Sort by highest pointsEarned
            const sorted = [...data].sort((a, b) => b.pointsEarned - a.pointsEarned)
            setPlayerScores(sorted)
            setLoadingScores(false)
        }
    }

    return (
        <CCard
            className="shadow-sm"
            style={{
                backgroundColor: '#262626',   // lighter than before
                border: '1px solid #3a3a3a',
                color: defaultTextColor,
                borderRadius: '14px',
            }}
        >
            <CCardBody>
                {/* Match Name */}
                <CCardTitle className="fw-bold mb-2 fs-4">
                    {match.matchName}
                </CCardTitle>

                {/* Course Info */}
                <CCardText className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                    {match.round?.course?.courseName}, {match.round?.course?.courseCity},{' '}
                    {match.round?.course?.courseState}
                </CCardText>

                {/* Teams or Singles */}
                <CRow className="align-items-center text-center mb-3">
                    {/* LEFT SIDE */}
                    <CCol xs={5}>
                        {isTeamMatch ? (
                            <>
                                <p
                                    className="fw-bold mb-2 fs-5"
                                    style={{ color: isTeamWinner(match.teams[0]) ? winnerColor : defaultTextColor }}
                                >
                                    {match.teams[0].teamName}
                                </p>

                                <div className="d-flex justify-content-center mb-2" style={{ gap: '10px' }}>
                                    {match.teams[0].players.map((player) => (
                                        <div key={player.playerId} className="text-center">
                                            <CCardImage
                                                src={`src/assets/images/avatars/${player.playerId}.jpg`}
                                                style={{
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    width: avatarSize,
                                                    height: avatarSize,
                                                    border: '2px solid #444',
                                                }}
                                            />
                                            <div className="mt-2" style={{ fontSize: '0.8rem' }}>
                                                {player.playerNickname || player.playerFirstName}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isTeamWinner(match.teams[0]) && (
                                    <div className="fw-bold" style={{ color: winnerColor }}>
                                        {formatMatchResult(match.holesWonBy, match.holesRemaining)}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* SINGLES LEFT PLAYER */
                            <>
                                <p
                                    className="fw-bold mb-2 fs-5"
                                    style={{
                                        color:
                                            match.playerWinner?.playerId === match.players[0].playerId
                                                ? winnerColor
                                                : defaultTextColor,
                                    }}
                                >
                                    {match.players[0].playerNickname || match.players[0].playerId}
                                </p>

                                <div className="d-flex justify-content-center mb-2">
                                    <CCardImage
                                        src={`src/assets/images/avatars/${match.players[0].playerId}.jpg`}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            width: avatarSize,
                                            height: avatarSize,
                                            border: '2px solid #444',
                                        }}
                                    />
                                </div>

                                {match.playerWinner?.playerId === match.players[0].playerId && (
                                    <div className="fw-bold" style={{ color: winnerColor }}>
                                        {formatMatchResult(match.holesWonBy, match.holesRemaining)}
                                    </div>
                                )}
                            </>
                        )}
                    </CCol>

                    {/* VS */}
                    <CCol xs={2}>
                        <p className="fw-bold fs-4 mb-0">vs</p>
                    </CCol>

                    {/* RIGHT SIDE */}
                    <CCol xs={5}>
                        {isTeamMatch ? (
                            <>
                                <p
                                    className="fw-bold mb-2 fs-5"
                                    style={{ color: isTeamWinner(match.teams[1]) ? winnerColor : defaultTextColor }}
                                >
                                    {match.teams[1].teamName}
                                </p>

                                <div className="d-flex justify-content-center mb-2" style={{ gap: '10px' }}>
                                    {match.teams[1].players.map((player) => (
                                        <div key={player.playerId} className="text-center">
                                            <CCardImage
                                                src={`src/assets/images/avatars/${player.playerId}.jpg`}
                                                style={{
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    width: avatarSize,
                                                    height: avatarSize,
                                                    border: '2px solid #444',
                                                }}
                                            />
                                            <div className="mt-2" style={{ fontSize: '0.8rem' }}>
                                                {player.playerNickname || player.playerFirstName}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isTeamWinner(match.teams[1]) && (
                                    <div className="fw-bold" style={{ color: winnerColor }}>
                                        {formatMatchResult(match.holesWonBy, match.holesRemaining)}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* SINGLES RIGHT PLAYER */
                            <>
                                <p
                                    className="fw-bold mb-2 fs-5"
                                    style={{
                                        color:
                                            match.playerWinner?.playerId === match.players[1].playerId
                                                ? winnerColor
                                                : defaultTextColor,
                                    }}
                                >
                                    {match.players[1].playerNickname || match.players[1].playerId}
                                </p>

                                <div className="d-flex justify-content-center mb-2">
                                    <CCardImage
                                        src={`src/assets/images/avatars/${match.players[1].playerId}.jpg`}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            width: avatarSize,
                                            height: avatarSize,
                                            border: '2px solid #444',
                                        }}
                                    />
                                </div>

                                {match.playerWinner?.playerId === match.players[1].playerId && (
                                    <div className="fw-bold" style={{ color: winnerColor }}>
                                        {formatMatchResult(match.holesWonBy, match.holesRemaining)}
                                    </div>
                                )}
                            </>
                        )}
                    </CCol>
                </CRow>


                {/* Expand Button */}
                <div className="d-flex justify-content-center mt-3">
                    {match.holesWonBy ? (
                        // Match already played → Normal collapse toggle
                        <CButton color="info" variant="outline" onClick={handleToggle}>
                            {expanded ? 'Hide Match Details' : 'View Match Details'}
                        </CButton>
                    ) : (
                        // Match not played → Update Result
                        <CButton
                            color="warning"
                            variant="outline"
                            onClick={() => setShowUpdateForm((prev) => !prev)}
                        >
                            {showUpdateForm ? 'Cancel' : 'Update Result'}
                        </CButton>
                    )}

                </div>
                {showUpdateForm && (
                    <div
                        className="mt-3 p-3"
                        style={{
                            backgroundColor: '#2f2f2f',
                            borderRadius: '10px',
                            border: '1px solid #3a3a3a'
                        }}
                    >
                        <h6 className="mb-3">Enter Match Result</h6>

                        {/* Winner Selection */}
                        <div className="mb-3">
                            <label className="form-label">Select Winner</label>

                            {/* TEAM MATCH */}
                            {isTeamMatch && (
                                <div className="d-flex" style={{ gap: '10px' }}>
                                    {match.teams.map((team) => (
                                        <CButton
                                            key={team.teamName}
                                            color={winnerId === team.teamName ? 'success' : 'secondary'}
                                            variant="outline"
                                            onClick={() => setWinnerId(team.teamName)}
                                        >
                                            {team.teamName}
                                        </CButton>
                                    ))}
                                </div>
                            )}

                            {/* SINGLES MATCH */}
                            {isSinglesMatch && (
                                <div className="d-flex" style={{ gap: '10px' }}>
                                    {match.players.map((p) => (
                                        <CButton
                                            key={p.playerId}
                                            color={winnerId === p.playerId ? 'success' : 'secondary'}
                                            variant="outline"
                                            onClick={() => setWinnerId(p.playerId)}
                                        >
                                            {p.playerNickname || p.playerId}
                                        </CButton>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Holes Won */}
                        <div className="mb-3">
                            <label className="form-label">Holes Won By</label>
                            <input
                                type="number"
                                className="form-control"
                                value={holesWon}
                                onChange={(e) => setHolesWon(e.target.value)}
                            />
                        </div>

                        {/* Holes Remaining */}
                        <div className="mb-3">
                            <label className="form-label">Holes Remaining</label>
                            <input
                                type="number"
                                className="form-control"
                                value={holesRemainingInput}
                                onChange={(e) => setHolesRemainingInput(e.target.value)}
                            />
                        </div>

                        {/* Submit */}
                        <CButton
                            color="success"
                            onClick={async () => {
                                setSaving(true);

                                const updated = {
                                    ...match,
                                    holesWonBy: Number(holesWon),
                                    holesRemaining: Number(holesRemainingInput),
                                    teamWinner: null,
                                    teamLoser: null,
                                    playerWinner: null,
                                    playerLoser: null,
                                };

                                // TEAM MATCH LOGIC
                                if (isTeamMatch) {
                                    const winner = match.teams.find(t => t.teamName === winnerId) || null;
                                    const loser = match.teams.find(t => t.teamName !== winnerId) || null;

                                    updated.teamWinner = winner;
                                    updated.teamLoser = loser;
                                }

                                // SINGLES MATCH LOGIC
                                if (isSinglesMatch) {
                                    const winner = match.players.find(p => p.playerId === winnerId) || null;
                                    const loser = match.players.find(p => p.playerId !== winnerId) || null;

                                    updated.playerWinner = winner;
                                    updated.playerLoser = loser;
                                }

                                await fetch(`http://localhost:8080/match/${match.matchId}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(updated),
                                });

                                if (typeof refreshMatches === 'function') {
                                    await refreshMatches();
                                }

                                setSaving(false);
                                setShowUpdateForm(false);
                            }}

                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Submit Result'}
                        </CButton>

                    </div>
                )}

                {/* Details Section */}
                <CCollapse visible={expanded} className="mt-3">
                    {loadingScores ? (
                        <div className="text-center py-4">
                            <CSpinner color="light" />
                        </div>
                    ) : (
                        <CListGroup flush>
                            {playerScores.map((s) => (
                                <CListGroupItem
                                    key={s.scoreId}
                                    className="d-flex align-items-center"
                                    style={{
                                        backgroundColor: '#2f2f2f',
                                        borderColor: '#3a3a3a',
                                        color: '#fff',
                                    }}
                                >
                                    {/* Avatar */}
                                    <CCardImage
                                        src={`src/assets/images/avatars/${s.player.playerId}.jpg`}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginRight: '15px',
                                        }}
                                    />

                                    {/* Player name */}
                                    <div className="flex-grow-1 fw-bold">{s.player.playerId}</div>

                                    {/* Stats aligned evenly */}
                                    <div
                                        className="d-flex justify-content-between"
                                        style={{ width: '200px', fontSize: '0.9rem' }}
                                    >
                                        <div className="text-center">
                                            <div className="fw-bold">{s.pointsEarned}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Points</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="fw-bold">{s.score}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Score</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="fw-bold">+{s.scoreToPar}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>To Par</div>
                                        </div>

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

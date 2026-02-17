import React, { useEffect, useState } from 'react';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
} from '@coreui/react';
import { formatMatchResult } from '../../utils/matchFormatters';

export const MatchResultsTable = ({ eventName }) => {
    const [matches, setMatches] = useState([]);

    // Fetch match data
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(
                    `https://golf-master-backend.onrender.com/match/eventName/${encodeURIComponent(eventName)}`
                );
                const data = await response.json();
                setMatches(data);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };

        fetchMatches();
    }, [eventName]);

    // Helper: get winner name based on which winner object exists
    const getWinnerName = (match) => {
        if (match.teamWinner) {
            return match.teamWinner.teamName;
        }
        if (match.playerWinner) {
            // Note: your Match.java used 'playerId' for individual players
            // Ensure your backend provides playerName or use playerId as a fallback
            return match.playerWinner.playerName || match.playerWinner.playerId || '';
        }
        return '';
    };

    // Helper: get loser name
    const getLoserName = (match) => {
        if (match.teamLoser) {
            return match.teamLoser.teamName;
        }
        if (match.playerLoser) {
            return match.playerLoser.playerName || match.playerLoser.playerId || '';
        }
        return '';
    };

    // Helper: get team color class
    const getTeamColor = (teamName) => {
        if (teamName === 'Cardinals') return 'text-danger';
        if (teamName === 'Eagles') return 'text-warning';
        return '';
    };

    return (
        <CCard className="mb-4">
            <CCardBody>
                <CRow>
                    <CCol sm={5}>
                        <h4 className="card-title mb-0">Match Results</h4>
                        <div className="small text-body-secondary">{eventName}</div>
                    </CCol>
                </CRow>
                <CTable hover striped responsive className="mt-3">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Match</CTableHeaderCell>
                            {/* Hide Round and Course on extra small screens, show on Medium (md) and up */}
                            <CTableHeaderCell className="d-none d-md-table-cell">Round</CTableHeaderCell>
                            <CTableHeaderCell className="d-none d-md-table-cell">Course</CTableHeaderCell>
                            <CTableHeaderCell>Winner</CTableHeaderCell>
                            <CTableHeaderCell>Score</CTableHeaderCell>
                            <CTableHeaderCell>Loser</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {matches.map((match) => (
                            <CTableRow key={match.matchNumber} className="align-middle">
                                <CTableHeaderCell scope="row">{match.matchNumber}</CTableHeaderCell>

                                {/* Match the d-none logic in the data cells */}
                                <CTableDataCell className="d-none d-md-table-cell">
                                    {match.round?.roundName || ''}
                                </CTableDataCell>
                                <CTableDataCell className="d-none d-md-table-cell">
                                    {match.round?.course?.courseName || ''}
                                </CTableDataCell>

                                <CTableDataCell className={`${getTeamColor(match.teamWinner?.teamName)} fw-bold`}>
                                    {getWinnerName(match)}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {formatMatchResult(match.holesWonBy, match.holesRemaining)}
                                </CTableDataCell>
                                <CTableDataCell className={getTeamColor(match.teamLoser?.teamName)}>
                                    {getLoserName(match)}
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    );
};

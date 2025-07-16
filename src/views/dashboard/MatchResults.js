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

export const MatchResultsTable = ({ eventName }) => {
  const [matches, setMatches] = useState([]);

  // Fetch match data
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/match/eventName/${encodeURIComponent(eventName)}`
        );
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [eventName]);

  // Helper: get winner name
  const getWinnerName = (match) => {
    return match.matchNumber <= 5
      ? match.teamWinner?.teamName || ''
      : match.playerWinner?.playerName || '';
  };

  // Helper: get loser name
  const getLoserName = (match) => {
    return match.matchNumber <= 5
      ? match.teamLoser?.teamName || ''
      : match.playerLoser?.playerName || '';
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

        <CTable hover striped className="mt-3">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Match</CTableHeaderCell>
              <CTableHeaderCell scope="col">Round</CTableHeaderCell>
              <CTableHeaderCell scope="col">Course</CTableHeaderCell>
              <CTableHeaderCell scope="col">Winner</CTableHeaderCell>
              <CTableHeaderCell scope="col">Score</CTableHeaderCell>
              <CTableHeaderCell scope="col">Loser</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {matches.map((match) => (
              <CTableRow key={match.matchNumber} className="align-middle">
                <CTableHeaderCell scope="row">{match.matchNumber}</CTableHeaderCell>
                <CTableDataCell>{match.round?.roundName || ''}</CTableDataCell>
                <CTableDataCell>{match.round?.course?.courseName || ''}</CTableDataCell>
                <CTableDataCell className={`${getTeamColor(match.teamWinner?.teamName)} fw-bold`}>
                  {getWinnerName(match)}
                </CTableDataCell>
                <CTableDataCell>
                  {match.holesWonBy != null && match.holesRemaining != null
                    ? `${match.holesWonBy} & ${match.holesRemaining}`
                    : ''}
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

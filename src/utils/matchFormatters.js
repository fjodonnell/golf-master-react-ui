export const formatMatchResult = (holesWonBy, holesRemaining) => {
    if (holesWonBy == null || holesRemaining == null) return '';
  
    if (holesWonBy === 0) return 'AS';
  
    if (holesRemaining === 0) return `${holesWonBy} UP`;
  
    return `${holesWonBy} & ${holesRemaining}`;
  };
  
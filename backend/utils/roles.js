exports.getUserRole = (attributes) => {
    const primaryAffiliation = attributes['cas:eduPersonPrimaryAffiliation'][0];
    const virginiaTechAffiliation = attributes['cas:virginiaTechAffiliation'];
  
    if (primaryAffiliation === 'faculty' || (virginiaTechAffiliation && virginiaTechAffiliation.includes('VT-FACULTY'))) {
      return 'professor';
    } else if (primaryAffiliation === 'student' || (virginiaTechAffiliation && virginiaTechAffiliation.includes('VT-STUDENT'))) {
      return 'student';
    }
    return 'unknown';
  };
const CAS_SERVICE_URL = 'https://crescendo.cs.vt.edu:8080/auth/Dashboard';
const CAS_VALIDATE_URL = 'https://login.vt.edu/profile/cas/serviceValidate';

function getUserRole(attributes) {
  const primaryAffiliation = attributes['cas:eduPersonPrimaryAffiliation'][0];
  const virginiaTechAffiliation = attributes['cas:virginiaTechAffiliation'];

  if (primaryAffiliation === 'faculty' || (virginiaTechAffiliation && virginiaTechAffiliation.includes('VT-FACULTY'))) {
    return 'professor';
  } else if (primaryAffiliation === 'student' || (virginiaTechAffiliation && virginiaTechAffiliation.includes('VT-STUDENT'))) {
    return 'student';
  }
  return 'unknown';
}

module.exports = {
  CAS_SERVICE_URL,
  CAS_VALIDATE_URL,
  getUserRole,
};

const axios = require('axios');
const xml2js = require('xml2js');
const User = require('../models/user');
const { CAS_VALIDATE_URL, CAS_SERVICE_URL, getUserRole } = require('../utils/casUtils');

exports.handleDashboard = async (req, res) => {
  console.log('Request received at /Dashboard');
  console.log('Session data:', req.session);
  console.log('User data:', req.session.user);

  if (req.session.user) {
    return redirectUser(req, res, req.session.user.role);
  }

  const { ticket } = req.query;
  if (!ticket) {
    return res.redirect(`https://login.vt.edu/cas/login?service=${encodeURIComponent(CAS_SERVICE_URL)}`);
  }

  try {
    const response = await axios.get(CAS_VALIDATE_URL, {
      params: {
        ticket,
        service: CAS_SERVICE_URL
      }
    });

    console.log('CAS response received'); 

    const user = await parseCasResponse(response.data);
    console.log('Parsed CAS response:', user);
    const pid = user['cas:user'][0];
    const attributes = user['cas:attributes'][0];
    const email = attributes['cas:eduPersonPrincipalName'][0];
    const role = getUserRole(attributes);

    req.session.user = { pid, email, role };
    let dbUser = await User.findOne({ email: email });
    if (!dbUser) {
      dbUser = new User({ pid, email, isFirstLogin: true });
      await dbUser.save();
      req.session.user.isFirstLogin = true;
    } else {
      req.session.user.name = dbUser.name;
      req.session.user.isFirstLogin = false;
    }

    console.log('Redirecting user based on role:', role); 
    redirectUser(req, res, role);
  } catch (error) {
    console.error('CAS ticket validation failed:', error);
    res.status(500).send('Ticket validation failed');
  }
};

exports.checkSession = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('User not authenticated');
  }

  res.status(200).json({
    user: req.session.user
  });
};

const parseCasResponse = (data) => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      if (err) {
        return reject(err);
      }
      try {
        const user = result['cas:serviceResponse']['cas:authenticationSuccess'][0];
        resolve(user);
      } catch (error) {
        reject(new Error('CAS authentication failed'));
      }
    });
  });
};




const redirectUser = (req, res, role) => {
  if (role === 'studentssss') {
    console.log("Redirecting to student page....");
    return res.redirect('https://crescendo.cs.vt.edu/Courses');
  } else if (role === 'student') {
    console.log("Redirecting to faculty page....");
    return res.redirect('https://crescendo.cs.vt.edu/Dashboard');
  } else {
    return res.status(403).send('Access denied');
  }
};
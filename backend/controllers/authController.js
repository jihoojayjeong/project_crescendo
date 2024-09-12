const axios = require('axios');
const xml2js = require('xml2js');
const User = require('../models/user');
const { CAS_VALIDATE_URL, CAS_SERVICE_URL, getUserRole } = require('../utils/casUtils');

exports.handleAuthentication = async (req, res) => {
  console.log('handleAuthentication called');
  console.log('Request query:', req.query);
  if(process.env.NODE_ENV === 'development') {
    req.session.user = {
      pid: 'test_pid',
      email: 'test@vt.edu',
      role: 'student'
    };
    req.session.user_id = 'test_pid';
    
    return redirectUserBasedOnRole(req, res, req.session.user.role);
  }

  if (req.session.user) {
    return redirectUserBasedOnRole(req, res, req.session.user.role);
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
    const user = await parseCasResponse(response.data);
    const pid = user['cas:user'][0];
    const attributes = user['cas:attributes'][0];
    const email = attributes['cas:eduPersonPrincipalName'][0];
    const role = getUserRole(attributes);

    req.session.user = { pid, email, role };
    req.session.user_id = pid;
    let dbUser = await User.findOne({ email: email });
    if (!dbUser) {
      dbUser = new User({ pid, email, isFirstLogin: true });
      await dbUser.save();
      req.session.user.isFirstLogin = true;
    } else {
      req.session.user.name = dbUser.name;
      req.session.user.isFirstLogin = false;
    }

    redirectUserBasedOnRole(req, res, role);
  } catch (error) {
    console.error('CAS ticket validation failed:', error);
    res.status(500).send('Ticket validation failed');
  }
};

exports.checkSession = (req, res) => {
  console.log('checkSession called');
  if (!req.session.user) {
    console.log('No user in session');
    return res.status(200).json({ isAuthenticated: false });
  }

  console.log('User in session:', req.session.user);
  res.status(200).json({
    isAuthenticated: true,
    user: req.session.user
  });
};


exports.handleLogout = (req, res) => {
  console.log('handleLogout called');
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

const redirectUserBasedOnRole = (req, res, role) => {
  const redirectBaseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.PROD_REDIRECT_URL;
  console.log("Redirecting to:", redirectBaseUrl);
  if (role === 'student') {
    console.log("Redirecting to student page....");
    return res.redirect(`${redirectBaseUrl}/Dashboard`);
  } else if (role === 'faculty') {
    console.log("Redirecting to faculty page....");
    return res.redirect(`${redirectBaseUrl}/Courses`);
  } else {
    return res.status(403).send('Access denied');
  }
};

exports.fakeLogin = async (req, res) => {
  console.log("HERE in FAKE LOGIN!!!");
  try {
    const { role } = req.body;
    if (req.session.user) {
      console.log("Session already exists:", req.session.user);
      return res.status(200).json({
        message: 'Already logged in',
        user: req.session.user
      });
    }

    const fakeUser = {
      pid: '12345678',
      role: role || 'student',
      name: 'John Doe',
      email: 'johndoe@local.dev',
      isFirstLogin: false,
    };

    req.session.user = fakeUser;
    req.session.user_id = fakeUser.pid;

    let dbUser = await User.findOne({ email: fakeUser.email });
    if (!dbUser) {
      dbUser = new User({ pid: fakeUser.pid, email: fakeUser.email, name: fakeUser.name, isFirstLogin: fakeUser.isFirstLogin });
      await dbUser.save();
    }

    res.status(200).json({
      message: 'Test login successful',
      user: fakeUser
    });
  } catch (error) {
    console.error('Fake login failed:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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

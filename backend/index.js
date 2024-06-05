require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const xml2js = require('xml2js'); 

const app = express();

const corsOptions = {
  origin: 'https://crescendo.cs.vt.edu',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, sameSite: 'none' }
}));

const CAS_SERVICE_URL = 'https://crescendo.cs.vt.edu/Dashboard';
const CAS_VALIDATE_URL = 'https://login.vt.edu/profile/cas/serviceValidate';

const PORT = process.env.PORT || 8080;
const HTTP_PORT = 80;
const httpsOptions = {
  key: fs.readFileSync('/home/sangwonlee/cert/key.pem'),
  cert: fs.readFileSync('/home/sangwonlee/cert/crescendo.cs.vt.edu.crt')
};

// const redirectToHTTPS = (req, res, next) => {
//   if (!req.secure) {
//     console.log('https://' + req.headers.host + req.url);
//     return res.redirect('https://' + req.headers.host + req.url);
//   }
//   next();
// };
// app.use(redirectToHTTPS);
//i have not specified 8080 , it is redirecting the request to 8080
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server started on https://localhost:${PORT}`);
});

const schemaData = mongoose.Schema({
  title: String,
  message: String,
}, {
  timestamps: true
});

const feedbackModel = mongoose.model("feedbacks", schemaData);
console.log('MongoDB URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err));

app.get('/Dashboard', async (req, res) => {
  const { ticket } = req.query;
  if (!ticket) {
    return res.redirect(CAS_SERVICE_URL);
  }

  try {
    const response = await axios.get(CAS_VALIDATE_URL, {
      params: {
        ticket,
        service: CAS_SERVICE_URL
      }
    });

    const parser = new xml2js.Parser();
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error('XML parsing error:', err);
        return res.status(500).send('CAS ticket validation failed');
      }

      const user = result['cas:serviceResponse']['cas:authenticationSuccess'][0];
      req.session.user = {
        username: user['cas:user'][0],
        attributes: user['cas:attributes'][0]
      };

      res.redirect('/Dashboard');
    });
  } catch (error) {
    console.error('CAS 티켓 검증 실패:', error);
    res.status(500).send('CAS 티켓 검증 실패');
  }
});

app.get('/Dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect(CAS_SERVICE_URL);
  }
  res.send('Dashboard');
});
//explain where I am running fe, and be, and my issue.
app.get('/api/user', (req, res) => {
  console.log('Received request for /api/user'); 
  if (!req.session.user) {
    console.log('No user in session');
    return res.status(401).send('User not authenticated');
  }
  console.log('User in session:', req.session.user);
  res.json(req.session.user); 
});

app.post("/saveFeedback", async (req, res) => {
  try {
    console.log('Received request:', req.body);

    if (!req.body.title || !req.body.message) {
      console.error('Validation error: Missing title or message');
      return res.status(400).json({ success: false, message: "Title and message are required fields" });
    }

    const data = new feedbackModel(req.body);
    await data.save();

    res.status(200).json({ success: true, message: "Feedback sent successfully" });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/getFeedback", async (req, res) => {
  try {
    const data = await feedbackModel.find({}, { title: 1, message: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

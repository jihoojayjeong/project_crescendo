require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const xml2js = require('xml2js');
const User = require('./models/user');

const app = express();

const corsOptions = {
  origin: 'https://crescendo.cs.vt.edu',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true}
}));

const CAS_SERVICE_URL = 'https://crescendo.cs.vt.edu:8080/Dashboard';
const CAS_VALIDATE_URL = 'https://login.vt.edu/profile/cas/serviceValidate';

const PORT = process.env.PORT || 8080;
const httpsOptions = {
  key: fs.readFileSync('/home/sangwonlee/cert/key.pem'),
  cert: fs.readFileSync('/home/sangwonlee/cert/crescendo.cs.vt.edu.crt')
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

const schemaData = mongoose.Schema({
  title: String,
  message: String,
}, {
  timestamps: true
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  studendPid: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const feedbackModel = mongoose.model("feedbackss", schemaData);
console.log('MongoDB URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err));

app.get('/Dashboard', async (req, res) => {
  console.log('Request received at /Dashboard');
  console.log('Session data:', req.session);
  console.log('User data:' , req.session.user);
  if (!req.session.user) {
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
      const parser = new xml2js.Parser();
      parser.parseString(response.data, async(err, result) => {
        console.log("Result : " , JSON.stringify(result)) 
        if (err) {
          console.error('XML parsing error:', err);
          return res.status(500).send('CAS ticket validation failed');
        }
        const user = result['cas:serviceResponse']['cas:authenticationSuccess'][0];
        const username = user['cas:user'][0];
        const attributes = user['cas:attributes'][0];
        const email = attributes['cas:eduPersonPrincipalName'][0];
        const name = attributes['cas:displayName'] ? attributes['cas:displayName'][0] : username;
        req.session.user = { username, email, name};
        let dbUser = await User.findOne({ email: email });
        if (!dbUser) {
          // if it's first time a user logging in, save it to db and ask name
          console.log("1ST TIME USER LOGIN");
          dbUser = new User({ username, email });
          await dbUser.save();
          req.session.user.isFirstLogin = true;
        }
        else{
          req.session.user.name = dbUser.name;
          req.session.user.isFirstLogin = false;
          console.log("NOT 1ST TIME LOGIN");
        }
        res.redirect('https://crescendo.cs.vt.edu/Dashboard');
      });
    } catch (error) {
      console.error('CAS ticket validation failed123:', error);
      res.status(500).send('ticket validation failed');
    }
  } else {
    res.redirect('https://crescendo.cs.vt.edu/Dashboard');
  }
});

app.post('/saveName', async (req, res) => {
  const { firstName, lastName } = req.body;
  const email = req.session.user.email;

  // update user info in db
  await User.updateOne({ email: email }, { name: `${firstName} ${lastName}` });

  // update name in session
  req.session.user.name = `${firstName} ${lastName}`;
  req.session.user.isFirstLogin = false;

  res.status(200).json({ message: 'Name updated successfully' });
});

//This is for testing, make sure remove it once it's successful
app.get('/resetSession', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Failed to reset session');
    }
    res.send('Session reset');
  });
});


app.get('/getUser', (req, res) => {
  console.log('Received request for /api/user');
  if (!req.session.user) {
    console.log('No user in session');
    return res.status(401).send('User not authenticated');
  }
  console.log('User in session:', req.session.user);
  res.json({ username: req.session.user.username, email: req.session.user.email});
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

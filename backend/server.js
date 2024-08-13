require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { CAS_SERVICE_URL, CAS_VALIDATE_URL } = require('./utils/casUtils');

const app = express();

const corsOptions = {
  origin: ['https://crescendo.cs.vt.edu', 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'],
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
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: true }
}));


const PORT = process.env.PORT || 8080;
const httpsOptions = {
  key: fs.readFileSync('/home/sangwonlee/cert/key.pem'),
  cert: fs.readFileSync('/home/sangwonlee/cert/crescendo.cs.vt.edu.crt')
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err));

app.use('/auth', require('./routes/authRoutes'));
app.use('/courses', require('./routes/courseRoutes'));
app.use('/feedback', require('./routes/feedbackRoutes'));
app.use('/user', require('./routes/userRoutes'));

  
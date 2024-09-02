require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});
console.log(`Loaded environment variablessssss from .env.${process.env.NODE_ENV}`);
console.log("MONGO_URI_PROD:", process.env.MONGO_URI_PROD);
const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { CAS_SERVICE_URL, CAS_VALIDATE_URL } = require('./utils/casUtils');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoUri = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;
console.log("MONGO URI: ", mongoUri);
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: mongoUri }),
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 8080;

mongoose.connect(mongoUri)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err));
  
app.use('/auth', require('./routes/authRoutes'));
app.use('/courses', require('./routes/courseRoutes'));
app.use('/feedback', require('./routes/feedbackRoutes'));
app.use('/user', require('./routes/userRoutes'));


if (process.env.NODE_ENV === 'production') {
  const httpsOptions = {
    key: fs.readFileSync('/home/sangwonlee/cert/key.pem'),
    cert: fs.readFileSync('/home/sangwonlee/cert/crescendo.cs.vt.edu.crt')
  };
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server started on ${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server started on ${PORT}`);
  });
}


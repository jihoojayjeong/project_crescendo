require('dotenv').config();
const express = require('express');
const session = require('express-session');
const CASAuthentication = require('cas-authentication');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));

  const cas = new CASAuthentication({
    cas_url: 'https://login.vt.edu/profile/cas',
    service_url: 'http://cs.vt.edu:8080',  // 서비스 URL
    cas_version: '2.0',
    renew: false,
    is_dev_mode: false
  });

  app.use(cas.bounce);

const PORT = process.env.PORT || 8080;

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
        console.log("Connected to db")
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
          });
    })
    .catch((err) => console.log(err))


app.post("/saveFeedback", async (req, res) => {
    try {
        console.log(req.body);

        if (!req.body.title || !req.body.message) {
            return res.status(400).json({ success: false, message: "Title and message are required fields" });
        }

        const data = new feedbackModel(req.body);
        await data.save();

        res.status(200).json({ success: true, message: "Data save successful" });
    } catch (error) {
        console.error(error);
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
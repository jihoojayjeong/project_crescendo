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
const MongoStore = require('connect-mongo');
const Course = require('./models/course');

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
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: true }
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

const feedbackModel = mongoose.model("feedbackss", schemaData);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err));

  app.post('/createCourse', async (req, res) => {
    const { name, term, crn} = req.body;
  
    if (!req.session.user) {
      return res.status(401).send('User not authenticated');
    }
  
    try {
      const newCourse = new Course({
        name,
        term,
        crn,
      });
  
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).send('Failed to create course');
    }
  });

  app.get('/getCourses', async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).send('Failed to fetch courses');
    }
  });


app.delete('/deleteCourse/:id', async (req, res) => {
  const courseId = req.params.id;

  if (!req.session.user) {
    return res.status(401).send('User not authenticated');
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).send('Course not found');
    }

    await Course.deleteOne({ _id: courseId });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).send('Failed to delete course');
  }
});

app.put('/updateCourse/:id', async (req, res) => {
  const courseId = req.params.id;
  const { name, term, crn } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, { name, term, crn }, { new: true });
    if (!updatedCourse) {
      return res.status(404).send('Course not found');
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).send('Failed to update course');
  }
});

app.get('/getCourse/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  try {
      const course = await Course.findById(courseId); 
      if (!course) {
          return res.status(404).json({ error: 'Course not found' });
      }
      res.json(course);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});


  

  app.get('/Dashboard', async (req, res) => {
    console.log('Request received at /Dashboard');
    console.log('Session data:', req.session);
    console.log('User data:', req.session.user);
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
        parser.parseString(response.data, async (err, result) => {
          if (err) {
            console.error('XML parsing error:', err);
            return res.status(500).send('CAS ticket validation failed');
          }
          const user = result['cas:serviceResponse']['cas:authenticationSuccess'][0];
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
  
          // 역할에 따라 적절한 URL로 리디렉션
          if (role === 'student') {
            console.log("Redirecting to student page....");
            return res.redirect('https://crescendo.cs.vt.edu/Courses');
          } else if (role === 'professor') {
            console.log("Redirecting to faculty page....");
            return res.redirect('https://crescendo.cs.vt.edu/Dashboard');
          } else {
            return res.status(403).send('Access denied');
          }
        });
  
      } catch (error) {
        console.error('CAS ticket validation failed:', error);
        return res.status(500).send('Ticket validation failed');
      }
    } else {
      const { role } = req.session.user;
      if (role === 'student') {
        return res.redirect('https://crescendo.cs.vt.edu/Courses');
      } else if (role === 'professor') {
        return res.redirect('https://crescendo.cs.vt.edu/Dashboard');
      } else {
        return res.status(403).send('Access denied');
      }
    }
  });
  


app.post('/saveName', async (req, res) => {
  const { firstName, lastName } = req.body;
  const email = req.session.user.email;

  await User.updateOne({ email: email }, { name: `${firstName} ${lastName}` });

  req.session.user.name = `${firstName} ${lastName}`;
  req.session.user.isFirstLogin = false;

  res.status(200).json({ message: 'Name updated successfully' });
});

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
  if (!req.session.user) {
    return res.status(401).send('User not authenticated');
  }
  res.json({
    pid: req.session.user.pid,
    email: req.session.user.email,
    role: req.session.user.role,
    name: req.session.user.name,
    isFirstLogin: req.session.user.isFirstLogin
  });
});

app.get('/getStudents', async (req, res) => {
  try {
    const students = await User.find({}, 'name email');
    const studentsWithRole = students.map(student => {
      const role = req.session.user.role || 'unknown';
      return { ...student._doc, role };
    });
    res.status(200).json(studentsWithRole);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

app.post("/saveFeedback", async (req, res) => {
  try {
    if (!req.body.title || !req.body.message) {
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

const mongoose = require('mongoose');
const User = require('../models/user');
const Course = require('../models/course');
require('dotenv').config({ path: './.env.development' });

const courseId = '66c514df6f1cae1379217c1b';

async function addUsersToCourse() {
  try {
    await mongoose.connect(process.env.MONGO_URI_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({});

    const course = await Course.findById(courseId);
    if (!course) {
      console.error('Course not found');
      process.exit(1);
    }

    for (let user of users) {
      if (!course.students.includes(user.pid)) {
        course.students.push(user.pid);
      }
    }

    await course.save();
    console.log('All users added to course successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error adding users to course:', error);
    process.exit(1);
  }
}

addUsersToCourse();

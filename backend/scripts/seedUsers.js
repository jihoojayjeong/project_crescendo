const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config({ path: './.env.development' });
console.log('MONGODB_URI:', process.env.MONGO_URI_DEV);

const users = [
  { pid: '10000001', name: 'Student 1', email: 'student1@vt.edu', role: 'student' },
  { pid: '10000002', name: 'Student 2', email: 'student2@vt.edu', role: 'student' },
  { pid: '10000003', name: 'Student 3', email: 'student3@vt.edu', role: 'student' },
  { pid: '10000004', name: 'Student 4', email: 'student4@vt.edu', role: 'student' },
  { pid: '10000005', name: 'Student 5', email: 'student5@vt.edu', role: 'student' },
  { pid: '10000006', name: 'Student 6', email: 'student6@vt.edu', role: 'student' },
  { pid: '10000007', name: 'Student 7', email: 'student7@vt.edu', role: 'student' },
  { pid: '10000008', name: 'Student 8', email: 'student8@vt.edu', role: 'student' },
  { pid: '10000009', name: 'Student 9', email: 'student9@vt.edu', role: 'student' },
  { pid: '10000010', name: 'Student 10', email: 'student10@vt.edu', role: 'student' },
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    for (let user of users) {
      await User.findOneAndUpdate(
        { email: user.email },
        user,
        { upsert: true, new: true }
      );
    }

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating seed data:', error);
    process.exit(1);
  }
}

seedUsers();

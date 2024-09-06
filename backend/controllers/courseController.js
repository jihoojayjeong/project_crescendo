const Course = require('../models/course');
const User = require('../models/user'); 
const { v4: uuidv4 } = require('uuid'); 
const mongoose = require('mongoose');

exports.createCourse = async (req, res) => {
  const { name, term, crn } = req.body;

  if (!req.session.user) {
    return res.status(401).send('User not authenticated');
  }

  try {
    const uniqueCode = uuidv4();
    const newCourse = new Course({ name, term, crn, uniqueCode});
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).send('Failed to create course');
  }
};

exports.register = async (req, res) => {
  const { uniqueCode } = req.body;
  const userPid = req.session.user.pid;

  try {
    const course = await Course.findOne({ uniqueCode });
    if (!course) {
      return res.status(404).send('Course not found');
    }

    if (course.students.includes(userPid)) {
      return res.status(400).send('User already registered for this course');
    }

    course.students.push(userPid);
    await course.save();
    res.status(200).json({ message: 'Successfully registered for the course', course });
  } catch (error) {
    console.error('Error registering course:', error);
    res.status(500).json({ message: 'Failed to register course' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Failed to fetch courses');
  }
};

exports.getRegisteredCourses = async (req, res) => {
  const userId = req.session.user_id;
  try {
    const courses = await Course.find({ students: userId });
    res.status(200).json(courses);
  } catch(error) {
    onsole.error('Error fetching user courses:', error);
    res.status(500).send('Failed to fetch user courses');
  }
};

exports.getCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.session.user.pid;

  try {
    const course = await Course.findById(courseId).populate('groups.members', 'name email pid');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const courseData = course.toObject();

    // Find the group that the user belongs to in this course
    const userGroup = courseData.groups.find(group => 
      group.members.some(member => member.pid === userId)
    );

    courseData.userGroup = userGroup ? userGroup.groupNumber.toString() : 'Not assigned';

    res.json(courseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCourse = async (req, res) => {
  const courseId = req.params.courseId;
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
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;

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
};

exports.getStudentsInCourse = async(req, res) => {
  const courseId = req.params.courseId;

  try{
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({message : 'course not found'});
    }

    const students = await User.find({ pid : { $in : course.students}}, 'name email');

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
}

exports.deleteStudentFromCourse = async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    const student = await User.findById(studentId)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const studentPid = student.pid; 

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.students = course.students.filter(pid => pid !== studentPid);
    await course.save();

    res.status(200).json({ message: 'Student removed from course successfully' });
  } catch (error) {
    console.error('Error removing student from course:', error);
    res.status(500).json({ message: 'Failed to remove student from course' });
  }
};

exports.createGroups = async (req, res) => {
  const { courseId } = req.params;
  const { groupSize } = req.body //This refers the # of students in each group
  try {
    const course = await Course.findById(courseId).populate('students');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    //Fetch student id
    const studentIds = course.students;

    // shuffle students
    const shuffledStudents = studentIds.sort(() => Math.random() - 0.5);

    // splits into groups
    let groups = [];
    for (let i = 0; i < shuffledStudents.length; i += groupSize) {
      groups.push(shuffledStudents.slice(i, i + groupSize));
    }

    // save the group in the db
    course.groups = groups.map((group, index) => ({
      groupNumber: index + 1,
      members: group
    }));

    await course.save();

    res.status(200).json({ message: 'Groups created successfully', groups: course.groups });
  } catch (error) {
    console.error('Error creating groups:', error);
    res.status(500).json({ message: 'Failed to create groups' });
  }
};

exports.getGroups = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate('groups.members', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ groups: course.groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Failed to fetch groups' });
  }
};

exports.saveGroups = async (req, res) => {
  const { courseId } = req.params;
  const { groups } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newGroups = groups.map(group => ({
      groupNumber: group.groupNumber,
      members: group.members.map(member => new mongoose.Types.ObjectId(member._id))
    }));

    course.groups = newGroups;
    await course.save();

    // Populate the members data before sending the response
    await course.populate('groups.members', 'name email pid');

    res.status(200).json({ groups: course.groups });
  } catch (error) {
    console.error('Error saving groups:', error);
    res.status(500).json({ message: 'Failed to save groups', error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  const { courseId, groupId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.groups = course.groups.filter(group => group._id.toString() !== groupId);
    await course.save();

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Failed to delete group' });
  }
};

exports.addStudentToCourse = async (req, res) => {
  const { courseId } = req.params;
  const { studentEmail } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const student = await User.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (course.students.includes(student.pid)) {
      return res.status(400).json({ message: 'Student already in the course' });
    }

    course.students.push(student.pid);
    await course.save();

    res.status(200).json({ message: 'Student added to course successfully', student: { name: student.name, email: student.email } });
  } catch (error) {
    console.error('Error adding student to course:', error);
    res.status(500).json({ message: 'Failed to add student to course' });
  }
};


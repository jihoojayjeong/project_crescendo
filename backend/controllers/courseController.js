const Course = require('../models/course');
const { v4: uuidv4 } = require('uuid'); 

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
  const userId = req.session.user._id;

  try {
    const course = await Course.findOne({ uniqueCode });
    if (!course) {
      return res.status(404).send('Course not found');
    }

    if (course.students.includes(userId)) {
      return res.status(400).send('User already registered for this course');
    }

    course.students.push(userId);
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
    const course = await Course.findById(courseId).populate('students', 'name email');
    if (!course) {
      return res.status(404).json({message : 'course not found'});
    }

    res.status(200).json(course.students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
}


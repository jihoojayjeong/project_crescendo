const User = require('../models/user');

exports.saveName = async (req, res) => {
  const { firstName, lastName } = req.body;
  const email = req.session.user.email;

  await User.updateOne({ email: email }, { name: `${firstName} ${lastName}` });

  req.session.user.name = `${firstName} ${lastName}`;
  req.session.user.isFirstLogin = false;

  res.status(200).json({ message: 'Name updated successfully' });
};

exports.resetSession = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Failed to reset session');
    }
    res.send('Session reset');
  });
};

exports.getUser = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('User not authenticated');
  }
  res.json({
    pid: req.session.user.pid,
    email: req.session.user.email,
    role: req.session.user.role,
    name: req.session.user.name,
    isFirstLogin: req.session.user.isFirstLogin,
    group: req.session.user.group
  });
};

exports.getStudents = async (req, res) => {
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
};



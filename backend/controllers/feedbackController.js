const Feedback = require('../models/feedback');

exports.saveFeedback = async (req, res) => {
  try {
    if (!req.body.title || !req.body.message) {
      return res.status(400).json({ success: false, message: "Title and message are required fields" });
    }
    const data = new Feedback(req.body);
    await data.save();
    res.status(200).json({ success: true, message: "Feedback sent successfully" });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const data = await Feedback.find({}, { title: 1, message: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

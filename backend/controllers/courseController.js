const Course = require('../models/Course');
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course', error: err.message });
  }
};

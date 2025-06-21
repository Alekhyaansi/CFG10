const Course = require('../models/Course');

// POST /api/admin/courses
exports.createCourse = async (req, res) => {
  try {
    const { sessionNumber, title, description, videoUrl, resources } = req.body;

    const course = await Course.create({
      sessionNumber,
      title,
      description,
      videoUrl,
      resources,
      createdBy: req.user.id
    });

    res.status(201).json({ message: 'Course created', course });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course', error: err.message });
  }
};

// GET /api/admin/courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort('sessionNumber');
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

// PUT /api/admin/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course updated', course });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course', error: err.message });
  }
};

// DELETE /api/admin/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', error: err.message });
  }
};

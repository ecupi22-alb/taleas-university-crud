const Course = require('../models/Course');

// GET all courses (with student count or list)
exports.getAll = async (req, res) => {
  try {
    const courses = await Course.find().populate('students', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// POST create course
exports.create = async (req, res) => {
  try {
    const { title, code, description } = req.body;
    if (!title || !code) {
      return res.status(400).json({ message: 'Title and code are required' });
    }
    const course = new Course({
      title,
      code: code.trim().toUpperCase(),
      description: description || '',
      students: []
    });
    await course.save();
    res.status(201).json({ message: req.t('course_created'), course });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Course code already exists' });
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// PUT update course
exports.update = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('students', 'name email');
    if (!course) return res.status(404).json({ message: req.t('course_not_found') });
    res.json({ message: req.t('course_updated'), course });
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// DELETE course
exports.delete = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: req.t('course_not_found') });
    res.json({ message: req.t('course_deleted') });
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

const Student = require('../models/Student');

// GET all students (with populated courses for display)
exports.getAll = async (req, res) => {
  try {
    const students = await Student.find().populate('enrolledCourses', 'title code');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// POST create student
exports.create = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || age === undefined) {
      return res.status(400).json({ message: 'Name, email and age are required' });
    }
    const student = new Student({ name, email, age: Number(age), enrolledCourses: [] });
    await student.save();
    res.status(201).json({ message: req.t('student_created'), student });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// PUT update student
exports.update = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('enrolledCourses', 'title code');
    if (!student) return res.status(404).json({ message: req.t('student_not_found') });
    res.json({ message: req.t('student_updated'), student });
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// DELETE student
exports.delete = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: req.t('student_not_found') });
    res.json({ message: req.t('student_deleted') });
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// GET one student by id (for detail view with courses)
exports.getOne = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('enrolledCourses', 'title code description');
    if (!student) return res.status(404).json({ message: req.t('student_not_found') });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

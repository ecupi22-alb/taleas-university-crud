const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// POST enroll student in course
exports.enroll = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ message: req.t('invalid_ids') });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: req.t('invalid_ids') });
    }
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);
    if (!student || !course) {
      return res.status(404).json({ message: req.t('invalid_ids') });
    }
    // Check if already enrolled
    const existing = await Enrollment.findOne({ studentId, courseId });
    if (existing) {
      return res.status(400).json({ message: req.t('already_enrolled') });
    }
    const enrollment = new Enrollment({ studentId, courseId });
    await enrollment.save();
    // Update Student and Course arrays so they stay in sync
    student.enrolledCourses.push(courseId);
    await student.save();
    course.students.push(studentId);
    await course.save();
    res.status(201).json({ message: req.t('enrolled'), enrollment });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: req.t('already_enrolled') });
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// DELETE remove enrollment (body: studentId, courseId)
exports.unenroll = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ message: req.t('invalid_ids') });
    }
    const enrollment = await Enrollment.findOneAndDelete({ studentId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: req.t('enrollment_not_found') });
    }
    // Remove from Student and Course arrays
    await Student.findByIdAndUpdate(studentId, { $pull: { enrolledCourses: courseId } });
    await Course.findByIdAndUpdate(courseId, { $pull: { students: studentId } });
    res.json({ message: req.t('unenrolled') });
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

// GET all enrollments (for enrollments page - list with student and course names)
exports.getAll = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'title code')
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: req.t('server_error'), error: err.message });
  }
};

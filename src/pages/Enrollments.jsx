import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { getStudents, getCourses, getEnrollments, enroll, unenroll } from '../services/api';

function Enrollments({ showToast }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: null });
  const [form, setForm] = useState({ studentId: '', courseId: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [s, c, e] = await Promise.all([getStudents(), getCourses(), getEnrollments()]);
      setStudents(s);
      setCourses(c);
      setEnrollments(e);
    } catch (err) {
      showToast(err.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEnroll = () => {
    setForm({ studentId: '', courseId: '' });
    setModal({ open: true, mode: 'enroll' });
  };

  const handleEnroll = async () => {
    if (!form.studentId || !form.courseId) {
      showToast('Please select both student and course', 'error');
      return;
    }
    try {
      await enroll(form.studentId, form.courseId);
      showToast('Student enrolled successfully', 'success');
      setModal({ open: false });
      load();
    } catch (e) {
      showToast(e.message || 'Failed to enroll', 'error');
    }
  };

  const openUnenroll = (enr) => {
    setDeleteTarget(enr);
    setModal({ open: true, mode: 'unenroll' });
  };

  const handleUnenroll = async () => {
    if (!deleteTarget) return;
    try {
      await unenroll(deleteTarget.studentId._id, deleteTarget.courseId._id);
      showToast('Enrollment removed', 'success');
      setModal({ open: false });
      setDeleteTarget(null);
      load();
    } catch (e) {
      showToast(e.message || 'Failed to remove', 'error');
    }
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Enrollments</h2>
        <button type="button" className="btn btn-primary" onClick={openEnroll}>
          Enroll Student in Course
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="card-list">
            {enrollments.length === 0 ? (
              <p className="empty-msg">No enrollments yet. Enroll a student in a course!</p>
            ) : (
              enrollments.map((enr) => (
                <div key={enr._id} className="card">
                  <div className="card-body">
                    <h3>{enr.studentId?.name}</h3>
                    <p>{enr.studentId?.email}</p>
                    <p className="code">→ {enr.courseId?.title} ({enr.courseId?.code})</p>
                    <p className="small">Enrolled: {formatDate(enr.enrolledAt)}</p>
                  </div>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => openUnenroll(enr)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {modal.open && modal.mode === 'enroll' && (
        <Modal
          isOpen={true}
          onClose={() => setModal({ open: false })}
          title="Enroll Student in Course"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEnroll();
            }}
            className="form"
          >
            <div className="form-group">
              <label>Student *</label>
              <select
                value={form.studentId}
                onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Course *</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title} ({c.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setModal({ open: false })}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Enroll
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal.open && modal.mode === 'unenroll' && deleteTarget && (
        <Modal
          isOpen={true}
          onClose={() => setModal({ open: false })}
          title="Remove Enrollment"
        >
          <p>
            Remove <strong>{deleteTarget.studentId?.name}</strong> from{' '}
            <strong>{deleteTarget.courseId?.title}</strong>?
          </p>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => setModal({ open: false })}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleUnenroll}>
              Remove
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Enrollments;

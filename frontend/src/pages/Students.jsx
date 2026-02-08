import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} from '../services/api';

function Students({ showToast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: null, student: null });
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [errors, setErrors] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setList(data);
    } catch (e) {
      showToast(e.message || 'Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm({ name: '', email: '', age: '' });
    setErrors({});
    setModal({ open: true, mode: 'add', student: null });
  };

  const openEdit = (student) => {
    setForm({ name: student.name, email: student.email, age: String(student.age) });
    setErrors({});
    setModal({ open: true, mode: 'edit', student });
  };

  const openDelete = (student) => {
    setModal({ open: true, mode: 'delete', student });
  };

  const openDetail = async (id) => {
    try {
      const data = await getStudent(id);
      setModal({ open: true, mode: 'detail', student: data });
    } catch (e) {
      showToast(e.message || 'Failed to load student', 'error');
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.age.trim()) e.age = 'Age is required';
    else if (isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120) {
      e.age = 'Age must be between 1 and 120';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    try {
      await createStudent({ name: form.name.trim(), email: form.email.trim(), age: Number(form.age) });
      showToast('Student created successfully', 'success');
      setModal({ open: false });
      load();
    } catch (e) {
      showToast(e.message || 'Failed to create', 'error');
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      await updateStudent(modal.student._id, {
        name: form.name.trim(),
        email: form.email.trim(),
        age: Number(form.age)
      });
      showToast('Student updated successfully', 'success');
      setModal({ open: false });
      load();
    } catch (e) {
      showToast(e.message || 'Failed to update', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(modal.student._id);
      showToast('Student deleted successfully', 'success');
      setModal({ open: false });
      load();
    } catch (e) {
      showToast(e.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Students</h2>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          Add Student
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="card-list">
          {list.length === 0 ? (
            <p className="empty-msg">No students yet. Add one!</p>
          ) : (
            list.map((s) => (
              <div key={s._id} className="card">
                <div className="card-body">
                  <h3>{s.name}</h3>
                  <p>{s.email}</p>
                  <p>Age: {s.age}</p>
                  {s.enrolledCourses?.length > 0 && (
                    <p className="small">Courses: {s.enrolledCourses.map((c) => c.title).join(', ')}</p>
                  )}
                </div>
                <div className="card-actions">
                  <button type="button" className="btn btn-sm" onClick={() => openDetail(s._id)}>
                    View
                  </button>
                  <button type="button" className="btn btn-sm" onClick={() => openEdit(s)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => openDelete(s)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add / Edit modal */}
      {modal.open && (modal.mode === 'add' || modal.mode === 'edit') && (
        <Modal
          isOpen={true}
          onClose={() => setModal({ open: false })}
          title={modal.mode === 'add' ? 'Add Student' : 'Edit Student'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              modal.mode === 'add' ? handleCreate() : handleUpdate();
            }}
            className="form"
          >
            <div className="form-group">
              <label>Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
                disabled={modal.mode === 'edit'}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                placeholder="18"
              />
              {errors.age && <span className="form-error">{errors.age}</span>}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setModal({ open: false })}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {modal.mode === 'add' ? 'Create' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {modal.open && modal.mode === 'delete' && (
        <Modal
          isOpen={true}
          onClose={() => setModal({ open: false })}
          title="Delete Student"
        >
          <p>Are you sure you want to delete <strong>{modal.student?.name}</strong>? This cannot be undone.</p>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => setModal({ open: false })}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Detail modal */}
      {modal.open && modal.mode === 'detail' && modal.student && (
        <Modal
          isOpen={true}
          onClose={() => setModal({ open: false })}
          title="Student Details"
        >
          <div className="detail-box">
            <p><strong>Name:</strong> {modal.student.name}</p>
            <p><strong>Email:</strong> {modal.student.email}</p>
            <p><strong>Age:</strong> {modal.student.age}</p>
            <h4>Enrolled Courses</h4>
            {modal.student.enrolledCourses?.length > 0 ? (
              <ul>
                {modal.student.enrolledCourses.map((c) => (
                  <li key={c._id}>{c.title} ({c.code})</li>
                ))}
              </ul>
            ) : (
              <p className="muted">Not enrolled in any course yet.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Students;

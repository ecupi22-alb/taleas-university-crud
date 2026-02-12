import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';

function Courses({ showToast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: null, course: null });
  const [form, setForm] = useState({ title: '', code: '', description: '' });
  const [errors, setErrors] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setList(data);
    } catch (e) {
      showToast(e.message || 'Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm({ title: '', code: '', description: '' });
    setErrors({});
    setModal({ open: true, mode: 'add', course: null });
  };

  const openEdit = (course) => {
    setForm({
      title: course.title,
      code: course.code,
      description: course.description || ''
    });
    setErrors({});
    setModal({ open: true, mode: 'edit', course });
  };

  const openDelete = (course) => {
    setModal({ open: true, mode: 'delete', course });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.code.trim()) e.code = 'Code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    try {
      await createCourse({
        title: form.title.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim()
      });
      showToast('Course created successfully', 'success');
      setModal({ open: false });
      load();
    } catch (e) {
      showToast(e.message || 'Failed to create', 'error');
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      await updateCourse(modal.course._id, {
        title: form.title.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim()
      });
      showToast('Course updated successfully', 'success');
      setModal({ open: false });
      load();
    } catch (e) {
      showToast(e.message || 'Failed to update', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(modal.course._id);
      showToast('Course deleted successfully', 'success');
      setModal({ open: false });
      load();
    } catch (e) {
      showToast(e.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Courses</h2>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          Add Course
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="card-list">
          {list.length === 0 ? (
            <p className="empty-msg">No courses yet. Add one!</p>
          ) : (
            list.map((c) => (
              <div key={c._id} className="card">
                <div className="card-body">
                  <h3>{c.title}</h3>
                  <p className="code">{c.code}</p>
                  {c.description && <p className="small">{c.description}</p>}
                  {c.students?.length > 0 && (
                    <p className="small">Students: {c.students.length}</p>
                  )}
                </div>
                <div className="card-actions">
                  <button type="button" className="btn btn-sm" onClick={() => openEdit(c)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => openDelete(c)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {modal.open && (modal.mode === 'add' || modal.mode === 'edit') && (
        <Modal
          isOpen={true}
          onClose={() => setModal({ open: false })}
          title={modal.mode === 'add' ? 'Add Course' : 'Edit Course'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              modal.mode === 'add' ? handleCreate() : handleUpdate();
            }}
            className="form"
          >
            <div className="form-group">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Course title"
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Code *</label>
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="CS101"
                disabled={modal.mode === 'edit'}
              />
              {errors.code && <span className="form-error">{errors.code}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
              />
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

      {modal.open && modal.mode === 'delete' && (
        <Modal
          isOpen={true}
          onClose={() => setModal({ open: false })}
          title="Delete Course"
        >
          <p>Are you sure you want to delete <strong>{modal.course?.title}</strong>? This cannot be undone.</p>
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
    </div>
  );
}

export default Courses;

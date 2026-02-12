import React, { useState, useCallback } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Toast from './components/Toast';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';

// Simple toast state - pass showToast to children so they can trigger notifications
function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">Taleas University</h1>
        <nav className="nav">
          <NavLink to="/students" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Students
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Courses
          </NavLink>
          <NavLink to="/enrollments" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Enrollments
          </NavLink>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Students showToast={showToast} />} />
          <Route path="/students" element={<Students showToast={showToast} />} />
          <Route path="/courses" element={<Courses showToast={showToast} />} />
          <Route path="/enrollments" element={<Enrollments showToast={showToast} />} />
        </Routes>
      </main>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

export default App;

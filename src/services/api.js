// Base URL - Vite proxy forwards /api to backend
const BASE = '/api';

function getHeaders() {
  return {
    'Content-Type': 'application/json'
    // Optional: add Accept-Language: 'sq' for Albanian
  };
}

// Students
export async function getStudents() {
  const res = await fetch(`${BASE}/students`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getStudent(id) {
  const res = await fetch(`${BASE}/students/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createStudent(data) {
  const res = await fetch(`${BASE}/students`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

export async function updateStudent(id, data) {
  const res = await fetch(`${BASE}/students/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE}/students/${id}`, { method: 'DELETE', headers: getHeaders() });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

// Courses
export async function getCourses() {
  const res = await fetch(`${BASE}/courses`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createCourse(data) {
  const res = await fetch(`${BASE}/courses`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

export async function updateCourse(id, data) {
  const res = await fetch(`${BASE}/courses/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

export async function deleteCourse(id) {
  const res = await fetch(`${BASE}/courses/${id}`, { method: 'DELETE', headers: getHeaders() });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

// Enrollments
export async function getEnrollments() {
  const res = await fetch(`${BASE}/enroll`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function enroll(studentId, courseId) {
  const res = await fetch(`${BASE}/enroll`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ studentId, courseId })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

export async function unenroll(studentId, courseId) {
  const res = await fetch(`${BASE}/enroll`, {
    method: 'DELETE',
    headers: getHeaders(),
    body: JSON.stringify({ studentId, courseId })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

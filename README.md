# Taleas_Task2_Emiliano

A simple University Student Management app. You can manage students, courses, and enroll students in courses. Built with React (Vite) and Node/Express/MongoDB.

## Tech used

- **Frontend:** React 18, Vite, React Router, plain CSS (Flexbox), JavaScript (ES6)
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Features:** CRUD for students and courses, enroll/unenroll, modals and toasts (no alert/confirm), responsive layout

## How to run (step-by-step)

1. **Open a terminal** in the project folder `Taleas_Task2_Emiliano`.
2. **Start MongoDB** (if local): make sure the MongoDB service is running, or run `mongod`.
3. **Backend:**  
   `cd backend` → `npm install` → copy `.env.example` to `.env` if needed → `npm start`.  
   You should see "Server running on port 5000" and "MongoDB connected".
4. **Frontend:** open a **new** terminal, `cd frontend` → `npm install` → `npm run dev`.  
   Open <http://localhost:3000> in the browser.
5. Use **Students** to add students, **Courses** to add courses, **Enrollments** to enroll a student in a course.

### 1. MongoDB (details)

You need MongoDB running locally (or use MongoDB Atlas and put the connection string in `.env`).

- Install MongoDB or use a cloud DB.
- If local: start MongoDB (e.g. `mongod` or via Windows/Mac service).
- Default URI in project: `mongodb://localhost:27017/taleas_university`

### 2. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set:

- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/taleas_university` (or your Atlas URI)

Then:

```bash
npm start
```

Server runs on <http://localhost:5000>.

### 3. Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App runs on <http://localhost:3000>. Vite proxies `/api` to the backend so you don’t need to change URLs.

## Features

- **Students:** Create, list, update, delete; view details with enrolled courses
- **Courses:** Create, list, update, delete
- **Enrollments:** Enroll a student in a course; list enrollments; remove enrollment
- **UI:** Custom modal for add/edit/delete; toast notifications; loading spinner; no `alert()` or `confirm()`
- **API:** All responses support translation via `Accept-Language: sq` (Albanian) or default English

## API (REST)

- `GET/POST /api/students` — list, create  
- `GET/PUT/DELETE /api/students/:id` — get one, update, delete  
- `GET/POST /api/courses` — list, create  
- `PUT/DELETE /api/courses/:id` — update, delete  
- `GET/POST/DELETE /api/enroll` — list enrollments, enroll (body: studentId, courseId), remove (body: studentId, courseId)

## Project structure

backend/     → server, routes, controllers, models, middleware (translate), config (db)
frontend/    → Vite React app, pages (Students, Courses, Enrollments), components, services/api

## Common errors and fixes

- **Backend: "MongoDB connection error"** — MongoDB is not running or the URI is wrong. Start MongoDB or fix `MONGODB_URI` in `.env`.
- **Frontend: "Failed to load" / network errors** — Backend must be running on port 5000. Start it with `npm start` in the `backend` folder.
- **CORS errors** — Backend uses `cors()` for all origins. If you still see CORS issues, make sure you use the Vite dev server (port 3000) so the proxy is used; avoid opening the frontend by file://.
- **"Email already exists" / "Course code already exists"** — Use a different email or course code; these fields are unique.
- **"Student is already enrolled"** — That student is already in that course; check the Enrollments page before enrolling again.

## Author

Emiliano Çupi

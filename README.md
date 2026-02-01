# Care_Connect

#  Hospital Management System (MERN Stack)

A full-stack Hospital Management System built using the MERN stack (MongoDB, Express, React, Node.js).  
The system supports Staff, Doctors, and Patients, with real-time scheduling, conflict checks, dashboards, and calendar views.


##  Features

###  Authentication & Roles
- Role-based login (Staff / Doctor / Patient)
- Secure authentication using JWT
- Role-specific dashboards

---

###  Staff Dashboard
- View total doctors, patients, appointments, and surgeries
- Book appointments and surgeries
- Automatic conflict detection (doctor & patient)
- Today’s Appointments and Surgeries displayed side-by-side
- Delete appointments and surgeries
- Dashboard summary cards

---

###  Doctor Dashboard
- View only their own appointments and surgeries
- Live auto-sync (updates automatically)
- Status badges:
  -  Scheduled
  -  Rescheduled
  -  Completed
  -  Cancelled
- Clean and minimal UI

---

###  Doctor Schedule View
- Toggle between List View and Calendar View
- Calendar supports:
  - Monthly
  - Weekly
  - Daily views
- Appointments and surgeries displayed together
- Color-coded events

---

###  Smart Automation
- Past appointments and surgeries are auto-completed
- Live status updates without manual refresh
- Backend conflict checks before booking

---

##  Tech Stack

### Frontend
- React
- React Router
- Axios
- FullCalendar
- React Toastify
- CSS (custom dashboard styling)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

##  Project Structure


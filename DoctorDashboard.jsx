import './Dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const userId = localStorage.getItem('userId'); // User ID
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  /* ================= LOAD DOCTOR + DATA ================= */
  useEffect(() => {
    if (userId) {
      loadDoctorAndData();
    }
  }, [userId]);

  const loadDoctorAndData = async () => {
    try {
      // 1️⃣ Find doctor by userId
      const docRes = await axios.get('/api/doctors');
      const foundDoctor = docRes.data.find(d => d.userId === userId);

      if (!foundDoctor) return;

      setDoctor(foundDoctor);

      // 2️⃣ Load appointments & surgeries
      const [aRes, sRes] = await Promise.all([
        axios.get('/api/appointments'),
        axios.get('/api/surgeries')
      ]);

      setAppointments(
        aRes.data.filter(a => a.doctor?._id === foundDoctor._id)
      );

      setSurgeries(
        sRes.data.filter(s => s.doctor?._id === foundDoctor._id)
      );
    } catch (err) {
      console.error('Doctor dashboard load failed', err);
    }
  };

  /* ================= STATUS BADGE ================= */
  const statusBadge = (status = 'scheduled') => {
    const colors = {
      scheduled: '#22c55e',
      rescheduled: '#f59e0b',
      cancelled: '#ef4444',
      completed: '#3b82f6'
    };

    return (
      <span
        style={{
          background: colors[status] || '#6b7280',
          color: '#fff',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          textTransform: 'capitalize'
        }}
      >
        {status}
      </span>
    );
  };

  /* ================= AUTO-SYNC ================= */
  useEffect(() => {
    const interval = setInterval(loadDoctorAndData, 15000); // 15 sec live sync
    return () => clearInterval(interval);
  }, [doctor]);

  return (
    <div className="dashboard">
      <nav className="nav">
        <h1>{doctor ? `Dr. ${doctor.name} — Dashboard` : 'Doctor Dashboard'}</h1>
      </nav>

      <div className="content">
        {/* ================= APPOINTMENTS ================= */}
        <div className="section">
          <h2>Appointments</h2>
          <ul>
            {appointments.length === 0 && <li>No appointments</li>}
            {appointments.map(a => (
              <li key={a._id}>
                <span>
                  {a.patient?.name} — {new Date(a.date).toLocaleString()}
                </span>
                {statusBadge(a.status)}
              </li>
            ))}
          </ul>
        </div>

        {/* ================= SURGERIES ================= */}
        <div className="section">
          <h2>Surgeries</h2>
          <ul>
            {surgeries.length === 0 && <li>No surgeries</li>}
            {surgeries.map(s => (
              <li key={s._id}>
                <span>
                  {s.patient?.name} — {s.type} — {new Date(s.date).toLocaleString()}
                </span>
                {statusBadge(s.status)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

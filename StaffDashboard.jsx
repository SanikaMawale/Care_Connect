import './Dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardCards from '../components/DashboardCards';
import { toast } from 'react-toastify';

const StaffDashboard = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  const [appointment, setAppointment] = useState({
    doctor: '',
    patient: '',
    date: '',
    notes: ''
  });

  const [surgery, setSurgery] = useState({
    doctor: '',
    patient: '',
    type: '',
    date: '',
    notes: ''
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadBaseData();
  }, []);

  const loadBaseData = async () => {
    try {
      const [d, p] = await Promise.all([
        axios.get('/api/doctors'),
        axios.get('/api/patients')
      ]);

      setDoctors(d.data || []);
      setPatients(p.data || []);
      loadToday();
    } catch {
      toast.error('Failed to load dashboard data');
    }
  };

  const loadToday = async () => {
    try {
      const [a, s] = await Promise.all([
        axios.get('/api/appointments/today'),
        axios.get('/api/surgeries/today')
      ]);

      setAppointments(a.data || []);
      setSurgeries(s.data || []);
    } catch {
      toast.error('Failed to load today data');
    }
  };

  /* ================= DASHBOARD CARDS ================= */
  const cardsData = [
    { title: 'Total Doctors', value: doctors.length },
    { title: 'Total Patients', value: patients.length },
    { title: 'Appointments Today', value: appointments.length },
    { title: 'Surgeries Today', value: surgeries.length }
  ];

  /* ================= CONFLICT CHECK ================= */
  const hasAppointmentConflict = () => {
    return appointments.some(a => {
      const sameTime =
        new Date(a.date).getTime() === new Date(appointment.date).getTime();

      if (a.doctor?._id === appointment.doctor && sameTime) {
        toast.error('Doctor already has an appointment at this time');
        return true;
      }

      if (a.patient?._id === appointment.patient && sameTime) {
        toast.error('Patient already has an appointment at this time');
        return true;
      }

      return false;
    });
  };

  /* ================= ADD APPOINTMENT ================= */
  const addAppointment = async () => {
    if (!appointment.doctor || !appointment.patient || !appointment.date) {
      toast.warning('Please fill all appointment fields');
      return;
    }

    if (hasAppointmentConflict()) return;

    try {
      await axios.post('/api/appointments', appointment);
      toast.success('Appointment booked successfully');

      setAppointment({
        doctor: '',
        patient: '',
        date: '',
        notes: ''
      });

      loadToday();
    } catch {
      toast.error('Failed to book appointment');
    }
  };

  /* ================= DELETE APPOINTMENT ================= */
  const deleteAppointment = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;

    try {
      await axios.delete(`/api/appointments/${id}`);
      toast.success('Appointment deleted');
      loadToday();
    } catch {
      toast.error('Failed to delete appointment');
    }
  };

  /* ================= ADD SURGERY ================= */
  const addSurgery = async () => {
    if (!surgery.doctor || !surgery.patient || !surgery.type || !surgery.date) {
      toast.warning('Please fill all surgery fields');
      return;
    }

    try {
      await axios.post('/api/surgeries', surgery);
      toast.success('Surgery booked successfully');

      setSurgery({
        doctor: '',
        patient: '',
        type: '',
        date: '',
        notes: ''
      });

      loadToday();
    } catch {
      toast.error('Failed to book surgery');
    }
  };

  /* ================= DELETE SURGERY ================= */
  const deleteSurgery = async (id) => {
    if (!window.confirm('Delete this surgery?')) return;

    try {
      await axios.delete(`/api/surgeries/${id}`);
      toast.success('Surgery deleted');
      loadToday();
    } catch {
      toast.error('Failed to delete surgery');
    }
  };

  return (
    <div className="dashboard">
      {/* ================= NAVBAR ================= */}
      <nav className="nav">
        <h1>Staff Dashboard</h1>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
          <li onClick={() => navigate('/staff/doctors')}>Doctors</li>
          <li onClick={() => navigate('/staff/patients')}>Patients</li>
          <li onClick={() => navigate('/')}>Logout</li>
        </ul>
      </nav>

      <div className="content">
        {/* ================= CARDS ================= */}
        <DashboardCards cards={cardsData} />

        {/* 🔥 TWO COLUMN LAYOUT */}
        <div className="list-grid">
          {/* ================= APPOINTMENTS ================= */}
          <div className="section">
            <h2>Appointments (Today)</h2>

            <ul>
              {appointments.length === 0 && <li>No appointments today</li>}
              {appointments.map(a => (
                <li key={a._id}>
                  <span>{a.doctor?.name} → {a.patient?.name}</span>
                  <button onClick={() => deleteAppointment(a._id)}>❌</button>
                </li>
              ))}
            </ul>

            <select
              value={appointment.doctor}
              onChange={e =>
                setAppointment({ ...appointment, doctor: e.target.value })
              }
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>

            <select
              value={appointment.patient}
              onChange={e =>
                setAppointment({ ...appointment, patient: e.target.value })
              }
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={appointment.date}
              onChange={e =>
                setAppointment({ ...appointment, date: e.target.value })
              }
            />

            <textarea
              placeholder="Notes"
              value={appointment.notes}
              onChange={e =>
                setAppointment({ ...appointment, notes: e.target.value })
              }
            />

            <button onClick={addAppointment}>Add Appointment</button>
          </div>

          {/* ================= SURGERIES ================= */}
          <div className="section">
            <h2>Surgeries (Today)</h2>

            <ul>
              {surgeries.length === 0 && <li>No surgeries today</li>}
              {surgeries.map(s => (
                <li key={s._id}>
                  <span>{s.doctor?.name} → {s.patient?.name}</span>
                  <button onClick={() => deleteSurgery(s._id)}>❌</button>
                </li>
              ))}
            </ul>

            <select
              value={surgery.doctor}
              onChange={e =>
                setSurgery({ ...surgery, doctor: e.target.value })
              }
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>

            <select
              value={surgery.patient}
              onChange={e =>
                setSurgery({ ...surgery, patient: e.target.value })
              }
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <input
              placeholder="Surgery Type"
              value={surgery.type}
              onChange={e =>
                setSurgery({ ...surgery, type: e.target.value })
              }
            />

            <input
              type="datetime-local"
              value={surgery.date}
              onChange={e =>
                setSurgery({ ...surgery, date: e.target.value })
              }
            />

            <button onClick={addSurgery}>Add Surgery</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

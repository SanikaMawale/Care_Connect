import './Dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/* ✅ CALENDAR IMPORTS */
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const DoctorSchedule = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [view, setView] = useState('list');

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const [docRes, apptRes, surgRes] = await Promise.all([
        axios.get(`/api/doctors/${doctorId}`),
        axios.get('/api/appointments'),
        axios.get('/api/surgeries')
      ]);

      setDoctor(docRes.data);
      setAppointments(apptRes.data.filter(a => a.doctor?._id === doctorId));
      setSurgeries(surgRes.data.filter(s => s.doctor?._id === doctorId));
    } catch {
      toast.error('Failed to load doctor schedule');
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
          padding: '3px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          marginRight: '10px',
          textTransform: 'capitalize'
        }}
      >
        {status}
      </span>
    );
  };

  /* ================= ACTIONS ================= */
  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    await axios.patch(`/api/appointments/${id}/cancel`);
    toast.success('Appointment cancelled');
    loadSchedule();
  };

  const cancelSurgery = async (id) => {
    if (!window.confirm('Cancel this surgery?')) return;
    await axios.patch(`/api/surgeries/${id}/cancel`);
    toast.success('Surgery cancelled');
    loadSchedule();
  };

  const rescheduleAppointment = async (id) => {
    const newDate = prompt('Enter new date & time (YYYY-MM-DD HH:mm)');
    if (!newDate) return;
    await axios.patch(`/api/appointments/${id}/reschedule`, { date: newDate });
    toast.success('Appointment rescheduled');
    loadSchedule();
  };

  const rescheduleSurgery = async (id) => {
    const newDate = prompt('Enter new date & time (YYYY-MM-DD HH:mm)');
    if (!newDate) return;
    await axios.patch(`/api/surgeries/${id}/reschedule`, { date: newDate });
    toast.success('Surgery rescheduled');
    loadSchedule();
  };

  /* ================= CALENDAR EVENTS ================= */
  const calendarEvents = [
    ...appointments.map(a => ({
      id: a._id,
      title: `Appt: ${a.patient?.name}`,
      start: a.date,
      backgroundColor: '#22c55e',
      borderColor: '#22c55e'
    })),
    ...surgeries.map(s => ({
      id: s._id,
      title: `Surgery: ${s.patient?.name}`,
      start: s.date,
      backgroundColor: '#ef4444',
      borderColor: '#ef4444'
    }))
  ];

  return (
    <div className="dashboard">
      <nav className="nav">
        <h1>{doctor ? `Dr. ${doctor.name} — Schedule` : 'Doctor Schedule'}</h1>
        <ul>
          <li onClick={() => navigate(-1)}>Back</li>
        </ul>
      </nav>

      <div className="content">
        {/* 🔥 VIEW TOGGLE */}
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setView('list')}>List View</button>
          <button onClick={() => setView('calendar')} style={{ marginLeft: '10px' }}>
            Calendar View
          </button>
        </div>

        {/* ================= CALENDAR (MONTH / WEEK / DAY) ================= */}
        {view === 'calendar' && (
          <div className="section">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              height="auto"
            />
          </div>
        )}

        {/* ================= LIST VIEW ================= */}
        {view === 'list' && (
          <div className="list-grid">
            {/* APPOINTMENTS */}
            <div className="section">
              <h2>Appointments</h2>
              <ul>
                {appointments.length === 0 && <li>No appointments</li>}
                {appointments.map(a => {
                  const status = a.status || 'scheduled';
                  return (
                    <li key={a._id}>
                      <span>
                        {a.patient?.name} — {new Date(a.date).toLocaleString()}
                      </span>
                      <div>
                        {statusBadge(status)}
                        {['scheduled', 'rescheduled'].includes(status) && (
                          <>
                            <button onClick={() => rescheduleAppointment(a._id)}>⏰</button>
                            <button onClick={() => cancelAppointment(a._id)}>❌</button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* SURGERIES */}
            <div className="section">
              <h2>Surgeries</h2>
              <ul>
                {surgeries.length === 0 && <li>No surgeries</li>}
                {surgeries.map(s => {
                  const status = s.status || 'scheduled';
                  return (
                    <li key={s._id}>
                      <span>
                        {s.patient?.name} — {s.type} — {new Date(s.date).toLocaleString()}
                      </span>
                      <div>
                        {statusBadge(status)}
                        {['scheduled', 'rescheduled'].includes(status) && (
                          <>
                            <button onClick={() => rescheduleSurgery(s._id)}>⏰</button>
                            <button onClick={() => cancelSurgery(s._id)}>❌</button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedule;

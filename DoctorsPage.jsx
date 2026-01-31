import './Dashboard.css';
import { useState } from 'react';

const DoctorsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  const [appointmentData, setAppointmentData] = useState({
    doctor: '',
    patient: '',
    time: ''
  });

  const [surgeryData, setSurgeryData] = useState({
    doctor: '',
    patient: '',
    type: ''
  });

  const addAppointment = () => {
    if (!appointmentData.doctor || !appointmentData.patient) return;
    setAppointments([...appointments, appointmentData]);
    setAppointmentData({ doctor: '', patient: '', time: '' });
  };

  const addSurgery = () => {
    if (!surgeryData.doctor || !surgeryData.patient) return;
    setSurgeries([...surgeries, surgeryData]);
    setSurgeryData({ doctor: '', patient: '', type: '' });
  };

  return (
    <div className="dashboard">
      <nav className="nav">
        <h1>Doctors</h1>
        <ul>
          <li>Logout</li>
        </ul>
      </nav>

      <div className="content">
        <div className="section">
          <h3>Add Appointment</h3>
          <input
            placeholder="Doctor Name"
            value={appointmentData.doctor}
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, doctor: e.target.value })
            }
          />
          <input
            placeholder="Patient Name"
            value={appointmentData.patient}
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, patient: e.target.value })
            }
          />
          <input
            placeholder="Time"
            value={appointmentData.time}
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, time: e.target.value })
            }
          />
          <button onClick={addAppointment}>Add Appointment</button>

          <ul>
            {appointments.map((a, i) => (
              <li key={i}>
                {a.doctor} → {a.patient} ({a.time})
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Add Surgery</h3>
          <input
            placeholder="Doctor Name"
            value={surgeryData.doctor}
            onChange={(e) =>
              setSurgeryData({ ...surgeryData, doctor: e.target.value })
            }
          />
          <input
            placeholder="Patient Name"
            value={surgeryData.patient}
            onChange={(e) =>
              setSurgeryData({ ...surgeryData, patient: e.target.value })
            }
          />
          <input
            placeholder="Surgery Type"
            value={surgeryData.type}
            onChange={(e) =>
              setSurgeryData({ ...surgeryData, type: e.target.value })
            }
          />
          <button onClick={addSurgery}>Add Surgery</button>

          <ul>
            {surgeries.map((s, i) => (
              <li key={i}>
                {s.doctor} → {s.patient} ({s.type})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
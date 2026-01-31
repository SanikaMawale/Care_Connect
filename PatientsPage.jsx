import './Dashboard.css';
import { useState } from 'react';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [updateText, setUpdateText] = useState('');

  const addUpdate = () => {
    if (!patientName || !updateText) return;

    setPatients([
      ...patients,
      {
        name: patientName,
        update: updateText
      }
    ]);

    setPatientName('');
    setUpdateText('');
  };

  return (
    <div className="dashboard">
      <nav className="nav">
        <h1>Patients</h1>
        <ul>
          <li>Logout</li>
        </ul>
      </nav>

      <div className="content">
        <div className="section">
          <h3>Treatment Updates</h3>

          <input
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />

          <textarea
            placeholder="Write treatment update..."
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
          />

          <button onClick={addUpdate}>Save Update</button>

          <ul>
            {patients.map((p, i) => (
              <li key={i}>
                <strong>{p.name}</strong>: {p.update}
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Today's Doctors</h3>

          <h4>Appointments</h4>
          <p>(Will be auto-linked later)</p>

          <h4>Surgeries</h4>
          <p>(Will be auto-linked later)</p>
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
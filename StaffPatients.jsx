import '../Dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const StaffPatients = () => {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    medicalHistory: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const res = await axios.get('/api/patients');
    setPatients(res.data);
  };

  const addPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/patients', patientData);

      // ✅ SHOW GENERATED LOGIN
      setCredentials(res.data.login);

      setPatientData({
        name: '',
        age: '',
        gender: '',
        contact: '',
        address: '',
        medicalHistory: ''
      });

      setShowForm(false);
      fetchPatients();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Error adding patient');
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    await axios.delete(`/api/patients/${id}`);
    fetchPatients();
  };

  return (
    <div className="dashboard">
      <nav className="nav">
        <h1>Patients</h1>
      </nav>

      <div className="content">
        <div className="section">

          <h3>Patients List</h3>

          <ul>
            {patients.map(p => (
              <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{p.name} ({p.age}, {p.gender})</span>
                <button onClick={() => deletePatient(p._id)}>Delete</button>
              </li>
            ))}
          </ul>

          <button onClick={() => setShowForm(true)}>Add Patient</button>

          {showForm && (
            <form onSubmit={addPatient}>
              <input placeholder="Name" value={patientData.name}
                onChange={e => setPatientData({ ...patientData, name: e.target.value })} required />

              <input type="number" placeholder="Age" value={patientData.age}
                onChange={e => setPatientData({ ...patientData, age: e.target.value })} required />

              <input placeholder="Gender" value={patientData.gender}
                onChange={e => setPatientData({ ...patientData, gender: e.target.value })} required />

              <input placeholder="Contact" value={patientData.contact}
                onChange={e => setPatientData({ ...patientData, contact: e.target.value })} required />

              <input placeholder="Address" value={patientData.address}
                onChange={e => setPatientData({ ...patientData, address: e.target.value })} />

              <textarea placeholder="Medical History"
                value={patientData.medicalHistory}
                onChange={e => setPatientData({ ...patientData, medicalHistory: e.target.value })} />

              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          )}

          {/* ✅ SHOW GENERATED LOGIN */}
          {credentials && (
            <div style={{ marginTop: '1rem', background: '#222', padding: '10px' }}>
              <h4>Patient Login Created</h4>
              <p><b>Username:</b> {credentials.username}</p>
              <p><b>Password:</b> {credentials.password}</p>
              <button onClick={() => setCredentials(null)}>Close</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StaffPatients;
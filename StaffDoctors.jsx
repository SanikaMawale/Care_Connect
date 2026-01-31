import '../Dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const navigate = useNavigate();

  const [doctorData, setDoctorData] = useState({
    name: '',
    specialty: '',
    contact: '',
    experience: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const res = await axios.get('/api/doctors');
    setDoctors(res.data);
  };

  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/doctors', doctorData);

      setCredentials(res.data.login);

      setDoctorData({
        name: '',
        specialty: '',
        contact: '',
        experience: ''
      });

      setShowForm(false);
      fetchDoctors();
    } catch {
      alert('Error adding doctor');
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    await axios.delete(`/api/doctors/${id}`);
    fetchDoctors();
  };

  return (
    <div className="dashboard">
      <nav className="nav">
        <h1>Doctors</h1>
      </nav>

      <div className="content">
        <div className="section">
          <h3>Doctors List</h3>

          <ul>
            {doctors.map(d => (
              <li
                key={d._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  {d.name} ({d.specialty})
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* 🔍 DETAILS BUTTON */}
                  <button
                    onClick={() =>
                      navigate(`/doctor/${d._id}/schedule`)
                    }
                  >
                    Details
                  </button>

                  <button onClick={() => deleteDoctor(d._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button onClick={() => setShowForm(true)}>Add Doctor</button>

          {showForm && (
            <form onSubmit={addDoctor}>
              <input
                placeholder="Name"
                required
                value={doctorData.name}
                onChange={e =>
                  setDoctorData({ ...doctorData, name: e.target.value })
                }
              />
              <input
                placeholder="Specialty"
                required
                value={doctorData.specialty}
                onChange={e =>
                  setDoctorData({ ...doctorData, specialty: e.target.value })
                }
              />
              <input
                placeholder="Contact"
                required
                value={doctorData.contact}
                onChange={e =>
                  setDoctorData({ ...doctorData, contact: e.target.value })
                }
              />
              <input
                placeholder="Experience"
                value={doctorData.experience}
                onChange={e =>
                  setDoctorData({ ...doctorData, experience: e.target.value })
                }
              />

              <button type="submit">Save</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          )}

          {credentials && (
            <div style={{ marginTop: '1rem', background: '#222', padding: '10px' }}>
              <h4>Doctor Login Credentials</h4>
              <p><strong>Username:</strong> {credentials.username}</p>
              <p><strong>Password:</strong> {credentials.password}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDoctors;

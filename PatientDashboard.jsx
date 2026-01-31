import './Dashboard.css';

const PatientDashboard = () => {
  const handleEdit = () => {
    alert('Edit functionality coming soon!');
  };

  return (
    <>
      <nav className="nav">
        <h1>Patient Dashboard</h1>
        <ul>
          <li>Book Appointments</li>
          <li>Medical Bill</li>
          <li>Recommendations</li>
          <li>Test Reports</li>
          <li>Logout</li>
        </ul>
      </nav>
      <div className="content">
        <div className="section">
          <h3>List of Treatments</h3>
          <ul>
            <li>Treatment 1</li>
            <li>Treatment 2</li>
          </ul>
          <button onClick={handleEdit}>Edit Treatments</button>
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;
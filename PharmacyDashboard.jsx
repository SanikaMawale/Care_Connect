import './Dashboard.css';

const PharmacyDashboard = () => {
  const handleEdit = () => {
    alert('Edit functionality coming soon!');
  };

  return (
    <div className="dashboard">
      <nav className="nav">
        <h1>Pharmacy Dashboard</h1>
        <ul>
          <li>Logout</li>
        </ul>
      </nav>
      <div className="content">
        <div className="section">
          <h3>Patient Prescriptions</h3>
          <ul>
            <li>Prescription 1</li>
            <li>Prescription 2</li>
          </ul>
          <button onClick={handleEdit}>Edit Prescriptions</button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Common
import Home from './pages/Home';
import Login from './pages/Login';

// Dashboards
import DoctorDashboard from './pages/DoctorDashboard';
import StaffDashboard from './pages/StaffDashboard';
import PatientDashboard from './pages/PatientDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';

// Staff sub-pages
import StaffDoctors from './pages/staff/StaffDoctors';
import StaffPatients from './pages/staff/StaffPatients';
import DoctorSchedule from './pages/DoctorSchedule';


function App() {
  return (
    <Router>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Role based login */}
        <Route path="/login/:role" element={<Login />} />

        {/* Dashboards */}
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/pharmacy" element={<PharmacyDashboard />} />

        {/* Staff pages */}
        <Route path="/staff/doctors" element={<StaffDoctors />} />
        <Route path="/staff/patients" element={<StaffPatients />} />

        <Route path="/doctor/:doctorId/schedule" element={<DoctorSchedule />} />


      </Routes>
    </Router>
  );
}

export default App;

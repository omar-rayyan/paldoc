import NotFound from "./components/NotFound.jsx";
import LandingPage from "./components/LandingPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import { Routes, Route } from 'react-router-dom';
import OurDoctorsPage from "./components/OurDoctorsPage.jsx";
import DoctorAppointments from "./components/AppointmentsDoctor.jsx";
import PatientsPageAdmin from "./components/PatientsPageAdmin.jsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/doctors" element={<OurDoctorsPage />} />
        <Route path="/admin/patients" element={<PatientsPageAdmin />} />
        <Route path="/appointments" element={<DoctorAppointments />} />
    </Routes>
  );
}

export default App;
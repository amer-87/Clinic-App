import { HashRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import ReceptionPage from "./ReceptionPage";
import DoctorPage from "./DoctorPage";
import OwnerPage from "./OwnerPage";
import RegistrationPage from "./RegistrationPage";
import './style.css';

// ——————————————
// Imports from context
// ——————————————
import { ClinicProvider, ClinicContext } from "./context";

// ——————————————
// Layout
// ——————————————
function Layout({ children }) {

  return (
    <div>
      <header>
        <div className="container">
          <div>🩺  عيادة الطبيب</div>
          <div style={{ fontSize: '14px', color: '#fff' }}>
            {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <NavLink to="/doctor" className={({isActive})=>isActive?"active":""}>صفحة الطبيب</NavLink>
        </div>
      </header>
      <main>{children}</main>
      <footer>البيانات تحفظ محليًا في المتصفح (LocalStorage).</footer>
    </div>
  );
}

// ——————————————
// App Content Component
// ——————————————
function AppContent() {
  return (
    <Routes>
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/" element={<Navigate to="/owner" replace />} />
      <Route path="/doctor" element={
        <Layout>
          <DoctorPage />
        </Layout>
      } />
      <Route path="/owner" element={
        <Layout>
          <OwnerPage />
        </Layout>
      } />
      <Route path="*" element={<Navigate to="/owner" replace />} />
    </Routes>
  );
}

// ——————————————
// App Component
// ——————————————
export default function App() {
  return (
    <ClinicProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </ClinicProvider>
  );
}

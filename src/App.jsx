import { HashRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useContext } from "react";
import ReceptionPage from "./ReceptionPage";
import DoctorPage from "./DoctorPage";
import OwnerPage from "./OwnerPage";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";
import './style.css';

// ——————————————
// Imports from context
// ——————————————
import { ClinicProvider, ClinicContext } from "./context";

// ——————————————
// Protected Route Component (Disabled - No Login Required)
// ——————————————
function ProtectedRoute({ children }) {
  return children;
}

// ——————————————
// Layout
// ——————————————
function Layout({ children }) {
  const { user, logout } = useContext(ClinicContext);

  return (
    <div>
      <header>
        <div className="container">
          <div>🩺  عيادة الطبيب</div>
          <div style={{ fontSize: '14px', color: '#fff' }}>
            {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <NavLink to="/doctor" className={({isActive})=>isActive?"active":""}>صفحة الطبيب</NavLink>
            {user && (
              <button 
                onClick={logout}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                تسجيل الخروج
              </button>
            )}
          </div>
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

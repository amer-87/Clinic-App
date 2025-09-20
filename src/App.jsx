import { HashRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import ReceptionPage from "./ReceptionPage";
import SecretaryPage from "./SecretaryPage";
import DoctorPage from "./DoctorPage";
import OwnerPage from "./OwnerPage";
import UserListPage from "./UserListPage";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import ProtectedRoute from "./ProtectedRoute";
import './style.css';

// ——————————————
// Imports from context
// ——————————————
import { ClinicProvider, ClinicContext } from "./context";
import { useContext } from "react";

// ——————————————
// Layout
// ——————————————
function Layout({ children }) {
  const { user, getPendingUsers, logout } = useContext(ClinicContext);
  const pendingDoctorsCount = getPendingUsers('doctor').length;
  
  return (
    <div>
      <header>
        <div className="container">
          {user && user.role === 'secretary' && (
            <NavLink to="/reception" className={({isActive})=>isActive?"active":""}>صفحة السكرتير</NavLink>
          )}
          <div>🩺  عيادة الطبيب</div>
          <div style={{ fontSize: '14px', color: '#fff' }}>
            {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          {user && user.role === 'doctor' && (
            <NavLink to="/doctor" className={({isActive})=>isActive?"active":""}>صفحة الطبيب</NavLink>
          )}
          {user && user.role === 'owner' && (
            <NavLink to="/users" className={({isActive})=>isActive?"active":""} style={{ position: 'relative' }}>
              قائمة المستخدمين
              {pendingDoctorsCount > 0 && (
                <span style={{
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  lineHeight: '1'
                }}>
                  {pendingDoctorsCount}
                </span>
              )}
            </NavLink>
          )}
          {user && (
            <button onClick={logout} className="logout-btn">تسجيل الخروج</button>
          )}
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
  const { user } = useContext(ClinicContext);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      
      <Route path="/" element={
        user ? (
          user.role === "doctor" ? <Navigate to="/doctor" replace /> :
          user.role === "secretary" ? <Navigate to="/reception" replace /> :
          user.role === "owner" ? <Navigate to="/owner" replace /> :
          <Navigate to="/login" replace />
        ) : <Navigate to="/login" replace />
      } />
      
      <Route path="/reception" element={
        <ProtectedRoute allowedRoles={['secretary', 'doctor', 'owner']}>
          <Layout>
            <SecretaryPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/doctor" element={
        <ProtectedRoute allowedRoles={['doctor', 'owner']}>
          <Layout>
            <DoctorPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/owner" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Layout>
            <OwnerPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={['owner']}>
          <Layout>
            <UserListPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
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

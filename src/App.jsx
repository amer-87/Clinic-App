import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import ReceptionPage from "./ReceptionPage";
import SecretaryPage from "./SecretaryPage";
import DoctorPage from "./DoctorPage";
import OwnerPage from "./OwnerPage";
import UserListPage from "./UserListPage";
// Removed import of LoginPage as login screen is removed
// import LoginPage from "./LoginPage";
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
  const { user, getPendingUsers } = useContext(ClinicContext);
  const pendingDoctorsCount = getPendingUsers('doctor').length;
  return (
    <div>
      <header>
        <div className="container">
          <NavLink to="/reception" className={({isActive})=>isActive?"active":""}>صفحة السكرتير</NavLink>
          <div>🩺  عيادة الطبيب</div>
          <div style={{ fontSize: '14px', color: '#fff' }}>
            {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <NavLink to="/doctor" className={({isActive})=>isActive?"active":""}>صفحة الطبيب</NavLink>
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
        </div>
      </header>
      <main>{children}</main>
      <footer>البيانات تحفظ محليًا في المتصفح (LocalStorage).</footer>
    </div>
  );
}

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useContext(ClinicContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.status !== 'approved') {
    // Redirect users not approved yet to login
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to their page
    if (user.role === "doctor") return <Navigate to="/doctor" replace />;
    if (user.role === "secretary") return <Navigate to="/reception" replace />;
    if (user.role === "owner") return <Navigate to="/owner" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ——————————————
// App Content Component
// ——————————————
function AppContent() {
  const { user } = useContext(ClinicContext);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/reception" replace />} />
        <Route path="/reception" element={<SecretaryPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/owner" element={<OwnerPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="*" element={<Navigate to="/reception" replace />} />
      </Routes>
    </Layout>
  );
}

// ——————————————
// App Component
// ——————————————
export default function App() {
  return (
    <ClinicProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ClinicProvider>
  );
}

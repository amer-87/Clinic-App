import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import ReceptionPage from "./ReceptionPage";
import SecretaryPage from "./SecretaryPage";
import DoctorPage from "./DoctorPage";
import LoginPage from "./LoginPage";
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
  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to their page
    if (user.role === "doctor") return <Navigate to="/doctor" replace />;
    if (user.role === "secretary") return <Navigate to="/reception" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ——————————————
// App Component
// ——————————————
export default function App() {
  return (
    <ClinicProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <PrivateRoute allowedRoles={["secretary"]}>
                <SecretaryPage />
              </PrivateRoute>
            }/>
            <Route path="/reception" element={
              <PrivateRoute allowedRoles={["secretary"]}>
                <SecretaryPage />
              </PrivateRoute>
            }/>
            <Route path="/doctor" element={
              <PrivateRoute allowedRoles={["doctor"]}>
                <DoctorPage />
              </PrivateRoute>
            }/>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ClinicProvider>
  );
}

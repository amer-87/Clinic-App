import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ReceptionPage from "./ReceptionPage";
import SecretaryPage from "./SecretaryPage";
import DoctorPage from "./DoctorPage";
import './style.css';

// ——————————————
// Imports from context
// ——————————————
import { ClinicProvider } from "./context";

// ——————————————
// Layout
// ——————————————
function Layout({ children }) {
  return (
    <div>
      <header>
        <div className="container">
          <div>🩺 نظام عيادة بسيط</div>
          <nav>
            <NavLink to="/reception" className={({isActive})=>isActive?"active":""}>صفحة السكرتير</NavLink>
            <NavLink to="/doctor" className={({isActive})=>isActive?"active":""}>صفحة الطبيب</NavLink>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer>البيانات تحفظ محليًا في المتصفح (LocalStorage).</footer>
    </div>
  );
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
            <Route path="/" element={<SecretaryPage/>}/>
            <Route path="/reception" element={<SecretaryPage/>}/>
            <Route path="/doctor" element={<DoctorPage/>}/>
            <Route path="*" element={<SecretaryPage/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </ClinicProvider>
  );
}

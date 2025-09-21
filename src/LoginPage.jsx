import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClinicContext } from "./context";
import './style.css';


export default function LoginPage() {
  const { login } = useContext(ClinicContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.username || !credentials.password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    const success = login(credentials.username, credentials.password);
    if (success) {
      // إعادة التوجيه بناءً على دور المستخدم
      // سيتم التعامل مع هذا في App.jsx عبر Navigate
      navigate('/');
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>تسجيل الدخول</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">البريد الإلكتروني:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">كلمة المرور:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="أدخل كلمة المرور"
            />
            <div style={{ marginTop: '5px' }}>
              <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  style={{ marginRight: '5px' }}
                />
                إظهار كلمة المرور
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            تسجيل الدخول
          </button>
        </form>


        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
          <p>ليس لديك حساب؟</p>
          <Link to="/register" className="btn-secondary" style={{ display: 'inline-block', marginTop: '10px' }}>
            تسجيل طبيب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}

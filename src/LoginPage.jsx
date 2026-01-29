import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClinicContext } from "./context";
import './style.css';

export default function LoginPage() {
  const { login } = useContext(ClinicContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Trim whitespace and validate
    const trimmedUsername = formData.username.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      setLoading(false);
      return;
    }

    try {
      const success = login(trimmedUsername, trimmedPassword);
      
      if (success) {
        // Redirect to home page after successful login
        navigate('/');
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة. تأكد من عدم وجود مسافات زائدة.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '48px', margin: '0' }}>🩺</h1>
          <h2 style={{ margin: '8px 0', color: '#2c5282' }}>عيادة الطبيب</h2>
          <p style={{ color: '#718096', fontSize: '14px' }}>تسجيل الدخول إلى النظام</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="أدخل اسم المستخدم"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">كلمة المرور:</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="أدخل كلمة المرور"
                required
                disabled={loading}
                style={{ paddingLeft: '40px' }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#718096',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2c5282'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#718096'}
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{
              backgroundColor: '#fed7d7',
              color: '#c53030',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center',
              border: '1px solid #fc8181'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#a0aec0' : '#3b7dc4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div style={{ 
          marginTop: '24px', 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#718096',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '16px'
        }}>
          <p>💡 معلومات تسجيل الدخول الافتراضية:</p>
          <p style={{ fontFamily: 'monospace', backgroundColor: '#f7fafc', padding: '8px', borderRadius: '4px', margin: '8px 0' }}>
            اسم المستخدم: owner<br/>
            كلمة المرور: owner123
          </p>
          <p style={{ fontSize: '11px', color: '#a0aec0' }}>
            يمكنك تغيير هذه البيانات من صفحة المالك بعد تسجيل الدخول
          </p>
        </div>
      </div>
    </div>
  );
}

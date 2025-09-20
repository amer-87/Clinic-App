import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClinicContext } from "./context";
import { sendRegistrationNotification } from "./helpers";
import './style.css';


export default function RegistrationPage() {
  const { addUser } = useContext(ClinicContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    title: "",
    licenseNumber: ""
  });

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("الاسم والبريد الإلكتروني وكلمة المرور مطلوبة");
      setLoading(false);
      return;
    }


    try {
      // Create new doctor with pending status
      const newDoctor = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        specialization: formData.specialization,
        title: formData.title,
        licenseNumber: formData.licenseNumber,
        role: "doctor",
        status: "pending",
        createdAt: new Date().toISOString()
      };


      addUser(newDoctor);
      
      // Send email notification to owner
      try {
        await sendRegistrationNotification(newDoctor);
        setSuccess("تم إرسال طلب التسجيل بنجاح. سيتم مراجعته من قبل المالك وإرسال بريد إلكتروني لك عند الموافقة.");
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        setSuccess("تم إرسال طلب التسجيل بنجاح. سيتم مراجعته من قبل المالك. (ملاحظة: لم يتم إرسال الإشعار بالبريد الإلكتروني)");
      }
      
      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        specialization: "",
        title: "",
        licenseNumber: ""
      });


      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError("حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        <h2>تسجيل طبيب جديد</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">الاسم الكامل:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="أدخل البريد الإلكتروني"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">رقم الهاتف:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="أدخل رقم الهاتف"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">كلمة المرور:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="specialization">التخصص:</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="أدخل التخصص"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">عنوان الطبيب:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="أدخل عنوان الطبيب"
            />
          </div>

          <div className="form-group">
            <label htmlFor="licenseNumber">رقم الرخصة الطبية:</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              placeholder="أدخل رقم الرخصة الطبية"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "جاري التسجيل..." : "تسجيل الطبيب"}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/login')}
            >
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

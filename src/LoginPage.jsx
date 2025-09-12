import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClinicContext } from "./context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("secretary");
  const { setUser } = useContext(ClinicContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication
    if (email && password) {
      // Set user with role
      setUser({ email, role: userType });
      // Redirect based on role
      if (userType === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/reception");
      }
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="login-container">
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleSubmit}>
        <label>البريد الالكتروني</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>الرقم السري</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>نوع المستخدم</label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="secretary">سكرتير</option>
          <option value="doctor">طبيب</option>
        </select>
        <button type="submit">تسجيل الدخول</button>
      </form>
    </div>
  );
}

import React, { useContext, useState } from "react";
import { ClinicContext } from "./context";

export default function OwnerPage() {
  const { user, logout, updateOwner } = useContext(ClinicContext);

  const [accountForm, setAccountForm] = useState({
    email: user?.email || '',
    password: ''
  });

  return (
    <div className="page">
      <h2>🏥 لوحة تحكم المالك</h2>
      <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
        التاريخ والوقت: {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3>إعدادات الحساب</h3>
        <div className="card" style={{ border: '1px solid #3b7dc4', borderRadius: '12px', padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!accountForm.email || !accountForm.password) {
              alert("يرجى إدخال البريد الإلكتروني وكلمة المرور الجديدة");
              return;
            }
            updateOwner(accountForm.email, accountForm.password);
            alert("تم تحديث بيانات الحساب بنجاح");
            logout(); // تسجيل خروج لإعادة تسجيل الدخول بالبيانات الجديدة
          }}>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="accountEmail" style={{ display: 'block', marginBottom: '4px' }}>البريد الإلكتروني الجديد:</label>
              <input
                type="email"
                id="accountEmail"
                value={accountForm.email}
                onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="أدخل البريد الإلكتروني الجديد"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="accountPassword" style={{ display: 'block', marginBottom: '4px' }}>كلمة المرور الجديدة:</label>
              <input
                type="password"
                id="accountPassword"
                value={accountForm.password}
                onChange={(e) => setAccountForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="أدخل كلمة المرور الجديدة"
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>تحديث الحساب</button>
          </form>
        </div>
      </div>
    </div>
  );
}

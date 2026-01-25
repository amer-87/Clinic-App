import React, { useContext, useState } from "react";
import { ClinicContext } from "./context";

export default function OwnerPage() {
  const { user, logout, updateOwner } = useContext(ClinicContext);

  const [accountForm, setAccountForm] = useState({
    username: user?.username || '',
    password: ''
  });

  return (
    <div className="page">
      <h2>🏥 لوحة تحكم المالك</h2>
      <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
        التاريخ والوقت: {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>

      {/* User Info Card */}
      <div style={{ marginBottom: '32px' }}>
        <div className="card" style={{ 
          border: '1px solid #48bb78', 
          borderRadius: '12px', 
          padding: '16px', 
          maxWidth: '600px', 
          margin: '0 auto',
          backgroundColor: '#f0fff4'
        }}>
          <h3 style={{ marginTop: '0', color: '#2f855a' }}>👤 معلومات المستخدم الحالي</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <p><strong>الاسم:</strong> {user?.name}</p>
            <p><strong>اسم المستخدم:</strong> {user?.username}</p>
            <p><strong>الدور:</strong> {user?.role === 'owner' ? 'مالك' : 'طبيب'}</p>
            <p><strong>تاريخ الإنشاء:</strong> {new Date(user?.createdAt).toLocaleDateString('ar-EG')}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3>🔐 تغيير بيانات الحساب</h3>
        <div className="card" style={{ border: '1px solid #3b7dc4', borderRadius: '12px', padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!accountForm.username || !accountForm.password) {
              alert("يرجى إدخال اسم المستخدم وكلمة المرور الجديدة");
              return;
            }
            updateOwner(accountForm.username, accountForm.password);
            alert("تم تحديث بيانات الحساب بنجاح! سيتم تسجيل الخروج الآن.");
            logout(); // تسجيل خروج لإعادة تسجيل الدخول بالبيانات الجديدة
          }}>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="accountUsername" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>اسم المستخدم الجديد:</label>
              <input
                type="text"
                id="accountUsername"
                value={accountForm.username}
                onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="أدخل اسم المستخدم الجديد"
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="accountPassword" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>كلمة المرور الجديدة:</label>
              <input
                type="password"
                id="accountPassword"
                value={accountForm.password}
                onChange={(e) => setAccountForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="أدخل كلمة المرور الجديدة"
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ 
              width: '100%', 
              padding: '12px',
              backgroundColor: '#3b7dc4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              تحديث الحساب
            </button>
          </form>
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: '#fff5f5', 
            borderRadius: '6px',
            border: '1px solid #feb2b2',
            fontSize: '13px',
            color: '#c53030'
          }}>
            ⚠️ تنبيه: بعد تحديث البيانات، سيتم تسجيل خروجك تلقائياً. ستحتاج لتسجيل الدخول مرة أخرى باستخدام البيانات الجديدة.
          </div>
        </div>
      </div>
    </div>
  );
}

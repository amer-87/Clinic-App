import React, { useContext } from "react";
import { ClinicContext } from "./context";

export default function UserListPage() {
  const { users, logout } = useContext(ClinicContext);

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button onClick={logout} className="btn-danger">تسجيل الخروج</button>
      </div>
      <h2>🏥 قائمة المستخدمين</h2>
      <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
        التاريخ والوقت: {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>

      <div className="card" style={{ border: '1px solid #3b7dc4', borderRadius: '12px', padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <h3>جميع المستخدمين</h3>
        {users.length === 0 ? (
          <p>لا توجد مستخدمين مسجلين.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2a5d9f', color: 'white' }}>
                <th style={{ padding: '8px', textAlign: 'right' }}>البريد الإلكتروني</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>الدور</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>الحالة</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>موافق عليه من</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', textAlign: 'right' }}>{user.email}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    {user.role === 'owner' ? 'مالك' : user.role === 'doctor' ? 'طبيب' : 'سكرتير'}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    {user.status === 'approved' ? 'موافق عليه' : 'قيد المراجعة'}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>{user.approvedBy || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

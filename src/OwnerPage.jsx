import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClinicContext } from "./context";
import { sendApprovalNotification, sendRejectionNotification } from "./helpers";

export default function OwnerPage() {
  const { user, getPendingUsers, approveUser, rejectUser, logout, updateOwner } = useContext(ClinicContext);
  const pendingDoctors = getPendingUsers('doctor');
  const navigate = useNavigate();

  const [accountForm, setAccountForm] = useState({
    email: user?.email || '',
    password: ''
  });

  console.log("Pending doctors for approval:", pendingDoctors);

  const handleApprove = async (email) => {
    // Find the doctor to get their actual password
    const doctor = pendingDoctors.find(doc => doc.email === email);
    if (!doctor) {
      alert("لم يتم العثور على الطبيب للموافقة عليه.");
      return;
    }
    
    approveUser(email, user.email, doctor.password);
    
    try {
      await sendApprovalNotification(email, doctor.password);
      alert("تمت الموافقة على الطبيب. يمكنه الآن تسجيل الدخول باستخدام كلمة المرور التي أدخلها أثناء التسجيل.");
    } catch (error) {
      console.error("Failed to send approval email:", error);
      alert("تمت الموافقة على الطبيب، ولكن حدث خطأ في إرسال البريد الإلكتروني.");
    }
  };


  const handleReject = async (email) => {
    const reason = prompt("يرجى إدخال سبب الرفض (اختياري):");
    rejectUser(email, user.email);
    
    try {
      await sendRejectionNotification(email, reason);
      alert("تم رفض طلب الطبيب وإرسال إشعار بالبريد الإلكتروني.");
    } catch (error) {
      console.error("Failed to send rejection email:", error);
      alert("تم رفض طلب الطبيب، ولكن حدث خطأ في إرسال البريد الإلكتروني.");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const approveEmail = urlParams.get('approve');
    const rejectEmail = urlParams.get('reject');

    if (user && user.role === 'owner') {
      if (approveEmail) {
        handleApprove(approveEmail);
        // Clear the URL
        navigate('/owner', { replace: true });
      } else if (rejectEmail) {
        handleReject(rejectEmail);
        // Clear the URL
        navigate('/owner', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="page">
      <h2>🏥 لوحة تحكم المالك</h2>
      <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
        التاريخ والوقت: {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>

      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <h3 style={{ display: 'inline-block' }}>الأطباء قيد الموافقة</h3>
        {pendingDoctors.length > 0 && (
          <span style={{
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '4px 10px',
            fontSize: '14px',
            fontWeight: 'bold',
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translate(50%, -50%)'
          }}>
            {pendingDoctors.length}
          </span>
        )}
      </div>

      <div className="card" style={{ border: '1px solid #3b7dc4', borderRadius: '12px', padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        {pendingDoctors.length === 0 ? (
          <p>لا توجد طلبات موافقة حاليًا.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pendingDoctors.map((doc) => (
              <li key={doc.email} style={{ display: 'flex', flexDirection: 'column', padding: '8px', borderBottom: '1px solid #ddd' }}>
                <div><strong>الاسم:</strong> {doc.name || "غير متوفر"}</div>
                <div><strong>البريد:</strong> {doc.email}</div>
                <div><strong>الهاتف:</strong> {doc.phone || "غير متوفر"}</div>
                <div style={{ marginTop: '8px' }}>
                  <button className="btn-primary" style={{ marginRight: '8px' }} onClick={() => handleApprove(doc.email)}>موافقة</button>
                  <button className="btn-danger" onClick={() => handleReject(doc.email)}>رفض</button>
                </div>
              </li>
            ))}
          </ul>
        )}
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

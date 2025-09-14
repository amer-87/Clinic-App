import React, { useState, useContext } from "react";
import { useClinic } from "./hooks";
import { ClinicContext } from "./context";
import PatientTable from "./PatientTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DoctorPage() {
  const { state, removePatient, addPatient, updatePatient, setStatus } = useClinic();
  const { logout, addSecretary, user, users } = useContext(ClinicContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  // New states for secretary credentials and form toggle
  const [secretaryName, setSecretaryName] = useState("");
  const [secretaryCode, setSecretaryCode] = useState("");
  // Removed secretaryPhone as per new requirement
  const [secretaryMessage, setSecretaryMessage] = useState("");
  const [showSecretaryForm, setShowSecretaryForm] = useState(false);
  // Removed verificationCode, enteredCode, codeSent as no email verification needed now

  // New state to hold last added secretary credentials for display
  const [lastAddedSecretary, setLastAddedSecretary] = useState(null);

  // States for patient form
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    medicalHistory: {
      diabetes: false,
      hypertension: false,
      asthma: false,
      allergies: false,
      other: ""
    }
  });
  const [file, setFile] = useState(null);

  const patients = state.patients;

  async function handleSavePDF() {
    // Create a hidden div with detailed patient information
    const detailsDiv = document.createElement('div');
    detailsDiv.style.position = 'absolute';
    detailsDiv.style.left = '-9999px';
    detailsDiv.style.top = '-9999px';
    detailsDiv.style.width = '800px';
    detailsDiv.style.fontFamily = 'Arial, sans-serif';
    detailsDiv.style.fontSize = '12px';
    detailsDiv.style.padding = '20px';
    detailsDiv.style.backgroundColor = '#f8fafc';
    detailsDiv.style.color = '#000';
    detailsDiv.style.direction = 'rtl';

    let htmlContent = '<h1 style="text-align: center; color: #2a5d9f; margin-bottom: 20px;">بيانات المرضى</h1>';
    htmlContent += '<div style="column-count: 2; column-gap: 20px;">';
    patients.forEach((patient, index) => {
      htmlContent += `
        <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); break-inside: avoid;">
          <h3 style="color: #2a5d9f; margin-bottom: 10px;">المريض ${index + 1}: ${patient.firstName} ${patient.lastName}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
            <p style="margin: 0;"><strong>العمر:</strong> ${patient.age}</p>
            <p style="margin: 0;"><strong>الجنس:</strong> ${patient.gender}</p>
            <p style="margin: 0;"><strong>العنوان:</strong> ${patient.address || 'غير محدد'}</p>
            <p style="margin: 0;"><strong>الهاتف:</strong> ${patient.phone}</p>
          </div>
          <p style="margin: 5px 0;"><strong>التاريخ الطبي:</strong> ${patient.medicalHistory ? Object.keys(patient.medicalHistory).filter(key => patient.medicalHistory[key]).join(', ') : 'غير محدد'}</p>
          <p style="margin: 5px 0;"><strong>الأعراض الحالية:</strong> ${patient.currentSymptoms ? Object.keys(patient.currentSymptoms).filter(key => patient.currentSymptoms[key]).join(', ') : 'غير محدد'}</p>
          <p style="margin: 5px 0;"><strong>التشخيص:</strong> ${patient.diagnosis || 'غير محدد'}</p>
          <p style="margin: 5px 0;"><strong>الوصفة الطبية:</strong> ${patient.prescription || 'غير محدد'}</p>
          <p style="margin: 5px 0;"><strong>الحالة:</strong> <span style="color: ${patient.status === 'done' ? '#166534' : '#b45309'}; font-weight: bold;">${patient.status === 'done' ? 'مكتمل' : 'في الانتظار'}</span></p>
        </div>
      `;
    });
    htmlContent += '</div>';

    detailsDiv.innerHTML = htmlContent;
    document.body.appendChild(detailsDiv);

    const canvas = await html2canvas(detailsDiv, { scale: 2 });
    document.body.removeChild(detailsDiv);

    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    doc.save("patients_data.pdf");
  }

  function handlePrintPrescription() {
    if (!selectedPatient) return;
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <html>
        <head>
          <title>الوصفة الطبية</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
            h1 { text-align: center; color: #2a5d9f; }
            .details { margin-bottom: 20px; }
            .details p { margin: 5px 0; }
            .prescription { border-top: 1px solid #ccc; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>الوصفة الطبية</h1>
          <div class="details">
            <p><strong>الاسم:</strong> ${selectedPatient.firstName} ${selectedPatient.lastName}</p>
            <p><strong>العمر:</strong> ${selectedPatient.age}</p>
            <p><strong>الجنس:</strong> ${selectedPatient.gender}</p>
            <p><strong>الهاتف:</strong> ${selectedPatient.phone}</p>
            <p><strong>التشخيص:</strong> ${diagnosis || 'غير محدد'}</p>
          </div>
          <div class="prescription">
            <h2>الوصفة الطبية:</h2>
            <p>${prescription || 'غير محدد'}</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }

  function handleSelect(patient) {
    setSelectedPatient(patient);
    setDiagnosis(patient.diagnosis || "");
    setPrescription(patient.prescription || "");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedPatient) return;
    updatePatient(selectedPatient.id, { diagnosis, prescription });
    setStatus(selectedPatient.id, "done");
    setSelectedPatient(null);
    setDiagnosis("");
    setPrescription("");
  }

  // Handler for adding secretary
  function handleAddSecretary(e) {
    e.preventDefault();
    if (!secretaryName || !secretaryCode) {
      setSecretaryMessage("يرجى إدخال الاسم والرمز للسكرتير.");
      return;
    }
    // Check if secretary name already exists (used as email)
    const existingSecretary = users?.find(u => u.email === secretaryName && u.role === "secretary");
    if (existingSecretary) {
      setSecretaryMessage("الاسم موجود بالفعل.");
      return;
    }
    addSecretary(secretaryName, secretaryName, user.email, secretaryCode);
    setSecretaryMessage("تم إضافة السكرتير بنجاح.");
    setLastAddedSecretary({ name: secretaryName, code: secretaryCode }); // Save for display
    setSecretaryName("");
    setSecretaryCode("");
    setShowSecretaryForm(false);
  }

  function handleDelete(patient) {
    if(window.confirm(`هل أنت متأكد من حذف المراجع ${patient.firstName}؟`)) {
      removePatient(patient.id);
    }
  }

  function handleEdit(patient) {
    setEditingPatient(patient);
    setForm({
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      age: patient.age || "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      address: patient.address || "",
      medicalHistory: {
        diabetes: patient.medicalHistory?.diabetes || false,
        hypertension: patient.medicalHistory?.hypertension || false,
        asthma: patient.medicalHistory?.asthma || false,
        allergies: patient.medicalHistory?.allergies || false,
        other: patient.medicalHistory?.other || ""
      }
    });
    setFile(patient.file || null);
    setShowForm(true);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (editingPatient) {
      // Update existing patient
      updatePatient(editingPatient.id, {
        ...form,
        file: file
      });
    } else {
      // Add new patient
      const newPatient = {
        ...form,
        id: Date.now(),
        createdAt: Date.now(),
        visitDate: new Date().toISOString().slice(0, 10),
        status: "waiting",
        file: file
      };
      addPatient(newPatient);
    }
    // Reset form
    setForm({
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
      medicalHistory: {
        diabetes: false,
        hypertension: false,
        asthma: false,
        allergies: false,
        other: ""
      }
    });
    setFile(null);
    setEditingPatient(null);
    setShowForm(false);
  }

  return (
    <div className="page">
      <h2>🏥 صفحة الطبيب</h2>
      <div style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
        التاريخ والوقت: {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
      {user && (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <button onClick={logout} className="btn-danger">تسجيل الخروج</button>
        </div>
      )}

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingPatient(null); }}>
          إضافة مريض جديد
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingPatient ? 'تعديل معلومات المريض' : 'إضافة مريض جديد'}</h3>
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label>
                الاسم الثلاثي
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="input"
                  required
                />
              </label>
              <label>
                العمر
                <input
                  type="number"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  className="input"
                  required
                />
              </label>
              <label>
                الجنس
                <select
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">اختر الجنس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </label>
              <label>
                الهاتف
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="input"
                  required
                />
              </label>
              <label>
                العنوان
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="input"
                />
              </label>
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4>التاريخ الطبي</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={form.medicalHistory.diabetes}
                    onChange={e => setForm({
                      ...form,
                      medicalHistory: { ...form.medicalHistory, diabetes: e.target.checked }
                    })}
                  />
                  السكري
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.medicalHistory.hypertension}
                    onChange={e => setForm({
                      ...form,
                      medicalHistory: { ...form.medicalHistory, hypertension: e.target.checked }
                    })}
                  />
                  ارتفاع ضغط الدم
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.medicalHistory.asthma}
                    onChange={e => setForm({
                      ...form,
                      medicalHistory: { ...form.medicalHistory, asthma: e.target.checked }
                    })}
                  />
                  الربو
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.medicalHistory.allergies}
                    onChange={e => setForm({
                      ...form,
                      medicalHistory: { ...form.medicalHistory, allergies: e.target.checked }
                    })}
                  />
                  الحساسية
                </label>
              </div>
              <label>
                أخرى
                <input
                  type="text"
                  value={form.medicalHistory.other}
                  onChange={e => setForm({
                    ...form,
                    medicalHistory: { ...form.medicalHistory, other: e.target.value }
                  })}
                  className="input"
                />
              </label>
            </div>



            <div style={{ marginTop: '16px' }}>
              <label>
                تقرير/صورة المريض
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="input"
                />
              </label>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary">
                {editingPatient ? 'تحديث المريض' : 'إضافة المريض'}
              </button>
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
        <div className="card" style={{flex:'1 1 500px'}}>
          <h3>قائمة المراجعين </h3>
          <PatientTable patients={patients} onEdit={handleEdit} onDelete={handleDelete} onRowClick={handleSelect} />

          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <button onClick={handleSavePDF} className="btn-primary">حفظ البيانات</button>
          </div>
        </div>

        <div className="card" style={{flex:'1 1 500px'}}>
          <h3>تفاصيل المريض{selectedPatient ? `: ${selectedPatient.firstName} ${selectedPatient.lastName}` : ''}</h3>
          <div style={{marginBottom:'16px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              <p><strong>الاسم:</strong> {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : ''}</p>
              <p><strong>العمر:</strong> {selectedPatient ? selectedPatient.age : ' '}</p>
              <p><strong>الجنس:</strong> {selectedPatient ? selectedPatient.gender : ' '}</p>
              <p><strong>الهاتف:</strong> {selectedPatient ? selectedPatient.phone : ' '}</p>
            </div>
            {selectedPatient && (
              <>
                <h4>التاريخ الطبي:</h4>
                <ul>
                  {selectedPatient.medicalHistory?.diabetes && <li>السكري</li>}
                  {selectedPatient.medicalHistory?.hypertension && <li>ارتفاع ضغط الدم</li>}
                  {selectedPatient.medicalHistory?.asthma && <li>الربو</li>}
                  {selectedPatient.medicalHistory?.allergies && <li>الحساسية</li>}
                  {selectedPatient.medicalHistory?.other && <li>أخرى: {selectedPatient.medicalHistory.other}</li>}
                </ul>
                <h4>الأعراض الحالية:</h4>
                <ul>
                  {selectedPatient.currentSymptoms?.headache && <li>صداع</li>}
                  {selectedPatient.currentSymptoms?.fever && <li>حمى</li>}
                  {selectedPatient.currentSymptoms?.cough && <li>سعال</li>}
                  {selectedPatient.currentSymptoms?.fatigue && <li>إرهاق</li>}
                </ul>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              التشخيص:
              <textarea
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="input"
                rows="2"
              />
            </label>
            <label>
              الوصفة الطبية:
              <textarea
                value={prescription}
                onChange={e => setPrescription(e.target.value)}
                className="input"
                rows="5"
              />
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary">حفظ وإنهاء</button>
              <button type="button" className="btn-outline" onClick={handlePrintPrescription}>طباعة الوصفة</button>
            </div>
          </form>
        </div>

        {user && (
          <>
            {/* Toggle button for secretary form */}
            <div style={{flexBasis: '100%', marginTop: '20px', textAlign: 'center'}}>
              <button className="btn-primary" onClick={() => setShowSecretaryForm(!showSecretaryForm)}>
                {showSecretaryForm ? 'إخفاء تسجيل السكرتير' : 'تسجيل سكرتير جديد'}
              </button>
            </div>

            {/* Secretary registration form */}
            {showSecretaryForm && (
              <div className="card" style={{flex:'1 1 300px'}}>
                <h3>إضافة سكرتير</h3>
                <form onSubmit={handleAddSecretary}>
                  <label>
                    الاسم:
                    <input
                      type="text"
                      value={secretaryName}
                      onChange={e => setSecretaryName(e.target.value)}
                      className="input"
                      required
                    />
                  </label>
                  <label>
                    الرمز:
                    <input
                      type="password"
                      value={secretaryCode}
                      onChange={e => setSecretaryCode(e.target.value)}
                      className="input"
                      required
                    />
                  </label>
                  <button type="submit" className="btn-primary">إضافة السكرتير</button>
                </form>
                {secretaryMessage && <p>{secretaryMessage}</p>}
                {lastAddedSecretary && (
                  <div style={{ marginTop: '10px', backgroundColor: '#e0ffe0', padding: '10px', borderRadius: '5px' }}>
                    <strong>السكرتير المضاف:</strong>
                    <p>الاسم: {lastAddedSecretary.name}</p>
                    <p>الرمز: {lastAddedSecretary.code}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, useContext, useRef, useEffect } from "react";
import { useClinic } from "./hooks";
import { ClinicContext } from "./context";
import PatientTable from "./PatientTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DoctorPage() {
  const { state, removePatient, addPatient, updatePatient, setStatus } = useClinic();
  const { addSecretary, user, users } = useContext(ClinicContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const prescriptionRef = useRef(null);
  const firstNameRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const medicalRef = useRef(null);
  const diabetesRef = useRef(null);
  const hypertensionRef = useRef(null);
  const asthmaRef = useRef(null);
  const allergiesRef = useRef(null);
  const otherRef = useRef(null);

  const patients = state.patients.sort((a, b) => b.createdAt - a.createdAt);

  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.load();
      videoRef.current.play().catch(err => alert('فشل تشغيل الفيديو: ' + err.message));
    }
  }, [isCameraOpen, stream]);

  useEffect(() => {
    if (showForm && !editingPatient && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [showForm, editingPatient]);

  function formatPrescription(text) {
    if (!text) return "RX\n\n- ";
    let lines = text.split('\n');
    if (lines[0] !== 'RX') {
      lines = ['RX', '', ...lines];
    }
    return lines.map(line => line === 'RX' || line === '' ? line : line.startsWith('-') ? line : '- ' + line.trim()).join('\n');
  }

  async function handleSavePDF() {
    const doc = new jsPDF('p', 'mm', 'a4');

    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];

      // Create HTML for this patient
      const detailsDiv = document.createElement('div');
      detailsDiv.style.position = 'absolute';
      detailsDiv.style.left = '-9999px';
      detailsDiv.style.top = '-9999px';
      detailsDiv.style.width = '210mm'; // A4 width
      detailsDiv.style.height = '297mm'; // A4 height
      detailsDiv.style.fontFamily = 'Arial, sans-serif';
      detailsDiv.style.fontSize = '16px';
      detailsDiv.style.padding = '40px 10px 10px 5px';
      detailsDiv.style.backgroundColor = '#f8fafc';
      detailsDiv.style.color = '#000';
      detailsDiv.style.direction = 'rtl';

      let htmlContent = `<h1 style="text-align: center; color: #2a5d9f; margin-bottom: 20px;">بيانات المريض ${i + 1}: ${patient.firstName} ${patient.lastName}</h1>`;
      htmlContent += `
        <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 10px; background-color: #e3f2fd; padding: 15px; border-radius: 5px;">
            <p style="margin: 2px 0; color: #1565c0;"><strong>الاسم:</strong> ${patient.firstName} ${patient.lastName}</p>
            <p style="margin: 2px 0; color: #1565c0; display: flex; justify-content: space-between;"><span><strong>العمر:</strong> ${patient.age}</span><span><strong>التاريخ:</strong> ${patient.visitDate}</span></p>
            <p style="margin: 2px 0; color: #1565c0;"><strong>الهاتف:</strong> ${patient.phone}</p>
            <p style="margin: 2px 0; color: #1565c0;"><strong>الجنس:</strong> ${patient.gender}</p>
          </div>
          <p style="margin: 5px 0;"><strong>العنوان:</strong> ${patient.address || 'غير محدد'}</p>
          <p style="margin: 5px 0;"><strong>الوصفة الطبية:</strong> ${patient.prescription || 'غير محدد'}</p>
        </div>
      `;

      detailsDiv.innerHTML = htmlContent;
      document.body.appendChild(detailsDiv);

      const canvas = await html2canvas(detailsDiv, { scale: 2, width: 794, height: 1123 }); // A4 at 96 DPI * 2
      document.body.removeChild(detailsDiv);

      const imgData = canvas.toDataURL('image/png');

      if (i > 0) {
        doc.addPage();
      }

      doc.addImage(imgData, 'PNG', 0, 0, 210, 297); // A4 size
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
            @page { size: A4; margin: 0; }
            body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; margin: 0; background-color: #f8fafc; }
            .container { position: relative; height: 1000px; }
            .card { background-color: #fff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 16px; width: 100%; max-width: 800px; margin: 0 auto; max-height: 950px; overflow: hidden; }
            .details { background-color: #e3f2fd; padding: 10px; border-radius: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; margin-bottom: 16px; }
            .details p { margin: 5px 0; color: #1565c0; }
            .prescription { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #fff; min-height: 600px; white-space: pre-wrap; margin-bottom: 16px; }
            .prescription p { margin: 0; font-size: 20px; line-height: 1.5; text-align: left; }
            .footer { position: absolute; bottom: 0; left: 20px; right: 20px; display: flex; justify-content: space-between; border-top: 2px solid #2a5d9f; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="doctor-info" style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2a5d9f; padding-bottom: 10px  ; ">
                <p><strong>الدكتور</strong></p>
                <p> ${user ? user.name : 'غير محدد'}</p>
                <p><strong>التخصص:</strong> ${user ? user.specialization || 'غير محدد' : 'غير محدد'}</p>
              </div>
              <div class="details">
                <p><strong>الاسم:</strong> ${selectedPatient.firstName} ${selectedPatient.lastName}</p>
                <p style="display: flex; justify-content: space-between;"><span><strong>العمر:</strong> ${selectedPatient.age}</span><span><strong>التاريخ:</strong> ${selectedPatient.visitDate}</span></p>
                <p><strong>الهاتف:</strong> ${selectedPatient.phone}</p>
                <p><strong>الجنس:</strong> ${selectedPatient.gender}</p>
              </div>
              <div class="prescription">
                <p>${prescription || 'غير محدد'}</p>
              </div>
            </div>
            <div class="footer">
              <p><strong>العنوان:</strong> ${user ? user.title || 'غير محدد' : 'غير محدد'}</p>
              <p><strong>الهاتف:</strong> ${user ? user.phone || 'غير محدد' : 'غير محدد'}</p>
            </div>
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
    const pres = patient.prescription || "";
    setPrescription(formatPrescription(pres));
  }



  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = prescriptionRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = prescription;
      const newValue = value.substring(0, start) + '\n' + value.substring(end);
      setPrescription(formatPrescription(newValue));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 3;
      }, 0);
    }
  }

  function saveAndFinish() {
    if (!selectedPatient) return;
    updatePatient(selectedPatient.id, { prescription });
    setStatus(selectedPatient.id, "done");
    setSelectedPatient(null);
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
    setCapturedImages(patient.cameraImages || []);
    setShowForm(true);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (editingPatient) {
      // Update existing patient
      updatePatient(editingPatient.id, {
        ...form,
        file: file,
        cameraImages: capturedImages
      });
    } else {
      // Add new patient
      const newPatient = {
        ...form,
        id: Date.now(),
        createdAt: Date.now(),
        visitDate: new Date().toISOString().slice(0, 10),
        status: "waiting",
        file: file,
        cameraImages: capturedImages
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
    setCapturedImages([]);
    setEditingPatient(null);
    setShowForm(false);
  }

  async function openCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      alert('لا يمكن الوصول إلى الكاميرا: ' + err.message);
    }
  }

  function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      setCapturedImages([...capturedImages, dataURL]);
      closeCamera(); // Close camera after capture
    }
  }

  function deleteImage(index) {
    setCapturedImages(capturedImages.filter((_, i) => i !== index));
  }

  function closeCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }

  return (
    <div className="page">
      <h2>🏥 صفحة الطبيب</h2>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingPatient(null); }}>
          إضافة مريض جديد
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingPatient ? 'تعديل معلومات المريض' : 'إضافة مريض جديد'}</h3>
          <form onSubmit={handleFormSubmit} onKeyDown={e => { if(e.key === 'Enter') e.preventDefault(); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label>
                الاسم الثلاثي
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); ageRef.current.focus(); } }}
                  ref={firstNameRef}
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
                  onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); phoneRef.current.focus(); } }}
                  ref={ageRef}
                  className="input"
                  required
                />
              </label>
              <label>
                الهاتف
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g, '') })}
                  onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addressRef.current.focus(); } }}
                  ref={phoneRef}
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
                  onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); genderRef.current.focus(); } }}
                  ref={addressRef}
                  className="input"
                />
              </label>
            </div>
            <label>
              الجنس
              <div style={{ display: 'flex', gap: '10px' }}>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="ذكر"
                    checked={form.gender === "ذكر"}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                    onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); medicalRef.current.focus(); } }}
                    ref={genderRef}
                    required
                  />
                  ذكر
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="أنثى"
                    checked={form.gender === "أنثى"}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                    onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); medicalRef.current.focus(); } }}
                    required
                  />
                  أنثى
                </label>
              </div>
            </label>

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
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        hypertensionRef.current.focus();
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        setForm({
                          ...form,
                          medicalHistory: { ...form.medicalHistory, diabetes: !form.medicalHistory.diabetes }
                        });
                        hypertensionRef.current.focus();
                      }
                    }}
                    ref={diabetesRef}
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
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        asthmaRef.current.focus();
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        diabetesRef.current.focus();
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        setForm({
                          ...form,
                          medicalHistory: { ...form.medicalHistory, hypertension: !form.medicalHistory.hypertension }
                        });
                        asthmaRef.current.focus();
                      }
                    }}
                    ref={hypertensionRef}
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
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        allergiesRef.current.focus();
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        hypertensionRef.current.focus();
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        setForm({
                          ...form,
                          medicalHistory: { ...form.medicalHistory, asthma: !form.medicalHistory.asthma }
                        });
                        allergiesRef.current.focus();
                      }
                    }}
                    ref={asthmaRef}
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
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        otherRef.current.focus();
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        asthmaRef.current.focus();
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        setForm({
                          ...form,
                          medicalHistory: { ...form.medicalHistory, allergies: !form.medicalHistory.allergies }
                        });
                        otherRef.current.focus();
                      }
                    }}
                    ref={allergiesRef}
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
              <label>صور من الكاميرا</label>
              {isCameraOpen && <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxWidth: '300px', border: '1px solid #ccc' }} />}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {capturedImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img src={img} alt={`الصورة ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ccc' }} />
                    <button type="button" onClick={() => deleteImage(index)} style={{ position: 'absolute', top: '0', right: '0', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                {!isCameraOpen && <button type="button" onClick={openCamera} className="btn-secondary">فتح الكاميرا</button>}
                {isCameraOpen && <button type="button" onClick={capturePhoto} className="btn-primary">التقاط الصورة</button>}
                {isCameraOpen && <button type="button" onClick={closeCamera} className="btn-outline">إغلاق الكاميرا</button>}
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
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

          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button onClick={handleSavePDF} className="btn-primary">حفظ البيانات</button>
            <button className="btn-primary" onClick={() => setShowSecretaryForm(!showSecretaryForm)}>
              {showSecretaryForm ? 'إخفاء تسجيل السكرتير' : 'تسجيل سكرتير جديد'}
            </button>
          </div>
        </div>

        <div className="card" style={{flex:'1 1 500px'}}>
          {/* Doctor Information Section */}
          {user && (
            <div className="doctor-info" style={{textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #2a5d9f', paddingBottom: '10px', backgroundColor: '#e3f2fd', borderRadius: '20px'}}>
              <p><strong>الدكتور</strong></p>
              <p>{user.name}</p>
              <p><strong>التخصص:</strong> {user.specialization || 'غير محدد'}</p>
            </div>
          )}

          <div style={{marginBottom:'16px'}}>
            {selectedPatient && (
              <div className="details" style={{backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '5px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px'}}>
                <p style={{margin: '5px 0', color: '#1565c0'}}><strong>الاسم:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                <p style={{margin: '5px 0', color: '#1565c0', display: 'flex', justifyContent: 'space-between'}}><span><strong>العمر:</strong> {selectedPatient.age}</span><span><strong>التاريخ:</strong> {selectedPatient.visitDate}</span></p>
                <p style={{margin: '5px 0', color: '#1565c0'}}><strong>الهاتف:</strong> {selectedPatient.phone}</p>
                <p style={{margin: '5px 0', color: '#1565c0'}}><strong>الجنس:</strong> {selectedPatient.gender}</p>
              </div>
            )}
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
                {selectedPatient.cameraImages && selectedPatient.cameraImages.length > 0 && (
                  <div>
                    <h4>الصور :</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedPatient.cameraImages.map((img, index) => (
                        <img key={index} src={img} alt={`صورة المريض ${index + 1}`} style={{ width: '150px', height: '150px', objectFit: 'cover', border: '1px solid #ccc' }} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <form>
            <label>
              <textarea
                ref={prescriptionRef}
                value={prescription}
                onChange={e => setPrescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input"
                rows="15"
                style={{ fontSize: '18px', textAlign: 'left', direction: 'ltr' }}
              />
            </label>
          </form>



          {user && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '2px solid #2a5d9f', paddingTop: '10px' }}>
              <p><strong>العنوان:</strong> {user.title || 'غير محدد'}</p>
              <p><strong>الهاتف:</strong> {user.phone || 'غير محدد'}</p>
            </div>
          )}
        </div>

        {user && (
          <>
            {/* Toggle button for secretary form */}
            <div style={{flexBasis: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px'}}>
              <button type="button" className="btn-primary" onClick={saveAndFinish}>حفظ وإنهاء</button>
              <button type="button" className="btn-outline" onClick={handlePrintPrescription}>طباعة الوصفة</button>
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

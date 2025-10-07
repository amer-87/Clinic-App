import React, { useState, useContext, useRef, useEffect } from "react";
import { useClinic } from "./hooks";
import { ClinicContext } from "./context";
import PatientTable from "./PatientTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DoctorPage() {
  const { state, removePatient, addPatient, updatePatient, setStatus, updateUser } = useClinic();
  const { user } = useContext(ClinicContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialization: "",
    title: "",
    phone: ""
  });



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
  const tableRef = useRef(null);

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
    const container = document.createElement('div');
    container.style.width = '210mm';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.direction = 'rtl';
    container.style.backgroundColor = '#fff';
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    // Title
    const title = document.createElement('h2');
    title.textContent = 'الوصفات الطبية';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.style.color = '#2a5d9f';
    container.appendChild(title);

    // Prescriptions
    patients.forEach((patient) => {
      if (patient.prescription) {
        const patientDiv = document.createElement('div');
        patientDiv.style.marginBottom = '20px';
        patientDiv.style.border = '1px solid #ddd';
        patientDiv.style.padding = '10px';
        patientDiv.style.borderRadius = '8px';
        patientDiv.style.backgroundColor = '#f9f9f9';

        const nameP = document.createElement('p');
        nameP.textContent = `المريض: ${patient.firstName} ${patient.lastName}`;
        nameP.style.fontSize = '16px';
        nameP.style.fontWeight = 'bold';
        nameP.style.marginBottom = '5px';
        patientDiv.appendChild(nameP);

        const detailsP = document.createElement('p');
        detailsP.style.fontSize = '14px';
        detailsP.style.color = '#555';
        detailsP.style.marginBottom = '10px';
        detailsP.style.display = 'flex';
        detailsP.style.justifyContent = 'space-between';

        const ageSpan = document.createElement('span');
        ageSpan.textContent = `العمر: ${patient.age}`;
        detailsP.appendChild(ageSpan);

        const phoneSpan = document.createElement('span');
        phoneSpan.textContent = `الهاتف: ${patient.phone}`;
        detailsP.appendChild(phoneSpan);

        const dateSpan = document.createElement('span');
        dateSpan.textContent = `التاريخ: ${patient.visitDate}`;
        detailsP.appendChild(dateSpan);

        patientDiv.appendChild(detailsP);

        const prescriptionP = document.createElement('p');
        prescriptionP.textContent = patient.prescription;
        prescriptionP.style.fontSize = '14px';
        prescriptionP.style.whiteSpace = 'pre-wrap';
        prescriptionP.style.textAlign = 'left';
        prescriptionP.style.direction = 'ltr';
        prescriptionP.style.border = '1px solid #eee';
        prescriptionP.style.padding = '8px';
        prescriptionP.style.backgroundColor = '#fff';
        prescriptionP.style.borderRadius = '4px';
        patientDiv.appendChild(prescriptionP);

        container.appendChild(patientDiv);
      }
    });

    document.body.appendChild(container);

    const canvas = await html2canvas(container, { scale: 2 });
    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a5');
    const imgWidth = 210;
    const pageHeight = 148;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('prescriptions.pdf');
  }

  function handlePrintPrescription() {
    if (!selectedPatient) return;
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <html>
        <head>
          <title>الوصفة الطبية</title>
          <style>
            @page { size: 297mm 210mm; margin: 10mm; }
            body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; margin: 0; background-color: #f8fafc; }
            .container { position: relative; height: auto; }
            .card { background-color: #fff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 16px; width: 100%; max-width: 800px; margin: 0 auto; }
            .details { background-color: #e3f2fd; padding: 10px; border-radius: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; margin-bottom: 16px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .details p { margin: 5px 0; color: #1565c0; }
            .prescription { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #fff; white-space: pre-wrap; margin-bottom: 16px; }
            .prescription p { margin: 0; font-size: 20px; line-height: 1.5; text-align: left; }
            .footer { background-color: #e3f2fd; padding: 10px; border-radius: 5px; display: flex; justify-content: space-between; margin-top: 16px; color: #1565c0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
              <div class="footer">
                <p><strong>العنوان:</strong> ${user ? user.title || 'غير محدد' : 'غير محدد'}</p>
                <p><strong>الهاتف:</strong> ${user ? user.phone || 'غير محدد' : 'غير محدد'}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    // After printing, save and finish
    updatePatient(selectedPatient.id, { prescription, prescriptionDate: new Date().toISOString() });
    setStatus(selectedPatient.id, "done");
    setSelectedPatient(null);
    setPrescription("");
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

  function handleDoctorSubmit(e) {
    e.preventDefault();
    updateUser(doctorForm);
    setShowDoctorForm(false);
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
      <div style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
        التاريخ والوقت: {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingPatient(null); }}>
          إضافة مريض جديد
        </button>
        <button className="btn-secondary" onClick={() => { setShowDoctorForm(true); setDoctorForm({ name: user?.name || '', specialization: user?.specialization || '', title: user?.title || '', phone: user?.phone || '' }); }}>
          تحديث معلومات الطبيب
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

      {showDoctorForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>تحديث معلومات الطبيب</h3>
          <form onSubmit={handleDoctorSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label>
                الاسم
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  className="input"
                  required
                />
              </label>
              <label>
                التخصص
                <input
                  type="text"
                  value={doctorForm.specialization}
                  onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                  className="input"
                />
              </label>
              <label>
                العنوان
                <input
                  type="text"
                  value={doctorForm.title}
                  onChange={e => setDoctorForm({ ...doctorForm, title: e.target.value })}
                  className="input"
                />
              </label>
              <label>
                الهاتف
                <input
                  type="tel"
                  value={doctorForm.phone}
                  onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value.replace(/[^0-9]/g, '') })}
                  className="input"
                />
              </label>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary">حفظ</button>
              <button type="button" className="btn-outline" onClick={() => setShowDoctorForm(false)}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
        <div className="card" style={{flex:'1 1 500px'}}>
          <h3>قائمة المراجعين </h3>
          <div ref={tableRef}>
            <PatientTable patients={patients} onEdit={handleEdit} onDelete={handleDelete} onRowClick={handleSelect} />
          </div>

          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button onClick={handleSavePDF} className="btn-primary">حفظ البيانات</button>
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
              <button type="button" className="btn-outline" onClick={handlePrintPrescription}>طباعة الوصفة</button>
            </div>


          </>
        )}
      </div>
    </div>
  );
}

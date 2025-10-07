import React, { useState, useRef, useEffect } from "react";
import { useClinic } from "./hooks";
import PatientTable from "./PatientTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SecretaryPage() {
  const { state, removePatient, addPatient, updatePatient, removeAllPatients } = useClinic();
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

  function handleClearAll() {
    if(window.confirm("هل أنت متأكد من مسح جميع بيانات المرضى؟")) {
      removeAllPatients();
    }
  }

  async function handleSavePDF() {
    const table = document.querySelector('.table');
    if (!table) {
      alert('لم يتم العثور على جدول البيانات للطباعة.');
      return;
    }

    // Create a container with date and table
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.direction = 'rtl';
    container.style.backgroundColor = '#fff';

    // Add date header
    const dateHeader = document.createElement('h2');
    dateHeader.textContent = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    dateHeader.style.textAlign = 'center';
    dateHeader.style.marginBottom = '20px';
    dateHeader.style.color = '#2a5d9f';
    container.appendChild(dateHeader);

    // Clone the table and append
    const tableClone = table.cloneNode(true);
    // Remove action buttons from clone
    const actionCells = tableClone.querySelectorAll('td:last-child, th:last-child');
    actionCells.forEach(cell => cell.remove());
    container.appendChild(tableClone);

    document.body.appendChild(container);

    const canvas = await html2canvas(container, { scale: 2 });
    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('l', 'mm', 'a5');
    const imgWidth = 210; // A5 landscape width in mm
    const pageHeight = 148; // A5 landscape height in mm
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
  const [file, setFile] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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

  function handleDelete(patient) {
    if(window.confirm(`هل أنت متأكد من حذف المراجع ${patient.name}؟`)) {
      removePatient(patient.id);
    }
  }

  function handleEdit(patient) {
    setEditingPatient(patient);
    setForm({
      firstName: patient.firstName || "",
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

  function handleSubmit(e) {
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
        diagnosis: "",
        prescription: "",
        file: file,
        cameraImages: capturedImages
      };
      addPatient(newPatient);
    }
    // Reset form
    setForm({
      firstName: "",
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

  const filteredPatients = state.patients
    .sort((a, b) => b.createdAt - a.createdAt);

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

  return (
    <div className="page">
      <h2>📋 صفحة السكرتير</h2>
      <div style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
        التاريخ والوقت: {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingPatient(null); }}>
          إضافة مريض جديد
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingPatient ? 'تعديل معلومات المريض' : 'إضافة مريض جديد'}</h3>
          <form onSubmit={handleSubmit} onKeyDown={e => { if(e.key === 'Enter') e.preventDefault(); }}>
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

      <PatientTable patients={filteredPatients} onDelete={handleDelete} onEdit={handleEdit} />

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
        <button className="btn-secondary" onClick={handleSavePDF}>
          حفظ البيانات
        </button>
        <button className="btn-danger" onClick={handleClearAll}>
          مسح الكل
        </button>
      </div>
    </div>
  );
}

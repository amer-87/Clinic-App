import React, { useState, useContext, useRef, useEffect, useMemo } from "react";
import { useClinic } from "./hooks";
import { ClinicContext } from "./context";
import PatientTable from "./PatientTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DoctorPage() {
  const { state, removePatient, addPatient, updatePatient, setStatus, removeAllPatients, updateUser } = useClinic();
  const { user } = useContext(ClinicContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState("");

  // Default doctor settings from user context
  const doctorSettings = useMemo(() => ({
    name: user?.name || "",
    specialization: user?.specialization || "",
    title: user?.title || "",
    phone: user?.phone || "",
    cardBackgroundColor: user?.cardBackgroundColor || "#ffffff",
    cardBorderColor: user?.cardBorderColor || "#e5e7eb",
    cardShadowColor: user?.cardShadowColor || "rgba(0,0,0,0.05)",
    formBackgroundColor: user?.formBackgroundColor || "#f0f9ff",
    formBorderColor: user?.formBorderColor || "#3b82f6",
    doctorInfoBackgroundColor: user?.doctorInfoBackgroundColor || "#dbeafe",
    doctorInfoBorderColor: user?.doctorInfoBorderColor || "#2563eb",
    doctorInfoTextColor: user?.doctorInfoTextColor || "#1e40af",
    detailsBackgroundColor: user?.detailsBackgroundColor || "#dbeafe",
    detailsTextColor: user?.detailsTextColor || "#1e40af",
    prescriptionTextColor: user?.prescriptionTextColor || "#000000",
    doctorInfoFontSize: user?.doctorInfoFontSize || "16",
    detailsFontSize: user?.detailsFontSize || "14",
    doctorInfoBackgroundImage: user?.doctorInfoBackgroundImage || "",
    textareaBackgroundImage: user?.textareaBackgroundImage || "",
    detailsBackgroundImage: user?.detailsBackgroundImage || ""
  }), [user]);

  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorForm, setDoctorForm] = useState(doctorSettings);

  // حالة للمعاينة المباشرة - تحتوي على الإعدادات المؤقتة
  const [previewSettings, setPreviewSettings] = useState(null);
  // حالة لحفظ القيم الأصلية قبل التعديل
  const [originalSettings, setOriginalSettings] = useState(null);

  useEffect(() => {
    if (showDoctorForm) {
      setDoctorForm(doctorSettings);
      setPreviewSettings(doctorSettings);
      setOriginalSettings(doctorSettings);
    }
  }, [showDoctorForm, doctorSettings]);

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

    const title = document.createElement('h2');
    title.textContent = 'الوصفات الطبية';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    title.style.color = '#2a5d9f';
    container.appendChild(title);

    patients.forEach((patient) => {
      if (patient.prescription) {
        const patientDiv = document.createElement('div');
        patientDiv.style.marginBottom = '20px';
        patientDiv.style.border = '1px solid #ddd';
        patientDiv.style.padding = '10px';
        patientDiv.style.borderRadius = '8px';
        patientDiv.style.backgroundColor = '#f9f9f9';

        const nameP = document.createElement('p');
        nameP.textContent = `المراجع: ${patient.firstName} ${patient.lastName}`;
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

    const cardBgColor = '#ffffff';
    const cardBorderColor = '#e5e7eb';
    const cardShadowColor = 'rgba(0,0,0,0.05)';

    const doctorInfoBgColor = '#e3f2fd';
    const doctorInfoBorderColor = '#2a5d9f';
    const doctorInfoTextColor = '#1e40af';
    const doctorInfoBgImage = '';
    const doctorInfoFontSize = '16';

    const detailsBgColor = '#e3f2fd';
    const detailsTextColor = '#1565c0';
    const detailsFontSize = '14';
    const detailsBgImage = '';

    const prescriptionTextColor = '#000000';
    const textareaBgImage = '';
    
    const doctorInfoBgStyle = doctorInfoBgImage 
      ? `background-image: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${doctorInfoBgImage}); background-size: cover; background-position: center; background-repeat: no-repeat;`
      : '';
    
    const detailsBgStyle = detailsBgImage 
      ? `background-image: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${detailsBgImage}); background-size: cover; background-position: center; background-repeat: no-repeat;`
      : '';
    
    const textareaBgStyle = textareaBgImage 
      ? `background-image: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${textareaBgImage}); background-size: cover; background-position: center; background-repeat: no-repeat;`
      : '';
    
    const htmlContent = `
      <html>
        <head>
          <title>الوصفة الطبية</title>
          <meta charset="UTF-8">
          <style>
            @page { 
              size: A4 landscape; 
              margin: 10mm; 
            }
            html, body { 
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
            }
            body { 
              font-family: 'Arial', 'Segoe UI', sans-serif; 
              direction: rtl; 
              background-color: #ffffff; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
            }
            .container { 
              position: relative;
              width: 50%;
              max-width: 148mm;
              display: flex;
              flex-direction: column;
              height: 100%;
              page-break-after: avoid;
              page-break-inside: avoid;
            }
            .card { 
              background-color: ${cardBgColor}; 
              border: 2px solid ${cardBorderColor};
              border-radius: 12px; 
              box-shadow: 0 2px 8px ${cardShadowColor}; 
              padding: 12px; 
              width: 100%;
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
              display: flex;
              flex-direction: column;
              height: 100%;
              max-height: 277mm;
              page-break-inside: avoid;
              page-break-after: avoid;
            }
            .content-wrapper {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .doctor-info {
              text-align: center; 
              margin-bottom: 8px; 
              border-bottom: 2px solid ${doctorInfoBorderColor}; 
              padding: 6px;
              background-color: ${doctorInfoBgColor};
              ${doctorInfoBgStyle}
              border-radius: 8px;
              font-size: ${Math.max(11, parseInt(doctorInfoFontSize) - 3)}px;
              color: ${doctorInfoTextColor};
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
            }
            .doctor-info p {
              margin: 2px 0;
              color: ${doctorInfoTextColor};
            }
            .doctor-info strong {
              font-size: ${Math.max(12, parseInt(doctorInfoFontSize) - 2)}px;
            }
            .details { 
              background-color: ${detailsBgColor}; 
              ${detailsBgStyle}
              padding: 6px; 
              border-radius: 6px; 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 3px; 
              margin-bottom: 8px; 
              font-size: ${Math.max(9, parseInt(detailsFontSize) - 3)}px;
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
            }
            .details p { 
              margin: 2px 0; 
              color: ${detailsTextColor}; 
            }
            .prescription { 
              padding: 8px; 
              border: 1px solid #cbd5e1; 
              border-radius: 6px; 
              background-color: #fff; 
              ${textareaBgStyle}
              white-space: pre-wrap; 
              margin-bottom: 8px;
              flex-grow: 1;
              overflow: hidden;
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
              max-height: 180mm;
            }
            .prescription p { 
              margin: 0; 
              font-size: 13px; 
              line-height: 1.3; 
              text-align: left; 
              direction: ltr;
              color: ${prescriptionTextColor};
            }
            .footer { 
              background-color: ${detailsBgColor}; 
              padding: 8px 12px; 
              margin-bottom: 0;
              border-radius: 6px; 
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              color: ${detailsTextColor}; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
              margin-top: auto;
              border: 2px solid ${doctorInfoBorderColor};
              border-top: 3px solid ${doctorInfoBorderColor};
              font-size: ${Math.max(10, parseInt(detailsFontSize) - 2)}px;
              page-break-inside: avoid;
              break-inside: avoid;
              flex-shrink: 0;
            }
            .footer p {
              margin: 0;
              font-weight: bold;
              color: ${detailsTextColor};
            }
            @media print {
              html, body {
                height: 100%;
                overflow: hidden;
              }
              .container {
                height: 90%;
                page-break-after: avoid;
                page-break-inside: avoid;
              }
              .card {
                height: 100%;
                max-height: 277mm;
                page-break-inside: avoid;
                page-break-after: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="content-wrapper">
                <div class="doctor-info">
                  <p><strong>الدكتور</strong></p>
                  <p>${(showDoctorForm && previewSettings ? previewSettings.name : doctorSettings.name) || 'غير محدد'}</p>
                  <p><strong>التخصص:</strong> ${(showDoctorForm && previewSettings ? previewSettings.specialization : doctorSettings.specialization) || 'غير محدد'}</p>
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
          </div>
          <script>
            // الانتظار حتى يتم تحميل المحتوى بالكامل قبل فتح نافذة الطباعة
            window.onload = function() {
              // تأخير قصير إضافي للتأكد من تحميل جميع الأنماط والصور
              setTimeout(function() {
                window.print();
                // إغلاق النافذة بعد الطباعة أو الإلغاء
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // حفظ بيانات المراجع بعد فتح نافذة الطباعة
    updatePatient(selectedPatient.id, { prescription, prescriptionDate: new Date().toISOString() });
    setStatus(selectedPatient.id, "done");
    setSelectedPatient(null);
    setPrescription("");
    
    // التمرير السلس إلى جدول المراجعين بعد الطباعة
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 600);
  }

  function handleSelect(patient) {
    const currentDate = new Date().toISOString().slice(0, 10);
    const updatedPatient = { ...patient, visitDate: currentDate };
    updatePatient(patient.id, { visitDate: currentDate });
    setSelectedPatient(updatedPatient);
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
    setShowForm(true);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (editingPatient) {
      updatePatient(editingPatient.id, { ...form });
    } else {
      const newPatient = {
        ...form,
        id: Date.now(),
        createdAt: Date.now(),
        visitDate: new Date().toISOString().slice(0, 10),
        status: "waiting"
      };
      addPatient(newPatient);
    }
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
    setEditingPatient(null);
    setShowForm(false);
  }

  function handleDoctorSubmit(e) {
    e.preventDefault();
    console.log("Doctor form submitted:", doctorForm);
    updateUser(doctorForm);
    alert("تم حفظ الإعدادات بنجاح!");
    setShowDoctorForm(false);
    setPreviewSettings(null);
    setOriginalSettings(null);
  }

  function handleCancelDoctorForm() {
    // إرجاع القيم الأصلية
    if (originalSettings) {
      setDoctorForm(originalSettings);
      setPreviewSettings(originalSettings);
    }
    setShowDoctorForm(false);
    setPreviewSettings(null);
    setOriginalSettings(null);
  }

  // دالة لتحديث المعاينة المباشرة
  function handlePreviewChange(field, value) {
    const updatedSettings = { ...doctorForm, [field]: value };
    setDoctorForm(updatedSettings);
    setPreviewSettings(updatedSettings);
  }

  function handleDeleteAll() {
    if (window.confirm('هل أنت متأكد من حذف جميع المراجعين؟ لا يمكن التراجع عن هذا الإجراء.')) {
      removeAllPatients();
      setSelectedPatient(null);
      setPrescription("");
      alert('تم حذف جميع المراجعين بنجاح');
    }
  }

  function handleImageUpload(e, imageType) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (imageType === 'doctorInfo') {
          handlePreviewChange('doctorInfoBackgroundImage', reader.result);
        } else if (imageType === 'textarea') {
          handlePreviewChange('textareaBackgroundImage', reader.result);
        } else if (imageType === 'details') {
          handlePreviewChange('detailsBackgroundImage', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage(imageType) {
    if (imageType === 'doctorInfo') {
      handlePreviewChange('doctorInfoBackgroundImage', '');
    } else if (imageType === 'textarea') {
      handlePreviewChange('textareaBackgroundImage', '');
    } else if (imageType === 'details') {
      handlePreviewChange('detailsBackgroundImage', '');
    }
  }

  return (
    <div className="page">
      <div className="doctor-page-header">
        <h2 className="doctor-page-title">
          <span className="icon">🏥</span>
          <span>عيادة الطبيب</span>
        </h2>
        <div className="doctor-page-datetime">
          {new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>



      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingPatient(null); }}>
          إضافة مراجع جديد
        </button>
        <button className="btn-secondary" onClick={() => { setShowDoctorForm(true); }}>
          تحديث معلومات الطبيب
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingPatient ? 'تعديل معلومات المراجع' : 'إضافة مراجع جديد'}</h3>
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

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary">
                {editingPatient ? 'تحديث المراجع' : 'إضافة المراجع'}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
              <label style={{ fontSize: '13px' }}>
                الاسم
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={e => handlePreviewChange('name', e.target.value)}
                  className="input"
                  style={{ fontSize: '12px', padding: '6px' }}
                  required
                />
              </label>
              <label style={{ fontSize: '13px' }}>
                التخصص
                <input
                  type="text"
                  value={doctorForm.specialization}
                  onChange={e => handlePreviewChange('specialization', e.target.value)}
                  className="input"
                  style={{ fontSize: '12px', padding: '6px' }}
                />
              </label>
              <label style={{ fontSize: '13px' }}>
                العنوان
                <input
                  type="text"
                  value={doctorForm.title}
                  onChange={e => handlePreviewChange('title', e.target.value)}
                  className="input"
                  style={{ fontSize: '12px', padding: '6px' }}
                />
              </label>
              <label style={{ fontSize: '13px' }}>
                الهاتف
                <input
                  type="tel"
                  value={doctorForm.phone}
                  onChange={e => handlePreviewChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                  className="input"
                  style={{ fontSize: '12px', padding: '6px' }}
                />
              </label>
            </div>

            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ marginTop: '0', marginBottom: '6px', color: '#2a5d9f', fontSize: '13px' }}>ألوان الفورم</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <label style={{ fontSize: '11px' }}>
                  خلفية
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doctorForm.cardBackgroundColor || "#ffffff"}
                      onChange={e => handlePreviewChange('cardBackgroundColor', e.target.value)}
                      style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', padding: '1px' }}
                    />
                    <input
                      type="text"
                      value={doctorForm.cardBackgroundColor || "#ffffff"}
                      onChange={e => handlePreviewChange('cardBackgroundColor', e.target.value)}
                      className="input"
                      placeholder="#ffffff"
                      style={{ flex: 1, fontSize: '10px', padding: '2px 4px' }}
                    />
                  </div>
                </label>
                <label style={{ fontSize: '11px' }}>
                  إطار
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doctorForm.cardBorderColor || "#e5e7eb"}
                      onChange={e => handlePreviewChange('cardBorderColor', e.target.value)}
                      style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', padding: '1px' }}
                    />
                    <input
                      type="text"
                      value={doctorForm.cardBorderColor || "#e5e7eb"}
                      onChange={e => handlePreviewChange('cardBorderColor', e.target.value)}
                      className="input"
                      placeholder="#e5e7eb"
                      style={{ flex: 1, fontSize: '10px', padding: '2px 4px' }}
                    />
                  </div>
                </label>
                <label style={{ fontSize: '11px' }}>
                  ظل
                  <input
                    type="text"
                    value={doctorForm.cardShadowColor || "rgba(0,0,0,0.05)"}
                    onChange={e => handlePreviewChange('cardShadowColor', e.target.value)}
                    className="input"
                    placeholder="rgba(0,0,0,0.05)"
                    style={{ fontSize: '10px', padding: '2px 4px' }}
                  />
                </label>
              </div>
            </div>

            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ marginTop: '0', marginBottom: '6px', color: '#2a5d9f', fontSize: '13px' }}>ألوان المحتوى</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <label style={{ fontSize: '11px' }}>
                  خلفية معلومات الطبيب
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doctorForm.doctorInfoBackgroundColor || "#dbeafe"}
                      onChange={e => handlePreviewChange('doctorInfoBackgroundColor', e.target.value)}
                      style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', padding: '1px' }}
                    />
                    <input
                      type="text"
                      value={doctorForm.doctorInfoBackgroundColor || "#dbeafe"}
                      onChange={e => handlePreviewChange('doctorInfoBackgroundColor', e.target.value)}
                      className="input"
                      placeholder="#dbeafe"
                      style={{ flex: 1, fontSize: '10px', padding: '2px 4px' }}
                    />
                  </div>
                </label>
                <label style={{ fontSize: '11px' }}>
                  إطار معلومات الطبيب
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doctorForm.doctorInfoBorderColor || "#2563eb"}
                      onChange={e => handlePreviewChange('doctorInfoBorderColor', e.target.value)}
                      style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', padding: '1px' }}
                    />
                    <input
                      type="text"
                      value={doctorForm.doctorInfoBorderColor || "#2563eb"}
                      onChange={e => handlePreviewChange('doctorInfoBorderColor', e.target.value)}
                      className="input"
                      placeholder="#2563eb"
                      style={{ flex: 1, fontSize: '10px', padding: '2px 4px' }}
                    />
                  </div>
                </label>
                <label style={{ fontSize: '11px' }}>
                  خلفية تفاصيل المراجع
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doctorForm.detailsBackgroundColor || "#dbeafe"}
                      onChange={e => handlePreviewChange('detailsBackgroundColor', e.target.value)}
                      style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', padding: '1px' }}
                    />
                    <input
                      type="text"
                      value={doctorForm.detailsBackgroundColor || "#dbeafe"}
                      onChange={e => handlePreviewChange('detailsBackgroundColor', e.target.value)}
                      className="input"
                      placeholder="#dbeafe"
                      style={{ flex: 1, fontSize: '10px', padding: '2px 4px' }}
                    />
                  </div>
                </label>
                <label style={{ fontSize: '11px' }}>
                  نص معلومات الطبيب
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doctorForm.doctorInfoTextColor || "#1e40af"}
                      onChange={e => handlePreviewChange('doctorInfoTextColor', e.target.value)}
                      style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', padding: '1px' }}
                    />
                    <input
                      type="text"
                      value={doctorForm.doctorInfoTextColor || "#1e40af"}
                      onChange={e => handlePreviewChange('doctorInfoTextColor', e.target.value)}
                      className="input"
                      placeholder="#1e40af"
                      style={{ flex: 1, fontSize: '10px', padding: '2px 4px' }}
                    />
                  </div>
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '6px' }}>
                <label style={{ fontSize: '11px' }}>
                  نص تفاصيل المراجع
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doctorForm.detailsTextColor || "#1e40af"}
                      onChange={e => handlePreviewChange('detailsTextColor', e.target.value)}
                      style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', padding: '1px' }}
                    />
                    <input
                      type="text"
                      value={doctorForm.detailsTextColor || "#1e40af"}
                      onChange={e => handlePreviewChange('detailsTextColor', e.target.value)}
                      className="input"
                      placeholder="#1e40af"
                      style={{ flex: 1, fontSize: '10px', padding: '2px 4px' }}
                    />
                  </div>
                </label>
                <label style={{ fontSize: '11px' }}>
                  نص الوصفة الطبية
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doctorForm.prescriptionTextColor || "#000000"}
                      onChange={e => handlePreviewChange('prescriptionTextColor', e.target.value)}
                      style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', borderRadius: '3px', cursor: 'pointer', padding: '1px' }}
                    />
                    <input
                      type="text"
                      value={doctorForm.prescriptionTextColor || "#000000"}
                      onChange={e => handlePreviewChange('prescriptionTextColor', e.target.value)}
                      className="input"
                      placeholder="#000000"
                      style={{ flex: 1, fontSize: '10px', padding: '2px 4px' }}
                    />
                  </div>
                </label>
              </div>
            </div>

            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <h4 style={{ marginTop: '0', marginBottom: '6px', color: '#2a5d9f', fontSize: '13px' }}>أحجام الخطوط والخلفيات</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <label style={{ fontSize: '11px' }}>
                  خط معلومات الطبيب
                  <input
                    type="number"
                    min="12"
                    max="24"
                    value={doctorForm.doctorInfoFontSize || "16"}
                    onChange={e => {
                      const value = Math.min(24, Math.max(12, parseInt(e.target.value) || 16));
                      handlePreviewChange('doctorInfoFontSize', value.toString());
                    }}
                    className="input"
                    placeholder="16"
                    style={{ fontSize: '11px', padding: '3px 5px' }}
                  />
                </label>
                <label style={{ fontSize: '11px' }}>
                  خط تفاصيل المراجع
                  <input
                    type="number"
                    min="10"
                    max="20"
                    value={doctorForm.detailsFontSize || "14"}
                    onChange={e => {
                      const value = Math.min(20, Math.max(10, parseInt(e.target.value) || 14));
                      handlePreviewChange('detailsFontSize', value.toString());
                    }}
                    className="input"
                    placeholder="14"
                    style={{ fontSize: '11px', padding: '3px 5px' }}
                  />
                </label>
                <label style={{ cursor: 'pointer', fontSize: '11px' }}>
                  خلفية معلومات
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'doctorInfo')}
                    style={{ fontSize: '11px', padding: '3px 5px' }}
                  />
                  {user?.doctorInfoBackgroundImage && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('doctorInfo')}
                      style={{ fontSize: '10px', padding: '2px 6px', marginTop: '4px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      حذف الصورة
                    </button>
                  )}
                </label>
                <label style={{ cursor: 'pointer', fontSize: '11px' }}>
                  خلفية الوصفة
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'textarea')}
                    style={{ fontSize: '11px', padding: '3px 5px' }}
                  />
                  {user?.textareaBackgroundImage && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('textarea')}
                      style={{ fontSize: '10px', padding: '2px 6px', marginTop: '4px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      حذف الصورة
                    </button>
                  )}
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '6px' }}>
                <label style={{ cursor: 'pointer', fontSize: '11px' }}>
                  خلفية تفاصيل المراجع
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'details')}
                    style={{ fontSize: '11px', padding: '3px 5px' }}
                  />
                  {user?.detailsBackgroundImage && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('details')}
                      style={{ fontSize: '10px', padding: '2px 6px', marginTop: '4px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      حذف الصورة
                    </button>
                  )}
                </label>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary">حفظ التغييرات</button>
              <button type="button" className="btn-outline" onClick={handleCancelDoctorForm}>إلغاء</button>
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
            <button onClick={handleDeleteAll} className="btn-outline" style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}>حذف الكل</button>
          </div>
        </div>

        <div
          className="card"
          style={{
            flex:'1 1 500px',
            backgroundColor: (showDoctorForm && previewSettings ? previewSettings.cardBackgroundColor : doctorSettings.cardBackgroundColor) || '#ffffff',
            borderColor: (showDoctorForm && previewSettings ? previewSettings.cardBorderColor : doctorSettings.cardBorderColor) || '#e5e7eb',
            boxShadow: `0 4px 6px ${(showDoctorForm && previewSettings ? previewSettings.cardShadowColor : doctorSettings.cardShadowColor) || 'rgba(0,0,0,0.05)'}`
          }}
        >
          <div
            className="doctor-info"
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              borderBottom: `2px solid ${(showDoctorForm && previewSettings ? previewSettings.doctorInfoBorderColor : doctorSettings.doctorInfoBorderColor) || '#2a5d9f'}`,
              paddingBottom: '10px',
              backgroundColor: (showDoctorForm && previewSettings ? previewSettings.doctorInfoBackgroundColor : doctorSettings.doctorInfoBackgroundColor) || '#e3f2fd',
              backgroundImage: (showDoctorForm && previewSettings ? previewSettings.doctorInfoBackgroundImage : doctorSettings.doctorInfoBackgroundImage) ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${showDoctorForm && previewSettings ? previewSettings.doctorInfoBackgroundImage : doctorSettings.doctorInfoBackgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '20px',
              fontSize: `${(showDoctorForm && previewSettings ? previewSettings.doctorInfoFontSize : doctorSettings.doctorInfoFontSize) || 16}px`,
              color: (showDoctorForm && previewSettings ? previewSettings.doctorInfoTextColor : doctorSettings.doctorInfoTextColor) || '#1e40af'
            }}
          >
            <p style={{ color: (showDoctorForm && previewSettings ? previewSettings.doctorInfoTextColor : doctorSettings.doctorInfoTextColor) || '#1e40af' }}><strong>الدكتور</strong></p>
            <p style={{ color: (showDoctorForm && previewSettings ? previewSettings.doctorInfoTextColor : doctorSettings.doctorInfoTextColor) || '#1e40af' }}>{(showDoctorForm && previewSettings ? previewSettings.name : doctorSettings.name) || 'غير محدد'}</p>
            <p style={{ color: (showDoctorForm && previewSettings ? previewSettings.doctorInfoTextColor : doctorSettings.doctorInfoTextColor) || '#1e40af' }}><strong>التخصص:</strong> {(showDoctorForm && previewSettings ? previewSettings.specialization : doctorSettings.specialization) || 'غير محدد'}</p>
          </div>

          <div style={{marginBottom:'16px'}}>
            {selectedPatient && (
              <div 
                className="details" 
                style={{
                  backgroundColor: (showDoctorForm && previewSettings ? previewSettings.detailsBackgroundColor : user?.detailsBackgroundColor) || '#e3f2fd', 
                  backgroundImage: (showDoctorForm && previewSettings ? previewSettings.detailsBackgroundImage : user?.detailsBackgroundImage) ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${showDoctorForm && previewSettings ? previewSettings.detailsBackgroundImage : user.detailsBackgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  padding: '10px', 
                  borderRadius: '5px', 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '1px',
                  fontSize: `${(showDoctorForm && previewSettings ? previewSettings.detailsFontSize : user?.detailsFontSize) || 14}px`
                }}
              >
                <p style={{margin: '5px 0', color: (showDoctorForm && previewSettings ? previewSettings.detailsTextColor : user?.detailsTextColor) || '#1565c0'}}><strong>الاسم:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                <p style={{margin: '5px 0', color: (showDoctorForm && previewSettings ? previewSettings.detailsTextColor : user?.detailsTextColor) || '#1565c0', display: 'flex', justifyContent: 'space-between'}}><span><strong>العمر:</strong> {selectedPatient.age}</span><span><strong>التاريخ:</strong> {selectedPatient.visitDate}</span></p>
                <p style={{margin: '5px 0', color: (showDoctorForm && previewSettings ? previewSettings.detailsTextColor : user?.detailsTextColor) || '#1565c0'}}><strong>الهاتف:</strong> {selectedPatient.phone}</p>
                <p style={{margin: '5px 0', color: (showDoctorForm && previewSettings ? previewSettings.detailsTextColor : user?.detailsTextColor) || '#1565c0'}}><strong>الجنس:</strong> {selectedPatient.gender}</p>
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
                  style={{ 
                    fontSize: '18px', 
                    textAlign: 'left', 
                    direction: 'ltr',
                    color: (showDoctorForm && previewSettings ? previewSettings.prescriptionTextColor : user?.prescriptionTextColor) || '#000000',
                    backgroundImage: (showDoctorForm && previewSettings ? previewSettings.textareaBackgroundImage : user?.textareaBackgroundImage) ? `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${showDoctorForm && previewSettings ? previewSettings.textareaBackgroundImage : user.textareaBackgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
            </label>
          </form>

          {user && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '2px solid #2a5d9f', paddingTop: '10px' }}>
              <p><strong>العنوان:</strong> {(showDoctorForm && previewSettings ? previewSettings.title : user.title) || 'غير محدد'}</p>
              <p><strong>الهاتف:</strong> {(showDoctorForm && previewSettings ? previewSettings.phone : user.phone) || 'غير محدد'}</p>
            </div>
          )}
        </div>

        {selectedPatient && (
          <>
            <div style={{flexBasis: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px'}}>
              <button type="button" className="btn-outline" onClick={handlePrintPrescription}>طباعة الوصفة</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useClinic } from "./hooks";
import PatientTable from "./PatientTable";
import StatsBar from "./StatsBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DoctorPage() {
  const { state, updatePatient, setStatus, setSelectedPatientId } = useClinic();
  const [selected, setSelected] = useState(null);


  const allPatients = state.patients.sort((a, b) => a.createdAt - b.createdAt);

  const defaultPatient = {
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    insurance: "",
    medicalHistory: {
      diabetes: false,
      hypertension: false,
      asthma: false,
      allergies: false,
      other: ""
    },
    currentSymptoms: {
      headache: false,
      fever: false,
      cough: false,
      fatigue: false
    },
    diagnosis: "",
    prescription: "",
    file: null
  };

  const displayPatient = selected || defaultPatient;

  useEffect(() => {
    // Removed auto-selection on reload to keep info blank
    if (selected) {
      const fresh = state.patients.find(p => p.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [state.patients, selected]);

  useEffect(() => {
    if (state.selectedPatientId) {
      const patient = state.patients.find(p => p.id === state.selectedPatientId);
      if (patient) setSelected(patient);
    }
  }, [state.selectedPatientId, state.patients]);

  function handleSave(fields) {
    if (selected) updatePatient(selected.id, fields);
  }

  async function handleSaveDataPDF() {
    if (allPatients.length === 0) {
      alert("لا توجد بيانات مراجعين لحفظها.");
      return;
    }
    // Create a hidden div with all patients' info, diagnosis, and prescription for PDF capture
    const pdfContent = document.getElementById("pdf-content");
    if (!pdfContent) {
      alert("PDF content container not found.");
      return;
    }
    // Use html2canvas to capture the content
    const canvas = await html2canvas(pdfContent, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save("all_patients_data.pdf");
  }





  return (
    <div className="page">
      <h2>🧑‍⚕️ واجهة الطبيب</h2>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: '2 1 600px' }}>
          <h1 style={{ backgroundColor: '#2a5d9f', color: 'white', padding: '10px', textAlign: 'center', marginBottom: '20px' }}>
            PATIENT RECORD
          </h1>
          {/* Patient Information Section */}
          <section style={{ backgroundColor: '#3b7dc4', padding: '10px', color: 'white', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>PATIENT INFORMATION</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div><strong>الاسم الثلاثي:</strong> {displayPatient.firstName}</div>
              <div><strong>Age:</strong> {displayPatient.age}</div>
              <div><strong>Gender:</strong> {displayPatient.gender}</div>
              <div><strong>Phone:</strong> {displayPatient.phone}</div>
              <div><strong>Email:</strong> {displayPatient.email}</div>
              <div><strong>Address:</strong> {displayPatient.address}</div>
              <div><strong>Insurance:</strong> {displayPatient.insurance}</div>
            </div>
          </section>

          <label>تشخيص الطبيب
            <textarea value={displayPatient.diagnosis || ""} onChange={e => handleSave({ diagnosis: e.target.value })} className="input" />
          </label>
          <label>وصفة/أدوية
            <textarea rows="10" value={displayPatient.prescription || ""} onChange={e => handleSave({ prescription: e.target.value })} className="input" />
          </label>
          {/* Removed notes field as per request */}
          {/* <label>ملاحظات
            <textarea value={displayPatient.notes || ""} onChange={e => handleSave({ notes: e.target.value })} className="input" />
          </label> */}

          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button className="btn-primary" disabled={!selected} onClick={() => setStatus(selected.id, "withDoctor")}>بدأ الكشف</button>
            <button className="btn-outline" disabled={!selected} onClick={() => {
              setStatus(selected.id, "done");
              setSelectedPatientId(null);
              setSelected(null);
            }}>إنهاء الحالة</button>
          </div>

          {selected && selected.file && (
            <div>
              <p>📷 تقرير/صورة المريض:</p>
              <img src={URL.createObjectURL(selected.file)} alt="تقرير المريض" style={{ width: "200px", borderRadius: "8px" }} />
            </div>
          )}
        </div>

        <div className="card" style={{ flex: '1 1 300px' }}>
          <h2>📊 الإحصائيات السريعة</h2>
          <StatsBar patients={allPatients} />
          <div style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>
            التاريخ: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <PatientTable patients={allPatients} onSelect={setSelected} />
          <div style={{ marginTop: '16px' }}>
            <button className="btn-secondary" onClick={handleSaveDataPDF}>حفظ البيانات</button>
          </div>
        </div>
      </div>

      {/* Hidden div for PDF content */}
      <div id="pdf-content" style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        backgroundColor: "white",
        color: "black",
        padding: "20px",
        width: "800px",
        direction: "rtl",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
          <h1 style={{ margin: 0 }}>المراجعين</h1>
          <div>{new Date().toLocaleDateString('ar-EG')}</div>
        </div>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          backgroundColor: "#fff"
        }}>
          <thead>
            <tr style={{
              backgroundColor: "#2a5d9f",
              color: "#fff"
            }}>
              <th style={{
                padding: "12px 16px",
                textAlign: "right",
                fontWeight: "bold",
                borderBottom: "2px solid #3b7dc4"
              }}>التسلسل</th>
              <th style={{
                padding: "12px 16px",
                textAlign: "right",
                fontWeight: "bold",
                borderBottom: "2px solid #3b7dc4"
              }}>الاسم</th>
              <th style={{
                padding: "12px 16px",
                textAlign: "right",
                fontWeight: "bold",
                borderBottom: "2px solid #3b7dc4"
              }}>العمر</th>
              <th style={{
                padding: "12px 16px",
                textAlign: "right",
                fontWeight: "bold",
                borderBottom: "2px solid #3b7dc4"
              }}>الجنس</th>
              <th style={{
                padding: "12px 16px",
                textAlign: "right",
                fontWeight: "bold",
                borderBottom: "2px solid #3b7dc4"
              }}>الهاتف</th>
              <th style={{
                padding: "12px 16px",
                textAlign: "right",
                fontWeight: "bold",
                borderBottom: "2px solid #3b7dc4"
              }}>الحالة</th>
              <th style={{
                padding: "12px 16px",
                textAlign: "right",
                fontWeight: "bold",
                borderBottom: "2px solid #3b7dc4"
              }}>التشخيص</th>
              <th style={{
                padding: "12px 16px",
                textAlign: "right",
                fontWeight: "bold",
                borderBottom: "2px solid #3b7dc4"
              }}>الوصفة</th>
            </tr>
          </thead>
          <tbody>
            {allPatients.map((p, index) => (
              <tr key={p.id} style={{
                backgroundColor: index % 2 === 0 ? "#f1f5f9" : "#fff"
              }}>
                <td style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb"
                }}>{index + 1}</td>
                <td style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb"
                }}>{p.firstName} {p.lastName}</td>
                <td style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb"
                }}>{p.age}</td>
                <td style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb"
                }}>{p.gender}</td>
                <td style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb"
                }}>{p.phone}</td>
                <td style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb"
                }}>{p.status}</td>
                <td style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb",
                  whiteSpace: "pre-wrap"
                }}>{p.diagnosis || "لا يوجد تشخيص"}</td>
                <td style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb",
                  whiteSpace: "pre-wrap"
                }}>{p.prescription || "لا توجد وصفة"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

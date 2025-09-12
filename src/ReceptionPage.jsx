import React, { useState } from "react";
import { useClinic } from "./hooks";
import { todayISO } from "./helpers"; // إذا استخدمت helpers.js، أو ضع الدالة هنا مباشرة
import PatientTable from "./PatientTable";
import StatsBar from "./StatsBar";

export default function ReceptionPage() {
  const { state, addPatient, updatePatient, removePatient } = useClinic();
  const [form,setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "ذكر",
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
    visitDate: todayISO()
  });
  const [query,setQuery] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);

  const patientsToday = state.patients.filter(p=>p.visitDate===form.visitDate).sort((a, b) => a.createdAt - b.createdAt);
  const filtered = (query.trim()===""
    ? patientsToday
    : patientsToday.filter(p=>[p.firstName,p.phone,p.complaint].some(v=>v?.toLowerCase().includes(query.toLowerCase())))).filter(p => !editingPatient || p.id !== editingPatient.id);

  function handleEdit(patient) {
    setEditingPatient(patient);
    setForm({
      firstName: patient.firstName,
      lastName: patient.lastName || "",
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      insurance: patient.insurance,
      medicalHistory: patient.medicalHistory,
      currentSymptoms: patient.currentSymptoms,
      visitDate: patient.visitDate
    });
  }

  function handleDelete(patient) {
    if(window.confirm(`هل أنت متأكد من حذف المراجع ${patient.name}؟`)) {
      removePatient(patient.id);
    }
  }

  function handleSubmit(e){
    e.preventDefault();
    if(!form.firstName || !form.age) return alert("يرجى إدخال الاسم الأول والعمر");
    if(editingPatient) {
      updatePatient(editingPatient.id, { ...form });
      setEditingPatient(null);
    } else {
      addPatient({
        ...form,
        id: Date.now().toString(),
        status: "waiting",
        createdAt: Date.now()
      });
    }
    setForm({
      firstName: "",
      lastName: "",
      age: "",
      gender: "ذكر",
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
      visitDate: todayISO()
    });
  }

  return (
    <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
      <div className="card" style={{flex:'1 1 700px'}}>
        <h1 className="section-title" style={{textAlign: 'center'}}>
          PATIENT RECORD
        </h1>
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'20px'}}>
          {/* Patient Information Section */}
          <section className="section-secondary">
            <h3 className="section-title">PATIENT INFORMATION</h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                <label>
                  الاسم الثلاثي:
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => setForm({...form, firstName: e.target.value})}
                    className="input"
                    style={{width: '100%'}}
                  />
                </label>
              <label>
                العمر:
                <input
                  type="number"
                  value={form.age}
                  onChange={e => setForm({...form, age: e.target.value})}
                  className="input"
                  style={{width: '100%'}}
                />
              </label>
              <label>
                Gender:
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <label style={{color: 'black'}}>
                    <input
                      type="radio"
                      name="gender"
                      value="ذكر"
                      checked={form.gender === 'ذكر'}
                      onChange={e => setForm({...form, gender: e.target.value})}
                    />
                    Male
                  </label>
                  <label style={{color: 'black'}}>
                    <input
                      type="radio"
                      name="gender"
                      value="أنثى"
                      checked={form.gender === 'أنثى'}
                      onChange={e => setForm({...form, gender: e.target.value})}
                    />
                    Female
                  </label>
                </div>
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="input"
                  style={{width: '100%'}}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="input"
                  style={{width: '100%'}}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  className="input"
                  style={{width: '100%'}}
                />
              </label>
              <label>
                Insurance:
                <input
                  type="text"
                  value={form.insurance}
                  onChange={e => setForm({...form, insurance: e.target.value})}
                  className="input"
                  style={{width: '100%'}}
                />
              </label>
            </div>
          </section>

          {/* Medical History Section */}
          <section className="section-accent">
            <h3 className="section-title section-title-secondary">MEDICAL HISTORY</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
              <label>
                <input
                  type="checkbox"
                  checked={form.medicalHistory.diabetes}
                  onChange={e => setForm({
                    ...form,
                    medicalHistory: {...form.medicalHistory, diabetes: e.target.checked}
                  })}
                />
                Diabetes
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.medicalHistory.hypertension}
                  onChange={e => setForm({
                    ...form,
                    medicalHistory: {...form.medicalHistory, hypertension: e.target.checked}
                  })}
                />
                Hypertension
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.medicalHistory.asthma}
                  onChange={e => setForm({
                    ...form,
                    medicalHistory: {...form.medicalHistory, asthma: e.target.checked}
                  })}
                />
                Asthma
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.medicalHistory.allergies}
                  onChange={e => setForm({
                    ...form,
                    medicalHistory: {...form.medicalHistory, allergies: e.target.checked}
                  })}
                />
                Allergies
              </label>
              <label style={{flexGrow: 1}}>
                <input
                  type="checkbox"
                  checked={form.medicalHistory.other !== ""}
                  onChange={e => setForm({
                    ...form,
                    medicalHistory: {...form.medicalHistory, other: e.target.checked ? form.medicalHistory.other : ""}
                  })}
                />
                Other
                <input
                  type="text"
                  value={form.medicalHistory.other}
                  onChange={e => setForm({
                    ...form,
                    medicalHistory: {...form.medicalHistory, other: e.target.value}
                  })}
                  disabled={form.medicalHistory.other === ""}
                  style={{marginLeft: '10px', width: '60%'}}
                />
              </label>
            </div>
          </section>

          {/* Current Symptoms Section */}
          <section className="section-accent">
            <h3 className="section-title section-title-secondary">CURRENT SYMPTOMS</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
              <label>
                <input
                  type="checkbox"
                  checked={form.currentSymptoms.headache}
                  onChange={e => setForm({
                    ...form,
                    currentSymptoms: {...form.currentSymptoms, headache: e.target.checked}
                  })}
                />
                Headache
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.currentSymptoms.fever}
                  onChange={e => setForm({
                    ...form,
                    currentSymptoms: {...form.currentSymptoms, fever: e.target.checked}
                  })}
                />
                Fever
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.currentSymptoms.cough}
                  onChange={e => setForm({
                    ...form,
                    currentSymptoms: {...form.currentSymptoms, cough: e.target.checked}
                  })}
                />
                Cough
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.currentSymptoms.fatigue}
                  onChange={e => setForm({
                    ...form,
                    currentSymptoms: {...form.currentSymptoms, fatigue: e.target.checked}
                  })}
                />
                Fatigue
              </label>
            </div>
          </section>

          <button className="btn-primary" type="submit" style={{alignSelf: 'center', width: '200px'}}>
            {editingPatient ? "تحديث" : "إضافة للمراجعين"}
          </button>
        </form>
      </div>

      <div className="card" style={{flex:'2 1 600px'}}>
        <h2>👥 مراجعي اليوم</h2>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="بحث بالاسم/الهاتف/الشكوى" className="input"/>
        <StatsBar patients={patientsToday}/>
        <PatientTable patients={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

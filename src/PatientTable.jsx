import React from "react";

export default function PatientTable({ patients, onEdit, onDelete, onEntry, onSelect }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>التسلسل</th>
          <th>الاسم</th>
          <th>العمر</th>
          <th>الجنس</th>
          <th>الهاتف</th>
          <th>الحالة</th>
          <th>الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p, index) => (
          <tr key={p.id} className={p.status === "done" ? "done" : "waiting"}>
            <td>{index + 1}</td>
            <td>{p.firstName} {p.lastName}</td>
            <td>{p.age}</td>
            <td>{p.gender}</td>
            <td>{p.phone}</td>
            <td>{p.status}</td>
            <td>
              {onSelect && <button className="btn-primary" onClick={() => onSelect(p)}>اختيار</button>}
              {onEdit && <button className="btn-secondary" onClick={() => onEdit(p)}>تعديل</button>}
              {onDelete && <button className="btn-danger" onClick={() => onDelete(p)}>مسح</button>}
              {onEntry && <button className="btn" onClick={() => onEntry(p)}>ادخال</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

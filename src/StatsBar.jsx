import React from "react";

export default function StatsBar({ patients }) {
  const waiting = patients.filter(p => p.status === "waiting").length;
  const withDoctor = patients.filter(p => p.status === "withDoctor").length;
  const done = patients.filter(p => p.status === "done").length;
  return (
    <div className="stats">
      <div>انتظار: {waiting}</div>
      <div>مع الطبيب: {withDoctor}</div>
      <div>منتهي: {done}</div>
    </div>
  );
}

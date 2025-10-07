export function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}

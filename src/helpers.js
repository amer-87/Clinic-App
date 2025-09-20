export function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}

// Email configuration
export const EMAIL_CONFIG = {
  serviceID: 'service_54hd7ve',
  templateID: 'template_4dg9cwd', // New template with approval links
  userID: '3R6jOm-e7QM3YUCAT',
  ownerEmail: 'aamerblack@gmail.com',
  baseURL: 'http://localhost:5173/owner'
};

// Email sending utility
export async function sendEmail(to, subject, message) {
  try {
    const { serviceID, templateID, userID } = EMAIL_CONFIG;
    
    const templateParams = {
      to_email: to,
      subject: subject,
      message: message,
      from_name: 'Clinic Management System'
    };

    // Import emailjs dynamically to avoid SSR issues
    const emailjs = await import('@emailjs/browser');
    return await emailjs.send(serviceID, templateID, templateParams, userID);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Send registration notification to owner with approval links
export async function sendRegistrationNotification(doctorData) {
  const approveURL = `${EMAIL_CONFIG.baseURL}?approve=${encodeURIComponent(doctorData.email)}`;
  const rejectURL = `${EMAIL_CONFIG.baseURL}?reject=${encodeURIComponent(doctorData.email)}`;

  const templateParams = {
    to_email: EMAIL_CONFIG.ownerEmail,
    name: doctorData.name,
    email: doctorData.email,
    phone: doctorData.phone || 'غير متوفر',
    specialization: doctorData.specialization || 'غير متوفر',
    title: doctorData.title || 'غير متوفر',
    licenseNumber: doctorData.licenseNumber || 'غير متوفر',
    date: new Date().toLocaleString('ar-EG'),
    approve_url: approveURL,
    reject_url: rejectURL,
    from_name: 'Clinic Management System'
  };

  try {
    const { serviceID, templateID, userID } = EMAIL_CONFIG;
    
    // Import emailjs dynamically to avoid SSR issues
    const emailjs = await import('@emailjs/browser');
    return await emailjs.send(serviceID, templateID, templateParams, userID);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Send approval notification to doctor
export async function sendApprovalNotification(doctorEmail, password) {
  const subject = 'تمت الموافقة على حسابك في عيادة الطبيب';
  const message = `
    تمت الموافقة على طلب تسجيلك في نظام عيادة الطبيب.
    
    بيانات الدخول:
    البريد الإلكتروني: ${doctorEmail}
    كلمة المرور: ${password} (كلمة المرور التي أدخلتها أثناء التسجيل)
    
    يمكنك تسجيل الدخول من خلال الرابط: http://localhost:5173/login
  `;

  return sendEmail(doctorEmail, subject, message);
}

// Send rejection notification to doctor
export async function sendRejectionNotification(doctorEmail, reason = '') {
  const subject = 'تم رفض طلب تسجيلك في عيادة الطبيب';
  const message = `
    نأسف لإبلاغك بأن طلب تسجيلك في نظام عيادة الطبيب قد تم رفضه.
    
    ${reason ? `السبب: ${reason}` : 'لأسباب إدارية'}
    
    يمكنك التواصل مع إدارة العيادة لمزيد من المعلومات.
  `;

  return sendEmail(doctorEmail, subject, message);
}

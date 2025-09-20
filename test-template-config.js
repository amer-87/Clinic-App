// Test script to verify EmailJS template configuration
const EMAIL_CONFIG = {
  serviceID: 'service_54hd7ve',
  templateID: 'template_4dg9cwd',
  userID: '3R6jOm-e7QM3YUCAT',
  ownerEmail: 'aamerblack@gmail.com',
  baseURL: 'http://localhost:5176/owner' // Updated port to 5176
};

console.log("Testing EmailJS Template Configuration...");
console.log("Service ID:", EMAIL_CONFIG.serviceID);
console.log("Template ID:", EMAIL_CONFIG.templateID);
console.log("User ID:", EMAIL_CONFIG.userID);
console.log("Owner Email:", EMAIL_CONFIG.ownerEmail);
console.log("Base URL:", EMAIL_CONFIG.baseURL);

// Test data
const testDoctor = {
  name: "دكتور أحمد",
  email: "doctor.ahmed@example.com",
  phone: "0123456789",
  specialization: "طب الأسرة",
  title: "دكتور",
  licenseNumber: "MED123456"
};

// Generate test URLs
const approveURL = `${EMAIL_CONFIG.baseURL}?approve=${encodeURIComponent(testDoctor.email)}`;
const rejectURL = `${EMAIL_CONFIG.baseURL}?reject=${encodeURIComponent(testDoctor.email)}`;

console.log("\nGenerated Test URLs:");
console.log("Approve URL:", approveURL);
console.log("Reject URL:", rejectURL);

console.log("\n⚠️ ISSUE DETECTED:");
console.log("Emails are being sent but without approval links.");
console.log("This means the EmailJS template is not configured with the required variables.");

console.log("\n🔧 SOLUTION:");
console.log("1. Go to https://www.emailjs.com/ and login");
console.log("2. Navigate to 'Email Templates'");
console.log("3. Edit template with ID: template_4dg9cwd");
console.log("4. Make sure the template HTML includes these variables:");
console.log("   - {{approve_url}}");
console.log("   - {{reject_url}}");
console.log("   - {{name}}, {{email}}, {{phone}}, {{specialization}}");
console.log("   - {{title}}, {{licenseNumber}}, {{date}}");

console.log("\n📋 Required Template HTML Structure:");
console.log(`<div style="font-family: Arial, sans-serif; text-align: center; direction: rtl;">
  <h2>طلب تسجيل طبيب جديد</h2>
  <p>قام الطبيب <strong>{{name}}</strong> بالتسجيل.</p>
  <p>البريد الإلكتروني: {{email}}</p>
  <p>الهاتف: {{phone}}</p>
  <p>التخصص: {{specialization}}</p>
  <p>عنوان الطبيب: {{title}}</p>
  <p>رقم الرخصة: {{licenseNumber}}</p>
  <p>تاريخ التسجيل: {{date}}</p>

  <div style="margin: 20px 0;">
    <a href="{{approve_url}}" 
       style="background-color: #28a745; color: #fff; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px; margin-right: 10px;">
       ✅ الموافقة
    </a>
    <a href="{{reject_url}}" 
       style="background-color: #dc3545; color: #fff; padding: 10px 20px; 
              text-decoration: none; border-radius: 5px;">
       ❌ الرفض
    </a>
  </div>

  <p>يمكنك اتخاذ القرار مباشرة من خلال الأزرار أعلاه.</p>
</div>`);

console.log("\n✅ After updating the template, test registration again.");
console.log("The email should now contain clickable approval/rejection buttons.");

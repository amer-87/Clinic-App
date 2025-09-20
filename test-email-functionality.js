// Test script to verify email functionality
// Note: This is for testing purposes only
const EMAIL_CONFIG = {
  serviceID: 'service_54hd7ve',
  templateID: 'template_yk39dej',
  userID: '3R6jOm-e7QM3YUCAT',
  ownerEmail: 'aamerblack@gmail.com',
  baseURL: 'http://localhost:5173/owner'
};


// Mock doctor data for testing
const testDoctor = {
  name: "دكتور أحمد",
  email: "doctor.ahmed@example.com",
  phone: "0123456789",
  specialization: "طب الأسرة",
  title: "دكتور",
  licenseNumber: "MED123456"
};

console.log("Testing email functionality...");
console.log("Template ID:", EMAIL_CONFIG.templateID);
console.log("Owner Email:", EMAIL_CONFIG.ownerEmail);
console.log("Base URL:", EMAIL_CONFIG.baseURL);

// Test URL generation
const approveURL = `${EMAIL_CONFIG.baseURL}?approve=${encodeURIComponent(testDoctor.email)}`;
const rejectURL = `${EMAIL_CONFIG.baseURL}?reject=${encodeURIComponent(testDoctor.email)}`;

console.log("\nGenerated URLs:");
console.log("Approve URL:", approveURL);
console.log("Reject URL:", rejectURL);

console.log("\nTo test the actual email sending, you need to:");
console.log("1. Make sure EmailJS is properly configured");
console.log("2. The template 'template_yk39dej' exists in your EmailJS account");
console.log("3. The template has the correct HTML structure with {{approve_url}} and {{reject_url}} variables");
console.log("4. Register a new doctor through the registration page");

console.log("\nTemplate should include these variables:");
console.log("- {{name}}, {{email}}, {{phone}}, {{specialization}}");
console.log("- {{title}}, {{licenseNumber}}, {{date}}");
console.log("- {{approve_url}}, {{reject_url}}");

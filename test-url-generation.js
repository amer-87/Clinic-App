// Test script to verify URL generation functionality
const EMAIL_CONFIG = {
  serviceID: 'service_54hd7ve',
  templateID: 'template_4dg9cwd',
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

console.log("Testing URL generation functionality...");
console.log("Fixed userID:", EMAIL_CONFIG.userID);
console.log("Template ID:", EMAIL_CONFIG.templateID);
console.log("Owner Email:", EMAIL_CONFIG.ownerEmail);
console.log("Base URL:", EMAIL_CONFIG.baseURL);

// Test URL generation
const approveURL = `${EMAIL_CONFIG.baseURL}?approve=${encodeURIComponent(testDoctor.email)}`;
const rejectURL = `${EMAIL_CONFIG.baseURL}?reject=${encodeURIComponent(testDoctor.email)}`;

console.log("\nGenerated URLs:");
console.log("Approve URL:", approveURL);
console.log("Reject URL:", rejectURL);

console.log("\nTo test the actual email sending:");
console.log("1. Make sure the development server is running on http://localhost:5173/");
console.log("2. Register a new doctor through the registration page");
console.log("3. Check if email is sent to aamerblack@gmail.com");
console.log("4. Click the approval/rejection links in the email");

console.log("\nThe issue was fixed:");
console.log("- Changed userID from '3R6jOm-e7QM3极UCAT' to '3R6jOm-e7QM3YUCAT'");
console.log("- Updated templateID to 'template_4dg9cwd'");

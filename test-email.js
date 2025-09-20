// Simple test script to check EmailJS configuration
import { sendRegistrationNotification } from './src/helpers.js';

// Test data
const testDoctor = {
  name: "Test Doctor",
  email: "test@example.com", 
  phone: "1234567890",
  specialization: "General Medicine",
  title: "Dr.",
  licenseNumber: "MED12345"
};

console.log("Testing EmailJS configuration...");

try {
  await sendRegistrationNotification(testDoctor);
  console.log("✅ Email sent successfully!");
} catch (error) {
  console.error("❌ Email sending failed:", error.message);
  console.error("Full error:", error);
}

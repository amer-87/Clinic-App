// Test script to verify email sending functionality
import { sendRegistrationNotification } from './src/helpers.js';

// Mock doctor data for testing
const testDoctor = {
  name: "دكتور أحمد",
  email: "doctor.ahmed@example.com", 
  phone: "0123456789",
  specialization: "طب الأسرة",
  title: "دكتور",
  licenseNumber: "MED123456"
};

console.log("Testing email sending to owner...");
console.log("Owner email: aamerblack@gmail.com");

try {
  const result = await sendRegistrationNotification(testDoctor);
  console.log("✅ Email sent successfully!");
  console.log("Result:", result);
} catch (error) {
  console.error("❌ Failed to send email:", error);
  console.log("Check the following:");
  console.log("1. EmailJS service ID: service_54hd7ve");
  console.log("2. EmailJS template ID: template_yk39dej"); 
  console.log("3. EmailJS user ID: 3R6jOm-e7QM3YUCAT");
  console.log("4. Make sure the template exists in your EmailJS account");
  console.log("5. Verify the template has {{approve_url}} and {{reject_url}} variables");
}

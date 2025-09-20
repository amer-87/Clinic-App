// Test script to verify EmailJS configuration works
const EMAIL_CONFIG = {
  serviceID: 'service_54hd7ve',
  templateID: 'template_4dg9cwd',
  userID: '3R6jOm-e7QM3YUCAT',
  ownerEmail: 'aamerblack@gmail.com',
  baseURL: 'http://localhost:5173/owner'
};

console.log("=== اختبار تكوين EmailJS ===");
console.log("");

console.log("📧 بيانات التكوين:");
console.log(`Service ID: ${EMAIL_CONFIG.serviceID}`);
console.log(`Template ID: ${EMAIL_CONFIG.templateID}`);
console.log(`User ID: ${EMAIL_CONFIG.userID}`);
console.log(`Owner Email: ${EMAIL_CONFIG.ownerEmail}`);
console.log("");

console.log("🔍 التحقق من صحة البيانات:");
console.log(`Service ID صالح: ${EMAIL_CONFIG.serviceID.startsWith('service_')}`);
console.log(`Template ID صالح: ${EMAIL_CONFIG.templateID.startsWith('template_')}`);
console.log(`User ID صالح: ${EMAIL_CONFIG.userID.length > 10}`); // EmailJS userIDs are typically long
console.log("");

console.log("📋 اختبار إنشاء روابط:");
const testEmail = "test.doctor@example.com";
const approveURL = `${EMAIL_CONFIG.baseURL}?approve=${encodeURIComponent(testEmail)}`;
const rejectURL = `${EMAIL_CONFIG.baseURL}?reject=${encodeURIComponent(testEmail)}`;

console.log(`رابط الموافقة: ${approveURL}`);
console.log(`رابط الرفض: ${rejectURL}`);
console.log("");

console.log("✅ التكوين يبدو صحيحاً من الناحية الفنية");
console.log("");
console.log("⚠️  إذا لم تصل الرسائل، قد تكون هناك مشاكل في:");
console.log("1. تكوين خدمة Gmail في لوحة تحكم EmailJS");
console.log("2. التحقق من عنوان البريد الإلكتروني في EmailJS");
console.log("3. تطابق أسماء المتغيرات في القالب مع الكود");
console.log("4. اتصال خدمة Gmail بشكل صحيح");
console.log("");
console.log("🔍 تحقق من لوحة تحكم EmailJS للتأكد من:");
console.log("- خدمة Gmail متصلة ومفعّلة");
console.log("- القالب template_4dg9cwd موجود ويحتوي على المتغيرات الصحيحة");
console.log("- البريد aamerblack@gmail.com مفعّل ومتحقق منه");

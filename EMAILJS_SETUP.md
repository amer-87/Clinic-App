# EmailJS Setup Instructions

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Connect your Gmail account (aamerblack@gmail.com)
5. Note down the Service ID

## Step 3: Create Email Templates
Create these templates in EmailJS dashboard:

### Template 1: Registration Notification to Owner
- **Name**: Clinic Registration Notification
- **Subject**: طلب تسجيل طبيب جديد - {{name}}
- **Content**:
```
هناك طلب تسجيل جديد من طبيب:

الاسم: {{name}}
البريد الإلكتروني: {{email}}
الهاتف: {{phone}}
التخصص: {{specialization}}
سنوات الخبرة: {{experience}}
رقم الرخصة: {{licenseNumber}}

تاريخ الطلب: {{date}}

يرجى مراجعة الطلب في لوحة تحكم المالك.
```

### Template 2: Approval Notification to Doctor
- **Name**: Doctor Approval Notification
- **Subject**: تمت الموافقة على حسابك في عيادة الطبيب
- **Content**:
```
تمت الموافقة على طلب تسجيلك في نظام عيادة الطبيب.

بيانات الدخول:
البريد الإلكتروني: {{email}}
كلمة المرور المؤقتة: {{password}}

يرجى تسجيل الدخول وتغيير كلمة المرور بعد أول دخول.

يمكنك تسجيل الدخول من خلال الرابط: http://localhost:5173/login
```

### Template 3: Rejection Notification to Doctor
- **Name**: Doctor Rejection Notification
- **Subject**: تم رفض طلب تسجيلك في عيادة الطبيب
- **Content**:
```
نأسف لإبلاغك بأن طلب تسجيلك في نظام عيادة الطبيب قد تم رفضه.

{{#if reason}}السبب: {{reason}}{{else}}لأسباب إدارية{{/if}}

يمكنك التواصل مع إدارة العيادة لمزيد من المعلومات.
```

## Step 4: Update Configuration
Update the following values in `src/helpers.js`:

```javascript
export const EMAIL_CONFIG = {
  serviceID: 'your_emailjs_service_id', // Replace with actual Service ID
  templateID: 'your_emailjs_template_id', // Replace with template ID for registration notifications
  userID: 'your_emailjs_user_id', // Replace with your Public Key from EmailJS
  ownerEmail: 'aamerblack@gmail.com' // Owner email for registration notifications
};
```

## Step 5: Test the Setup
1. Restart the development server
2. Test registration flow
3. Check if emails are being sent successfully

## Troubleshooting
- Make sure EmailJS templates use the correct variable names
- Verify that your email service is properly connected in EmailJS
- Check browser console for any email sending errors

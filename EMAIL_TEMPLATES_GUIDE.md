# EmailJS Templates Setup Guide

## Required Templates for Clinic Application

### Template 1: Registration Notification to Owner
**Purpose:** Notify owner when a new doctor registers with interactive approval buttons

**Template Name:** Clinic Registration Notification

**Subject:** طلب تسجيل طبيب جديد - {{name}}

**Content (HTML):**
```html
<div style="font-family: Arial, sans-serif; text-align: center; direction: rtl;">
  <h2>طلب تسجيل طبيب جديد</h2>
  <p>قام الطبيب <strong>{{name}}</strong> بالتسجيل.</p>
  <p>البريد الإلكتروني: {{email}}</p>
  <p>الهاتف: {{phone}}</p>
  <p>التخصص: {{specialization}}</p>
  <p>سنوات الخبرة: {{experience}}</p>
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
</div>
```

**Variables to define in EmailJS:**
- {{name}}
- {{email}} 
- {{phone}}
- {{specialization}}
- {{experience}}
- {{licenseNumber}}
- {{date}}
- {{approve_url}}
- {{reject_url}}


---

### Template 2: Approval Notification to Doctor
**Purpose:** Notify doctor when their registration is approved

**Template Name:** Doctor Approval Notification

**Subject:** تمت الموافقة على حسابك في عيادة الطبيب

**Content (Arabic):**
```
تمت الموافقة على طلب تسجيلك في نظام عيادة الطبيب.

بيانات الدخول:
البريد الإلكتروني: {{email}}
كلمة المرور المؤقتة: {{password}}

يرجى تسجيل الدخول وتغيير كلمة المرور بعد أول دخول.

يمكنك تسجيل الدخول من خلال الرابط: http://localhost:5173/login
```

**Variables to define in EmailJS:**
- {{email}}
- {{password}}

---

### Template 3: Rejection Notification to Doctor  
**Purpose:** Notify doctor when their registration is rejected

**Template Name:** Doctor Rejection Notification

**Subject:** تم رفض طلب تسجيلك في عيادة الطبيب

**Content (Arabic):**
```
نأسف لإبلاغك بأن طلب تسجيلك في نظام عيادة الطبيب قد تم رفضه.

{{#if reason}}السبب: {{reason}}{{else}}لأسباب إدارية{{/if}}

يمكنك التواصل مع إدارة العيادة لمزيد من المعلومات.
```

**Variables to define in EmailJS:**
- {{reason}} (optional)

---

## Setup Instructions:

1. **Create each template** in EmailJS dashboard under "Email Templates"
2. **Use the exact template names** shown above for consistency
3. **Define all variables** in the EmailJS template editor
4. **Copy the Template ID** for each template (will look like: template_xxxxxxxxx)
5. **Update the templateID** in src/helpers.js with the registration notification template ID

## Important Notes:
- Make sure variable names in EmailJS templates match exactly with the code
- Test each template by sending a test email from EmailJS dashboard
- The application will use the first template (registration notification) for initial emails
- Approval and rejection templates will be used from the OwnerPage component

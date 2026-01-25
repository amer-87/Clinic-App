# 🏥 ClinicApp - نظام إدارة عيادة طبية متكامل

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646cff.svg)
![Electron](https://img.shields.io/badge/Electron-26.2.0-47848f.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**نظام شامل لإدارة العيادات الطبية مع واجهة عصرية وميزات متقدمة**

[المميزات](#-المميزات) • [التثبيت](#-التثبيت-والتشغيل) • [الاستخدام](#-الاستخدام) • [التوثيق](#-التوثيق)

</div>

---

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [التثبيت والتشغيل](#-التثبيت-والتشغيل)
- [الاستخدام](#-الاستخدام)
- [البنية](#-بنية-المشروع)
- [التخصيص](#-التخصيص)
- [الطباعة](#-الطباعة)
- [التوثيق](#-التوثيق)
- [المساهمة](#-المساهمة)
- [الترخيص](#-الترخيص)

---

## 🌟 نظرة عامة

**ClinicApp** هو نظام إدارة عيادة طبية متكامل مبني باستخدام أحدث تقنيات الويب. يوفر النظام واجهة سهلة الاستخدام لإدارة المرضى، كتابة الوصفات الطبية، وطباعتها بتصميم احترافي مع دعم كامل للتخصيص.

### ✨ لماذا ClinicApp؟

- 🚀 **سريع وخفيف** - مبني على Vite لأداء فائق
- 🎨 **قابل للتخصيص بالكامل** - 17 خيار لون + صور خلفية
- 📱 **متجاوب** - يعمل على جميع الأجهزة
- 🖨️ **طباعة احترافية** - دعم كامل للألوان والصور
- 💾 **تخزين محلي** - لا حاجة لخادم أو إنترنت
- 🌐 **دعم كامل للعربية** - واجهة RTL احترافية
- 🖥️ **تطبيق مكتبي** - دعم Electron لـ Windows/Mac/Linux

---

## ✨ المميزات

### 👥 إدارة المرضى
- ✅ إضافة مرضى جدد مع معلومات شاملة
- ✅ تعديل بيانات المرضى
- ✅ حذف المرضى (فردي أو جماعي)
- ✅ عرض قائمة المرضى في جدول منظم
- ✅ تحديث تلقائي لتاريخ الزيارة
- ✅ تسجيل التاريخ الطبي الكامل:
  - السكري
  - ارتفاع ضغط الدم
  - الربو
  - الحساسية
  - أمراض أخرى

### 📝 الوصفات الطبية
- ✅ محرر وصفات متقدم
- ✅ تنسيق تلقائي (RX + شرطات)
- ✅ حفظ الوصفات مع بيانات المريض
- ✅ تعديل الوصفات السابقة
- ✅ طباعة احترافية
- ✅ حفظ جميع الوصفات في PDF

### 🎨 التخصيص الشامل
- ✅ **17 خيار لون مختلف:**
  - ألوان الفورم (Card)
  - ألوان المحتوى
  - ألوان معلومات الطبيب
  - ألوان تفاصيل المراجع
- ✅ **صور الخلفية:**
  - خلفية معلومات الطبيب
  - خلفية الوصفة الطبية
  - طبقة شفافة تلقائية
- ✅ **أحجام الخطوط:**
  - خط معلومات الطبيب (12-24px)
  - خط تفاصيل المراجع (10-20px)
- ✅ معاينة مباشرة للتغييرات

### 🖨️ الطباعة الاحترافية
- ✅ طباعة مع جميع الألوان المخصصة
- ✅ طباعة مع صور الخلفية
- ✅ تنسيق احترافي A5
- ✅ معلومات كاملة (طبيب + مريض + وصفة)
- ✅ دعم `-webkit-print-color-adjust: exact`

### 💾 التخزين والحفظ
- ✅ حفظ تلقائي في LocalStorage
- ✅ استرجاع البيانات عند إعادة التحميل
- ✅ مزامنة بين التبويبات المفتوحة
- ✅ حفظ PDF لجميع الوصفات
- ✅ معالجة شاملة للأخطاء

### 🔐 الأمان والمصادقة
- ✅ نظام تسجيل دخول
- ✅ حساب مالك افتراضي
- ✅ تسجيل دخول تلقائي
- ✅ تحديث بيانات الحساب
- ✅ تسجيل خروج آمن

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 19.1.1** - مكتبة واجهة المستخدم
- **React Router DOM 7.8.2** - التوجيه
- **Vite 7.1.2** - أداة البناء
- **CSS3** - التنسيق

### PDF & Printing
- **jsPDF 2.5.1** - توليد ملفات PDF
- **html2canvas 1.4.1** - تحويل HTML إلى صور
- **jsPDF-AutoTable 5.0.2** - جداول PDF

### Desktop App
- **Electron 26.2.0** - تطبيق مكتبي
- **Electron Builder 26.0.12** - بناء التطبيق

### Development Tools
- **ESLint 9.33.0** - فحص الكود
- **Vite Plugin React** - دعم React

---

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js (v18 أو أحدث)
- npm أو yarn

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/clinic-app.git

# الانتقال إلى مجلد المشروع
cd clinic-app

# تثبيت المكتبات
npm install
```

### التشغيل في وضع التطوير

```bash
# تشغيل خادم التطوير
npm run dev

# سيعمل التطبيق على
# http://localhost:5173
```

### البناء للإنتاج

```bash
# بناء التطبيق
npm run build

# معاينة البناء
npm run preview
```

### بناء تطبيق Electron

```bash
# بناء تطبيق مكتبي لـ Windows
npm run electron:build

# سيتم إنشاء ملف التثبيت في مجلد dist-electron
```

---

## 📖 الاستخدام

### 1. تسجيل الدخول

عند فتح التطبيق لأول مرة، سيتم تسجيل الدخول تلقائياً بحساب المالك:

```
البريد الإلكتروني: aamerblack@gmail.com
كلمة المرور: owner123
```

### 2. إضافة مريض جديد

1. اضغط على زر **"إضافة مراجع جديد"**
2. املأ البيانات المطلوبة:
   - الاسم الثلاثي (مطلوب)
   - العمر (مطلوب)
   - الجنس (مطلوب)
   - الهاتف (مطلوب)
   - العنوان (اختياري)
   - التاريخ الطبي
3. اضغط **"إضافة المراجع"**

### 3. كتابة وصفة طبية

1. اختر مريض من الجدول
2. اكتب الوصفة في المحرر
3. سيتم التنسيق تلقائياً (RX + شرطات)
4. اضغط **"طباعة الوصفة"** عند الانتهاء

### 4. تخصيص الألوان والخطوط

1. اضغط على **"تحديث معلومات الطبيب"**
2. املأ معلوماتك (اسم، تخصص، عنوان، هاتف)
3. اختر الألوان المفضلة:
   - ألوان الفورم (Card)
   - ألوان المحتوى
   - ألوان معلومات الطبيب
4. اختر أحجام الخطوط
5. ارفع صور الخلفية (اختياري)
6. اضغط **"حفظ التغييرات"**

### 5. طباعة الوصفات

1. اختر مريض
2. اكتب الوصفة
3. اضغط **"طباعة الوصفة"**
4. ستفتح نافذة الطباعة مع جميع التخصيصات
5. اطبع أو احفظ كـ PDF

### 6. حفظ جميع الوصفات

1. اضغط على **"حفظ البيانات"**
2. سيتم تحميل ملف PDF يحتوي على جميع الوصفات

---

## 📁 بنية المشروع

```
clinic-app/
├── public/                 # الملفات العامة
│   └── vite.svg
├── src/                    # الكود المصدري
│   ├── assets/            # الأصول (صور، أيقونات)
│   ├── App.jsx            # المكون الرئيسي
│   ├── App.css            # أنماط التطبيق
│   ├── main.jsx           # نقطة الدخول
│   ├── index.css          # أنماط عامة
│   ├── style.css          # أنماط إضافية
│   ├── context.jsx        # إدارة الحالة
│   ├── contextDef.jsx     # تعريف السياق
│   ├── hooks.js           # Custom Hooks
│   ├── helpers.js         # دوال مساعدة
│   ├── DoctorPage.jsx     # صفحة الطبيب
│   ├── OwnerPage.jsx      # صفحة المالك
│   ├── PatientTable.jsx   # جدول المرضى
│   ├── StatsBar.jsx       # شريط الإحصائيات
│   ├── ReceptionPage.jsx  # صفحة الاستقبال
│   └── RegistrationPage.jsx # صفحة التسجيل
├── build/                 # ملفات البناء
│   └── installer.nsi      # إعدادات NSIS
├── electron.cjs           # ملف Electron الرئيسي
├── index.html             # HTML الرئيسي
├── package.json           # التبعيات والسكريبتات
├── vite.config.js         # إعدادات Vite
├── eslint.config.js       # إعدادات ESLint
└── README.md              # هذا الملف
```

---

## 🎨 التخصيص

### الألوان المتاحة

#### ألوان الفورم (Card)
- `cardBackgroundColor` - خلفية الفورم
- `cardBorderColor` - إطار الفورم
- `cardShadowColor` - ظل الفورم

#### ألوان المحتوى
- `formBackgroundColor` - خلفية الفورم الداخلية
- `formBorderColor` - إطار الفورم الداخلي
- `doctorInfoBackgroundColor` - خلفية معلومات الطبيب
- `doctorInfoBorderColor` - إطار معلومات الطبيب
- `detailsBackgroundColor` - خلفية تفاصيل المراجع
- `detailsTextColor` - نص تفاصيل المراجع

### صور الخلفية

```javascript
// رفع صورة خلفية لمعلومات الطبيب
doctorInfoBackgroundImage: "data:image/png;base64,..."

// رفع صورة خلفية للوصفة الطبية
textareaBackgroundImage: "data:image/png;base64,..."
```

### أحجام الخطوط

```javascript
// حجم خط معلومات الطبيب (12-24px)
doctorInfoFontSize: "16"

// حجم خط تفاصيل المراجع (10-20px)
detailsFontSize: "14"
```

---

## 🖨️ الطباعة

### ميزات الطباعة

- ✅ **دعم كامل للألوان** - جميع الألوان المخصصة تظهر في الطباعة
- ✅ **دعم صور الخلفية** - الصور تظهر مع طبقة شفافة
- ✅ **تنسيق احترافي** - تصميم A5 مناسب للطباعة
- ✅ **معلومات كاملة** - اسم الطبيب، التخصص، بيانات المريض، الوصفة

### كيفية الطباعة

```javascript
// الطباعة تستخدم window.open مع HTML مخصص
handlePrintPrescription() {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
}
```

### CSS للطباعة

```css
@page { 
  size: 297mm 210mm; 
  margin: 10mm; 
}

body {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
```

---

## 📚 التوثيق

### ملفات التوثيق المتاحة

1. **TEST_REPORT.md** - تقرير الاختبار الشامل
2. **DETAILED_TEST_CHECKLIST.md** - قائمة اختبار تفصيلية (200+ اختبار)
3. **AUTOMATED_CODE_ANALYSIS.md** - تحليل الكود الآلي
4. **RECOMMENDATIONS.md** - توصيات التحسين والتطوير
5. **FINAL_TEST_SUMMARY.md** - الملخص النهائي

### API Reference

#### Context API

```javascript
// استخدام السياق
import { useClinic } from './hooks';

const { state, addPatient, updatePatient, removePatient } = useClinic();
```

#### إضافة مريض

```javascript
addPatient({
  id: Date.now(),
  firstName: "أحمد",
  lastName: "محمد",
  age: 30,
  gender: "ذكر",
  phone: "0123456789",
  address: "القاهرة",
  medicalHistory: {
    diabetes: false,
    hypertension: false,
    asthma: false,
    allergies: false,
    other: ""
  },
  createdAt: Date.now(),
  visitDate: new Date().toISOString().slice(0, 10),
  status: "waiting"
});
```

#### تحديث مريض

```javascript
updatePatient(patientId, {
  firstName: "أحمد المحدث",
  prescription: "RX\n- دواء 1\n- دواء 2"
});
```

---

## 🤝 المساهمة

نرحب بالمساهمات! إذا كنت ترغب في المساهمة:

1. Fork المشروع
2. أنشئ فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

### إرشادات المساهمة

- اتبع معايير الكود الموجودة
- أضف اختبارات للميزات الجديدة
- حدّث التوثيق
- اكتب رسائل commit واضحة

---

## 🐛 الإبلاغ عن المشاكل

إذا وجدت مشكلة، يرجى فتح Issue مع:

- وصف واضح للمشكلة
- خطوات إعادة إنتاج المشكلة
- لقطات شاشة (إن أمكن)
- معلومات البيئة (نظام التشغيل، المتصفح، إلخ)

---

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

```
MIT License

Copyright (c) 2024 amer-87

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 المطور

**amer-87**

- GitHub: [@amer-87](https://github.com/amer-87)
- Email: aamerblack@gmail.com

---

## 🙏 شكر وتقدير

- [React](https://react.dev) - مكتبة واجهة المستخدم
- [Vite](https://vitejs.dev) - أداة البناء
- [Electron](https://www.electronjs.org) - إطار التطبيقات المكتبية
- [jsPDF](https://github.com/parallax/jsPDF) - توليد PDF
- [html2canvas](https://html2canvas.hertzen.com) - تحويل HTML

---

## 📊 الإحصائيات

![GitHub stars](https://img.shields.io/github/stars/yourusername/clinic-app?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/clinic-app?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/clinic-app)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/clinic-app)

---

## 🗺️ خارطة الطريق

- [x] نظام إدارة المرضى
- [x] كتابة الوصفات الطبية
- [x] طباعة احترافية
- [x] تخصيص شامل
- [x] تطبيق Electron
- [ ] نظام المواعيد
- [ ] نظام الفواتير
- [ ] تقارير وإحصائيات
- [ ] تطبيق موبايل
- [ ] نظام مستخدمين متعدد

---

## 📞 الدعم

للحصول على الدعم:

- 📧 Email: aamerblack@gmail.com
- 💬 GitHub Issues: [افتح Issue](https://github.com/yourusername/clinic-app/issues)
- 📖 التوثيق: [Wiki](https://github.com/yourusername/clinic-app/wiki)

---

<div align="center">

**صُنع بـ ❤️ في مصر**

⭐ إذا أعجبك المشروع، لا تنسَ إعطائه نجمة! ⭐

</div>

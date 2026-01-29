# ClinicApp 🏥

نظام إدارة عيادة طبية متكامل مبني باستخدام React + Vite + Electron

## المميزات ✨

- 📋 إدارة المرضى والمراجعين
- 👨‍⚕️ صفحة خاصة للطبيب
- 📝 كتابة وطباعة الوصفات الطبية
- 📊 إحصائيات وتقارير
- 🎨 واجهة مستخدم عصرية وسهلة الاستخدام
- 💾 حفظ البيانات محلياً
- 🖨️ طباعة الوصفات بتصميم احترافي
- 💻 تطبيق سطح مكتب قابل للتثبيت

## التقنيات المستخدمة 🛠️

- React 19
- Vite
- Electron - لتطبيق سطح المكتب
- jsPDF - لتوليد ملفات PDF
- html2canvas - لتحويل HTML إلى صور
- LocalStorage - لحفظ البيانات
- electron-builder - لبناء المثبت

## 📦 تحميل التطبيق الجاهز

### للمستخدمين النهائيين

إذا كنت تريد فقط استخدام التطبيق:

1. **حمّل أحد الملفات:**
   - `Clinic App-Setup-1.0.0.exe` - للتثبيت على Windows
   - `Clinic App-Portable-1.0.0.exe` - للتشغيل بدون تثبيت

2. **شغّل الملف** واتبع التعليمات

3. **ابدأ الاستخدام!**

📖 **للمزيد من التفاصيل:** راجع [دليل التوزيع](DISTRIBUTION_GUIDE.md)

---

## 🚀 للمطورين

### التثبيت والتشغيل

```bash
# تثبيت المكتبات
npm install

# تشغيل المشروع في وضع التطوير (متصفح)
npm run dev

# تشغيل كتطبيق Electron
npm run electron:serve

# بناء المشروع للإنتاج
npm run build
```

### بناء تطبيق سطح المكتب

#### الطريقة السريعة (Windows)

انقر نقراً مزدوجاً على:
```
build-installer.bat
```

#### استخدام سطر الأوامر

```bash
# بناء المثبت والنسخة المحمولة
npm run dist

# بناء النسخة المحمولة فقط
npm run dist:portable

# بناء وتشغيل Electron
npm run electron:build
```

### الملفات الناتجة

بعد البناء، ستجد في `dist-electron/`:
- `Clinic App-Setup-1.0.0.exe` - ملف المثبت
- `Clinic App-Portable-1.0.0.exe` - النسخة المحمولة

### اختبار المثبت

```bash
# تشغيل سكريبت الاختبار
test-installer.bat
```

---

## 📖 الاستخدام

### للمستخدمين

1. **صفحة التسجيل**: تسجيل الدخول كطبيب أو موظف استقبال
2. **صفحة الطبيب**: إدارة المرضى وكتابة الوصفات الطبية
3. **صفحة الاستقبال**: إضافة مرضى جدد وإدارة المواعيد

### للمطورين

راجع الملفات التالية:
- 📦 [دليل التوزيع](DISTRIBUTION_GUIDE.md) - كيفية بناء وتوزيع التطبيق
- 🎨 [تعليمات الأيقونة](build/ICON_INSTRUCTIONS.md) - إضافة أيقونة مخصصة
- ✅ [قائمة المهام](TODO_DISTRIBUTION.md) - تتبع التقدم

---

## 🔧 البنية التقنية

```
clinic/
├── src/                    # ملفات المصدر
│   ├── App.jsx            # المكون الرئيسي
│   ├── DoctorPage.jsx     # صفحة الطبيب
│   ├── ReceptionPage.jsx  # صفحة الاستقبال
│   └── ...
├── build/                  # ملفات البناء
│   ├── icon.ico           # أيقونة التطبيق
│   └── installer.nsi      # إعدادات NSIS
├── dist/                   # ملفات البناء (Vite)
├── dist-electron/          # ملفات المثبت
├── electron.cjs            # ملف Electron الرئيسي
├── package.json            # إعدادات المشروع
├── build-installer.bat     # سكريبت البناء
└── test-installer.bat      # سكريبت الاختبار
```

---

## 🎨 تخصيص التطبيق

### إضافة أيقونة مخصصة

1. أنشئ ملف `icon.ico` (256x256 بكسل)
2. ضعه في `build/icon.ico`
3. أعد بناء التطبيق

راجع [تعليمات الأيقونة](build/ICON_INSTRUCTIONS.md) للتفاصيل.

### تغيير اسم التطبيق

في `package.json`:
```json
{
  "name": "clinic-app",
  "productName": "Clinic App",
  "version": "1.0.0"
}
```

---

## 📊 متطلبات النظام

### للتطوير
- Node.js 16 أو أحدث
- npm 7 أو أحدث
- Windows 7 أو أحدث

### للمستخدمين النهائيين
- Windows 7/8/10/11 (64-bit)
- 2 GB RAM على الأقل
- 300 MB مساحة فارغة

---

## 🐛 حل المشاكل

### مشاكل البناء

```bash
# حذف node_modules وإعادة التثبيت
rmdir /s /q node_modules
npm install

# حذف ملفات البناء القديمة
rmdir /s /q dist
rmdir /s /q dist-electron
```

### مشاكل التشغيل

راجع [دليل التوزيع](DISTRIBUTION_GUIDE.md) - قسم "حل المشاكل الشائعة"

---

## 📝 السكريبتات المتاحة

| السكريبت | الوصف |
|----------|-------|
| `npm run dev` | تشغيل في وضع التطوير (متصفح) |
| `npm run build` | بناء للإنتاج |
| `npm run electron:serve` | تشغيل كتطبيق Electron |
| `npm run electron:build` | بناء وتشغيل Electron |
| `npm run dist` | بناء المثبت والنسخة المحمولة |
| `npm run dist:portable` | بناء النسخة المحمولة فقط |

---

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:

1. عمل Fork للمشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. فتح Pull Request

---

## 📞 الدعم

- **المطور:** amer-87
- **الإصدار:** 1.0.0
- **الترخيص:** MIT License

---

## 📚 موارد إضافية

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [electron-builder Documentation](https://www.electron.build/)

---

**آخر تحديث:** ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}

**الإصدار:** 1.0.0

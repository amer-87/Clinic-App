# دليل نقل المشروع إلى مستودع GitHub جديد

## الخطوة 1: إنشاء مستودع جديد على GitHub

1. افتح المتصفح واذهب إلى: https://github.com/new
2. املأ المعلومات التالية:
   - **Repository name**: `ClinicApp`
   - **Description**: نظام إدارة العيادات الطبية
   - **Visibility**: اختر Public أو Private حسب رغبتك
   - **لا تقم بتحديد** "Initialize this repository with a README"
3. اضغط على "Create repository"

## الخطوة 2: دفع المشروع إلى المستودع الجديد

بعد إنشاء المستودع، سيظهر لك رابط المستودع الجديد. استخدم الأوامر التالية:

### الطريقة الأولى: إذا كان المستودع الجديد فارغاً تماماً

```powershell
# الانتقال إلى مجلد المشروع
cd clinic

# إضافة المستودع الجديد كـ remote
git remote add neworigin https://github.com/amer-87/ClinicApp.git

# دفع جميع الفروع إلى المستودع الجديد
git push neworigin --all

# دفع جميع الـ tags
git push neworigin --tags

# جعل المستودع الجديد هو الأساسي
git remote remove origin
git remote rename neworigin origin
```

### الطريقة الثانية: إذا كنت تريد البدء من فرع معين فقط

```powershell
# الانتقال إلى مجلد المشروع
cd clinic

# التأكد من أنك على الفرع الصحيح
git checkout blackboxai/backup-latest-changes

# إضافة المستودع الجديد
git remote add neworigin https://github.com/amer-87/ClinicApp.git

# دفع الفرع الحالي
git push -u neworigin blackboxai/backup-latest-changes

# إذا كنت تريد جعله الفرع الرئيسي (main)
git checkout -b main
git push -u neworigin main
```

## الخطوة 3: حذف المستودع القديم clinic319

### الطريقة الأولى: من خلال GitHub (موصى بها)

1. اذهب إلى: https://github.com/amer-87/clinic319
2. اضغط على "Settings" (الإعدادات)
3. انزل إلى الأسفل حتى تجد "Danger Zone"
4. اضغط على "Delete this repository"
5. اتبع التعليمات لتأكيد الحذف

### الطريقة الثانية: إزالة الـ remote فقط من المشروع المحلي

```powershell
# إزالة المستودع القديم من الـ remotes
git remote remove origin

# أو إذا كنت تريد الاحتفاظ به باسم مختلف
git remote rename origin old-clinic319
```

## الخطوة 4: التحقق من النجاح

```powershell
# التحقق من الـ remotes الحالية
git remote -v

# يجب أن ترى:
# origin  https://github.com/amer-87/ClinicApp.git (fetch)
# origin  https://github.com/amer-87/ClinicApp.git (push)
```

## ملاحظات مهمة

- تأكد من حفظ أي تغييرات قبل البدء
- يمكنك الاحتفاظ بنسخة احتياطية من المشروع قبل الحذف
- إذا كان لديك collaborators آخرون، أخبرهم بالتغيير

## الحالة الحالية للمشروع

- **الفرع الحالي**: blackboxai/backup-latest-changes
- **آخر commit**: Update DoctorPage.jsx - Final changes before migration to ClinicApp
- **الملفات المعدلة**: تم حفظها جميعاً

## الأوامر السريعة (نسخ ولصق)

```powershell
# الانتقال للمشروع
cd clinic

# إضافة المستودع الجديد
git remote add neworigin https://github.com/amer-87/ClinicApp.git

# دفع جميع الفروع
git push neworigin --all

# دفع الـ tags
git push neworigin --tags

# استبدال origin
git remote remove origin
git remote rename neworigin origin

# التحقق
git remote -v
```

---

**تم إنشاء هذا الدليل بواسطة BLACKBOXAI**

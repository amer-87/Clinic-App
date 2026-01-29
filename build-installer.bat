@echo off
chcp 65001 >nul
echo ========================================
echo 🏥 Clinic App - بناء المثبت
echo ========================================
echo.

REM التحقق من وجود Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ خطأ: Node.js غير مثبت!
    echo الرجاء تثبيت Node.js من: https://nodejs.org/
    pause
    exit /b 1
)

REM التحقق من وجود npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ خطأ: npm غير متوفر!
    pause
    exit /b 1
)

echo ✅ Node.js و npm متوفران
echo.

REM التحقق من وجود node_modules
if not exist "node_modules\" (
    echo 📦 تثبيت المكتبات المطلوبة...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ فشل تثبيت المكتبات!
        pause
        exit /b %errorlevel%
    )
    echo ✅ تم تثبيت المكتبات بنجاح
    echo.
)

REM حذف ملفات البناء القديمة
echo 🧹 تنظيف ملفات البناء القديمة...
if exist "dist\" (
    rmdir /s /q "dist"
    echo ✅ تم حذف مجلد dist القديم
)
if exist "dist-electron\" (
    rmdir /s /q "dist-electron"
    echo ✅ تم حذف مجلد dist-electron القديم
)
echo.

REM بناء التطبيق
echo 🔨 بناء التطبيق...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ فشل بناء التطبيق!
    pause
    exit /b %errorlevel%
)
echo ✅ تم بناء التطبيق بنجاح
echo.

REM التحقق من وجود الأيقونة
if not exist "build\icon.ico" (
    echo ⚠️  تحذير: لم يتم العثور على أيقونة مخصصة
    echo سيتم استخدام الأيقونة الافتراضية
    echo لإضافة أيقونة مخصصة، راجع: build\ICON_INSTRUCTIONS.md
    echo.
)

REM إنشاء المثبت
echo 📦 إنشاء ملف المثبت...
echo هذه العملية قد تستغرق بضع دقائق...
echo.
call npx electron-builder --win --config.forceCodeSigning=false

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  ملاحظة: حدثت بعض المشاكل أثناء إنشاء المثبت
    echo لكن الملفات قد تكون موجودة في مجلد dist-electron
    echo.
) else (
    echo.
    echo ========================================
    echo ✅ تم إنشاء المثبت بنجاح!
    echo ========================================
    echo.
)

REM عرض الملفات المنشأة
if exist "dist-electron\" (
    echo 📁 الملفات المنشأة:
    echo.
    dir /b "dist-electron\*.exe" 2>nul
    echo.
    echo 📍 الموقع: %CD%\dist-electron\
    echo.
    echo 💡 يمكنك الآن:
    echo    1. اختبار المثبت على جهازك
    echo    2. مشاركة ملف Setup مع الأصدقاء
    echo    3. استخدام النسخة Portable بدون تثبيت
    echo.
) else (
    echo ❌ لم يتم العثور على مجلد dist-electron
    echo الرجاء التحقق من الأخطاء أعلاه
    echo.
)

echo ========================================
pause

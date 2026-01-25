@echo off
chcp 65001 >nul
echo ========================================
echo 🧪 اختبار ملفات المثبت
echo ========================================
echo.

REM التحقق من وجود مجلد dist-electron
if not exist "dist-electron\" (
    echo ❌ خطأ: مجلد dist-electron غير موجود!
    echo.
    echo يجب بناء التطبيق أولاً باستخدام:
    echo   build-installer.bat
    echo.
    pause
    exit /b 1
)

echo ✅ مجلد dist-electron موجود
echo.

REM البحث عن ملفات المثبت
echo 🔍 البحث عن ملفات المثبت...
echo.

set SETUP_FOUND=0
set PORTABLE_FOUND=0

REM البحث عن ملف Setup
for %%f in (dist-electron\*Setup*.exe) do (
    echo ✅ ملف Setup موجود: %%~nxf
    echo    الحجم: %%~zf bytes
    set SETUP_FOUND=1
)

echo.

REM البحث عن ملف Portable
for %%f in (dist-electron\*Portable*.exe) do (
    echo ✅ ملف Portable موجود: %%~nxf
    echo    الحجم: %%~zf bytes
    set PORTABLE_FOUND=1
)

echo.
echo ========================================

if %SETUP_FOUND%==0 (
    echo ⚠️  تحذير: لم يتم العثور على ملف Setup
)

if %PORTABLE_FOUND%==0 (
    echo ⚠️  تحذير: لم يتم العثور على ملف Portable
)

if %SETUP_FOUND%==1 if %PORTABLE_FOUND%==1 (
    echo.
    echo ✅ جميع الملفات موجودة وجاهزة للتوزيع!
    echo.
    echo 📍 الموقع: %CD%\dist-electron\
    echo.
    echo 💡 الخطوات التالية:
    echo    1. اختبر ملف Setup على جهازك
    echo    2. اختبر ملف Portable
    echo    3. إذا عمل كل شيء، يمكنك مشاركة الملفات
    echo.
)

echo ========================================
echo.
echo هل تريد فتح مجلد dist-electron؟ (Y/N)
set /p OPEN_FOLDER=

if /i "%OPEN_FOLDER%"=="Y" (
    start explorer "dist-electron"
)

pause

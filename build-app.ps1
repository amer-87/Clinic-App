# Build Clinic App Installer
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🏥 Clinic App - بناء المثبت" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to clinic directory
Set-Location -Path "clinic"

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js متوفر: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ خطأ: Node.js غير مثبت!" -ForegroundColor Red
    Write-Host "الرجاء تثبيت Node.js من: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "اضغط Enter للخروج"
    exit 1
}

Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 تثبيت المكتبات المطلوبة..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل تثبيت المكتبات!" -ForegroundColor Red
        Read-Host "اضغط Enter للخروج"
        exit 1
    }
    Write-Host "✅ تم تثبيت المكتبات بنجاح" -ForegroundColor Green
    Write-Host ""
}

# Clean old build files
Write-Host "🧹 تنظيف ملفات البناء القديمة..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "✅ تم حذف مجلد dist القديم" -ForegroundColor Green
}
if (Test-Path "dist-electron") {
    Remove-Item -Path "dist-electron" -Recurse -Force
    Write-Host "✅ تم حذف مجلد dist-electron القديم" -ForegroundColor Green
}
Write-Host ""

# Build the app
Write-Host "🔨 بناء التطبيق..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل بناء التطبيق!" -ForegroundColor Red
    Read-Host "اضغط Enter للخروج"
    exit 1
}
Write-Host "✅ تم بناء التطبيق بنجاح" -ForegroundColor Green
Write-Host ""

# Check for icon
if (-not (Test-Path "build\icon.ico")) {
    Write-Host "⚠️  تحذير: لم يتم العثور على أيقونة مخصصة" -ForegroundColor Yellow
    Write-Host "سيتم استخدام الأيقونة الافتراضية" -ForegroundColor Yellow
    Write-Host ""
}

# Create installer
Write-Host "📦 إنشاء ملف المثبت..." -ForegroundColor Yellow
Write-Host "هذه العملية قد تستغرق بضع دقائق..." -ForegroundColor Yellow
Write-Host ""

npx electron-builder --win --config.forceCodeSigning=false

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  ملاحظة: حدثت بعض المشاكل أثناء إنشاء المثبت" -ForegroundColor Yellow
    Write-Host "لكن الملفات قد تكون موجودة في مجلد dist-electron" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ تم إنشاء المثبت بنجاح!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
}

# Show created files
if (Test-Path "dist-electron") {
    Write-Host "📁 الملفات المنشأة:" -ForegroundColor Cyan
    Write-Host ""
    Get-ChildItem -Path "dist-electron\*.exe" | ForEach-Object {
        Write-Host "   📄 $($_.Name)" -ForegroundColor White
        Write-Host "      الحجم: $([math]::Round($_.Length / 1MB, 2)) MB" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "📍 الموقع: $(Get-Location)\dist-electron\" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 يمكنك الآن:" -ForegroundColor Yellow
    Write-Host "   1. اختبار المثبت على جهازك" -ForegroundColor White
    Write-Host "   2. مشاركة ملف Setup مع الأصدقاء" -ForegroundColor White
    Write-Host "   3. استخدام النسخة Portable بدون تثبيت" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ لم يتم العثور على مجلد dist-electron" -ForegroundColor Red
    Write-Host "الرجاء التحقق من الأخطاء أعلاه" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Read-Host "اضغط Enter للخروج"

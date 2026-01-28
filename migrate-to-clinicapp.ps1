# سكريبت نقل المشروع إلى ClinicApp
# Migration Script to ClinicApp Repository

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  نقل المشروع إلى ClinicApp" -ForegroundColor Cyan
Write-Host "  Migration to ClinicApp Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# التحقق من وجود git
Write-Host "🔍 التحقق من Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git غير مثبت! يرجى تثبيت Git أولاً." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git موجود" -ForegroundColor Green
Write-Host ""

# عرض الحالة الحالية
Write-Host "📊 الحالة الحالية:" -ForegroundColor Yellow
git status --short
Write-Host ""

# عرض المستودعات البعيدة الحالية
Write-Host "🌐 المستودعات البعيدة الحالية:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# السؤال عن المتابعة
Write-Host "⚠️  تأكد من إنشاء المستودع الجديد على GitHub أولاً:" -ForegroundColor Yellow
Write-Host "   https://github.com/new" -ForegroundColor Cyan
Write-Host ""
$continue = Read-Host "هل أنشأت المستودع ClinicApp على GitHub؟ (y/n)"

if ($continue -ne 'y' -and $continue -ne 'Y') {
    Write-Host "❌ تم الإلغاء. يرجى إنشاء المستودع أولاً." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 بدء عملية النقل..." -ForegroundColor Green
Write-Host ""

# إضافة المستودع الجديد
Write-Host "1️⃣ إضافة المستودع الجديد..." -ForegroundColor Yellow
git remote add neworigin https://github.com/amer-87/ClinicApp.git
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ تمت الإضافة بنجاح" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  المستودع موجود مسبقاً، سيتم استخدامه" -ForegroundColor Yellow
}
Write-Host ""

# دفع جميع الفروع
Write-Host "2️⃣ دفع جميع الفروع..." -ForegroundColor Yellow
git push neworigin --all
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ تم دفع الفروع بنجاح" -ForegroundColor Green
} else {
    Write-Host "   ❌ فشل دفع الفروع" -ForegroundColor Red
    Write-Host "   يرجى التحقق من الأخطاء أعلاه" -ForegroundColor Red
    exit 1
}
Write-Host ""

# دفع الـ tags
Write-Host "3️⃣ دفع الـ tags..." -ForegroundColor Yellow
git push neworigin --tags
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ تم دفع الـ tags بنجاح" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  لا توجد tags للدفع" -ForegroundColor Yellow
}
Write-Host ""

# السؤال عن حذف origin القديم
Write-Host "⚠️  هل تريد استبدال المستودع القديم (origin) بالجديد؟" -ForegroundColor Yellow
$replace = Read-Host "هذا سيحذف الإشارة إلى clinic319 (y/n)"

if ($replace -eq 'y' -or $replace -eq 'Y') {
    Write-Host ""
    Write-Host "4️⃣ استبدال المستودع القديم..." -ForegroundColor Yellow
    
    # حذف origin القديم
    git remote remove origin
    Write-Host "   ✅ تم حذف origin القديم" -ForegroundColor Green
    
    # إعادة تسمية neworigin إلى origin
    git remote rename neworigin origin
    Write-Host "   ✅ تم تعيين ClinicApp كمستودع أساسي" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ℹ️  تم الاحتفاظ بكلا المستودعين:" -ForegroundColor Cyan
    Write-Host "   - origin: clinic319" -ForegroundColor Cyan
    Write-Host "   - neworigin: ClinicApp" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ اكتملت عملية النقل بنجاح!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# عرض المستودعات البعيدة النهائية
Write-Host "🌐 المستودعات البعيدة الحالية:" -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "📝 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "   1. تحقق من المستودع الجديد: https://github.com/amer-87/ClinicApp" -ForegroundColor Cyan
Write-Host "   2. إذا كان كل شيء صحيحاً، يمكنك حذف clinic319 من:" -ForegroundColor Cyan
Write-Host "      https://github.com/amer-87/clinic319/settings" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ شكراً لاستخدام السكريبت!" -ForegroundColor Green

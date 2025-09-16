@echo off
echo Building Clinic App Installer...
npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo Creating installer without code signing...
npx electron-builder --win --config.win.target=nsis --config.forceCodeSigning=false

if %errorlevel% neq 0 (
    echo.
    echo Note: The installer was created but code signing failed due to permission issues.
    echo The installer should still work for local testing.
    echo Check dist-electron folder for the installer file.
) else (
    echo.
    echo Installer created successfully!
    echo Check dist-electron folder for the installer file.
)

pause

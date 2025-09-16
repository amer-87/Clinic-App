@echo off
echo Creating Portable Clinic App Installer...
echo.

REM Check if the built app exists
if not exist "dist-electron\win-unpacked\Clinic App.exe" (
    echo Error: Built application not found!
    echo Please run 'npm run electron:build' first.
    pause
    exit /b 1
)

REM Create portable installer directory
if exist "ClinicApp-Portable" rmdir /s /q "ClinicApp-Portable"
mkdir "ClinicApp-Portable"

echo Copying application files...
xcopy /e /i /y "dist-electron\win-unpacked\*.*" "ClinicApp-Portable\"

echo Creating README file...
echo # Clinic App - Portable Version > "ClinicApp-Portable\README.txt"
echo. >> "ClinicApp-Portable\README.txt"
echo This is a portable version of the Clinic App. >> "ClinicApp-Portable\README.txt"
echo. >> "ClinicApp-Portable\README.txt"
echo To run the application: >> "ClinicApp-Portable\README.txt"
echo 1. Double-click on "Clinic App.exe" >> "ClinicApp-Portable\README.txt"
echo 2. The application will start automatically >> "ClinicApp-Portable\README.txt"
echo. >> "ClinicApp-Portable\README.txt"
echo Navigation between pages should now work correctly. >> "ClinicApp-Portable\README.txt"

echo Creating batch file for easy execution...
echo @echo off > "ClinicApp-Portable\Run Clinic App.bat"
echo echo Starting Clinic App... >> "ClinicApp-Portable\Run Clinic App.bat"
echo start "" "Clinic App.exe" >> "ClinicApp-Portable\Run Clinic App.bat"
echo exit >> "ClinicApp-Portable\Run Clinic App.bat"

echo Creating ZIP archive...
powershell -Command "Compress-Archive -Path 'ClinicApp-Portable\*' -DestinationPath 'ClinicApp-Portable.zip' -Force"

echo.
echo Portable installer created successfully!
echo.
echo Files created:
echo - ClinicApp-Portable.zip (Portable version for distribution)
echo - ClinicApp-Portable folder (Unpacked portable version)
echo.
echo You can distribute the ZIP file to users. They can extract it and run:
echo "Clinic App.exe" or "Run Clinic App.bat"
echo.
pause

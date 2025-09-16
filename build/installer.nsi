; NSIS Installer Script for Clinic App
Unicode true

; Include Modern UI
!include "MUI2.nsh"

; Basic installer settings
Name "Clinic App"
OutFile "..\dist-electron\ClinicAppSetup.exe"
InstallDir "$PROGRAMFILES\Clinic App"
RequestExecutionLevel admin

; Modern UI Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"

; Installer pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\LICENSE.electron.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Installer sections
Section "Main Application" MainSection
  SetOutPath "$INSTDIR"
  
  ; Copy all files from the built app
  File /r "..\dist-electron\win-unpacked\*.*"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\Clinic App"
  CreateShortcut "$SMPROGRAMS\Clinic App\Clinic App.lnk" "$INSTDIR\Clinic App.exe"
  CreateShortcut "$DESKTOP\Clinic App.lnk" "$INSTDIR\Clinic App.exe"
  
  ; Write uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Write registry entries for uninstaller
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClinicApp" \
                   "DisplayName" "Clinic App"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClinicApp" \
                   "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClinicApp" \
                   "DisplayIcon" "$\"$INSTDIR\Clinic App.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClinicApp" \
                   "Publisher" "Clinic App Developer"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClinicApp" \
                     "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClinicApp" \
                     "NoRepair" 1
SectionEnd

; Uninstaller section
Section "Uninstall"
  ; Remove shortcuts
  Delete "$SMPROGRAMS\Clinic App\Clinic App.lnk"
  Delete "$DESKTOP\Clinic App.lnk"
  RMDir "$SMPROGRAMS\Clinic App"
  
  ; Remove installation directory
  RMDir /r "$INSTDIR"
  
  ; Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\ClinicApp"
SectionEnd

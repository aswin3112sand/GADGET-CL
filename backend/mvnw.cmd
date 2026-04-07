@ECHO OFF
SETLOCAL

SET "BASE_DIR=%~dp0"
SET "DIST_VERSION=3.9.9"
SET "DIST_ARCHIVE=apache-maven-%DIST_VERSION%-bin.zip"
SET "DIST_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%DIST_VERSION%/%DIST_ARCHIVE%"
SET "DIST_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%DIST_VERSION%-bin"
SET "MAVEN_HOME=%DIST_DIR%\apache-maven-%DIST_VERSION%"
SET "MVN_CMD=%MAVEN_HOME%\bin\mvn.cmd"

IF EXIST "%MVN_CMD%" GOTO run

IF NOT EXIST "%DIST_DIR%" MKDIR "%DIST_DIR%"

IF NOT EXIST "%DIST_DIR%\%DIST_ARCHIVE%" (
  ECHO Downloading Maven %DIST_VERSION%...
  powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%DIST_URL%' -OutFile '%DIST_DIR%\%DIST_ARCHIVE%'"
  IF ERRORLEVEL 1 EXIT /B 1
)

IF NOT EXIST "%MAVEN_HOME%" (
  ECHO Extracting Maven %DIST_VERSION%...
  powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%DIST_DIR%\%DIST_ARCHIVE%' -DestinationPath '%DIST_DIR%' -Force"
  IF ERRORLEVEL 1 EXIT /B 1
)

:run
CALL "%MVN_CMD%" %*
EXIT /B %ERRORLEVEL%

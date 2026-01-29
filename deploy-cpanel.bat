@echo off
echo ========================================
echo   Lyaymha America - cPanel Deployment
echo ========================================
echo.

echo [1/4] Installing dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build project
    pause
    exit /b 1
)

echo.
echo [3/4] Copying .htaccess file...
copy .htaccess dist\.htaccess
if %errorlevel% neq 0 (
    echo WARNING: .htaccess file not found, creating one...
    echo ^<IfModule mod_rewrite.c^> > dist\.htaccess
    echo   RewriteEngine On >> dist\.htaccess
    echo   RewriteBase / >> dist\.htaccess
    echo   RewriteRule ^index\.html$ - [L] >> dist\.htaccess
    echo   RewriteCond %%{REQUEST_FILENAME} !-f >> dist\.htaccess
    echo   RewriteCond %%{REQUEST_FILENAME} !-d >> dist\.htaccess
    echo   RewriteCond %%{REQUEST_FILENAME} !-l >> dist\.htaccess
    echo   RewriteRule . /index.html [L] >> dist\.htaccess
    echo ^</IfModule^> >> dist\.htaccess
)

echo.
echo [4/4] Creating deployment package...
cd dist
if exist "..\cpanel-deploy.zip" del "..\cpanel-deploy.zip"
powershell Compress-Archive -Path * -DestinationPath ..\cpanel-deploy.zip
cd ..

echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo Your deployment files are ready in:
echo   frontend\dist\
echo.
echo Deployment package created:
echo   frontend\cpanel-deploy.zip
echo.
echo NEXT STEPS:
echo 1. Login to your cPanel
echo 2. Go to File Manager
echo 3. Navigate to public_html
echo 4. Upload cpanel-deploy.zip
echo 5. Extract the zip file
echo 6. Delete the zip file
echo 7. Visit your domain!
echo.
echo ========================================
pause

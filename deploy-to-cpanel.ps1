# ===========================================
#  Lyaymha America Guthi - cPanel Deployment
# ===========================================
# Run this script to build and deploy to cPanel
# Usage: Right-click -> Run with PowerShell
#    OR: .\deploy-to-cpanel.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Lyaymha America Guthi - Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Frontend
Write-Host "[1/3] Building frontend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "  Build complete!" -ForegroundColor Green

# Step 2: Upload to cPanel via FTP
Write-Host ""
Write-Host "[2/3] Uploading to cPanel..." -ForegroundColor Yellow

$ftpServer = "ftp://ftp.lyaymhaamerica.org"
$user = "lag2020"
$pass = "LAG@am3rica2020!"
$distPath = "$PSScriptRoot\frontend\dist"

# Upload root files
Write-Host "  Uploading index.html..." -ForegroundColor Gray
curl.exe --ftp-create-dirs -T "$distPath\index.html" "$ftpServer/public_html/index.html" --user "${user}:${pass}" 2>$null

Write-Host "  Uploading .htaccess..." -ForegroundColor Gray
curl.exe --ftp-create-dirs -T "$distPath\.htaccess" "$ftpServer/public_html/.htaccess" --user "${user}:${pass}" 2>$null

# Upload assets
Write-Host "  Uploading assets..." -ForegroundColor Gray
$assets = Get-ChildItem -Path "$distPath\assets" -File
$total = $assets.Count
$current = 0

foreach ($file in $assets) {
    $current++
    $remoteName = [System.Uri]::EscapeDataString($file.Name)
    Write-Host "    [$current/$total] $($file.Name)" -ForegroundColor DarkGray
    curl.exe --ftp-create-dirs -T "$($file.FullName)" "$ftpServer/public_html/assets/$remoteName" --user "${user}:${pass}" 2>$null
}

Write-Host "  Upload complete!" -ForegroundColor Green

# Step 3: Push to GitHub
Write-Host ""
Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
git add -A
$hasChanges = git status --porcelain
if ($hasChanges) {
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Deploy update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    git commit -m $commitMsg
    git push
    Write-Host "  Pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "  No changes to commit" -ForegroundColor Gray
}

# Done!
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your site is live at:" -ForegroundColor Cyan
Write-Host "  https://lyaymhaamerica.org" -ForegroundColor White
Write-Host ""
pause

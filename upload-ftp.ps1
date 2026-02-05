$ErrorActionPreference = "SilentlyContinue"

$ftpServer = "ftp://ftp.lyaymhaamerica.org"
$user = "lag2020"
$pass = "LAG@am3rica2020!"
$distPath = "C:\Users\aryal\Desktop\Project-Culture-cpanell\frontend\dist"

Write-Host "=== Starting FTP Upload to lyaymhaamerica.org ===" -ForegroundColor Cyan

# Upload root files
Write-Host "`nUploading root files..." -ForegroundColor Yellow
curl.exe --ftp-create-dirs -T "$distPath\index.html" "$ftpServer/public_html/index.html" --user "${user}:${pass}" 2>$null
Write-Host "  - index.html done"
curl.exe --ftp-create-dirs -T "$distPath\.htaccess" "$ftpServer/public_html/.htaccess" --user "${user}:${pass}" 2>$null
Write-Host "  - .htaccess done"

# Upload assets
Write-Host "`nUploading assets folder..." -ForegroundColor Yellow
$assets = Get-ChildItem -Path "$distPath\assets" -File
$total = $assets.Count
$current = 0

foreach ($file in $assets) {
    $current++
    $remoteName = [System.Uri]::EscapeDataString($file.Name)
    Write-Host "  [$current/$total] $($file.Name)"
    curl.exe --ftp-create-dirs -T "$($file.FullName)" "$ftpServer/public_html/assets/$remoteName" --user "${user}:${pass}" 2>$null
}

Write-Host "`n=== Upload Complete! ===" -ForegroundColor Green
Write-Host "Visit: https://lyaymhaamerica.org" -ForegroundColor Cyan

# Configuration
$BackupDir = "C:\Users\Marika\db_backups"
$DbPath = "C:\Users\Marika\matheraptor\projects\MAGPIE_Server\db\world.db"
$ProjectDir = "C:\Users\Marika\matheraptor\projects\MAGPIE_Server"

# Create backup directory if it does not exist
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Generate a timestamped backup file name
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = Join-Path $BackupDir "world_$Timestamp.db"
# Standardize backslashes for Node string processing
$CleanDbPath = $DbPath.Replace('\', '\\')
$CleanBackupFile = $BackupFile.Replace('\', '\\')

Write-Host "Starting database backup snapshot..." -ForegroundColor Cyan

# Execute backup via better-sqlite3 engine
Set-Location $ProjectDir
node -e "
const db = require('./node_modules/better-sqlite3')('$CleanDbPath');
db.backup('$CleanBackupFile')
  .then(() => { console.log('Backup completed successfully.'); process.exit(0); })
  .catch((err) => { console.error(err); process.exit(1); });
"

# Keep only the last 7 days of backups to save disk space
Get-ChildItem -Path $BackupDir -Filter "world_*.db" | 
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | 
    Remove-Item -Force

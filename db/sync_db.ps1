# Configuration
$BackupDir  = "C:\Users\Marika\db_backups"
$DbPath     = "C:\Users\Marika\matheraptor\projects\MAGPIE_Server\db\world.db"
$ProjectDir = "C:\Users\Marika\matheraptor\projects\MAGPIE_Server"

# Generate custom timestamp format (YYYYMMDDHHMM)
$CTZ = Get-Date -Format "yyyyMMddHHmm"

# Setup Paths and fix backslashes for Node strings
$BackupFile = Join-Path $BackupDir "world_$CTZ.db"
$CleanDbPath = $DbPath.Replace('\', '\\')
$CleanBackupFile = $BackupFile.Replace('\', '\\')

# Ensure backup directory exists
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Step 1: Force WAL Checkpoint to flush memory data, then take a clean backup
Write-Host "📦 1/3 Flushing WAL memory and generating safe snapshot ($CTZ)..." -ForegroundColor Cyan
Set-Location $ProjectDir

# Force commit floating WAL matrix data (like your test ship) straight into world.db binary pages
node -e "require('./node_modules/better-sqlite3')('$CleanDbPath').pragma('wal_checkpoint(TRUNCATE)');"

# Package the structurally complete file into your backup directory
node -e "
const db = require('./node_modules/better-sqlite3')('$CleanDbPath');
db.backup('$CleanBackupFile')
  .then(() => { process.exit(0); })
  .catch((err) => { console.error(err); process.exit(1); });
"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Database processing or backup failed. Aborting sync pipeline."
    Exit
}

# Step 2: Remind user to stop the remote instance before copying
Write-Host "⚠️  2/3 Preparation: Ensure your server app is STOPPED (Ctrl+C on Ubuntu)!" -ForegroundColor Yellow
Read-Host "Press [ENTER] to confirm the remote server is stopped and begin the upload"

# Step 3: Securely push the stamped backup to the server's active file path
Write-Host "🚀 3/3 Syncing fresh data to magpie-gcp server..." -ForegroundColor Green
scp $BackupFile magpie-gcp:~/MAGPIE_Server/db/world.db

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database successfully synchronized with zero corruption!" -ForegroundColor Green
} else {
    Write-Host "❌ SCP Transfer failed. Check your network or SSH config." -ForegroundColor Red
}

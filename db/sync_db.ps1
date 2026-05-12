# Configuration (Dynamic paths based on script location inside the db/ folder)
$BackupDir  = "C:\Users\Marika\db_backups"
$DbDir      = $PSScriptRoot  
$ProjectDir = Split-Path -Parent $DbDir 

# Absolute file paths calculated dynamically
$WorldDbPath  = Join-Path $DbDir "world.db"
$ServerDbPath = Join-Path $DbDir "server.db"

# Generate custom timestamp format (YYYYMMDDHHMM)
$CTZ = Get-Date -Format "yyyyMMddHHmm"

# Setup local backup paths and fix backslashes for Node strings
$WorldBackupFile  = Join-Path $BackupDir "world_$CTZ.db"
$ServerBackupFile = Join-Path $BackupDir "server_$CTZ.db"

$CleanWorldDbPath   = $WorldDbPath.Replace('\', '\\')
$CleanServerDbPath  = $ServerDbPath.Replace('\', '\\')
$CleanWorldBackup   = $WorldBackupFile.Replace('\', '\\')
$CleanServerBackup  = $ServerBackupFile.Replace('\', '\\')

# Ensure backup directory exists
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Step 1: Force journal drop to override background locks and smash WAL data into main binaries
Write-Host "📦 1/4 Forcing absolute WAL integration into main files..." -ForegroundColor Cyan
Set-Location $ProjectDir

# Switching to DELETE mode forces full data integration and completely deletes the local wal/shm files
node -e "
const db1 = require('./node_modules/better-sqlite3')('$CleanWorldDbPath'); db1.pragma('journal_mode = DELETE'); db1.close();
const db2 = require('./node_modules/better-sqlite3')('$CleanServerDbPath'); db2.pragma('journal_mode = DELETE'); db2.close();
"

# Package structurally pristine world.db backup
node -e "
const db = require('./node_modules/better-sqlite3')('$CleanWorldDbPath');
db.backup('$CleanWorldBackup')
  .then(() => { process.exit(0); })
  .catch((err) => { console.error(err); process.exit(1); });
"
# Package structurally pristine server.db backup
node -e "
const db = require('./node_modules/better-sqlite3')('$CleanServerDbPath');
db.backup('$CleanServerBackup')
  .then(() => { process.exit(0); })
  .catch((err) => { console.error(err); process.exit(1); });
"

# Restore local WAL mode configurations so your development environment stays hyper-fast
node -e "
const db1 = require('./node_modules/better-sqlite3')('$CleanWorldDbPath'); db1.pragma('journal_mode = WAL'); db1.close();
const db2 = require('./node_modules/better-sqlite3')('$CleanServerDbPath'); db2.pragma('journal_mode = WAL'); db2.close();
"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Database snapshot processing failed. Aborting sync pipeline."
    Exit
}

# Step 2: Remind user to stop the remote instance
Write-Host "⚠️  2/4 Preparation: Ensure your server app is STOPPED (Ctrl+C on Ubuntu)!" -ForegroundColor Yellow
Read-Host "Press [ENTER] to confirm the remote server is stopped and begin the clean sync"

# Step 3: AUTOMATIC CLEANUP - Wipe all stale database, wal, and shm files on the remote server
Write-Host "🧹 3/4 Clearing out old database files and stale WAL logs on remote server..." -ForegroundColor Magenta
ssh magpie-gcp "rm -f ~/MAGPIE_Server/db/world.db* ~/MAGPIE_Server/db/server.db*"

# Step 4: Securely push both stamped backups to the server's active file paths
Write-Host "🚀 4/4 Syncing fresh world.db and server.db to magpie-gcp server..." -ForegroundColor Green
scp $WorldBackupFile magpie-gcp:~/MAGPIE_Server/db/world.db
scp $ServerBackupFile magpie-gcp:~/MAGPIE_Server/db/server.db

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Both databases successfully synchronized with zero leftover WAL logs!" -ForegroundColor Green
} else {
    Write-Host "❌ SCP Transfer failed. Check your network or SSH config." -ForegroundColor Red
}

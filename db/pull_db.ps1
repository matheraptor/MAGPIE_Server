# -----------------------------------------------------------------------------
# Project MAGPIE - Remote-to-Local Database Pull Utility (pull_db.ps1)
# -----------------------------------------------------------------------------
$ErrorActionPreference = "Stop"

# Configuration
$LocalDir   = ".\db"
$BackupDir  = "C:\Users\Marika\db_backups"
$ProjectDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogDir     = Join-Path $ProjectDir "logs"

# Generate custom timestamp format (YYYYMMDDHHMM and YYYYMMDD for logs)
$Timestamp  = (Get-Date).ToString("yyyyMMddHHmm")
$DateOnly   = Get-Date -Format "yyyyMMdd"
$LogFile    = Join-Path $LogDir "backend$DateOnly.log"

# Ensure directories exist
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir | Out-Null
}

# Logging function
function Log-Message {
    param([string]$Message)
    $LogTimestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$LogTimestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -ErrorAction SilentlyContinue
}

$ErrorActionPreference = "Stop"
Log-Message "=== pull_db.ps1 START ==="

# Step 1: Force WAL Integration on Remote Server via SSH
Log-Message "📦 1/4: Toggling remote SQLite journals to DELETE mode to flush WAL logs..."
ssh magpie-gcp "sqlite3 ~/MAGPIE_Server/db/world.db 'PRAGMA journal_mode=DELETE;' && sqlite3 ~/MAGPIE_Server/db/server.db 'PRAGMA journal_mode=DELETE;'"

if ($LASTEXITCODE -ne 0) {
    Log-Message "❌ Failed to toggle remote journal mode. Aborting."
    Exit 1
}

# Step 2: Create Local Time-Stamped Archival Backups of Current Local DBs
Log-Message "🗄️ 2/4: Creating local archival snapshots before overwriting..."
if (Test-Path "${LocalDir}\world.db") {
    Copy-Item "${LocalDir}\world.db" "${BackupDir}\world_${Timestamp}.db"
    Log-Message "✅ Saved local world.db backup."
}
if (Test-Path "${LocalDir}\server.db") {
    Copy-Item "${LocalDir}\server.db" "${BackupDir}\server_${Timestamp}.db"
    Log-Message "✅ Saved local server.db backup."
}

# Step 3: Clean Local Target Folder
Log-Message "🧹 3/4: Purging old local binary fragments and stale logs..."
Remove-Item -Path "${LocalDir}\*.db", "${LocalDir}\*.db-wal", "${LocalDir}\*.db-shm" -ErrorAction SilentlyContinue

# Step 4: Download Fresh Production DB Binaries via scp
Log-Message "📥 4/4: Downloading pristine databases from magpie-gcp..."
scp magpie-gcp:~/MAGPIE_Server/db/world.db "${LocalDir}\world.db"
if ($LASTEXITCODE -ne 0) {
    Log-Message "❌ Failed to download world.db from remote."
    Exit 1
}

scp magpie-gcp:~/MAGPIE_Server/db/server.db "${LocalDir}\server.db"
if ($LASTEXITCODE -ne 0) {
    Log-Message "❌ Failed to download server.db from remote."
    Exit 1
}
Log-Message "✅ Both databases successfully downloaded from magpie-gcp"

# Step 5: Restore WAL Mode on Production for Performance
Log-Message "⚡ 5/5: Restoring remote production databases to WAL performance mode..."
ssh magpie-gcp "sqlite3 ~/MAGPIE_Server/db/world.db 'PRAGMA journal_mode=WAL;' && sqlite3 ~/MAGPIE_Server/db/server.db 'PRAGMA journal_mode=WAL;'"

Log-Message "✨ Success! Your local development environment is synced with live production data."
Log-Message "=== pull_db.ps1 END ==="
#!/bin/bash
BACKUP_DIR="/home/hamedahastral/db_backups"
mkdir -p "$BACKUP_DIR"

# Generate a timestamped backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# LOW PRIORITY BACKUP: Prevents disk and CPU choking
/usr/bin/nice -n 19 /usr/bin/ionice -c 3 /usr/bin/sqlite3 /home/hamedahastral/MAGPIE_Server/db/world.db ".backup '$BACKUP_DIR/world_$TIMESTAMP.db'"

# Log completion to the file so you know it ran successfully
echo "[$(date)] Backup successful: world_$TIMESTAMP.db"

# Keep only the last 7 days of backups to save disk space
/usr/bin/nice -n 19 /usr/bin/find "$BACKUP_DIR" -type f -mtime +7 -delete


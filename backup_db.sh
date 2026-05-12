#!/bin/bash
BACKUP_DIR="/home/hamedahastral/db_backups"
mkdir -p "$BACKUP_DIR"

# Generate a timestamped backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
sqlite3 /home/hamedahastral/MAGPIE_Server/db/world.db ".backup '$BACKUP_DIR/world_$TIMESTAMP.db'"

# Keep only the last 7 days of backups to save disk space
find "$BACKUP_DIR" -type f -mtime +7 -delete

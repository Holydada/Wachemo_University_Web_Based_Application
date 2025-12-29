#!/bin/bash

# ==================== DATABASE BACKUP SCRIPT ====================
# Purpose: Automated database backup with compression and rotation
# Usage: ./backup.sh

# Configuration
DB_NAME="wcu_digital_campus"
DB_USER="root"
DB_PASS=""
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"
RETENTION_DAYS=30

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================== WCU Database Backup ====================${NC}"
echo "Starting backup at: $(date)"

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
  echo -e "${YELLOW}Creating backup directory...${NC}"
  mkdir -p "$BACKUP_DIR"
fi

# Perform database backup
echo -e "${YELLOW}Backing up database: $DB_NAME${NC}"
if [ -z "$DB_PASS" ]; then
  mysqldump -u "$DB_USER" "$DB_NAME" > "$BACKUP_FILE" 2>&1
else
  mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_FILE" 2>&1
fi

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Database backup completed successfully${NC}"
  
  # Compress backup
  echo -e "${YELLOW}Compressing backup file...${NC}"
  gzip "$BACKUP_FILE"
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup compressed: ${BACKUP_FILE}.gz${NC}"
    
    # Get file size
    FILE_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
    echo -e "${GREEN}✓ Backup size: $FILE_SIZE${NC}"
  else
    echo -e "${RED}✗ Compression failed${NC}"
  fi
else
  echo -e "${RED}✗ Database backup failed${NC}"
  exit 1
fi

# Delete old backups (older than RETENTION_DAYS)
echo -e "${YELLOW}Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
DELETED_COUNT=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS | wc -l)
echo -e "${GREEN}✓ Deleted $DELETED_COUNT old backup(s)${NC}"

# List current backups
echo -e "${YELLOW}Current backups:${NC}"
ls -lh "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | tail -5

echo -e "${GREEN}==================== Backup Complete ====================${NC}"
echo "Completed at: $(date)"
echo "Backup location: ${BACKUP_FILE}.gz"

# Optional: Upload to cloud storage (uncomment if needed)
# echo -e "${YELLOW}Uploading to cloud storage...${NC}"
# aws s3 cp "${BACKUP_FILE}.gz" s3://wcu-backups/ 2>&1
# if [ $? -eq 0 ]; then
#   echo -e "${GREEN}✓ Uploaded to cloud storage${NC}"
# fi

exit 0

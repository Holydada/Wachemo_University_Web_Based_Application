#!/bin/bash

# ==================== DATABASE RESTORE SCRIPT ====================
# Purpose: Restore database from backup file
# Usage: ./restore.sh <backup_file.sql.gz>

# Configuration
DB_NAME="wcu_digital_campus"
DB_USER="root"
DB_PASS=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================== WCU Database Restore ====================${NC}"

# Check if backup file is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: No backup file specified${NC}"
  echo "Usage: ./restore.sh <backup_file.sql.gz>"
  echo ""
  echo "Available backups:"
  ls -lh ./backups/backup_*.sql.gz 2>/dev/null
  exit 1
fi

BACKUP_FILE=$1

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
  exit 1
fi

echo "Backup file: $BACKUP_FILE"
echo "Database: $DB_NAME"
echo ""

# Confirm restore
read -p "Are you sure you want to restore? This will overwrite existing data! (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo -e "${YELLOW}Restore cancelled${NC}"
  exit 0
fi

echo -e "${YELLOW}Starting restore process...${NC}"

# Decompress and restore
if [[ $BACKUP_FILE == *.gz ]]; then
  echo -e "${YELLOW}Decompressing and restoring...${NC}"
  if [ -z "$DB_PASS" ]; then
    gunzip -c "$BACKUP_FILE" | mysql -u "$DB_USER" "$DB_NAME"
  else
    gunzip -c "$BACKUP_FILE" | mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME"
  fi
else
  echo -e "${YELLOW}Restoring from uncompressed file...${NC}"
  if [ -z "$DB_PASS" ]; then
    mysql -u "$DB_USER" "$DB_NAME" < "$BACKUP_FILE"
  else
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$BACKUP_FILE"
  fi
fi

# Check if restore was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Database restored successfully${NC}"
  echo -e "${GREEN}==================== Restore Complete ====================${NC}"
  exit 0
else
  echo -e "${RED}✗ Database restore failed${NC}"
  exit 1
fi

#!/bin/bash

BASE="/var/www/html"
DEFAULT="$BASE/user_default"
USER="$BASE/user"
BACKUP="$BASE/backup"

test "$(ls -A $USER)" || cp -R $DEFAULT/* $USER

chown www-data:www-data -R $USER
chown www-data:www-data -R $BACKUP
chmod 755 -R $USER
chmod 755 -R $BACKUP

rm -R $DEFAULT

exec "$@"
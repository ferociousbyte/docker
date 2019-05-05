#!/bin/bash

BASE="/var/www/html"
DEFAULT="$BASE/user_default"
USER="$BASE/user"
BACKUP="$BASE/backup"

if [ "$(ls -A $USER)" ]; then
    printf "Content in $USER already exists ... skip\n"
else
    printf "Copy initial data to $USER ... "
    cp -R $DEFAULT/* $USER
    printf "done\n"
fi

printf "Remove directory $DEFAULT ... "
test -d $DEFAULT && rm -R $DEFAULT
printf "done\n"

printf "Fix permissions of $BASE ... "
chown -R www-data:www-data $BASE
find $BASE -type f | xargs chmod 664
find $BASE/bin -type f | xargs chmod 775
find $BASE -type d | xargs chmod 775
find $BASE -type d | xargs chmod +s
umask 0002
printf "done\n"

printf "Run $@\n"
exec "$@"
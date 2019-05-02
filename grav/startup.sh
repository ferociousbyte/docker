#!/bin/bash

BASE="/var/www/html"
DEFAULT="$BASE/user_default"
USER="$BASE/user"

test "$(ls -A $USER)" || (cp -R $DEFAULT/* $USER && chown www-data:www-data -R $USER)
rm -R $DEFAULT

exec "$@"
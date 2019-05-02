FROM php:apache

# Requirements
RUN a2enmod rewrite expires\
    && apt update \
    && apt install -y git unzip libfreetype6-dev libjpeg62-turbo-dev libpng-dev libzip-dev \
    && docker-php-ext-install gd zip

# Environment Variables
ENV GRAV_VERSION=1.6.8 \
    GRAV_URL=https://github.com/getgrav/grav.git \
    GRAV_DIRECTORY=/var/www/html \
    GRAV_SCRIPT=startup.sh

# Workdir
WORKDIR ${GRAV_DIRECTORY}

# Installation
RUN git clone ${GRAV_URL} . \
    && git checkout ${GRAV_VERSION} \
    && bin/grav install \
    && bin/gpm install -y admin \
    && mv user user_default \
    && mkdir user \
    && chown www-data:www-data -R  .

# Volumes
VOLUME [ "${GRAV_DIRECTORY}/backup", "${GRAV_DIRECTORY}/user" ]

# Scriptfile
COPY ${GRAV_SCRIPT} .
RUN chmod 755 ${GRAV_SCRIPT}
ENTRYPOINT ["./startup.sh"]
CMD ["apache2-foreground"]
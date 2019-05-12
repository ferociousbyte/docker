FROM php:apache

# Requirements
RUN a2enmod rewrite expires\
    && apt update \
    && apt install -y git unzip libfreetype6-dev libjpeg62-turbo-dev libpng-dev libzip-dev libyaml-dev \
    && docker-php-ext-install zip exif opcache \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && pecl install apcu \
    && pecl install yaml \
    && docker-php-ext-enable apcu yaml

# Environment Variables
ENV GRAV_VERSION=1.6.9 \
    GRAV_URL=https://github.com/getgrav/grav.git \
    GRAV_DIRECTORY=/var/www/html

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

# PHP configuration
RUN mv "${PHP_INI_DIR}/php.ini-production" "${PHP_INI_DIR}/php.ini"
COPY --chown=root:staff conf/php.ini ${PHP_INI_DIR}/conf.d/custom.ini

# Scriptfile
COPY --chown=root:staff bin/startup.sh /startup.sh

ENTRYPOINT ["sh", "/startup.sh"]
CMD ["apache2-foreground"]
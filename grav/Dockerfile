FROM php:apache

# Environment Variables
ENV GRAV_VERSION 1.6.8
ENV GRAV_URL https://github.com/getgrav/grav.git
ENV GRAV_USER www-data
ENV GRAV_SCRIPT startup.sh
ENV GRAV_DIRECTORY /var/www/html

# Requirements
RUN a2enmod rewrite expires
RUN apt update
RUN apt install -y git unzip libfreetype6-dev libjpeg62-turbo-dev libpng-dev libzip-dev
RUN docker-php-ext-install gd zip

# User and Workdir
USER ${GRAV_USER}
WORKDIR ${GRAV_DIRECTORY}

# Installation
RUN git clone ${GRAV_URL} .
RUN git checkout ${GRAV_VERSION}
RUN bin/grav install 
RUN bin/gpm install -y admin
RUN mv user user_default
RUN mkdir user

# Volumes
VOLUME [ "${GRAV_DIRECTORY}/backup", "${GRAV_DIRECTORY}/user" ]

# Scriptfile
USER root
ADD ./${GRAV_SCRIPT} ${GRAV_SCRIPT}
RUN chmod 755 ${GRAV_SCRIPT}

ENTRYPOINT [ "./${GRAV_SCRIPT}" ]
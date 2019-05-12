FROM python:3-alpine

# Exposed port
EXPOSE 5000

# Environment Variables
ENV CALEXA_URL=https://localhost/dav \
    CALEXA_USER=user \
    CALEXA_PASSWORD=password

# Requirements
RUN apk update \
    && apk add build-base git ruby ruby-dev python-dev libxslt-dev libffi-dev openssl-dev \
    && gem install rdoc --no-document \
    && gem install json tiller \
    && pip install caldav ics flask \
    && pip install --upgrade pip==9.0.3 \
    && pip install flask_ask

# Installation
RUN git clone https://github.com/martin-riedl/CALexa /tmp/calexa \
    && mkdir -p /calexa/bin /calexa/conf \
    && cp /tmp/calexa/src/calexa.py /calexa/bin \
    && rm -R /tmp/calexa

ADD tiller/ /etc/tiller

CMD [ "/usr/bin/tiller", "-v" ]

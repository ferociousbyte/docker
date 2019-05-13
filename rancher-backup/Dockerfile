FROM alpine:latest

RUN apk update \
    && apk add rsync

COPY conf/ /conf

CMD [ "rsync", "--daemon", "--no-detach", "--config", "/conf/rsyncd.conf" ]

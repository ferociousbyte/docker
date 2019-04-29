FROM alpine:latest

RUN apk update
RUN apk add bash rsync

COPY scripts/* /scripts/
COPY config/* /config/

RUN chmod -R 755 scripts/*
RUN chmod -R 644 config/*

WORKDIR /scripts

ENTRYPOINT [ "bash", "rsync_daemon.sh" ]

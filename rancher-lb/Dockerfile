FROM nginx:stable

EXPOSE 80 443

RUN apt update \
    && apt install -y ruby \
    && gem install tiller

ADD tiller/ /etc/tiller

CMD [ "/usr/local/bin/tiller", "-v" ]
FROM nginx:stable
LABEL Author="xkodiak"

RUN apt update
RUN apt install -y ruby
RUN gem install tiller

EXPOSE 80
EXPOSE 443

ADD tiller/ /etc/tiller

CMD [ "/usr/local/bin/tiller", "-v" ]
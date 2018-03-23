FROM top20/node:8-alpine

MAINTAINER Alessandro Caprarelli @ RiderTrack

#Linux setup
RUN apk update \
  && apk add --update alpine-sdk \
  && apk del alpine-sdk \
  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
  && npm cache verify \
  && sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd

WORKDIR /app
# copy the source code
COPY . .

# install angular-cli
RUN npm install -g @angular/cli --unsafe

# install all the other dependencies
RUN npm install

# build angular app
RUN ng build --prod

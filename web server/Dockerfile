FROM nodesource/node:6

MAINTAINER Alessandro Caprarelli @ RiderTrack

# to convert file to unix, to remove not allowed characters
RUN apt-get update && apt-get install tofrodos

# Create app dir
RUN mkdir -p /home/nodejs/app
WORKDIR /home/nodejs/app

# Install app dependencies
COPY package.json /home/nodejs/app
RUN npm install

# Install gulp globally
RUN npm install -g gulp

# Copy app source code
COPY . /home/nodejs/app

# Copy gulpfile
COPY gulpfile.js /home/nodejs/app

# Copy wait-for file, in order to start the app when rabbit is available
COPY wait-for-it.sh /wait-for-it.sh

RUN fromdos /wait-for-it.sh

ENTRYPOINT ["gulp"]
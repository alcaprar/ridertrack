FROM nodesource/node:6

MAINTAINER Alessandro Caprarelli @ RiderTrack

# to convert file to unix, to remove not allowed characters
RUN apt-get update && apt-get install tofrodos

# Install app dependencies
COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && cp -R ./node_modules ./node-app

# Install gulp globally
RUN npm install -g gulp

# Copy app source code
COPY . /node-app

# Copy gulpfile
COPY gulpfile.js /node-app

WORKDIR /node-app

RUN npm install gulp

# Copy wait-for file, in order to start the app when mongodb is available
COPY wait-for-it.sh /wait-for-it.sh

# clean the file
RUN fromdos /wait-for-it.sh
FROM nodesource/node:6

MAINTAINER Alessandro Caprarelli

# to convert file to unix, to remove not allowed characters
RUN apt-get update && apt-get install tofrodos

# Create app dir
RUN mkdir -p /home/node

# Install app dependencies
COPY package.json /home/node
WORKDIR /home/node
RUN npm install

# Install gulp globally
RUN npm install -g gulp

# Copy app source code
COPY . /home/node

# Copy gulpfile
COPY gulpfile.js /home/node

RUN npm install gulp


# don't user RUN, otherwise environment variables are not passed
ENTRYPOINT ["gulp"]
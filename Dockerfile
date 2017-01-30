FROM node:boron
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm run build
RUN mkdir -p /usr/src/logs
CMD [ "npm", "start" ]
EXPOSE 1974 3000 3001 3002 3003 3030


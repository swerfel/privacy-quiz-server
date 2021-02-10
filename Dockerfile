FROM node:12 as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install



FROM base as prod
COPY dist ./
EXPOSE 3000
CMD [ "node", "server.js" ]
FROM node:8-alpine
ENV PORT 3000
WORKDIR /usr/src/app
COPY package*.json ../
RUN npm install
COPY . .
CMD [ "npm", "start" ]
EXPOSE 3000
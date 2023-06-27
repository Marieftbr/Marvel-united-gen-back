FROM node:18

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app 

RUN npm i

COPY models /app/models
COPY routes /app/routes
COPY *.js /app

CMD ["node", "index.js"]
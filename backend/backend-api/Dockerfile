FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY backend-api ./backend-api
WORKDIR /app/backend-api

EXPOSE 4002

CMD ["node", "index.js"]

# BE
FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 4050 587 3306

CMD ["node", "src/index.js"]

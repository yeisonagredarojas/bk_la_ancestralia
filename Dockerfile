FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN chmod +x wait-for.sh

RUN npm run build

CMD ["sh", "./wait-for.sh", "postgres", "npm", "run", "start:dev"]

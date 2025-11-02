FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Da permisos de ejecución al script
RUN chmod +x wait-for.sh

RUN npm run build

CMD ["./wait-for.sh", "postgres", "npm", "run", "start:dev"]

FROM node:23-slim

RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ /app/

COPY .babelrc /app/

RUN chown -R appuser:appuser /app

EXPOSE 3000

CMD ["npm","run","start"]

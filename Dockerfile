# build stage
FROM node:12
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]
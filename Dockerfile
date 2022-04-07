FROM nginx:alpine AS base
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY start.sh /

FROM node:14.17.0-alpine AS builder
COPY package*.json /configcat-monday-app/
WORKDIR /configcat-monday-app
RUN npm install
COPY ./ /configcat-monday-app/
RUN npm run build

FROM base as final
COPY --from=builder /configcat-monday-app/dist/configcat-monday-app /usr/share/nginx/html
CMD ["sh", "start.sh"]
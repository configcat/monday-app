FROM nginx:stable-alpine AS base
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf
RUN rm -rf /usr/share/nginx/html/*
COPY start.sh /

FROM node:iron-alpine AS builder
COPY package*.json /configcat-monday-app/
WORKDIR /configcat-monday-app
RUN npm install
COPY ./ /configcat-monday-app/
RUN npm run build

FROM base as final
COPY --from=builder /configcat-monday-app/dist/configcat-monday-app /usr/share/nginx/html
COPY _headers /usr/share/nginx/html/
CMD ["sh", "start.sh"]
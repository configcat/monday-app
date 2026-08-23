FROM nginxinc/nginx-unprivileged:stable-alpine AS base
USER root
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf
COPY start.sh /
RUN sed -i 's/\r//' /start.sh

FROM node:24.15-alpine AS builder
COPY package*.json /configcat-monday-app/
WORKDIR /configcat-monday-app
RUN npm install
COPY ./ /configcat-monday-app/
# Disable chunk optimization to avoid huge main js with unexpected characters that break the app 
ENV NG_BUILD_OPTIMIZE_CHUNKS=false
RUN npm run build

FROM base as final
ARG UID=101
USER root
COPY --from=builder /configcat-monday-app/dist/configcat-monday-app /usr/share/nginx/html
COPY _headers /usr/share/nginx/html/
RUN chown -R "$UID":0 /usr/share/nginx/html /etc/nginx \
    && chmod -R u+rwx,g+rwx /usr/share/nginx/html /etc/nginx
USER $UID
EXPOSE 8080
CMD ["sh", "start.sh"]
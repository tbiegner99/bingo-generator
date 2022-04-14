FROM node:14 as build

COPY ./src ./
COPY ./lib ./
COPY ./package-lock.json ./
COPY ./package.json ./

RUN npm ci

FROM nginx
COPY --from=build ./build /srv/package
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443

FROM node:18-alpine3.11 AS BUILD_IMAGE
RUN apk update && apk add curl bash make && rm -rf /var/cache/apk/*
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /usr/src/app

COPY . .
RUN npm ci
RUN npm run build

RUN npm prune --production

FROM node:16-alpine3.11 as output

RUN mkdir -p /home/node/app/
RUN mkdir -p /home/node/app/node_modules
RUN mkdir -p /home/node/app/dist

RUN chown -R 1000:1000 /home/node/app
RUN chown -R 1000:1000 /home/node/app/node_modules
RUN chown -R 1000:1000 /home/node/app/dist

WORKDIR /home/node/app

COPY --from=BUILD_IMAGE /usr/src/app/package.json /home/node/app
COPY --from=BUILD_IMAGE /usr/src/app/.develop.env /home/node/app
COPY --from=BUILD_IMAGE /usr/src/app/dist /home/node/app/dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules /home/node/app/node_modules

EXPOSE 4000
CMD ["npm", "run", "start:dev"]
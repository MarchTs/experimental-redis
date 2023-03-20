FROM node:14-alpine

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm config set registry http://10.16.200.40:8081/repository/npm-group/
RUN npm config set //10.16.200.40:8081/repository/npm-group/:_authToken 'NpmToken.1101881e-f99b-3748-9217-ff37f52b528d'

RUN yarn
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
RUN rm .env

EXPOSE 9000

ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true 
ENV NEW_RELIC_LOG=stdout

CMD [ "yarn", "app" ]
FROM node:14-alpine
LABEL maintainer="technology@luriz.com"

# Update aptitude with new repo
RUN apk add git
RUN apk update && apk add openssh

# Make ssh dir
RUN mkdir /root/.ssh/

# Copy over private key, and set permissions
# Warning! Anyone who gets their hands on this image will be able
# to retrieve this private key file from the corresponding image layer
#ADD docker/staging/ssh/id_rsa /root/.ssh/id_rsa

# Create known_hosts
RUN touch /root/.ssh/known_hosts
# Add bitbuckets key
#RUN ssh-keyscan gitlab.com >> /root/.ssh/known_hosts

WORKDIR /

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm i --only=prod

COPY . .

COPY docker/staging/.env .


#RUN npm run build
EXPOSE 4012
ENV NODE_ENV=production

CMD ["npm", "run", "start"]


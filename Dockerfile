FROM node:9-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY web/ .
RUN yarn

# Expose ports
EXPOSE 8080

CMD ["npm", "start"]

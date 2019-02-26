FROM node:9-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY web/ .
RUN yarn

ENV PORT=80

# Expose ports
EXPOSE 80

CMD ["npm", "start"]


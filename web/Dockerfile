FROM node:8.2-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY . .
RUN npm install --silent

# Expose ports
EXPOSE 8080

CMD ["npm", "start"]

# Use official Node.js image
FROM node:23-slim

# Set working directory inside the container
WORKDIR /usr/src/app

# Install curl (if you really need it)
RUN apt update && apt install -y curl

# Copy package.json and package-lock.json first (for better Docker caching)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install PM2 globally
RUN npm install -g pm2

# Copy the rest of the application (including your src/ folder and tsconfig.json)
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the built server with PM2
CMD ["pm2-runtime", "dist/server.js"]

# Build Stage
FROM node AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

# Build the Nuxt app for production
RUN npm run build

# Production Stage
FROM node

# Set working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/.output ./

# Expose the port the app will run on
EXPOSE 3000

# Set the command to start the server
CMD ["node", "/app/server/index.mjs"]

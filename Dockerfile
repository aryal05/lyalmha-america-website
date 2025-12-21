# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]

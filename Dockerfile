
# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json files first for better caching
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
RUN cd backend && npm install --only=production

# Install frontend dependencies and build
RUN cd frontend && npm install && npm run build

# Copy the rest of the application code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Move built frontend to backend public folder for serving
RUN mkdir -p backend/public && mv frontend/build/* backend/public/

# Set working directory to backend
WORKDIR /app/backend

# Expose the port the app runs on
EXPOSE 3001

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Start the application
CMD ["npm", "start"]
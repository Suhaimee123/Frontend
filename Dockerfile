# Step 1: Base Image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Set environment variables directly in the Dockerfile
ENV NEXT_PUBLIC_ADMIN_API_URL="https://springapi-sxik.onrender.com/api/Admin"
ENV PUBLIC_API_URL="https://springapi-sxik.onrender.com/api/"

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Step 2: Production Image
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=base /app/package.json /app/package-lock.json /app/next.config.js ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js application
CMD ["sh", "-c", "npm run start"]

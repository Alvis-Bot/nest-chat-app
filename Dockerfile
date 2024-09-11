##################
# BUILD BASE IMAGE
##################
FROM node:20-alpine AS base

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################
FROM base AS development

# Copy the source code and install dependencies
COPY . .

# Build the application
RUN yarn run build

# Start the development server
CMD ["yarn", "start"]


#############################
# BUILD FOR PRODUCTION
#############################
FROM base AS production

# Copy the source code
COPY . .

# Build the application
RUN yarn run build

# Use production-ready Node.js environment
ENV NODE_ENV=production

# Remove dev dependencies to reduce image size
RUN yarn install --frozen-lockfile --production

# Expose necessary port (optional, depending on your setup)
#EXPOSE 3000

# Start the production server
CMD ["node", "dist/main.js"]

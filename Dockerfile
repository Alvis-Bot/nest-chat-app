##################
# BUILD BASE IMAGE
##################

FROM node:20-alpine AS base

#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################

# Install dependencies
FROM base AS development

# Set the working directory
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the source code
COPY . .

# Use development Node.js environment
ENV NODE_ENV=development

# Expose port
EXPOSE 3000

# Command to run the application with nodemon
CMD ["yarn", "start"]


#############################
# BUILD FOR PRODUCTION
#############################

FROM base AS production

# Set the working directory
WORKDIR /app

# Copy the package.json and yarn.lock files

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the source code
COPY . .

# Use production Node.js environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]



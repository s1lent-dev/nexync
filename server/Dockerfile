FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project, including the prisma/schema folder
COPY . .

# Explicitly set the Prisma schema path
ENV PRISMA_SCHEMA=./prisma/schema/schema.prisma

# Run Prisma generate with the correct schema path
RUN npx prisma generate --schema=$PRISMA_SCHEMA

# Build the project
RUN npm run build

# Start the server
CMD ["node", "dist/server.js"]

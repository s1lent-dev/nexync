FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Copy the entire project, including the prisma/schema folder
COPY . .

# Install dependencies
RUN npm install

# Run Prisma generate with the correct schema path
RUN npx prisma generate --schema prisma/schema

# Build the project
RUN npm run build

# Start the server
CMD ["node", "dist/server.js"]

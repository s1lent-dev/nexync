FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Run Prisma generate with the correct schema path
RUN npx prisma generate

# Copy only the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project, including the prisma/schema folder
COPY . .

# Build the project
RUN npm run build

# Start the server
CMD ["node", "dist/server.js"]

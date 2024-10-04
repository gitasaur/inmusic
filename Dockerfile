# Use the Alpine version of Node.js 20
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml files to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

RUN npx --yes prisma generate

# Expose the port for Next.js
EXPOSE 3000
EXPOSE 50051

# Start the development server
CMD ["pnpm", "start"]
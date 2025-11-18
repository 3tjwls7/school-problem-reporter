# Stage 1: Build React App
FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

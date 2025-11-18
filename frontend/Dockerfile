FROM node:20 AS build
WORKDIR /app

COPY package*.json ./

# npm registry 속도 개선
RUN npm config set registry https://registry.npmmirror.com

RUN npm install --legacy-peer-deps

COPY . .
COPY .env.production ./

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

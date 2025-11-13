# Node 18 LTS 이미지 사용
FROM node:18

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# 상위의 공통 package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install
RUN npm install ioredis

# backend-auth 코드 복사
COPY backend-auth ./backend-auth

# backend-auth 폴더로 이동
WORKDIR /app/backend-auth

# 포트 노출 (Auth 서버는 4001)
EXPOSE 4001

# index.js 실행 (src 아님)
CMD ["node", "index.js"]

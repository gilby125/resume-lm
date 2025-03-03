FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

RUN rm -rf .next

RUN npm install next

COPY . .

RUN npm run build

EXPOSE 3300

CMD ["node_modules/.bin/next", "start", "-p", "3300"]

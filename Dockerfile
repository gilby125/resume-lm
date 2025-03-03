FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

RUN rm -rf .next

RUN npm install next

COPY . .

RUN echo "Running next build"
RUN node_modules/.bin/next build
RUN echo "Next build completed"

EXPOSE 3300

CMD ["node_modules/.bin/next", "start", "-p", "3300"]
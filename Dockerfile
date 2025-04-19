# Вихідний образ
FROM node:22-alpine

# Робоча директорія
WORKDIR /usr/src/app

# Копіюємо файли
COPY package.json yarn.lock ./

# Встановлюємо залежності через yarn
RUN yarn install

# Копіюємо решту файлів
COPY . .

# Відкриваємо порт (за потреби)
EXPOSE 3000

# Команда запуску (можна переписати в docker-compose)
CMD ["yarn", "start"]
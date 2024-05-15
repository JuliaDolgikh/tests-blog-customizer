#!/bin/bash

echo "УСТАНОВКА ЗАВИСИМОСТЕЙ"
npm i -g wait-port@1.0.4 > /dev/null
npm ci > /dev/null
npm ci --prefix /tmp/tests-blog-customizer > /dev/null
npx playwright install > /dev/null

echo "СБОРКА ПРОЕКТА"
npm run build

echo "ЗАПУСК ПРОЕКТА"
npm run start & wait-port -t 30000 localhost:8080

echo "ЗАПУСК ТЕСТОВ"
cd /tmp/tests-blog-customizer && npm run test

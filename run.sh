#!/bin/bash

npm i -g wait-port@1.0.4
npm ci
npm ci --prefix /tmp/tests-blog-customizer
npx playwright install --with-deps

npm run build
npm run start & wait-port -t 30000 localhost:8080
cd /tmp/tests-blog-customizer && npm run test
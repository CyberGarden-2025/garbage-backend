#!/bin/sh

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Seeding data..."
npm run db:seed

echo "Starting application..."
exec node dist/main.js

#!/bin/sh

# Run migrations
npx prisma migrate deploy

# Start app
node dist/main.js
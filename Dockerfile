###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:lts-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.


# Bundle app source
COPY . .
RUN npm install


# Run the build command which creates the production bundle
RUN npm run prisma:generate
RUN npm run build

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm run prisma:generate

RUN chmod +x ./docker-bootstrap-app.sh

EXPOSE 8080
# Migrate and start the server using the production build using bootstrap.sh
ENV DATABASE_URL "mysql://root:moamoa801@127.0.0.1:3316/test"

ENTRYPOINT ["./docker-bootstrap-app.sh"]



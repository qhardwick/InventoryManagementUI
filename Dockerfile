# Use a node base image which comes with npm
FROM node:latest

# create and set our working dir to /app
WORKDIR /app

# copy our package.json (and package-lock.json if available) to /app
COPY package.json package-lock.json* ./
RUN npm install -g vite

# install our packages
RUN npm install

# copy the rest of the project files
COPY . .

# build for production using vite build
RUN npm run build

CMD ["npm", "run", "dev", "--", "--host"]

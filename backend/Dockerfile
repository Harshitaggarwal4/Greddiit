FROM node:19.3.0
WORKDIR /backend
COPY package.json ./
RUN npm install
COPY ./ ./
EXPOSE 5000
CMD npm start
# ENTRYPOINT [ "npm","start" ]
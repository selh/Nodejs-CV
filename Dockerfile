FROM node:8.9.4

RUN apt-get update && apt-get install -y build-essential

RUN mkdir /proj

WORKDIR /proj
ADD ./package.json package.json
ADD ./config config

RUN npm install
RUN npm install --sav-dev babel-cli babel-preset-es2016

EXPOSE 9999

CMD ["npm", "run", "style"]
CMD ["npm", "run", "start:dev"]

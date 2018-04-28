# dev environment
FROM node:8.9.4

RUN apt-get update && apt-get install -y build-essential

#filesystem
RUN for i in `seq 1 3`; do \
      for j in `seq 1 3`; do \
          for k in `seq 1 3`; do \
            mkdir -p "/files/$i/$j/$k"; \
          done \
      done \
    done

#seed fs
COPY chef/cookbooks/baseconfig/files/EipjRV.pdf /files/1/3/3/EipjRV.pdf
COPY chef/cookbooks/baseconfig/files/HmYibh.pdf /files/1/1/3/HmYibh.pdf

#project directory
RUN mkdir /proj

WORKDIR /proj
ADD ./package.json package.json
ADD ./config config

RUN npm install

EXPOSE 9999

CMD ["npm", "run", "style"]
CMD ["npm", "run", "start:dev"]

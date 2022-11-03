FROM node:14-buster-slim

WORKDIR '/app'

RUN apt update && \
    apt install -y software-properties-common && \
    apt-get --assume-yes install apt-transport-https && \
    apt-add-repository 'deb https://notesalexp.org/tesseract-ocr-dev/buster/ buster main' && \
    # apt-get --assume-yes install wget && \
    # wget -O - https://notesalexp.org/debian/alexp_key.asc | apt-key add - && \
    # apt-get update && \
    apt-get update -oAcquire::AllowInsecureRepositories=true && \
    apt-get --assume-yes --allow-unauthenticated install notesalexp-keyring -oAcquire::AllowInsecureRepositories=true && \
    apt-get update && \
    apt-get --assume-yes install tesseract-ocr tesseract-ocr-tha

COPY ./package*.json ./
RUN npm install

COPY ./ ./

CMD ["npm", "run", "start:dev"]
EXPOSE 5000

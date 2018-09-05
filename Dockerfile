FROM node:8.11.1

WORKDIR /usr/src/smart-brain-api

COPY ./ ./

RUN npm install

ENV PORT 3000
EXPOSE 3000

CMD ["/bin/bash"]

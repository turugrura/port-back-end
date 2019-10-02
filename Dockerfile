FROM node:12.10.0-slim

WORKDIR /usr/src/myport-api

COPY ./ ./

# RUN npm install
# RUN rm -rf node_modules/sharp

# RUN npm uninstall sharp

# RUN npm install --save sharp

CMD [ "/bin/bash" ]
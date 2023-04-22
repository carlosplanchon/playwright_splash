FROM mcr.microsoft.com/playwright:v1.32.0-focal

COPY server.js /home/pwuser

# Install the application dependencies.
COPY package.json /home/pwuser
# COPY package-lock.json /home/pwuser

WORKDIR /home/pwuser

EXPOSE 56572

RUN ["npm", "install"]
RUN npm ci --omit=dev

CMD [ "node", "server.js" ]

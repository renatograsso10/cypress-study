# Base image with Node 20 and Chrome
FROM cypress/browsers:node-20.9.0-chrome-118.0.5993.88-1-ff-118.0.2-edge-118.0.2088.46-1

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install Java (Required for Allure)
RUN apt-get update && \
    apt-get install -y default-jre && \
    apt-get clean

# Install dependencies (Clean Install)
RUN npm ci

# Copy project files
COPY . .

# Verification command
CMD ["npm", "run", "test:report"]

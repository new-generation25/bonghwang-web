FROM alpine:latest

# Install required dependencies
RUN apk add --no-cache \
    ca-certificates \
    wget \
    unzip

# Create app directory
WORKDIR /app

# Download PocketBase for Linux
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.31/pocketbase_0.22.31_linux_amd64.zip && \
    unzip pocketbase_0.22.31_linux_amd64.zip && \
    rm pocketbase_0.22.31_linux_amd64.zip && \
    chmod +x /app/pocketbase

# Expose port (Railway will set this dynamically)
# Railway automatically sets PORT environment variable
EXPOSE 8080

# Create startup script that properly expands PORT
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'PORT=${PORT:-8080}' >> /app/start.sh && \
    echo 'exec /app/pocketbase serve --http=0.0.0.0:$PORT' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start PocketBase using the script
ENTRYPOINT ["/app/start.sh"]


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

# Create pb_data directory for persistent storage
# Note: Railway requires volumes to be configured via Dashboard, not Dockerfile
# Mount path: /app/pb_data
RUN mkdir -p /app/pb_data

# Expose port (Railway will set this dynamically)
# Railway automatically sets PORT environment variable
EXPOSE 8080

# Create a wrapper script that properly handles PORT
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo 'PORT="${PORT:-8080}"' >> /app/entrypoint.sh && \
    echo 'echo "Starting PocketBase on port $PORT"' >> /app/entrypoint.sh && \
    echo 'exec /app/pocketbase serve --http=0.0.0.0:"$PORT"' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Use the wrapper script
ENTRYPOINT ["/app/entrypoint.sh"]


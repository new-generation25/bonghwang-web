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

# Start PocketBase (Railway sets PORT environment variable)
# Railway automatically provides PORT env var, use it directly
CMD ["/bin/sh", "-c", "/app/pocketbase serve --http=0.0.0.0:${PORT:-8080}"]


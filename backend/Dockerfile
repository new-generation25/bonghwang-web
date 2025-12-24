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

# Expose port
EXPOSE 8080

# Start PocketBase
CMD ["/app/pocketbase", "serve", "--http=0.0.0.0:8080"]


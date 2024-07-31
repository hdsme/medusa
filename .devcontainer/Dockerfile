FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

RUN apt-get update && apt-get install -y tzdata

# Set the timezone environment variable
ENV TZ=Asia/Ho_Chi_Minh

# Set the default timezone to avoid prompts during tzdata installation
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
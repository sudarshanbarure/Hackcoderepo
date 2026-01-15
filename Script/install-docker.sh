#!/bin/bash
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing docker.io..."
    sudo apt update
    sudo apt install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker already installed"
fi

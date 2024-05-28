#!/bin/bash

# Stop the web site
sudo systemctl stop kiosk.service

# Pull latest from GIT
git pull

# Build SPA
cd homecontrol-dashboard/
npm i
npm run build
cd ..

# Build server
cd homecontrol-server/
npm i
npm run build
cd ..

# Start service
sudo systemctl stop kiosk.service
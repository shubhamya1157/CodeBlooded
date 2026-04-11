#!/bin/bash

# CampusConnect - Stop Script

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Stopping CampusConnect Services...${NC}\n"

# Kill services gracefully
services=(
  "Auth Service"
  "Event Service"
  "Registration Service"
  "API Gateway"
  "Frontend"
)

for service in "${services[@]}"; do
  log_file="logs/${service}.log"
  pid_file="logs/${service}.pid"
  
  if [ -f "$pid_file" ]; then
    pid=$(cat "$pid_file")
    if kill -0 $pid 2>/dev/null; then
      kill $pid
      echo -e "${GREEN}✓ Stopped ${service} (PID: $pid)${NC}"
    fi
    rm "$pid_file"
  fi
done

# Kill any remaining npm/node processes
pkill -f "npm run dev" || true
pkill -f "vite" || true

sleep 2

# Check if all processes are stopped
if ! pgrep -f "npm run dev" > /dev/null && ! pgrep -f "vite" > /dev/null; then
  echo -e "${GREEN}\n✅ All services stopped successfully!${NC}"
else
  echo -e "${RED}\n⚠️  Some processes may still be running${NC}"
  echo "Force killing remaining processes..."
  pkill -9 -f "npm run dev" || true
  pkill -9 -f "node" || true
  pkill -9 -f "vite" || true
  echo -e "${GREEN}✓ Force stopped${NC}"
fi

echo ""

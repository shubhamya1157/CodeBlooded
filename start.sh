#!/bin/bash

# CampusConnect Professional Development Startup
# HackTheChain 4.0 - Microservices Platform

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Create logs directory
mkdir -p logs

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🚀 CampusConnect - Professional Development Setup      ║"
echo "║         HackTheChain 4.0 - Microservices Platform         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to start a service
start_service() {
  local name=$1
  local port=$2
  local command=$3
  local log_file="logs/${name}.log"

  echo -e "${YELLOW}Starting ${name}...${NC}"
  
  eval "$command" > "$log_file" 2>&1 &
  local pid=$!
  
  sleep 2
  
  if kill -0 $pid 2>/dev/null; then
    echo -e "${GREEN}✓ ${name} started (PID: $pid, Port: $port)${NC}"
    echo "$pid" > "logs/${name}.pid"
  else
    echo -e "${RED}✗ ${name} failed to start${NC}"
    cat "$log_file"
    return 1
  fi
}

# Kill previous instances
echo -e "${BLUE}Cleaning up previous instances...${NC}"
pkill -f "npm run dev" || true
pkill -f "vite" || true
pkill -f "node" || true
sleep 2
echo -e "${GREEN}✓ Clean${NC}\n"

# Start services
echo -e "${BLUE}📡 Starting Services...${NC}\n"

# Auth Service
start_service "Auth Service" "3001" "npm run dev:auth" &
sleep 3

# Event Service
start_service "Event Service" "3002" "npm run dev:events" &
sleep 3

# Registration Service
start_service "Registration Service" "3003" "npm run dev:registration" &
sleep 3

# API Gateway
start_service "API Gateway" "8080" "npm run dev:gateway" &
sleep 3

# Frontend
start_service "Frontend" "5173" "npm run dev:frontend" &

echo ""
echo -e "${GREEN}✅ All services started!${NC}\n"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 Service Dashboard:${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}Auth Service${NC}..................... http://localhost:3001"
echo -e "  ${GREEN}Event Service${NC}................... http://localhost:3002"
echo -e "  ${GREEN}Registration Service${NC}........... http://localhost:3003"
echo ""
echo -e "  ${GREEN}API Gateway${NC}.................... http://localhost:8080"
echo -e "  ${GREEN}Health Check${NC}................... http://localhost:8080/api/health"
echo ""
echo -e "  ${GREEN}Frontend Application${NC}.......... http://localhost:5173"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📝 Logs Location:${NC}"
echo "  logs/Auth\ Service.log"
echo "  logs/Event\ Service.log"
echo "  logs/Registration\ Service.log"
echo "  logs/API\ Gateway.log"
echo "  logs/Frontend.log"
echo ""

echo -e "${YELLOW}🛑 To Stop Services:${NC}"
echo "  Press Ctrl+C"
echo "  Or run: bash stop.sh"
echo ""

echo -e "${YELLOW}🧪 Quick Tests:${NC}"
echo "  • Check Backend: curl http://localhost:8080/api/health"
echo "  • Frontend: Open http://localhost:5173 in browser"
echo "  • Test Auth: Create account in UI"
echo ""

# Wait for all background jobs
wait


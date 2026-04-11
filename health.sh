#!/bin/bash

# CampusConnect Health Check Script

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏥 CampusConnect Health Check${NC}\n"

# Services to check
declare -A services=(
  ["Auth Service"]="http://localhost:3001/health"
  ["Event Service"]="http://localhost:3002/health"
  ["Registration Service"]="http://localhost:3003/health"
  ["API Gateway"]="http://localhost:8080/api/health"
  ["Frontend"]="http://localhost:5173"
)

# Function to check service
check_service() {
  local name=$1
  local url=$2
  
  if curl -s -m 2 "$url" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} ${name}..................${GREEN}UP${NC}"
    return 0
  else
    echo -e "${RED}✗${NC} ${name}..................${RED}DOWN${NC}"
    return 1
  fi
}

# Check all services
total=0
healthy=0

for service in "${!services[@]}"; do
  url="${services[$service]}"
  check_service "$service" "$url"
  ((total++))
  if [ $? -eq 0 ]; then
    ((healthy++))
  fi
done

echo ""
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "Status: ${healthy}/${total} services running"

if [ $healthy -eq $total ]; then
  echo -e "${GREEN}✅ All systems operational!${NC}"
else
  echo -e "${YELLOW}⚠️  Some services are down${NC}"
fi

echo -e "${BLUE}════════════════════════════════════${NC}"
echo ""

# Check ports with netstat
echo -e "${BLUE}📡 Port Status:${NC}"
ports=(3001 3002 3003 8080 5173)
for port in "${ports[@]}"; do
  if lsof -i :$port > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Port $port is in use"
  else
    echo -e "  ${RED}✗${NC} Port $port is free"
  fi
done

echo ""
echo -e "${BLUE}Quick Links:${NC}"
echo "  • Auth Service.............. http://localhost:3001"
echo "  • Event Service............. http://localhost:3002"
echo "  • Registration Service...... http://localhost:3003"
echo "  • API Gateway............... http://localhost:8080"
echo "  • Health Check.............. http://localhost:8080/api/health"
echo "  • Frontend.................. http://localhost:5173"
echo ""

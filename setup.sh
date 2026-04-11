#!/bin/bash

# CampusConnect Development Setup Script
# Professional setup for HackTheChain 4.0 Microservices Platform

set -e  # Exit on error

echo "🚀 CampusConnect Development Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install root dependencies
echo -e "${BLUE}📦 Step 1: Installing root dependencies...${NC}"
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Root dependencies installed${NC}\n"

# Step 2: Install backend service dependencies
echo -e "${BLUE}📦 Step 2: Installing backend service dependencies...${NC}"

services=(
  "backend/services/user-auth-service"
  "backend/services/event-management-service"
  "backend/services/registration-notification-service"
  "backend/services/api-gateway"
)

for service in "${services[@]}"; do
  if [ -d "$service" ]; then
    echo "  Installing $service..."
    cd "$service"
    npm install --legacy-peer-deps
    cd - > /dev/null
    echo -e "${GREEN}  ✓ $service ready${NC}"
  fi
done
echo ""

# Step 3: Install frontend dependencies
echo -e "${BLUE}📦 Step 3: Installing frontend dependencies...${NC}"
cd frontend
npm install --legacy-peer-deps
cd - > /dev/null
echo -e "${GREEN}✓ Frontend dependencies installed${NC}\n"

# Step 4: Environment setup
echo -e "${BLUE}🔧 Step 4: Setting up environment variables...${NC}"
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file${NC}"
else
  echo -e "${YELLOW}ℹ .env file already exists${NC}"
fi

if [ ! -f "frontend/.env.local" ]; then
  cat > frontend/.env.local << EOF
VITE_API_URL=http://localhost:8080/api
EOF
  echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
else
  echo -e "${YELLOW}ℹ frontend/.env.local already exists${NC}"
fi
echo ""

# Step 5: Summary
echo -e "${GREEN}✅ Setup Complete!${NC}\n"
echo -e "${BLUE}Available Services:${NC}"
echo "  • Auth Service.............. http://localhost:3001"
echo "  • Event Service............. http://localhost:3002"
echo "  • Registration Service...... http://localhost:3003"
echo "  • API Gateway............... http://localhost:8080"
echo "  • Frontend.................. http://localhost:5173"
echo ""

echo -e "${BLUE}Quick Start Commands:${NC}"
echo "  npm run dev                 # Start all services"
echo "  npm run dev:auth            # Auth service only"
echo "  npm run dev:events          # Events service only"
echo "  npm run dev:registration    # Registration service only"
echo "  npm run dev:gateway         # API Gateway only"
echo "  npm run dev:frontend        # Frontend only"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Run: ${GREEN}npm run dev${NC}"
echo "  2. Open: ${GREEN}http://localhost:5173${NC}"
echo "  3. Test the platform!"
echo ""

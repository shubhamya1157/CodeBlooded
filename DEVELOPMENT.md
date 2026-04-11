# 🚀 CampusConnect - Professional Development Guide

## Quick Start (Recommended)

### One-Command Setup & Run

```bash
cd /Users/shubhamya1157/Desktop/hack/CodeBlooded

# First time setup (installs all dependencies)
bash setup.sh

# Start all services
bash start.sh
```

Then open your browser:
- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/api/health

---

## Available Scripts

### Setup & Installation
```bash
bash setup.sh
```
- Installs all dependencies
- Sets up environment files
- Configures workspaces
- **Run this first time only**

### Start Services
```bash
bash start.sh
```
- Starts all 5 services simultaneously
- Creates logs in `logs/` directory
- Shows service URLs and ports
- Enable color-coded output

### Stop Services
```bash
bash stop.sh
```
- Gracefully stops all services
- Cleans up PID files
- Confirms shutdown

### Health Check
```bash
bash health.sh
```
- Monitors all services
- Shows port status
- Displays quick links
- **Run while services are running**

---

## Service Architecture

```
┌─────────────────────────────────────┐
│      Frontend (React + Vite)        │
│      http://localhost:5173          │
└──────────────────┬──────────────────┘
                   │
           API Gateway
        http://localhost:8080
                   │
        ┌──────────┼──────────┐
        │          │          │
    Auth (3001) Events(3002) Reg(3003)
        │          │          │
    PostgreSQL PostgreSQL PostgreSQL
```

---

## Services Overview

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Auth Service** | 3001 | http://localhost:3001 | User authentication & JWT |
| **Event Service** | 3002 | http://localhost:3002 | Event CRUD operations |
| **Registration Service** | 3003 | http://localhost:3003 | Event registrations |
| **API Gateway** | 8080 | http://localhost:8080 | Entry point, routing |
| **Frontend** | 5173 | http://localhost:5173 | React UI |

---

## File Structure

```
CodeBlooded/
├── setup.sh                    # Initial setup (run once)
├── start.sh                    # Start all services
├── stop.sh                     # Stop all services
├── health.sh                   # Health monitoring
├── logs/                       # Service logs
│   ├── Auth\ Service.log
│   ├── Event\ Service.log
│   ├── Registration\ Service.log
│   ├── API\ Gateway.log
│   └── Frontend.log
├── frontend/                   # React UI
├── backend/
│   └── services/
│       ├── user-auth-service/
│       ├── event-management-service/
│       ├── registration-notification-service/
│       └── api-gateway/
└── package.json
```

---

## Step-by-Step Setup

### Step 1: Initial Setup (First Time Only)
```bash
cd /Users/shubhamya1157/Desktop/hack/CodeBlooded
bash setup.sh
```

Expected output:
```
✅ Setup Complete!

Available Services:
  • Auth Service.............. http://localhost:3001
  • Event Service............. http://localhost:3002
  • Registration Service...... http://localhost:3003
  • API Gateway............... http://localhost:8080
  • Frontend.................. http://localhost:5173
```

### Step 2: Start All Services
```bash
bash start.sh
```

Expected output:
```
✅ All services started!

📊 Service Dashboard:
  Auth Service..................... http://localhost:3001
  Event Service................... http://localhost:3002
  Registration Service........... http://localhost:3003
  API Gateway.................... http://localhost:8080
  Frontend Application.......... http://localhost:5173
```

### Step 3: Verify Services Are Running
In another terminal:
```bash
bash health.sh
```

Expected output:
```
✓ Auth Service..................✓ UP
✓ Event Service..................✓ UP
✓ Registration Service..................✓ UP
✓ API Gateway..................✓ UP
✓ Frontend..................✓ UP

Status: 5/5 services running
✅ All systems operational!
```

### Step 4: Open Frontend
```bash
# In your browser
http://localhost:5173
```

---

## Usage Guide

### Testing the Platform

1. **Create Account**
   - Go to http://localhost:5173
   - Click "Sign In"
   - Choose "Student" or "Organizer"
   - Create account

2. **Browse Events**
   - Click "Explore Events"
   - Search and filter
   - View event details

3. **Register for Event**
   - Click event
   - Click "Register Now"
   - See confirmation

4. **Organizer Features**
   - Create event
   - Manage registrations
   - View analytics

### Monitoring

**View Logs in Real-Time:**
```bash
# In separate terminals

# Terminal 1: Auth Service logs
tail -f logs/Auth\ Service.log

# Terminal 2: Gateway logs
tail -f logs/API\ Gateway.log

# Terminal 3: Frontend logs
tail -f logs/Frontend.log
```

**Check Service Status:**
```bash
bash health.sh
```

**List Running Processes:**
```bash
ps aux | grep node
ps aux | grep vite
```

---

## Individual Service Commands

If you need to run services individually:

```bash
# Terminal 1: Auth Service
npm run dev:auth

# Terminal 2: Event Service
npm run dev:events

# Terminal 3: Registration Service
npm run dev:registration

# Terminal 4: API Gateway
npm run dev:gateway

# Terminal 5: Frontend
npm run dev:frontend
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use the stop script
bash stop.sh
```

### Services Won't Start
```bash
# Check if node_modules exists
ls -la node_modules | head

# Reinstall dependencies
bash setup.sh

# Check for npm errors
npm run dev 2>&1 | head -50
```

### Frontend Not Loading
```bash
# Check API Gateway is running
curl http://localhost:8080/api/health

# Check frontend on different port
npm run dev -- --port 3000

# Clear browser cache
# Open DevTools (F12) and hard refresh (Ctrl+Shift+R)
```

### Database Connection Issues
```bash
# Check if services have .env configured
cat backend/services/user-auth-service/.env

# Verify DATABASE_URL is correct
# Update .env in each service if needed
```

---

## Production Checklist

Before deploying:
- [ ] All services pass health check
- [ ] Frontend loads without errors
- [ ] Can create account and login
- [ ] Can browse events
- [ ] Can register for events
- [ ] Organizer can create events
- [ ] Notifications working
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] API calls successful

---

## Performance Tips

1. **Parallel Development**
   - Use multiple terminals for each service
   - Helps with debugging
   - See real-time logs

2. **Hot Reload**
   - Frontend: Automatic (Vite)
   - Backend: Automatic (nodemon)
   - Modify code, save, refresh

3. **Clear Cache**
   - Clear browser cache for frontend changes
   - Restart service if backend changes don't reflect

4. **Monitor Logs**
   - Keep `tail -f` open in extra terminal
   - Helps identify issues quickly

---

## Common Use Cases

### Local Testing
```bash
bash start.sh
# Open http://localhost:5173
# Test features
bash stop.sh
```

### Debugging Specific Service
```bash
npm run dev:auth        # Start auth service only
# In another terminal
tail -f logs/Auth\ Service.log
```

### Testing API Directly
```bash
# Check health
curl http://localhost:8080/api/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get all events
curl http://localhost:8080/api/events
```

### Performance Testing
```bash
# Simulate 100 concurrent requests
ab -n 100 -c 10 http://localhost:8080/api/events
```

---

## Support

**Issues?**
1. Check logs: `bash health.sh`
2. Read error messages carefully
3. Try `bash stop.sh` then `bash start.sh`
4. Reinstall: `bash setup.sh`

**Need Help?**
- Frontend issues → Check `logs/Frontend.log`
- API issues → Check `logs/API\ Gateway.log`
- Auth issues → Check `logs/Auth\ Service.log`

---

## Summary

```bash
# First time
bash setup.sh

# Every development session
bash start.sh

# Monitor services
bash health.sh

# When done
bash stop.sh
```

**That's it! Happy coding! 🚀**

---

*Last Updated: April 11, 2026*
*HackTheChain 4.0 - Microservices Track*

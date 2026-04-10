# CampusConnect — claude.md
> **HackTheChain 4.0 | Track: Microservices**
> Principal Engineer Reference Document — React + JavaScript Stack
> **Backend Owner:** You | **Frontend Owner:** Teammate

---

## 🧭 Project Mission

Build **CampusConnect**, a resilient, **multi-tenant** event management platform for campus societies. Organisations (TechKnow Society, CACS Society, Clutch, Fit India Club, etc.) manage events, members, tasks, and utilities — while students register and participate. Architecture optimises for **fault isolation**, **horizontal scalability**, and **developer velocity**.

### 🧱 Core Architectural Principle

> "Separate identity from membership."

- **User = identity** (who you are)
- **Membership = role inside an organisation** (what you can do)

This enables one user to belong to multiple organisations with different roles in each. Build boundaries first, features later — clean RBAC, clear ownership (org → event), no coupled services.

---

## 🗂️ Monorepo Structure

```
campusconnect/
├── services/
│   ├── user-auth-service/                  # Port 3001 — JWT, users, orgs, members
│   ├── event-management-service/           # Port 3002 — Events, chat, worklist, AI
│   ├── registration-notification-service/  # Port 3003 — Queue, waitlist, email
│   ├── api-gateway/                        # Port 8080 — Reverse proxy, rate limiting
│   └── analytics-service/                  # Port 3004 — Bonus: real-time insights
├── client/                                 # React SPA (Vite + React 18) — teammate owns
├── shared/
│   ├── constants/                          # Shared enums, error codes, event topics
│   └── types/                              # JSDoc type definitions shared across services
├── infra/
│   ├── docker-compose.yml
│   ├── nginx/
│   └── rabbitmq/
├── docs/
│   ├── architecture-diagram.png
│   ├── openapi/                            # Per-service OpenAPI 3.0 specs
│   └── event-schemas/                      # RabbitMQ message schemas
└── claude.md
```

---

## ⚙️ Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React 18 + Vite | Teammate's stack — fast HMR, concurrent rendering |
| Styling | Tailwind CSS + shadcn/ui + **Framer Motion** | Light theme; Framer Motion for page transitions and animations |
| State | Zustand + React Query | Minimal boilerplate; server-state separation |
| Backend Runtime | Node.js 20 (ESM) | Uniform JS across all services |
| HTTP Framework | Express 5 | Battle-tested middleware ecosystem |
| Auth | JWT RS256 + refresh tokens | Stateless, verifiable across services |
| Message Queue | RabbitMQ | Durable queues, dead-letter exchange for overflow |
| Databases | MongoDB per service | Document model; isolated data stores |
| Real-time | Socket.IO (event-mgmt service) | Chat, announcements, seat counter push |
| Containerisation | Docker + docker-compose | Local orchestration, reproducible builds |
| API Gateway | Custom Express Gateway | Rate limiting, auth middleware, routing |
| Resilience | opossum (circuit breaker) | Node.js circuit breaker |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) | Event categorisation + personalised recommendations |
| Testing | Vitest + Supertest | Unit + integration coverage |

---

## 🗃️ MongoDB Schemas

### Service: `user-auth-service` — DB: `auth`

#### `users` collection
```js
{
  _id: ObjectId,
  name: String,
  email: String,                          // unique
  passwordHash: String,
  avatar: String,                         // URL
  role: "student" | "organiser" | "admin",
  eventsRegistered: [ObjectId],           // upcoming registered events
  eventsAttended: [ObjectId],             // past attended events
  registrationStatus: "pending" | "confirmed" | "waitlisted",
  createdAt: ISODate
}
```

#### `organizations` collection
```js
{
  _id: ObjectId,
  name: String,                           // "TechKnow Society"
  email: String,                          // unique
  passwordHash: String,
  avatar: String,                         // URL
  description: String,
  createdBy: ObjectId,                    // userId of creator; auto-assigned admin role
  events: [ObjectId],
  createdAt: ISODate
}
```

#### `memberships` collection
> Separates identity from role. One user can belong to multiple orgs with different roles.
```js
{
  _id: ObjectId,
  userId: ObjectId,                       // ref → users._id
  orgId: ObjectId,                        // ref → organizations._id
  role: "admin" | "senior_exec" | "junior_exec",
  joinedAt: ISODate
}
```

> **RBAC Rules**

| Action | Admin | Senior Exec | Junior Exec |
|--------|-------|-------------|-------------|
| Add member | ✅ | ✅ | ❌ |
| Remove member | ✅ | ❌ | ❌ |
| Create event | ✅ | ✅ | ❌ |
| Assign tasks | ✅ | ✅ | ❌ |
| View tasks | ✅ | ✅ | ✅ |
| Send announcement | ✅ | ✅ | ❌ |
| View complaints | ✅ | ✅ | ❌ |

---

### Service: `event-management-service` — DB: `events`

#### `events` collection
```js
{
  _id: ObjectId,
  name: String,
  description: String,
  category: "hackathon" | "cultural" | "sports" | "workshop" | "lecture",
  orgId: ObjectId,
  createdBy: ObjectId,                    // userId/memberId who created
  venue: String,
  capacity: Number,
  registeredCount: Number,                // maintained via RabbitMQ
  registrationDeadline: ISODate,          // cutoff for new registrations
  startsAt: ISODate,
  endsAt: ISODate,
  status: "draft" | "published" | "cancelled" | "completed",
  tags: [String],
  aiSummary: String,                      // Claude API generated
  worklist: [{
    taskId: ObjectId,
    title: String,
    assignedTo: ObjectId,                 // userId (member)
    assigneeName: String,
    status: "pending" | "completed",
    createdBy: ObjectId,
    scope: "org" | "event"               // org-level or event-level task
  }],
  utilities: [{
    item: "camera" | "tripod" | "table" | "MIC" | "projector" | "sound_system" | "lighting",
    quantity: Number,
    assigned: Boolean
  }],
  complaints: [{
    userId: ObjectId,
    text: String,
    status: "open" | "resolved",         // org can mark resolved
    createdAt: ISODate
  }],
  createdAt: ISODate,
  updatedAt: ISODate
}
```

#### `messages` collection (Chat + Announcements)
```js
{
  _id: ObjectId,
  eventId: ObjectId,
  senderId: ObjectId,
  senderName: String,
  senderRole: "student" | "junior_exec" | "senior_exec",
  type: "chat" | "announcement",          // announcements: org/member only
  text: String,
  createdAt: ISODate
}
```

> **Aggregation pipeline note:** Use `$lookup` to join member names onto worklist entries. Use `$project` with date math for `timeLeft`. Use `$subtract: [capacity, registeredCount]` for `seatsLeft`.

#### Key Aggregation — Event Detail with Enrollment Check
```js
db.events.aggregate([
  { $match: { _id: ObjectId(eventId) } },
  {
    $lookup: {
      from: "registrations",      // cross-service: queried via API, not direct lookup
      localField: "_id",
      foreignField: "eventId",
      as: "regs"
    }
  },
  {
    $addFields: {
      seatsLeft: { $subtract: ["$capacity", "$registeredCount"] },
      timeLeft: { $subtract: ["$startsAt", "$$NOW"] },
      isRegistered: { $in: [userId, "$regs.userId"] }
    }
  },
  {
    $project: { passwordHash: 0 }
  }
])
```

> **Note:** `registrations` live in a separate service DB. In production, `isRegistered` is injected by the API Gateway after calling registration-service. The aggregation above is for internal use within event-management-service only.

---

### Service: `registration-notification-service` — DB: `registrations`

#### `registrations` collection
```js
{
  _id: ObjectId,
  eventId: String,
  userId: String,
  status: "confirmed" | "waitlisted" | "cancelled",
  registeredAt: ISODate,
  notificationSent: Boolean,
  queuePosition: Number | null            // null if confirmed
}
```

---

## 🔌 Complete API Endpoint Map

### User & Auth Service — Port 3001

#### Auth
| Method | Endpoint | Body / Notes |
|--------|----------|--------------|
| POST | `/auth/register` | `{ type: "user"\|"organisation"\|"member", ...fields }` |
| POST | `/auth/login` | `{ email, password }` → `{ accessToken, refreshToken }` |
| POST | `/auth/refresh` | Rotate refresh token |
| GET | `/auth/verify` | Internal JWT validation (called by gateway) |

**Signup `type` field routing:**
- `user` → insert into `users`, role = `student`
- `organisation` → insert into `organizations`
- `member` → insert into `members`, requires `orgId` + `eventId` in body

#### Users
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/users/:id` | Profile fetch |
| PATCH | `/users/:id` | Update name, avatar, password |

#### Members / Membership
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/members/:id` | Member profile |
| PATCH | `/members/:id` | Update name, avatar, password |
| GET | `/organizations/:id/members` | List all members + roles |
| PATCH | `/members/:id/role` | Promote/demote role (admin only) |

#### Organizations
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/organizations` | Create org |
| GET | `/organizations/:id` | Get org + members + events list |
| PUT | `/organizations/:id` | Update name, description, avatar, email, password |
| DELETE | `/organizations/:id` | Delete org |
| POST | `/organizations/:id/members` | Add member (by email or memberId) |
| DELETE | `/organizations/:id/members/:memberId` | Remove member |
| PUT | `/organizations/:orgId/events/:eventId` | Rename event |

---

### Event Management Service — Port 3002

#### Events
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/events` | Create (org only); triggers AI categorisation |
| GET | `/events` | Paginated list with filters: category, date, availability |
| GET | `/events/:id` | Detail + seatsLeft + timeLeft (aggregation) + enrollment status |
| PATCH | `/events/:id` | Update details |
| DELETE | `/events/:id` | Soft delete (status = cancelled) |
| GET | `/events/:id/registrations` | Org view of attendees |

#### Chat & Announcements (persisted in MongoDB)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/events/:id/messages` | Paginated history (`?type=chat\|announcement`) |
| POST | `/events/:id/messages` | Send message (type inferred from sender role) |

#### Worklist
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/events/:id/worklist` | All tasks with assignee names |
| POST | `/events/:id/worklist` | Add task + assign to member |
| PATCH | `/events/:id/worklist/:taskId` | Update status (completed/pending) |

#### Utilities
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/events/:id/utilities` | List all utilities + assigned status |
| PATCH | `/events/:id/utilities` | Bulk update (add/remove/assign items) |

#### Complaints
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/events/:id/complaints` | Submit complaint (authenticated users) |
| GET | `/events/:id/complaints` | View complaints (org/admin only) |

#### RabbitMQ — Publishes
- `event.created` → analytics-service
- `event.updated` → analytics-service
- `event.cancelled` → registration-service (trigger cancellations)

#### RabbitMQ — Consumes
- `registration.confirmed` → `$inc { registeredCount: 1 }`
- `registration.cancelled` → `$inc { registeredCount: -1 }`

---

### Registration & Notification Service — Port 3003

| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/registrations` | Register for event; waitlisted if full |
| DELETE | `/registrations/:id` | Cancel registration; promotes waitlist |
| GET | `/registrations/user/:userId` | My registrations |
| GET | `/registrations/event/:eventId` | Event roster (org only) |
| POST | `/notifications/send` | Internal trigger for email/push |

---

### API Gateway — Port 8080

```
Incoming Request
      │
      ▼
┌──────────────────────┐
│  Rate Limiter         │  100 req/min per IP
│  CORS Handler         │
│  Request Logger       │  morgan
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│  Auth Middleware      │  Calls GET /auth/verify → cached in Redis (TTL 30s)
└──────────┬───────────┘
           ▼
┌─────────────────────────────────────────────────────┐
│  Route Proxying (http-proxy-middleware)              │
│  /api/auth/*         → user-auth-service:3001       │
│  /api/users/*        → user-auth-service:3001       │
│  /api/organizations/* → user-auth-service:3001      │
│  /api/members/*      → user-auth-service:3001       │
│  /api/events/*       → event-management-service:3002│
│  /api/register/*     → registration-service:3003    │
│  /api/analytics/*    → analytics-service:3004       │
└─────────────────────────────────────────────────────┘
```

---

## 🔌 Socket.IO Real-time Events (Port 3002)

| Event | Direction | Payload | Purpose |
|-------|-----------|---------|---------|
| `subscribe:event` | client → server | `{ eventId }` | Join event room |
| `unsubscribe:event` | client → server | `{ eventId }` | Leave room |
| `seat:update` | server → client | `{ eventId, seatsLeft }` | Live seat counter |
| `chat:message` | client → server | `{ eventId, text }` | Send chat |
| `chat:message:new` | server → client | `{ message }` | Broadcast chat to room |
| `announcement:new` | server → client | `{ message }` | Org broadcasts to room |

---

## 🔐 JWT Payload

```js
{
  sub: "entityId",
  role: "student" | "organiser" | "member" | "admin",
  type: "user" | "organisation" | "member",   // entity type
  orgId: "ObjectId | null",                   // set for members
  iat: 1700000000,
  exp: 1700003600
}
```

- Signed with RS256 (private key stays in user-auth-service)
- Public key distributed to all services for verification
- Refresh tokens stored in Redis with TTL

---

## 🛂 RBAC Middleware

Authorization is a **two-step** check on every protected route:

```js
// shared/middleware/rbac.js
export function requireOrgRole(...allowedRoles) {
  return async (req, res, next) => {
    const { sub: userId, role, orgId } = req.jwt;   // from rich JWT

    // Fast path: admin in JWT → always allowed
    if (role === 'admin') return next();

    // Fetch membership for this org from user-auth-service (cached in Redis 60s)
    const orgIdParam = req.params.orgId || req.body.orgId;
    const membership = await getMembership(userId, orgIdParam);  // Redis-cached

    if (!membership || !allowedRoles.includes(membership.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    req.membership = membership;
    next();
  };
}

// Usage on routes:
router.post('/events', requireOrgRole('admin', 'senior_exec'), createEvent);
router.post('/organizations/:orgId/members', requireOrgRole('admin', 'senior_exec'), addMember);
router.delete('/organizations/:orgId/members/:memberId', requireOrgRole('admin'), removeMember);
```

---

## 🔢 Backend Implementation Order

Follow this sequence strictly — each layer depends on the one above.

1. **Auth Service** — users, orgs, JWT RS256, refresh tokens
2. **Membership + RBAC** — memberships collection, `requireOrgRole` middleware, role patch
3. **Event Service** — CRUD, capacity, `registrationDeadline`, Socket.IO room setup
4. **Registration Logic** — RabbitMQ queue, waitlist, circuit breaker, auto-promote on cancel
5. **Aggregation API** — `seatsLeft`, `timeLeft`, `isRegistered` injected at gateway
6. **Tasks + Complaints** — worklist (org + event scope), complaint with `open/resolved` status
7. **Chat + Announcements** — persist to `messages` collection, broadcast via Socket.IO
8. **AI Features** — categorisation on event create, recommendations on home feed
9. **API Gateway** — proxy routes, rate limit, Redis cache, `isEnrolled` injection
10. **Stress Test** — k6 burst, tune RabbitMQ prefetch, verify circuit breaker fires

---

## 🤖 AI Features (Anthropic Claude API)

### 1. Event Categorisation (on POST /events)

```js
// event-management-service/src/services/aiService.js
export async function categoriseEvent({ title, description }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Campus event:
Title: ${title}
Description: ${description}

Return ONLY valid JSON (no markdown):
{ "category": "<hackathon|cultural|sports|workshop|lecture>", "tags": ["tag1","tag2"], "aiSummary": "<one sentence>" }`
      }]
    })
  });
  const data = await response.json();
  return JSON.parse(data.content[0].text);
}
```

### 2. Personalised Recommendations (GET /events — for logged-in users)

```js
// Send user's past event history to Claude, return ranked event IDs
export async function recommendEvents({ userHistory, availableEvents }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `User's past events: ${JSON.stringify(userHistory)}
Available events: ${JSON.stringify(availableEvents.map(e => ({ id: e._id, name: e.name, category: e.category, tags: e.tags })))}

Return ONLY valid JSON: { "recommendedIds": ["id1","id2","id3"], "reason": "<one sentence>" }`
      }]
    })
  });
  const data = await response.json();
  return JSON.parse(data.content[0].text);
}
```

---

## 🛡️ Resilience Patterns

### Circuit Breaker (opossum)
```js
// registration-service/src/lib/circuitBreaker.js
import CircuitBreaker from 'opossum';
import { processRegistration } from '../services/registrationService.js';

const options = { timeout: 3000, errorThresholdPercentage: 50, resetTimeout: 10000 };
export const registrationBreaker = new CircuitBreaker(processRegistration, options);

registrationBreaker.fallback(() => ({
  status: 'queued',
  message: 'System under load. Registration queued — you will be notified.'
}));
```

### Retry with Exponential Backoff
```js
// shared/lib/retry.js
export async function withRetry(fn, { retries = 3, baseDelay = 300 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try { return await fn(); }
    catch (err) {
      if (attempt === retries) throw err;
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

### Graceful Degradation
- Event service down → Gateway returns Redis-cached event list (TTL 60s)
- Notification service down → Registration still succeeds; notification batched for retry
- Auth service down → Gateway uses cached JWT validation (TTL 30s)

### RabbitMQ Overflow Queue
```
Exchange: registration_exchange
  ├── Queue: registration_processing    (main, prefetch=10)
  └── Queue: registration_overflow_dlq  (dead-letter, TTL-based retry)
```

---

## 🐳 Docker Setup

```yaml
# infra/docker-compose.yml
version: '3.9'
services:
  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: secret

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  mongo-auth:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: ["mongo-auth-data:/data/db"]

  mongo-events:
    image: mongo:7
    ports: ["27018:27017"]
    volumes: ["mongo-events-data:/data/db"]

  mongo-registrations:
    image: mongo:7
    ports: ["27019:27017"]
    volumes: ["mongo-reg-data:/data/db"]

  user-auth-service:
    build: ./services/user-auth-service
    ports: ["3001:3001"]
    environment:
      MONGO_URI: mongodb://mongo-auth:27017/auth
      REDIS_URL: redis://redis:6379
      JWT_PRIVATE_KEY_PATH: /run/secrets/jwt_private
    depends_on: [mongo-auth, redis]

  event-management-service:
    build: ./services/event-management-service
    ports: ["3002:3002"]
    environment:
      MONGO_URI: mongodb://mongo-events:27017/events
      RABBITMQ_URL: amqp://admin:secret@rabbitmq:5672
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
    depends_on: [mongo-events, rabbitmq]

  registration-notification-service:
    build: ./services/registration-notification-service
    ports: ["3003:3003"]
    environment:
      MONGO_URI: mongodb://mongo-registrations:27017/registrations
      RABBITMQ_URL: amqp://admin:secret@rabbitmq:5672
      SMTP_HOST: ${SMTP_HOST}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
    depends_on: [mongo-registrations, rabbitmq]

  api-gateway:
    build: ./services/api-gateway
    ports: ["8080:8080"]
    environment:
      AUTH_SERVICE_URL: http://user-auth-service:3001
      EVENTS_SERVICE_URL: http://event-management-service:3002
      REGISTRATION_SERVICE_URL: http://registration-notification-service:3003
      REDIS_URL: redis://redis:6379
    depends_on: [user-auth-service, event-management-service, registration-notification-service]

  client:
    build: ./client
    ports: ["5173:5173"]
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api

volumes:
  mongo-auth-data:
  mongo-events-data:
  mongo-reg-data:
```

---

## 📋 Environment Variables

```bash
# .env.example
ANTHROPIC_API_KEY=sk-ant-...
JWT_PRIVATE_KEY=...
JWT_PUBLIC_KEY=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=campusconnect@gmail.com
SMTP_PASS=...
REDIS_URL=redis://localhost:6379
```

---

## 🗓️ Hackathon Sprint Plan

| Phase | Time | Backend (You) | Frontend (Teammate) |
|---|---|---|---|
| **Setup** | 0–2h | Repo scaffold, Docker up, shared types, RabbitMQ + Redis | Vite init, Tailwind + shadcn + Framer Motion setup |
| **Auth + Org** | 2–5h | 3-way signup, org CRUD, member CRUD, JWT RS256 | Auth pages (login, signup with role selector) |
| **Events Core** | 5–8h | Event CRUD, capacity aggregation, Socket.IO | Home page, Event browser, EventDetail page |
| **Registration** | 8–10h | RabbitMQ queue, waitlist, circuit breaker, notifications | Register button, optimistic UI, seat counter |
| **Extended** | 10–13h | Worklist API, utilities API, complaints API, chat persist | Worklist UI, utility panel, complaint box, chat UI |
| **API Gateway** | 13–14h | Route proxying, rate limit, Redis cache | Connect all pages to gateway |
| **AI Features** | 14–16h | Categorisation on event create, recommendation endpoint | Recommendations on Home page |
| **Stress Test** | 16–17h | k6 run, fix bottlenecks, tune queues | — |
| **Polish + Demo** | 17–20h | README, OpenAPI specs, architecture diagram | UI polish, Framer Motion transitions |

---

## 📑 Evaluation Checklist

### Innovation & Idea (25%)
- [ ] AI event categorisation (auto-tag + summary on create)
- [ ] AI personalised recommendations on Home
- [ ] Real-time seat counter + chat via Socket.IO
- [ ] Waitlist with auto-promotion on cancellation
- [ ] Worklist + utility tracker per event

### Technical Execution (30%)
- [ ] 3+ independent services with isolated DBs
- [ ] RabbitMQ async messaging with dead-letter queue
- [ ] Circuit breaker + exponential backoff
- [ ] Docker Compose full orchestration
- [ ] RS256 JWT across all services

### User Experience (20%)
- [ ] Light theme with Framer Motion animations
- [ ] 3-way signup flow (User / Organisation / Member)
- [ ] Optimistic UI for registrations
- [ ] Org dashboard: members, events, worklist, utilities, complaints

### Problem Coverage (15%)
- [ ] Service decomposition ✅
- [ ] Inter-service communication ✅
- [ ] Resilience & scalability ✅
- [ ] Org, member, and student experience ✅

### Presentation (10%)
- [ ] Architecture diagram in `/docs`
- [ ] OpenAPI specs per service
- [ ] 3-min demo video script ready

---

## 🏁 Hackathon Strategy

**Focus on:**
- Working end-to-end flow (signup → join org → create event → register → chat)
- Clean RBAC demo (show junior exec blocked from creating event)
- One strong demo scenario: org creates event → member assigned task → user registers → gets waitlisted → previous registrant cancels → waitlisted user auto-promoted

**Avoid:**
- Overengineering analytics-service before core is stable
- Too many incomplete features — a polished 80% beats a broken 100%

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/your-team/campusconnect
cd campusconnect && cp .env.example .env

# 2. Spin up infrastructure
docker-compose up rabbitmq redis mongo-auth mongo-events mongo-registrations -d

# 3. Start services (dev mode)
cd services/user-auth-service && npm install && npm run dev
cd services/event-management-service && npm install && npm run dev
cd services/registration-notification-service && npm install && npm run dev
cd services/api-gateway && npm install && npm run dev

# 4. Start frontend (teammate)
cd client && npm install && npm run dev

# 5. Full stack via Docker
docker-compose up --build
```

---

## 🤝 Backend ↔ Frontend Handoff Contract

> Share this section with your teammate so they know exactly what to call.

- **Base URL:** `http://localhost:8080/api`
- **Auth header:** `Authorization: Bearer <accessToken>`
- **Token refresh:** POST `/api/auth/refresh` with `{ refreshToken }`
- **Socket.IO URL:** `http://localhost:3002` (direct, not through gateway)
- **Key derived fields** (computed server-side, always present in event response):
  - `seatsLeft = capacity - registeredCount`
  - `timeLeft` = ms until `startsAt` (ISO diff)
  - `isEnrolled` = boolean (injected by registration-service lookup in gateway)
- **Chat pagination:** GET `/api/events/:id/messages?type=chat&page=1&limit=50`
- **Announcement:** POST `/api/events/:id/messages` — server auto-sets `type: "announcement"` if sender role is `junior_exec` or `senior_exec`

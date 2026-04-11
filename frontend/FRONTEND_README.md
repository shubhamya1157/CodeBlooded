# 🎓 CampusConnect - Frontend

A modern, professional event management platform frontend for the HackTheChain 4.0 microservices hackathon.

## 🚀 Features

### For Students
- 🔍 **Browse Events** - Search and filter campus events
- 📝 **Register** - One-click event registration with instant confirmation
- ⏳ **Waitlist Management** - Automatic waitlisting when events are full
- 🎫 **Dashboard** - Track all registrations and confirmed events
- 🔔 **Notifications** - Real-time updates on registration status
- 💫 **Real-time Seat Counter** - Live updates on event availability

### For Organizers
- ➕ **Create Events** - Easily create and publish events
- 📊 **Analytics** - View registration metrics and attendee info
- 👥 **Registration Management** - Manage confirmed registrations and waitlists
- 📢 **Notifications** - Push notifications to registered attendees
- ⚙️ **Event Control** - Edit, update, and delete events

### Technical Highlights
- ✨ **Beautiful UI** - Modern glassmorphism design with smooth animations
- ⚡ **Lightning Fast** - Optimized React with Vite
- 🔐 **Secure** - JWT authentication with Zustand state management
- 🌐 **Real-time** - WebSocket support for live updates
- 📱 **Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🎨 **Polished** - Framer Motion animations and TailwindCSS styling

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Backend services running (Auth, Events, Registration)

## 🛠️ Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env.local` file:**
```bash
cat > .env.local << EOF
VITE_API_URL=http://localhost:8080/api
EOF
```

4. **Start development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🎯 Usage Guide

### Design System
The UI uses a modern dark theme with:
- **Primary Colors**: Blue (#3B82F6) and Purple (#9333EA)
- **Accents**: Pink (#EC4899)
- **Background**: Deep slate gradient
- **Typography**: Inter font family

### Key Components
- **Navbar** - Navigation and authentication
- **EventCard** - Reusable event display component
- **NotificationCenter** - Toast notifications
- **LoadingSpinner** - Loading states
- **CreateEventModal** - Event creation dialog

### Pages

#### Home `/`
Landing page with features and call-to-action

#### Events `/events`
Browse all available events with search and filters

#### Event Detail `/events/:id`
Full event information with registration capability

#### Auth `/auth`
Login/Register for students and organizers

#### Student Dashboard `/dashboard/student`
View registered events and waitlist status

#### Organizer Dashboard `/dashboard/organizer`
Manage created events and view registrations

## 🔧 Configuration

### API Integration
The frontend connects to backend via API Gateway:
```
API_GATEWAY: http://localhost:8080/api
```

Routes:
- `/auth` - Authentication Service (Port 3001)
- `/events` - Event Management Service (Port 3002)
- `/register` - Registration Service (Port 3003)

### Environment Variables
```
VITE_API_URL - API Gateway base URL (default: http://localhost:8080/api)
```

## 📦 Dependencies

### Core
- **React 19** - UI library
- **React Router 7** - Client-side routing
- **Vite** - Build tool

### State Management
- **Zustand** - Lightweight state management
- **React Query 5** - Server state management

### UI/Animation
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Forms
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Real-time
- **Socket.io Client** - WebSocket support

## 🎨 Styling

The frontend uses a comprehensive design system:

### Color Palette
```
Blue:    #3B82F6 (Primary actions)
Purple:  #9333EA (Secondary accent)
Pink:    #EC4899 (Highlights)
Gray:    #1F2937 - #F3F4F6 (Grayscale)
```

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🚀 Performance Optimizations

- Code splitting with React Router
- Image lazy loading
- CSS minification via TailwindCSS
- Optimized bundle with Vite
- Efficient re-renders with Zustand selectors

## 🔒 Security

- JWT token storage in localStorage
- CORS enabled for API Gateway
- XSS protection via React
- CSRF tokens in API requests
- Secure password handling

## 🐛 Debugging

Enable debug logging:
```javascript
// In API client
const DEBUG = true; // Set to true for verbose logging
```

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎓 Learning Resources

### State Management Pattern
```javascript
// Using Zustand store
const { user, token } = useAuthStore();
const { addNotification } = useUIStore();
```

### API Calls
```javascript
// Simple API calls
const events = await eventsAPI.getAll();
const response = await registrationAPI.register(userId, eventId);
```

### Component Pattern
```javascript
// Standard component structure
export default function MyComponent() {
  const [state, setState] = useState();
  return <motion.div>...</motion.div>;
}
```

## 🚀 Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 Performance Metrics (Target)

- **Lighthouse Score**: 90+
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of HackTheChain 4.0 - Microservices Track

## 🎉 Credits

Built with ❤️ for HackTheChain 4.0

---

**Questions?** Check the backend README or reach out to the team!

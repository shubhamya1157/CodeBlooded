import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';

import Navbar from './components/Navbar';
import NotificationCenter from './components/NotificationCenter';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const OrganizerDashboard = lazy(() => import('./pages/OrganizerDashboard'));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-gray-900 dark:text-white font-sans flex flex-col relative overflow-hidden transition-colors duration-500">
        {/* Animated background blobs - Sleek White & Blue Palette */}
        <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 dark:bg-blue-600/30 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-sky-400/20 dark:bg-sky-500/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000 pointer-events-none" />
        <div className="fixed top-[20%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/15 dark:bg-indigo-600/20 blur-[130px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000 pointer-events-none" />

        <Navbar />
        <NotificationCenter />

        <div className="flex-1 relative z-10">
          <Suspense fallback={<div className="flex items-center justify-center h-full"><LoadingSpinner /></div>}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

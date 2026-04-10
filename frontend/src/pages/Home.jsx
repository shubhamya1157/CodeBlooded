import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Page Entrance Animation
    gsap.to("#hero-title", { opacity: 1, y: -20, duration: 1, delay: 0.2 });
    gsap.to("#hero-sub", { opacity: 1, y: -10, duration: 1, delay: 0.4 });
    gsap.to("#hero-actions", { opacity: 1, y: 0, duration: 1, delay: 0.6 });

    // Initialize transition for "Light Mode" reset
    window.addEventListener('pageshow', () => {
      gsap.to("#transition-overlay", { y: "-100%", duration: 0.8, ease: "power4.out" });
    });
  }, []);

  const navigateTo = (url) => {
    const overlay = document.getElementById('transition-overlay');
    gsap.to(overlay, {
      y: "0%",
      duration: 0.6,
      ease: "power4.inOut",
      onComplete: () => {
        navigate(url);
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-['Plus_Jakarta_Sans']">
      <div className="page-transition fixed top-0 left-0 w-full h-full bg-indigo-600 z-50 transform -translate-y-full" id="transition-overlay"></div>

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">CampusConnect</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-zinc-600">
            <a href="#" className="text-indigo-600">Overview</a>
            <a href="#" onClick={() => navigateTo('/events')} className="hover:text-indigo-600 transition-colors cursor-pointer">Events Hub</a>
            <a href="#" onClick={() => navigateTo('/dashboard')} className="hover:text-indigo-600 transition-colors cursor-pointer">Organizer Portal</a>
            <button onClick={() => navigateTo('/auth')} className="bg-zinc-900 text-white px-5 py-2 rounded-full hover:bg-zinc-700 transition-all">Sign In</button>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-8 text-center bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-3xl mx-auto">
          <h1 id="hero-title" className="text-5xl md:text-7xl font-bold text-zinc-900 leading-tight opacity-0">
            Reliable Campus <br /><span className="text-indigo-600">Event Engineering.</span>
          </h1>
          <p id="hero-sub" className="mt-6 text-xl text-zinc-500 leading-relaxed opacity-0">
           "Building the bridges that bring your campus to life
                  Where engineering meets community."
          </p>
          <div id="hero-actions" className="mt-10 flex flex-wrap justify-center gap-4 opacity-0">
            <button onClick={() => navigateTo('/events')} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-200 transition-all">Explore Events</button>
            <div className="flex items-center px-6 py-4 rounded-xl border border-zinc-200 bg-white space-x-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="font-medium text-zinc-700">Cluster Status: Healthy</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Distributed Architecture</h2>
            <p className="text-zinc-500 mt-2">Independently deployable microservices[cite: 16].</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="micro-card p-8 rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-indigo-600 border border-zinc-200">
            <div className="text-indigo-600 font-mono text-sm mb-4">PORT: 3001</div>
            <h3 className="text-xl font-bold mb-3">User & Auth</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">Handles registration, JWT tokens, and role-based access control for students and admins.</p>
            <a href="#" onClick={() => navigateTo('/auth')} className="text-indigo-600 font-semibold inline-flex items-center hover:gap-2 transition-all cursor-pointer">Service Docs &rarr;</a>
          </div>

          <div className="micro-card p-8 rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-indigo-600 border border-zinc-200">
            <div className="text-indigo-600 font-mono text-sm mb-4">PORT: 3002</div>
            <h3 className="text-xl font-bold mb-3">Event Management</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">CRUD operations for scheduling, category tagging, and capacity management.</p>
            <a href="#" onClick={() => navigateTo('/events')} className="text-indigo-600 font-semibold inline-flex items-center hover:gap-2 transition-all cursor-pointer">Browse Data &rarr;</a>
          </div>

          <div className="micro-card p-8 rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-indigo-600 border border-zinc-200">
            <div className="text-indigo-600 font-mono text-sm mb-4">PORT: 3003</div>
            <h3 className="text-xl font-bold mb-3">Registration & Notification</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">High-concurrency processing with waitlist management and async notifications.</p>
            <a href="#" onClick={() => navigateTo('/dashboard')} className="text-indigo-600 font-semibold inline-flex items-center hover:gap-2 transition-all cursor-pointer">Queue Status &rarr;</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
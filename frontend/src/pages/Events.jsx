import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Music, Trophy, Gamepad, Code, Shield, Camera } from 'lucide-react';

const Events = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Animate elements on page load
    gsap.to(".event-card", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);

  const events = [
    {
      icon: Music,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-100',
      title: 'Dance Face-off',
      description: 'Annual inter-college cultural dance competition[cite: 6].',
      joined: 42
    },
    {
      icon: Trophy,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100',
      title: 'Campus Sports Meet',
      description: 'Athletics and team sports tournaments[cite: 5].',
      joined: 128
    },
    {
      icon: Gamepad,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      title: 'Esports Arena',
      description: 'Competitive gaming tournament for local clubs[cite: 6].',
      joined: 256
    },
    {
      icon: Code,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'HackTheChain 4.0',
      description: 'The flagship 24-hour innovation marathon[cite: 1].',
      joined: 890
    },
    {
      icon: Shield,
      iconColor: 'text-slate-100',
      bgColor: 'bg-slate-800',
      title: 'CTF Challenge',
      description: 'Capture the Flag security competition[cite: 16].',
      joined: 115
    },
    {
      icon: Camera,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      title: 'Lens & Light',
      description: 'Showcase your best campus moments and shots[cite: 6].',
      joined: 76
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans']">
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="font-bold text-xl text-indigo-600 flex items-center gap-2 hover:text-indigo-700 transition-colors">
            <ArrowLeft className="text-sm" /> CampusConnect
          </button>
          <div className="flex gap-6 text-sm font-semibold text-slate-600">
            <span className="text-emerald-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Service 3002 Active
            </span>
          </div>
        </div>
      </nav>

      <header className="py-16 px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Event Catalog</h1>
        <p className="text-slate-500 text-lg">Real-time registration tracking powered by our distributed notification service.</p>
      </header>

      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => {
            const IconComponent = event.icon;
            return (
              <div key={index} className="event-card p-8 rounded-3xl bg-white border border-slate-200 opacity-0 translate-y-4 transition-all duration-300 hover:border-indigo-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-100/50">
                <div className={`icon-box w-14 h-14 ${event.bgColor} ${event.iconColor} rounded-2xl flex items-center justify-center text-2xl mb-6 transition-transform duration-300 hover:scale-110`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-sm text-slate-500 mb-6">{event.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{event.joined} Joined</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Events;
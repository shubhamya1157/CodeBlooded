import React from 'react';
import { motion as Motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col p-8 pt-12 relative z-10 w-full max-w-6xl mx-auto">
      <Motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back. Your campus events are synced and ready.</p>
        </div>
      </Motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="glass-card rounded-2xl p-6 h-64 border-t-white/10 hover:border-primary/50 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
              <span className="text-primary font-bold">{i}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Event Block {i}</h3>
            <p className="text-sm text-muted-foreground">Placeholder block for upcoming campus society activities. Awesome UI incoming.</p>
          </Motion.div>
        ))}
      </div>
    </div>
  );
}

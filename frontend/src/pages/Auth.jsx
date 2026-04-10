import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Users, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [authType, setAuthType] = useState('user'); // user, organisation, member
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: e.target[0].value, password: e.target[1].value }
        : { type: authType, name: e.target[3] ? e.target[3].value : 'Unknown', email: e.target[4]?.value || e.target[0].value, password: e.target[5]?.value || e.target[1].value, orgId: authType === 'member' ? e.target[6]?.value : undefined };

      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        // Connected to backend successfully
        navigate('/dashboard');
      } else {
        alert(data.error || 'Authentication Failed');
      }
    } catch (err) {
      console.error('Backend connection error:', err);
      alert('Failed to connect to backend server. Is it running?');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative z-10">
      <motion.div 
        className="w-full max-w-md glass-card rounded-3xl p-8 overflow-hidden relative"
        initial="hidden" animate="visible" variants={fadeIn}
      >
        <div className="absolute inset-0 bg-hero-glow opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-10">
            <motion.div 
              className="w-16 h-16 mx-auto bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Sparkles className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-white">CampusConnect</h1>
            <p className="text-muted-foreground mt-2 text-sm">Where campus life synchronizes.</p>
          </div>

          <div className="flex gap-2 p-1 bg-black/40 rounded-xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", isLogin ? "bg-white/10 text-white shadow" : "text-muted-foreground hover:text-white")}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-all", !isLogin ? "bg-white/10 text-white shadow" : "text-muted-foreground hover:text-white")}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
               key={isLogin ? "login" : "register"}
               initial="hidden" animate="visible" exit="exit" variants={fadeIn}
               className="space-y-4"
               onSubmit={handleAuth}
            >
              {!isLogin && (
                <div className="flex justify-between gap-2 mb-6">
                  {['user', 'organisation', 'member'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAuthType(type)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border flex-1 transition-all",
                        authType === type ? "border-primary bg-primary/10 text-white" : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/20"
                      )}
                    >
                      {type === 'user' && <User className="w-5 h-5" />}
                      {type === 'organisation' && <Building2 className="w-5 h-5" />}
                      {type === 'member' && <Users className="w-5 h-5" />}
                      <span className="text-[10px] uppercase font-bold tracking-wider">{type}</span>
                    </button>
                  ))}
                </div>
              )}

              {(!isLogin || authType !== 'user') && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input placeholder="Full Name" required={!isLogin} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white transition-all placeholder:text-muted-foreground/50" />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" placeholder="Email address" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white transition-all placeholder:text-muted-foreground/50" />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="password" placeholder="Password" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white transition-all placeholder:text-muted-foreground/50" />
              </div>

              {!isLogin && authType === 'member' && (
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input placeholder="Organization Invite Code" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white transition-all placeholder:text-muted-foreground/50" />
                </div>
              )}

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                {isLogin ? 'Enter Hub' : 'Initialize Identity'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

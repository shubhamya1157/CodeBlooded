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

const Auth = () => {
  const [currentRole, setCurrentRole] = useState('student');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');
      const name = formData.get('name');
      const orgId = formData.get('orgId');

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      const payload = isLogin 
        ? { email, password }
        : { 
            type: authType, 
            name: name || 'Unknown',
            email, 
            password, 
            ...(authType === 'member' && { orgId })
          };

      console.log('Sending payload:', payload);
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        // Connected to backend successfully
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
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
    <>
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

      <div id="particles-container" className="absolute inset-0 z-0"></div>

      <div className="glass-card relative z-10 w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl">
        <div className="logo-section text-center mb-10">
          <div className="logo-icon mx-auto mb-5 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="logo-title text-3xl font-bold text-slate-900 mb-2">CampusConnect</h1>
          <p className="logo-subtitle text-slate-600">Distributed Event Platform</p>
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

        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group mb-6 opacity-0">
            <label className="form-label block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">University Email</label>
            <div className="relative">
              <input
                type="email"
                className="form-input w-full py-4 px-5 text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                id="emailInput"
                placeholder="your.name@university.edu"
                required
              />
              <svg className="input-icon absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>

          <div className="form-group mb-6 opacity-0">
            <label className="form-label block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type="password"
                className="form-input w-full py-4 px-5 text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                id="passwordInput"
                placeholder="Enter your password"
                required
              />
              <svg className="input-icon absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>

              {!isLogin && authType === 'member' && (
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input name="orgId" placeholder="Organization ID" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white transition-all placeholder:text-muted-foreground/50" />
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
};

export default Auth;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const Auth = () => {
  const [currentRole, setCurrentRole] = useState('student');
  const navigate = useNavigate();

  useEffect(() => {
    createParticles();
    entranceAnimation();
    initRoleSelector();
  }, []);

  const createParticles = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 6 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = '0.3';
      container.appendChild(particle);
      gsap.to(particle, {
        x: `random(-80, 80)`,
        y: `random(-80, 80)`,
        duration: `random(10, 15)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  };

  const entranceAnimation = () => {
    const tl = gsap.timeline();
    tl.from('.logo-icon', { scale: 0.8, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })
      .from('.logo-title', { y: 10, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.role-selector', { y: 10, opacity: 0, duration: 0.4 }, '-=0.3')
      .to('.form-group', { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.2')
      .to('.signin-button', { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
      .to('.forgot-password', { opacity: 1, duration: 0.4 }, '-=0.1')
      .to('.service-status', { opacity: 1, bottom: 24, duration: 0.5 }, '-=0.3');
  };

  const initRoleSelector = () => {
    const roleOptions = document.querySelectorAll('.role-option');
    const roleSlider = document.getElementById('roleSlider');
    if (roleSlider && roleOptions.length > 0) {
      roleSlider.style.width = `${roleOptions[0].offsetWidth}px`;
    }

    roleOptions.forEach((option, index) => {
      option.addEventListener('click', () => {
        roleOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        roleSlider.style.transform = `translateX(${index * 100}%)`;
        setCurrentRole(option.dataset.role);
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with role:', currentRole);
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex justify-center items-center font-['Inter'] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-gradient-radial from-indigo-200/20 via-purple-200/10 to-transparent"></div>
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

        <div className="role-selector flex bg-slate-100 p-1 rounded-xl mb-8 relative">
          <div id="roleSlider" className="role-slider absolute top-1 left-1 h-10 bg-indigo-600 rounded-lg transition-transform duration-300 ease-out shadow-sm"></div>
          <button className="role-option active flex-1 py-3 text-sm font-medium text-white rounded-lg" data-role="student">Student</button>
          <button className="role-option flex-1 py-3 text-sm font-medium text-slate-600 rounded-lg" data-role="organizer">Organizer</button>
          <button className="role-option flex-1 py-3 text-sm font-medium text-slate-600 rounded-lg" data-role="admin">Admin</button>
        </div>

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

          <button type="submit" className="signin-button w-full py-4 text-white bg-indigo-600 border-none rounded-xl cursor-pointer transition-all duration-300 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg opacity-0 font-semibold text-base">
            Sign In
          </button>

          <div className="error-message mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center hidden" id="errorMessage"></div>
        </form>

        <div className="forgot-password text-center mt-5 opacity-0">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 no-underline font-medium">Forgot your password?</a>
        </div>
      </div>

      <div className="service-status fixed bottom-6 right-6 flex items-center gap-3 py-3 px-5 bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-lg z-50 opacity-0">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <div>
          <div className="status-text text-sm font-medium text-slate-700">Auth Service Online</div>
          <div className="status-port text-xs text-slate-500">Port 3001</div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

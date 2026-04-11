import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Zap, Trophy, Users, Building2, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import { authAPI } from '../lib/api';
import BrandMark from '../components/BrandMark';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
};

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') !== 'register';
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', type: 'user', organizationName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(formData.email, formData.password);
      } else {
        response = await authAPI.register({
          type: formData.type, // Send the user type
          name: formData.name,
          email: formData.email,
          password: formData.password,
          organizationName: formData.organizationName, // Additional parameter for organisation/member
        });
      }
      
      const token = response.accessToken;
      const jwtPayload = parseJwt(token);
      const accountType = jwtPayload?.type === 'organisation' ? 'organizer' : 'student';
      const resolvedId = response.userId || response.orgId || jwtPayload?.sub;
      const displayName = formData.name || formData.email.split('@')[0];
      const user = {
        id: resolvedId,
        _id: resolvedId,
        name: displayName,
        email: formData.email,
        orgId: response.orgId,
        adminUserId: response.adminUserId,
      };

      setUser(user, token, accountType);
      navigate(accountType === 'organizer' ? '/dashboard/organizer' : '/dashboard/student');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    const newMode = isLogin ? 'register' : 'login';
    navigate(`?mode=${newMode}`);
    setFormData({ email: '', password: '', name: '', type: 'user', organizationName: '' });
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Side - Value Prop */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col justify-center space-y-10"
        >
          <div>
            <BrandMark compact className="mb-6" />
            <h1 className="text-5xl font-black text-gray-950 dark:text-white mb-4 leading-tight">CampusConnect</h1>
            <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold mb-8 leading-relaxed">
              Your Gateway to Global Hackathons, Competitions & Tech Events
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              Join 500K+ developers worldwide. Discover trending events, build amazing projects, and compete for $2M+ in prizes.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              { icon: Zap, title: '10K+ Events', desc: 'Global opportunities' },
              { icon: Trophy, title: '$2M+ Prizes', desc: 'Compete and win' },
              { icon: Users, title: '500K+ Community', desc: 'Network with developers' },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-950 dark:text-white">{item.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-slate-800/50 border border-blue-200 dark:border-blue-500/30">
            <p className="flex items-center text-sm text-gray-700 dark:text-gray-200 font-semibold">
              <Lightbulb className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
              <span><span className="text-blue-600 dark:text-blue-400 font-bold">Tip:</span> Join now to get early access to exclusive college and global events</span>
            </p>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <div className="glass-card rounded-3xl p-8 md:p-10 relative">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h2 className="text-3xl font-black text-gray-950 dark:text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join CampusConnect'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-semibold">
                {isLogin
                  ? 'Sign in to your account and explore amazing events'
                  : 'Create your account in just 30 seconds'}
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
              {/* User Type Field (Registration Only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">I am registering as:</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'user', icon: <User className="w-7 h-7 md:w-8 md:h-8 mb-1.5 stroke-[1.5]" />, label: 'Participant' },
                      { id: 'organisation', icon: <Building2 className="w-7 h-7 md:w-8 md:h-8 mb-1.5 stroke-[1.5]" />, label: 'Organizer' },
                      { id: 'member', icon: <Users className="w-7 h-7 md:w-8 md:h-8 mb-1.5 stroke-[1.5]" />, label: 'Org Member' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: opt.id }))}
                        className={`p-3 rounded-xl font-bold transition-all border-2 text-sm flex flex-col items-center justify-center gap-1 ${
                          formData.type === opt.id
                            ? 'bg-blue-50 dark:bg-slate-800/50 border-blue-600 text-blue-700 dark:text-blue-300 shadow-[0_0_15px_-3px_rgba(37,99,235,0.2)] transform scale-[1.02]'
                            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:bg-slate-800'
                        }`}
                      >
                        <div className={`${formData.type === opt.id ? 'text-blue-600 dark:text-blue-400 drop-shadow-sm dark:shadow-none' : 'text-gray-400 dark:text-gray-500'}`}>
                          {opt.icon}
                        </div>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Organization Field (For Organizer & Member) */}
              {!isLogin && (formData.type === 'organisation' || formData.type === 'member') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 pt-2">Organization Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      list="famous-orgs"
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder={formData.type === 'organisation' ? "Enter new organization name" : "Select or search organization..."}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                    <datalist id="famous-orgs">
                      <option value="IIT Bombay Tech Club" />
                      <option value="Stanford Computer Science Society" />
                      <option value="MIT AI Club" />
                      <option value="BITS Pilani Coding Club" />
                      <option value="Harvard Innovation Labs" />
                      <option value="Berkeley CS Association" />
                      <option value="Oxford Tech Society" />
                      <option value="CMU Robotics Club" />
                      <option value="Google Developer Groups" />
                      <option value="Microsoft Learn Student Ambassadors" />
                      <option value="Major League Hacking (MLH)" />
                      <option value="GitHub Campus Experts" />
                      <option value="Meta Developer Circle" />
                      <option value="AWS Educate" />
                    </datalist>
                  </div>
                </motion.div>
              )}

              {/* Name Field */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Developer"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border-l-4 border-l-red-500 border-t border-r border-b border-red-100 text-red-700 dark:text-red-400 font-semibold text-sm flex items-start space-x-3 shadow-sm dark:shadow-none"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{error}</div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-lg hover:shadow-xl dark:shadow-none hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 mt-8 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white dark:bg-slate-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <div className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <LoadingSpinner size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <div className="group-hover:scale-110 transition-transform">
                        {isLogin ? <Zap className="w-5 h-5 text-yellow-300" fill="currentColor" /> : <Sparkles className="w-5 h-5 text-yellow-300" />}
                      </div>
                      <span>{isLogin ? 'Sign In Securely' : 'Create My Account'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </motion.button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
              <p className="text-center text-gray-600 dark:text-gray-300 font-semibold mb-4">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleAuthMode}
                className="w-full py-3 rounded-lg border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:bg-slate-800/50 transition-all"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </motion.button>
            </div>

            {/* Security Badge */}
            <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-xs text-gray-700 dark:text-gray-200 font-semibold">
                <span className="text-green-600 dark:text-green-400 font-bold">Secure & Private</span> • Enterprise-grade encryption
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

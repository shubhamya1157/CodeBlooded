import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Calendar as CalendarIcon, Settings, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import BrandMark from './BrandMark';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, userType, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const location = useLocation();
  const dashboardPath = userType === 'organizer' ? '/dashboard/organizer' : '/dashboard/student';

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center space-x-3 group">
              <BrandMark className="hidden sm:flex" />
              <BrandMark compact className="sm:hidden" />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/events"
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                isActive('/events')
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-slate-800'
              }`}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Discover
            </Link>

            {userType === 'organizer' && (
              <Link
                to="/dashboard/organizer"
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  isActive('/dashboard/organizer')
                    ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Manage
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to={dashboardPath}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  isActive(dashboardPath)
                    ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 inline mr-2" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle (Temporarily disabled)
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-transparent dark:border-slate-700/50 hover:border-gray-200 dark:hover:border-slate-600 shadow-sm dark:shadow-none"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </motion.button>
            */}
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex items-center space-x-4 border-l border-gray-200 dark:border-slate-700 pl-4"
              >
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{user?.name}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold capitalize">{userType}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md dark:shadow-none">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                <Link
                  to="/auth"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md dark:shadow-none hover:shadow-lg dark:shadow-none transition-all"
                >
                  Sign In
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:bg-slate-800 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4 space-y-2 bg-gray-50 dark:bg-slate-800"
          >
            <Link
              to="/events"
              className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:bg-blue-500/20 hover:text-blue-700 dark:text-blue-300 transition-all font-semibold text-sm"
              onClick={() => setIsOpen(false)}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" />
              Discover Events
            </Link>
            {userType === 'organizer' && (
              <Link
                to="/dashboard/organizer"
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:bg-blue-500/20 hover:text-blue-700 dark:text-blue-300 transition-all font-semibold text-sm"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Manage Events
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to={dashboardPath}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:bg-blue-500/20 hover:text-blue-700 dark:text-blue-300 transition-all font-semibold text-sm"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 inline mr-2" />
                Dashboard
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/auth"
                className="block px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:bg-red-500/10 hover:text-red-600 dark:text-red-400 transition-all font-semibold text-sm"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}

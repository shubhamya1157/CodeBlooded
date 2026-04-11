import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Calendar, MapPin, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import { registrationAPI, eventsAPI } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, getUserId } = useAuthStore();
  const { addNotification } = useUIStore();
  const currentUserId = getUserId();

  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [tab, setTab] = useState('registered');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!currentUserId) {
      return;
    }
    loadData();
  }, [isAuthenticated, currentUserId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [registrationsData, eventsData] = await Promise.all([
        registrationAPI.getUserRegistrations(currentUserId),
        eventsAPI.getAll(),
      ]);
      
      setRegistrations(registrationsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Load Dashboard',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventDetails = (eventId) => {
    return events.find((e) => e._id === eventId);
  };

  const handleCancelRegistration = async (registrationId) => {
    try {
      setCancellingId(registrationId);
      const response = await registrationAPI.cancelRegistration(registrationId);

      addNotification({
        type: 'success',
        title: 'Registration Cancelled',
        message: response.message,
      });

      await loadData();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Unable to Cancel',
        message: error.message,
      });
    } finally {
      setCancellingId(null);
    }
  };

  const confirmedRegistrations = registrations.filter((r) => r.status === 'confirmed');
  const waitlistRegistrations = registrations.filter((r) => r.status === 'waitlisted');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-800 px-4 sm:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-950 dark:text-white mb-2">My Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300">Welcome back, {user?.name}!</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { icon: Calendar, label: 'Registered', value: confirmedRegistrations.length, iconColor: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-50 dark:bg-slate-800/50 border-blue-100' },
            { icon: Clock, label: 'Waitlisted', value: waitlistRegistrations.length, iconColor: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100' },
            { icon: Bell, label: 'Published Events', value: events.length, iconColor: 'text-violet-600', bgClass: 'bg-violet-50 border-violet-100' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border p-6 shadow-sm dark:shadow-none ${stat.bgClass}`}
            >
              <stat.icon className={`mb-2 w-8 h-8 ${stat.iconColor}`} />
              <p className="text-slate-500 dark:text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-950 dark:text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-4 border-b border-slate-200 dark:border-slate-700">
          {[
            { key: 'registered', label: '✓ Registered' },
            { key: 'waitlist', label: '⏳ Waitlist' },
          ].map((tabnav) => (
            <button
              key={tabnav.key}
              onClick={() => setTab(tabnav.key)}
              className={`py-3 px-4 font-medium border-b-2 transition-all ${
                tab === tabnav.key
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              {tabnav.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {tab === 'registered' && (
              <div className="space-y-4">
                {confirmedRegistrations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-300 text-lg">No confirmed registrations yet</p>
                    <button
                      onClick={() => navigate('/events')}
                      className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    >
                      Explore Events
                    </button>
                  </div>
                ) : (
                  confirmedRegistrations.map((registration) => {
                    const eventInfo = getEventDetails(registration.eventId);
                    return (
                      <motion.div
                        key={registration._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-2xl border border-emerald-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none transition-all hover:shadow-md dark:shadow-none"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <h3 className="text-xl font-bold text-slate-950 dark:text-white">{eventInfo?.name}</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">{eventInfo?.description}</p>
                            <div className="space-y-2">
                              {eventInfo?.date && (
                                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 text-sm">
                                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  <span>{new Date(eventInfo.date).toLocaleString()}</span>
                                </div>
                              )}
                              {eventInfo?.location && (
                                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 text-sm">
                                  <MapPin className="w-4 h-4 text-rose-500" />
                                  <span>{eventInfo.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col gap-2">
                            <button
                              onClick={() => navigate(`/events/${registration.eventId}`)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:bg-slate-800"
                            >
                              View Event
                              <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelRegistration(registration._id)}
                              disabled={cancellingId === registration._id}
                              className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 transition hover:bg-rose-100 dark:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {cancellingId === registration._id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {tab === 'waitlist' && (
              <div className="space-y-4">
                {waitlistRegistrations.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-300 text-lg">You're not on any waitlists</p>
                  </div>
                ) : (
                  waitlistRegistrations.map((registration) => {
                    const eventInfo = getEventDetails(registration.eventId);
                    return (
                      <motion.div
                        key={registration._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-2xl border border-amber-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-none"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                              <h3 className="text-xl font-bold text-slate-950 dark:text-white">{eventInfo?.name}</h3>
                              <span className="text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700">Waitlisted</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">{eventInfo?.description}</p>
                            <p className="text-amber-700 text-sm">
                              You're on the waitlist. We'll notify you if a spot opens up!
                            </p>
                          </div>
                          <div className="ml-4 flex flex-col gap-2">
                            <Bell className="w-6 h-6 text-amber-500" />
                            <button
                              onClick={() => handleCancelRegistration(registration._id)}
                              disabled={cancellingId === registration._id}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 transition hover:bg-rose-100 dark:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <XCircle className="h-4 w-4" />
                              {cancellingId === registration._id ? 'Cancelling...' : 'Leave Waitlist'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

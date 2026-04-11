import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Zap, ChevronLeft, Clock, CheckCircle2, Ticket, ShieldCheck, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EventVisual from '../components/EventVisual';
import { eventsAPI, registrationAPI } from '../lib/api';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import { demoEvents } from './Events';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);

  const { isAuthenticated, userType, getUserId } = useAuthStore();
  const { addNotification } = useUIStore();
  const currentUserId = getUserId();

  useEffect(() => {
    loadEvent();
  }, [id, isAuthenticated, currentUserId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getById(id);
      setEvent(data);

      if (isAuthenticated && currentUserId) {
        await checkRegistration(currentUserId);
      } else {
        setIsRegistered(false);
        setRegistration(null);
      }
    } catch (error) {
      console.error('Failed to load event from API:', error);
      // Fallback to demo events if API fails (e.g. invalid ObjectId for demo data)
      const demoEvent = demoEvents.find((e) => e._id === id);
      if (demoEvent) {
        setEvent(demoEvent);
        // Since it's a demo event, just clear registration or mock
        setIsRegistered(false);
        setRegistration(null);
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to Load Event',
          message: error.message || 'Event not found',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async (userId) => {
    try {
      const registrations = await registrationAPI.getUserRegistrations(userId);
      const activeRegistration = registrations.find((item) => item.eventId === id && item.status !== 'cancelled');
      setRegistration(activeRegistration || null);
      setIsRegistered(Boolean(activeRegistration));
    } catch (error) {
      console.error('Failed to check registration:', error);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Please Login',
        message: 'You need to login to register for events',
      });
      navigate('/auth');
      return;
    }

    if (userType === 'organizer') {
      addNotification({
        type: 'warning',
        title: 'Participant Account Required',
        message: 'Please use a participant account to join events.',
      });
      return;
    }

    try {
      setRegistering(true);
      
      const isDemo = demoEvents.some((e) => e._id === id);
      if (isDemo) {
        // Mock registration for demo events
        setTimeout(() => {
          setIsRegistered(true);
          const newReg = { status: 'confirmed', _id: `demo-reg-${id}`, eventId: id, userId: currentUserId };
          setRegistration(newReg);
          
          // Save for dashboard
          const storedRegs = JSON.parse(localStorage.getItem('demoRegistrations') || '[]');
          localStorage.setItem('demoRegistrations', JSON.stringify([...storedRegs.filter(r => r.eventId !== id), newReg]));

          setEvent(prev => ({
            ...prev,
            registeredCount: (prev.registeredCount || 0) + 1
          }));
          addNotification({
            type: 'success',
            title: 'Registered!',
            message: 'You have successfully joined the event.',
          });
          setRegistering(false);
        }, 1000);
        return;
      }

      const response = await registrationAPI.register(currentUserId, id, null);
      
      addNotification({
        type: 'success',
        title: response.status === 'confirmed' ? 'Registered!' : 'Added to Waitlist',
        message: response.message,
      });

      // Optimistic update for blazing fast UI
      setEvent(prev => ({
        ...prev,
        registeredCount: (prev.registeredCount || 0) + 1
      }));

      setIsRegistered(true);
      setRegistration(response.registration);
      await loadEvent();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: error.message,
      });
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    // For demo events, we might not have a real _id, or we set it to 'demo-reg'
    if (!registration) return;

    try {
      setRegistering(true);

      const isDemo = demoEvents.some((e) => e._id === id);
      if (isDemo) {
        // Mock cancellation for demo events
        setTimeout(() => {
          setIsRegistered(false);
          setRegistration(null);

          // Remove from dashboard localStorage
          const storedRegs = JSON.parse(localStorage.getItem('demoRegistrations') || '[]');
          localStorage.setItem('demoRegistrations', JSON.stringify(storedRegs.filter(r => r.eventId !== id)));

          setEvent(prev => ({
            ...prev,
            registeredCount: Math.max(0, (prev.registeredCount || 1) - 1)
          }));
          addNotification({
            type: 'success',
            title: 'Registration Cancelled',
            message: 'Your registration has been successfully cancelled.',
          });
          setRegistering(false);
        }, 1000);
        return;
      }

      if (!registration._id) {
        setRegistering(false);
        return;
      }

      const response = await registrationAPI.cancelRegistration(registration._id);

      addNotification({
        type: 'success',
        title: 'Registration Cancelled',
        message: response.message,
      });

      // Optimistic update for blazing fast UI
      setEvent(prev => ({
        ...prev,
        registeredCount: Math.max(0, (prev.registeredCount || 1) - 1)
      }));

      setIsRegistered(false);
      setRegistration(null);
      await loadEvent();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.message,
      });
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 dark:text-gray-500 text-lg mb-4">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const percentage = ((event.registeredCount || 0) / (event.capacity || 100)) * 100;
  const available = (event.capacity || 100) - (event.registeredCount || 0);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-800 px-4 sm:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/events')}
          className="mb-8 flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </motion.button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Event Details */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="mb-8 h-96 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              )}
              {!event.image && (
                <div className="w-full h-full">
                  <EventVisual
                    category={event.category}
                    title={event.name}
                    subtitle={event.description || 'CampusConnect event detail'}
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-slate-950 dark:text-white">{event.name}</h1>
                {event.category && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm font-semibold capitalize">
                    {event.category}
                  </span>
                )}
              </div>

              {event.description && (
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed">{event.description}</p>
              )}

              <div className="space-y-4">
                {event.date && (
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Date & Time</p>
                      <p className="text-slate-900 dark:text-slate-100 font-medium">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Location</p>
                      <p className="text-slate-900 dark:text-slate-100 font-medium">{event.location}</p>
                    </div>
                  </div>
                )}

                {event.duration && (
                  <div className="flex items-center space-x-4">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Duration</p>
                      <p className="text-slate-900 dark:text-slate-100 font-medium">{event.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              {event.requirements && (
                <div className="mt-8 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Requirements</h3>
                  <p className="text-slate-600 dark:text-slate-300">{event.requirements}</p>
                </div>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Ticket, title: registration?.status === 'waitlisted' ? 'Waitlist Status' : 'Instant Confirmation', text: registration?.status === 'waitlisted' ? 'Your seat request is in queue and updates appear in your dashboard.' : 'Seats are confirmed immediately whenever capacity is available.' },
                  { icon: ShieldCheck, title: 'Professional Check-in', text: 'Keep your event details, schedule, and attendee status in one place.' },
                  { icon: Sparkles, title: 'Manage Easily', text: 'You can review joined events from your dashboard and stay on top of upcoming sessions.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-none">
                    <item.icon className="mb-3 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Registration Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-20 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg dark:shadow-none shadow-slate-200/70"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Registration</h3>

              {/* Capacity */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Capacity</span>
                  <div className="flex items-center space-x-1 text-blue-700 dark:text-blue-300 font-semibold relative overflow-hidden h-6 min-w-[3rem] justify-end">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={event.registeredCount || 0}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                        className="tabular-nums"
                      >
                        {event.registeredCount || 0}
                      </motion.span>
                    </AnimatePresence>
                    <span className="mx-1">/</span>
                    <span>{event.capacity || 100}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className={`mb-6 rounded-2xl border p-4 ${
                registration?.status === 'confirmed'
                  ? 'border-emerald-200 bg-emerald-50'
                  : registration?.status === 'waitlisted'
                    ? 'border-amber-200 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-slate-800/50'
              }`}>
                {registration?.status === 'confirmed' ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-emerald-700 font-semibold">Registration Confirmed</p>
                      <p className="text-emerald-600 text-sm">Your seat is reserved for this event.</p>
                    </div>
                  </div>
                ) : registration?.status === 'waitlisted' ? (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="text-amber-700 font-semibold">Waitlist Active</p>
                      <p className="text-amber-600 dark:text-amber-400 text-sm">You are in queue and will be notified if a seat opens.</p>
                    </div>
                  </div>
                ) : available > 0 ? (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-blue-700 dark:text-blue-300 font-semibold">Seats Available</p>
                      <p className="text-blue-600 dark:text-blue-400 text-sm">{available} spots remaining</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-amber-700 font-semibold">
                    Event is full. Join the waitlist!
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRegister}
                  disabled={isRegistered || registering || userType === 'organizer'}
                  className={`w-full rounded-xl py-3 font-semibold transition-all flex items-center justify-center space-x-2 ${
                    isRegistered || userType === 'organizer'
                      ? 'cursor-not-allowed border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg dark:shadow-none hover:shadow-blue-200'
                  }`}
                >
                  <span>
                    {registering
                      ? 'Processing...'
                      : isRegistered
                        ? registration?.status === 'waitlisted'
                          ? 'Waitlisted'
                          : 'Registered'
                        : 'Participate in Event'}
                  </span>
                </button>

                {registration && (
                  <button
                    onClick={handleCancelRegistration}
                    disabled={registering}
                    className="w-full rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-500/10 py-3 font-semibold text-rose-600 dark:text-rose-400 transition hover:bg-rose-100 dark:bg-rose-500/20"
                  >
                    Cancel Registration
                  </button>
                )}

                {isAuthenticated && userType !== 'organizer' && (
                  <button
                    onClick={() => navigate('/dashboard/student')}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:bg-slate-800"
                  >
                    View My Dashboard
                  </button>
                )}
              </div>

              {!isAuthenticated && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                  <Link to="/auth" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-300">
                    Sign in
                  </Link>
                  {' '}to register
                </p>
              )}

              {userType === 'organizer' && (
                <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  Organizer accounts can manage events, while participant accounts can join them.
                </p>
              )}
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none"
            >
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">About Registration</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Once registered, you'll receive confirmation immediately. If the event is full, you'll be added to the waitlist.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, BarChart3, Users, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateEventModal from '../components/CreateEventModal';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { addNotification } = useUIStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // In a real app, fetch events here
  const stats = [
    { icon: Calendar, label: 'Total Events', value: events.length },
    { icon: Users, label: 'Total Registrations', value: events.reduce((sum, e) => sum + (e.registeredCount || 0), 0) },
    { icon: BarChart3, label: 'Avg. Per Event', value: events.length > 0 ? Math.round(events.reduce((sum, e) => sum + (e.registeredCount || 0), 0) / events.length) : 0 },
  ];

  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]);
    addNotification({
      type: 'success',
      title: 'Event Created!',
      message: `${newEvent.name} has been created successfully`,
    });
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((e) => e._id !== eventId));
    addNotification({
      type: 'success',
      message: 'Event deleted successfully',
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 sm:px-8 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-4xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Organizer Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your events and registrations</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 dark:shadow-none transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-none transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{stat.label}</p>
              </div>
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Events</h2>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <LoadingSpinner />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No events created yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-center">
                Get started by creating your first event to start accepting registrations.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 dark:shadow-none transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Event</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{event.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-700 dark:text-slate-300">{event.registeredCount || 0} / {event.capacity || 100} Registered</span>
                        </div>
                        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4 text-cyan-500" />
                          <span className="text-slate-700 dark:text-slate-300">{new Date(event.date || event.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
                      <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors" title="Edit Event">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}

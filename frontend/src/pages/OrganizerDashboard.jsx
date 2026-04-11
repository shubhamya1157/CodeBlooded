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
    <div className="min-h-[calc(100vh-64px)]px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Organizer Dashboard</h1>
              <p className="text-gray-400 dark:text-gray-500">Manage your events and registrations</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg dark:shadow-none hover:shadow-blue-500/50"
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
              className="p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5"
            >
              <stat.icon className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-gray-400 dark:text-gray-500 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Events</h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-white/20 bg-white dark:bg-slate-900/5">
              <Calendar className="w-16 h-16 text-gray-600 dark:text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 dark:text-gray-500 text-lg mb-4">No events yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:border-blue-400/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                        <span>{event.registeredCount || 0} / {event.capacity || 100}</span>
                        <span>•</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-lg hover:bg-white dark:bg-slate-900/10 transition-colors text-blue-400" title="Edit">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 rounded-lg hover:bg-white dark:bg-slate-900/10 transition-colors text-red-400"
                        title="Delete"
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

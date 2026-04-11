import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users } from 'lucide-react';
import { eventsAPI } from '../lib/api';
import { useUIStore } from '../store/ui';
import LoadingSpinner from './LoadingSpinner';

export default function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const { addNotification } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    capacity: 100,
    category: 'workshop',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacity' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        status: 'published',
      };

      const response = await eventsAPI.create(eventData);
      onEventCreated(response);
      setFormData({
        name: '',
        description: '',
        date: '',
        location: '',
        capacity: 100,
        category: 'workshop',
      });
      onClose();

      addNotification({
        type: 'success',
        title: 'Event Created!',
        message: 'Your event has been published successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Create Event',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white dark:bg-slate-900/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tech Summit 2024"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white dark:bg-slate-900/20 transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your event..."
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white dark:bg-slate-900/20 transition-all resize-none"
                    required
                  />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900/10 border border-white/20 text-white focus:outline-none focus:border-blue-400 focus:bg-white dark:bg-slate-900/20 transition-all"
                      required
                    />
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900/10 border border-white/20 text-white focus:outline-none focus:border-blue-400 focus:bg-white dark:bg-slate-900/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Auditorium A, Building 5"
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white dark:bg-slate-900/20 transition-all"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900/10 border border-white/20 text-white focus:outline-none focus:border-blue-400 focus:bg-white dark:bg-slate-900/20 transition-all"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="conference">Conference</option>
                    <option value="social">Social Event</option>
                    <option value="competition">Competition</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white dark:bg-slate-900/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg dark:shadow-none hover:shadow-blue-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Event</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

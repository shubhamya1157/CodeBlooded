import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, MapPin, Clock, Sparkles, ArrowRight, BarChart3, BookOpen, Video, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import EventVisual from './EventVisual';

export default function EventCard({ event, index }) {
  const [isHovered, setIsHovered] = useState(false);

  // Get category-specific colors
  const getCategoryGradient = () => {
    const category = event.category?.toLowerCase() || 'conferences';
    const gradients = {
      conferences: 'from-blue-600 to-indigo-600',
      workshops: 'from-purple-600 to-pink-600',
      networking: 'from-emerald-600 to-teal-600',
      webinars: 'from-orange-600 to-red-600',
      training: 'from-violet-600 to-purple-600',
      'default': 'from-blue-600 to-indigo-600'
    };
    return gradients[category] || gradients['default'];
  };

  const getCategoryIcon = () => {
    const category = event.category?.toLowerCase() || 'conferences';
    const icons = {
      conferences: BarChart3,
      workshops: Wrench,
      networking: Users,
      webinars: Video,
      training: BookOpen,
    };
    return icons[category] || Sparkles;
  };

  const getAvailability = () => {
    const registered = event.registeredCount || 0;
    const capacity = event.capacity || 100;
    const available = capacity - registered;
    
    if (available <= 0) return { text: 'Sold Out', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-500/20', indicator: 'bg-red-500' };
    if (available <= 10) return { text: `${available} spots left!`, color: 'text-orange-600', bgColor: 'bg-orange-100', indicator: 'bg-orange-500' };
    return { text: `${available} available`, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-500/20', indicator: 'bg-green-500' };
  };

  const availability = getAvailability();
  const percentage = Math.min(((event.registeredCount || 0) / (event.capacity || 100)) * 100, 100);
  const isPopular = event.registeredCount > 100;
  const CategoryIcon = getCategoryIcon();

  // Extract time from date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <Link to={`/events/${event._id}`}>
        <div className="group relative h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg dark:shadow-none hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-800">
          {/* Decorative gradient background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl -z-10" />
          
          {/* Top Section with Gradient */}
          <div className={`relative h-56 bg-gradient-to-br ${getCategoryGradient()} overflow-hidden`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.2),transparent)]" />
            </div>

            {/* Event image or icon */}
            {event.image ? (
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full">
                <EventVisual
                  category={event.category}
                  title={event.name}
                  subtitle={event.description || 'CampusConnect event experience'}
                  compact
                />
              </div>
            )}

            {/* Category Badge - Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white dark:bg-slate-900/95 backdrop-blur-md text-xs font-black text-gray-900 dark:text-gray-100 shadow-lg dark:shadow-none capitalize flex items-center space-x-2"
            >
              <CategoryIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>{event.category}</span>
            </motion.div>

            {/* Trending Badge - Top Right */}
            {isPopular && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute top-4 right-4 px-3 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black shadow-lg dark:shadow-none flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trending</span>
              </motion.div>
            )}

            {/* Hover Overlay */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent flex items-end justify-center pb-6"
              >
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-2 text-white font-bold text-sm bg-white dark:bg-slate-900/20 backdrop-blur px-4 py-2 rounded-full"
                >
                  <span>Explore Event</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Title with icon */}
            <div>
              <h3 className="font-black text-gray-950 dark:text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 dark:text-blue-400 transition-colors">
                {event.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Tags - Enhanced */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.slice(0, 3).map((tag, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-500/30 hover:shadow-md dark:shadow-none transition-all"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Event Details - Compact Grid */}
            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-800">
              {/* Date and Time */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="font-semibold">{formattedTime}</span>
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-200">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="font-semibold truncate">{event.location}</span>
                </div>
              )}

              {/* Participants and Prize */}
              <div className="flex items-center justify-between text-xs pt-2">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="font-semibold">{event.registeredCount || 0}+ joined</span>
                </div>
                {event.prizePool && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-black bg-amber-100 dark:bg-amber-500/20/50 px-2.5 py-1 rounded-lg"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{event.prizePool}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Availability Bar - Enhanced */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <motion.span
                  key={availability.text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs font-black ${availability.color} flex items-center space-x-1`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>{availability.text}</span>
                </motion.span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{percentage.toFixed(0)}% full</span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${
                    percentage >= 90 ? 'from-red-500 to-red-600' :
                    percentage >= 50 ? 'from-yellow-500 to-orange-500' :
                    'from-green-500 to-emerald-600'
                  } shadow-lg dark:shadow-none`}
                />
              </div>
            </div>

            {/* CTA Button - Enhanced */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:to-blue-800 text-white font-bold text-sm shadow-lg dark:shadow-none hover:shadow-xl dark:shadow-none transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Bottom accent line */}
          <div className={`h-1 w-full bg-gradient-to-r ${getCategoryGradient()}`} />
        </div>
      </Link>
    </motion.div>
  );
}

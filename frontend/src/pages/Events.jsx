import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Users, ChevronDown } from 'lucide-react';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { eventsAPI } from '../lib/api';
import { useUIStore } from '../store/ui';

export const demoEvents = [
  {
    _id: '1',
    name: 'Tech Summit 2026',
    category: 'conferences',
    description: 'The Premier Technology Conference & Networking Event with industry leaders and keynote speakers.',
    date: '2026-04-25T09:00:00Z',
    location: 'New Delhi Convention Center',
    registeredCount: 2500,
    capacity: 5000,
    prizePool: '$50K+',
    tags: ['Technology', 'Networking', 'Conference'],
  },
  {
    _id: '2',
    name: 'Business Leadership Summit',
    category: 'workshops',
    description: 'Executive Development & Strategy Workshop with Fortune 500 CEOs and one-on-one mentoring.',
    date: '2026-05-15T10:00:00Z',
    location: 'Mumbai Business Plaza',
    registeredCount: 150,
    capacity: 300,
    prizePool: '$75K+',
    tags: ['Leadership', 'Business', 'Professional'],
  },
  {
    _id: '3',
    name: 'Digital Marketing Masterclass',
    category: 'webinars',
    description: 'Master Modern Marketing Strategies including SEO, social media, content marketing, and analytics.',
    date: '2026-05-05T18:00:00Z',
    location: 'Online Live Sessions',
    registeredCount: 850,
    capacity: 1000,
    tags: ['Marketing', 'Digital', 'Training'],
  },
  {
    _id: '4',
    name: 'Startup Founders Mixer',
    category: 'networking',
    description: 'Networking event for entrepreneurs, startups, VCs, and angel investors with speed networking.',
    date: '2026-04-30T18:00:00Z',
    location: 'Bangalore Tech Hub',
    registeredCount: 180,
    capacity: 200,
    tags: ['Startup', 'Networking', 'Investors'],
  },
  {
    _id: '5',
    name: 'Financial Services Conference',
    category: 'conferences',
    description: 'Industry insights and networking for banking, fintech, and investment sector professionals.',
    date: '2026-05-20T09:00:00Z',
    location: 'Mumbai',
    registeredCount: 1100,
    capacity: 2000,
    prizePool: '$100K+',
    tags: ['Finance', 'Networking', 'Conference'],
  },
  {
    _id: '6',
    name: 'Project Management Intensive',
    category: 'workshops',
    description: 'PMP certification prep and agile transformation strategies with hands-on projects.',
    date: '2026-05-25T09:00:00Z',
    location: 'Online',
    registeredCount: 120,
    capacity: 150,
    tags: ['Management', 'Training', 'Professional'],
  },
];

export default function Events() {
  const [events, setEvents] = useState(demoEvents);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('upcoming');
  const { addNotification } = useUIStore();

  const loadEvents = async () => {
    try {
      // Try to fetch from API with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 2000)
      );
      
      const data = await Promise.race([eventsAPI.getAll(), timeoutPromise]);
      
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
      }
    } catch (apiError) {
      console.log('Using demo events (API unavailable or slow)');
      // Keep demo events if API fails
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const categories = ['all', 'conferences', 'workshops', 'networking', 'webinars', 'training'];

  const filteredAndSortedEvents = events
    .filter((event) => {
      const matchesSearch = !searchTerm || 
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === 'all' || event.category === category;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'upcoming') {
        return new Date(a.date) - new Date(b.date);
      }
      return b.prizes - a.prizes;
    });

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-white/20 dark:border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-4">Discover Events</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Find conferences, workshops, networking events, webinars, training, and more</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10"
        >
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/40 dark:border-slate-700 glass focus:bg-white/90 dark:focus:bg-slate-900/90 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative group">
            <div className="flex items-center space-x-2 px-4 py-3 border border-white/40 dark:border-slate-700 rounded-xl glass cursor-pointer hover:border-blue-300 transition-all">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-200 font-semibold capitalize">{category}</span>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
            </div>
            <div className="absolute top-full left-0 mt-2 w-full glass-card rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:bg-slate-800/50 hover:text-blue-600 dark:text-blue-400 font-semibold capitalize transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="relative group">
            <div className="flex items-center space-x-2 px-4 py-3 border border-white/40 dark:border-slate-700 rounded-xl glass cursor-pointer hover:border-blue-300 transition-all">
              <span className="text-gray-700 dark:text-gray-200 font-semibold">{sortBy === 'upcoming' ? 'Upcoming' : 'Prize'}</span>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
            </div>
            <div className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => setSortBy('upcoming')}
                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:bg-slate-800/50 hover:text-blue-600 dark:text-blue-400 font-semibold transition-all"
              >
                Upcoming First
              </button>
              <button
                onClick={() => setSortBy('prize')}
                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:bg-slate-800/50 hover:text-blue-600 dark:text-blue-400 font-semibold transition-all"
              >
                Highest Prize
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300 font-semibold">
            {filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? 'event' : 'events'} found
          </p>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredAndSortedEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {filteredAndSortedEvents.map((event, index) => (
              <EventCard key={event._id} event={event} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

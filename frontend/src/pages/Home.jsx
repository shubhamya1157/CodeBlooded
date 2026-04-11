import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, Briefcase, Calendar, Clock, Globe, Lightbulb, MapPin, Rocket, Target, Trophy, Users, Video, Wrench, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import BrandMark from '../components/BrandMark';
import EventVisual from '../components/EventVisual';

export default function Home() {
  const { isAuthenticated, user, userType } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Events', icon: Sparkles },
    { id: 'conferences', label: 'Conferences', icon: BarChart3 },
    { id: 'workshops', label: 'Workshops', icon: Wrench },
    { id: 'networking', label: 'Networking', icon: Users },
    { id: 'webinars', label: 'Webinars', icon: Video },
  ];

  const featuredEvents = [
    {
      title: 'Tech Summit 2026',
      subtitle: 'The Premier Technology Conference & Networking Event',
      description: 'Discover the latest innovations in technology. Meet industry leaders, attend keynote speeches, participate in panel discussions, and network with 5000+ professionals from around the world.',
      tags: ['Technology', 'Networking', 'Conference'],
      date: 'April 25-27, 2026',
      time: '9:00 AM - 6:00 PM IST',
      location: 'New Delhi Convention Center',
      participants: '5000+ Attendees',
      capacity: 'Limited Seats',
      status: 'REGISTER NOW',
      trending: true,
      type: 'Conference',
      category: 'conferences',
    },
    {
      title: 'Business Leadership Summit',
      subtitle: 'Executive Development & Strategy Workshop',
      description: 'Learn advanced leadership strategies from Fortune 500 CEOs. Participate in interactive workshops, case studies, and one-on-one mentoring sessions with senior executives.',
      tags: ['Leadership', 'Business', 'Professional'],
      date: 'May 15-17, 2026',
      time: '10:00 AM - 5:30 PM IST',
      location: 'Mumbai Business Plaza',
      participants: '300+ Professionals',
      capacity: '500 Seats',
      status: 'REGISTRATION OPENING',
      type: 'Workshop',
      category: 'workshops',
    },
    {
      title: 'Digital Marketing Masterclass',
      subtitle: 'Master Modern Marketing Strategies & Techniques',
      description: 'Learn from top digital marketing experts. Topics include SEO, social media, content marketing, analytics, and paid advertising. Perfect for marketers at any level.',
      tags: ['Marketing', 'Digital', 'Training'],
      date: 'May 5-9, 2026',
      time: '6:00 PM - 8:00 PM IST (Daily)',
      location: 'Online Live Sessions',
      participants: '1000+ Registered',
      capacity: '500 Seats Available',
      status: 'REGISTER NOW',
      type: 'Webinar',
      category: 'webinars',
    },
    {
      title: 'Startup Founders Networking Mixer',
      subtitle: 'Connect with Entrepreneurs & Investors',
      description: 'A relaxed networking event for entrepreneurs, startups, VCs, and angel investors. Speed networking sessions, pitching opportunities, and informal discussions.',
      tags: ['Startup', 'Networking', 'Investors'],
      date: 'April 30, 2026',
      time: '6:00 PM - 9:00 PM IST',
      location: 'Bangalore Tech Hub',
      participants: '200+ Attendees',
      capacity: 'Limited Spots',
      status: 'APPLY NOW',
      type: 'Networking',
      category: 'networking',
    },
  ];

  const allEvents = {
    all: [
      { name: 'Tech Summit 2026', type: 'Conference', date: 'Apr 25-27', participants: '5000+ Attendees', location: 'Delhi', price: '$99-$299' },
      { name: 'Business Leadership Summit', type: 'Workshop', date: 'May 15-17', participants: '300+ Professionals', location: 'Mumbai', price: '$199-$499' },
      { name: 'Digital Marketing Masterclass', type: 'Webinar', date: 'May 5-9', participants: '1000+ Registered', location: 'Online', price: 'Free - $49' },
      { name: 'Startup Founders Mixer', type: 'Networking', date: 'Apr 30', participants: '200+ Attendees', location: 'Bangalore', price: 'Free' },
    ],
    conferences: [
      { name: 'Tech Summit 2026', type: 'Conference', date: 'Apr 25-27', participants: '5000+ Attendees', location: 'Delhi', price: '$99-$299' },
      { name: 'Financial Services Conference', type: 'Conference', date: 'May 20-22', participants: '2000+ Professionals', location: 'Mumbai', price: '$149-$399' },
      { name: 'Healthcare Innovation Summit', type: 'Conference', date: 'June 10-12', participants: '1500+ Leaders', location: 'Bangalore', price: '$129-$349' },
    ],
    workshops: [
      { name: 'Business Leadership Summit', type: 'Workshop', date: 'May 15-17', participants: '300+ Professionals', location: 'Mumbai', price: '$199-$499' },
      { name: 'Project Management Intensive', type: 'Workshop', date: 'May 25-29', participants: '150+ Participants', location: 'Online', price: '$99-$249' },
      { name: 'Data Analytics Bootcamp', type: 'Workshop', date: 'June 1-5', participants: '200+ Trainees', location: 'Delhi', price: '$149-$299' },
    ],
    networking: [
      { name: 'Startup Founders Mixer', type: 'Networking', date: 'Apr 30', participants: '200+ Attendees', location: 'Bangalore', price: 'Free' },
      { name: 'Women Leaders Networking Brunch', type: 'Networking', date: 'May 12', participants: '150+ Women', location: 'Delhi', price: 'Free' },
      { name: 'Industry Professionals Happy Hour', type: 'Networking', date: 'May 25', participants: '300+ Professionals', location: 'Mumbai', price: 'Free' },
    ],
    webinars: [
      { name: 'Digital Marketing Masterclass', type: 'Webinar', date: 'May 5-9', participants: '1000+ Registered', location: 'Online', price: 'Free - $49' },
      { name: 'LinkedIn Profile Optimization Webinar', type: 'Webinar', date: 'Apr 28', participants: '500+ Attendees', location: 'Online', price: 'Free' },
      { name: 'AI & Machine Learning Trends Webinar', type: 'Webinar', date: 'May 15', participants: '800+ Registered', location: 'Online', price: '$29-$79' },
    ],
  };

  const stats = [
    { number: '50,000+', label: 'Events Hosted', icon: Globe },
    { number: '2M+', label: 'Total Attendees', icon: Users },
    { number: '$50M+', label: 'Value Created', icon: Trophy },
    { number: '150+', label: 'Categories', icon: Sparkles },
  ];

  return (
    <>
      {isAuthenticated ? (
        // AUTHENTICATED DASHBOARD
        <div className="min-h-full">
          {/* Welcome Section */}
          <section className="border-b border-gray-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-2">
                  Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.name || 'User'}</span>!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-semibold">
                  {userType === 'organizer'
                    ? 'Explore featured events and new opportunities for your next campus programs.'
                    : 'Discover standout events, grow your network, and keep momentum on campus.'}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Featured Events Section for Authenticated Users */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-black text-gray-950 dark:text-white mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredEvents.slice(0, 2).map((event, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-md dark:shadow-none hover:shadow-lg dark:shadow-none transition-all"
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
                    {event.type}
                  </div>
                  <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-4">{event.subtitle}</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold">{event.participants}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-bold hover:shadow-lg dark:shadow-none transition-all"
                  >
                    {event.status}
                  </motion.button>
                </motion.div>
              ))}
            </div>
            <motion.div className="mt-8 text-center">
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
              >
                <span>Browse All Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </section>
        </div>
      ) : (
        // NON-AUTHENTICATED LANDING PAGE
        <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-[8%] top-10 h-72 w-72 rounded-full bg-cyan-200/55 blur-3xl dark:bg-cyan-400/15" />
          <div className="absolute right-[2%] top-12 h-96 w-96 rounded-full bg-blue-200/55 blur-3xl dark:bg-blue-500/15" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-200/45 blur-3xl dark:bg-violet-500/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
                <div className="inline-flex items-center gap-3 rounded-full border border-sky-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur dark:border-sky-500/30 dark:bg-slate-900/65">
                  <BrandMark compact />
                  <span className="text-sm font-bold text-sky-700 dark:text-sky-300">
                    Discover events that move your campus forward
                  </span>
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black text-gray-950 dark:text-white mb-6 leading-[0.95]">
                Campus life,
                <br />
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                  designed to connect.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-2xl mb-10 font-medium leading-relaxed">
                CampusConnect helps students find the right workshops, conferences, hackathons, and networking sessions without digging through noisy feeds. Everything feels curated, timely, and built for real momentum.
              </p>

              <motion.div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/events"
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>Browse Events</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/auth?mode=register"
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl border border-sky-200 bg-white/80 text-slate-900 font-bold shadow-sm backdrop-blur hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-white"
                  >
                    <span>Create Free Account</span>
                    <Rocket className="w-5 h-5 text-sky-500" />
                  </Link>
                </motion.div>
              </motion.div>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-gray-200 dark:border-slate-700">
                {stats.map((stat, i) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/65"
                    >
                      <StatIcon className="mb-3 h-5 w-5 text-sky-600 dark:text-sky-300" />
                      <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.22),transparent_32%)]" />
                <div className="relative grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="overflow-hidden rounded-[1.6rem]">
                    <EventVisual
                      category="all"
                      title="CampusConnect"
                      subtitle="A sharper way to discover workshops, talks, and student opportunities."
                    />
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-950 p-5 text-white shadow-xl dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-sky-300">Live this week</div>
                          <div className="mt-2 text-2xl font-black">24 curated picks</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3">
                          <Calendar className="h-5 w-5 text-sky-300" />
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        {['Startup mixer', 'AI workshop', 'Placement webinar'].map((item) => (
                          <div key={item} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                            <span className="font-semibold text-white/90">{item}</span>
                            <span className="text-xs uppercase tracking-[0.2em] text-sky-300">Open</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-[1.5rem] border border-sky-200 bg-sky-50 p-5 dark:border-slate-700 dark:bg-slate-900/80">
                        <Users className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                        <div className="mt-6 text-3xl font-black text-slate-950 dark:text-white">12k+</div>
                        <div className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">student connections</div>
                      </div>
                      <div className="rounded-[1.5rem] border border-violet-200 bg-violet-50 p-5 dark:border-slate-700 dark:bg-slate-900/80">
                        <Lightbulb className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                        <div className="mt-6 text-3xl font-black text-slate-950 dark:text-white">320+</div>
                        <div className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">skill-building sessions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-100px' }}>
          <div className="flex items-center justify-between mb-14">
            <div>
              <h2 className="text-4xl font-black text-gray-950 dark:text-white mb-2">Featured Events</h2>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Handpicked events & experiences this month</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/events" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:text-blue-300 flex items-center space-x-1">
                <span>View All Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-md dark:shadow-none hover:shadow-xl dark:shadow-none transition-all"
              >
                <div className="h-52 relative overflow-hidden">
                  <EventVisual category={event.category} title={event.title} subtitle={event.subtitle} compact />
                  {event.trending && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1 px-3 py-1.5 rounded-full bg-red-500 text-white font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Trending</span>
                    </div>
                  )}
                  <div className="px-2 py-1 rounded-full bg-white dark:bg-slate-900/90 text-xs font-bold text-gray-900 dark:text-gray-100">
                    {event.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-gray-950 dark:text-white text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold mb-3">{event.subtitle}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                  
                  {/* Event Details */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                      <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold">{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold">{event.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.slice(0, 2).map((tag, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Participants & Capacity */}
                  <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">Attendees</div>
                      <div className="font-black text-blue-600 dark:text-blue-400">{event.participants}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 dark:text-gray-300">Capacity</div>
                      <div className="font-black text-gray-950 dark:text-white">{event.capacity}</div>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-bold text-sm hover:shadow-lg dark:shadow-none transition-all">
                    {event.status}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Browse by Category */}
      <section className="bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="mb-12">
              <h2 className="text-4xl font-black text-gray-950 dark:text-white mb-2">Find Events By Type</h2>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Explore conferences, workshops, networking events, webinars, and more</p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-lg dark:shadow-none'
                      : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <cat.icon className="mr-2 inline h-4 w-4" />
                  {cat.label}
                </motion.button>
              ))}
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allEvents[activeCategory].map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-md dark:shadow-none hover:shadow-lg dark:shadow-none transition-all"
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
                    {event.type}
                  </div>
                  <h3 className="font-bold text-gray-950 dark:text-white mb-4 text-lg">{event.name}</h3>
                  
                  <div className="space-y-3 mb-5 pb-5 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">{event.participants}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-bold">{event.price}</span>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} className="w-full py-2.5 rounded-lg border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-50 dark:bg-slate-800/50 transition-all">
                    View Details
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Use Our Platform */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-black text-gray-950 dark:text-white text-center mb-16">Why Choose Our Platform?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Easy Discovery', desc: 'Find events that match your interests, schedule, and location preferences.' },
              { icon: Users, title: 'Networking Opportunities', desc: 'Connect with like-minded professionals and expand your professional network.' },
              { icon: BookOpen, title: 'Skill Development', desc: 'Attend workshops and training to develop new professional skills.' },
              { icon: Briefcase, title: 'Business Growth', desc: 'Access events designed to help your business grow and scale.' },
              { icon: Globe, title: 'Global Events', desc: 'Explore events from around the world in different industries.' },
              { icon: Clock, title: 'Flexible Options', desc: 'Choose between in-person, online, or hybrid events that fit your schedule.' },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl glass hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-6 shadow-sm border border-blue-200/50">
                    <IconComponent className="w-7 h-7 text-blue-600 dark:text-blue-400 stroke-[1.5]" />
                  </div>
                  <h3 className="font-black text-gray-950 dark:text-white mb-3 text-xl">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-3xl p-12 md:p-16 text-center text-white"
        >
          <h3 className="text-4xl md:text-5xl font-black mb-4">Start Exploring Events Today</h3>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover amazing events in your field, connect with professionals, and accelerate your growth. Join thousands who've found their next opportunity through our platform.
          </p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold hover:shadow-lg dark:shadow-none transition-all"
              >
                <span>Browse All Events</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/auth?mode=register"
                className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 font-bold transition-all border-2 border-white"
              >
                <span>Sign Up Free</span>
              </Link>
            </motion.div>
          </motion.div>
          <p className="text-sm opacity-80 mt-6">No credit card required. Start discovering events in seconds.</p>
        </motion.div>
      </section>
        </div>
      )}
    </>
  );
}

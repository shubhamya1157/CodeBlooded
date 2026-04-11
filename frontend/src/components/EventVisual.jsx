import { BarChart3, BookOpen, Sparkles, Users, Video, Wrench } from 'lucide-react';

const visualMap = {
  all: {
    gradient: 'from-sky-600 via-blue-600 to-violet-600',
    ring: 'from-white/40 via-white/10 to-white/0',
    accent: 'bg-cyan-300/90',
    icon: Sparkles,
    eyebrow: 'Campus pulse',
  },
  conferences: {
    gradient: 'from-blue-700 via-cyan-600 to-sky-500',
    ring: 'from-cyan-300/50 via-white/10 to-white/0',
    accent: 'bg-cyan-300/90',
    icon: BarChart3,
    eyebrow: 'Conference',
  },
  workshops: {
    gradient: 'from-violet-700 via-fuchsia-600 to-rose-500',
    ring: 'from-fuchsia-300/50 via-white/10 to-white/0',
    accent: 'bg-fuchsia-300/90',
    icon: Wrench,
    eyebrow: 'Workshop',
  },
  networking: {
    gradient: 'from-emerald-700 via-teal-600 to-cyan-500',
    ring: 'from-emerald-300/50 via-white/10 to-white/0',
    accent: 'bg-emerald-300/90',
    icon: Users,
    eyebrow: 'Networking',
  },
  webinars: {
    gradient: 'from-orange-600 via-amber-500 to-rose-500',
    ring: 'from-amber-200/50 via-white/10 to-white/0',
    accent: 'bg-amber-200/90',
    icon: Video,
    eyebrow: 'Live session',
  },
  training: {
    gradient: 'from-indigo-700 via-blue-600 to-cyan-500',
    ring: 'from-indigo-200/50 via-white/10 to-white/0',
    accent: 'bg-indigo-200/90',
    icon: BookOpen,
    eyebrow: 'Learning track',
  },
};

export default function EventVisual({ category = 'all', title = 'CampusConnect', subtitle = 'Discover your next opportunity', compact = false }) {
  const tone = visualMap[category?.toLowerCase()] || visualMap.all;
  const Icon = tone.icon;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${tone.gradient}`}>
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_30%)]`} />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.26)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.26)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${tone.ring} blur-2xl`} />
      <div className="absolute left-8 top-8 h-2.5 w-2.5 rounded-full bg-white/80" />
      <div className={`absolute bottom-12 left-10 h-3 w-3 rounded-full ${tone.accent}`} />
      <div className="absolute right-12 top-14 h-2 w-2 rounded-full bg-white/60" />

      <div className={`relative z-10 flex h-full flex-col justify-between ${compact ? 'p-4' : 'p-6 md:p-7'}`}>
        <div className="flex items-center justify-between">
          <div className="rounded-full border border-white/30 bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/90 backdrop-blur">
            {tone.eyebrow}
          </div>
          <div className="rounded-2xl border border-white/20 bg-slate-950/10 p-3 backdrop-blur-sm">
            <Icon className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
          </div>
        </div>

        <div className={`${compact ? 'max-w-[80%]' : 'max-w-[70%]'}`}>
          <div className={`font-black tracking-tight text-white ${compact ? 'text-lg' : 'text-3xl md:text-4xl'}`}>{title}</div>
          <p className={`mt-2 text-white/78 ${compact ? 'text-xs leading-5' : 'text-sm md:text-base leading-6'}`}>{subtitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['Discover', 'Connect', 'Launch'].map((item, index) => (
            <div
              key={item}
              className={`rounded-2xl border border-white/15 bg-white/${index === 1 ? '18' : '10'} px-3 py-3 backdrop-blur-sm`}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">Mode</div>
              <div className={`mt-1 font-bold text-white ${compact ? 'text-xs' : 'text-sm'}`}>{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

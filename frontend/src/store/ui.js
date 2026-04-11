import { create } from 'zustand';

// Setup initial theme based on localStorage or system preference
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //   if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    //   return savedTheme;
    // }
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // if (prefersDark) document.documentElement.classList.add('dark');
    // return prefersDark ? 'dark' : 'light';
    document.documentElement.classList.remove('dark');
    return 'light';
  }
  return 'light';
};

export const useUIStore = create((set) => ({
  notifications: [],
  theme: getInitialTheme(),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  
  addNotification: (notification) => {
    const id = Date.now();
    const message = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };
    
    set((state) => ({
      notifications: [...state.notifications, message],
    }));

    if (message.duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, message.duration);
    }

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));

import { create } from 'zustand';

export const useEventsStore = create((set, get) => ({
  events: [],
  selectedEvent: null,
  filters: {
    category: 'all',
    search: '',
    status: 'upcoming',
  },

  setEvents: (events) => set({ events }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  getFilteredEvents: () => {
    const { events, filters } = get();
    return events.filter((event) => {
      const matchesSearch = !filters.search || 
        event.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || event.category === filters.category;
      
      return matchesSearch && matchesCategory;
    });
  },
}));

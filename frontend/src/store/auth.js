import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      userType: null, // 'student', 'organizer', 'member'
      isAuthenticated: false,

      setUser: (user, token, userType) => {
        const resolvedId = user?._id || user?.id || user?.userId || user?.orgId || null;
        const normalizedUser = user
          ? {
              ...user,
              ...(resolvedId ? { id: resolvedId, _id: resolvedId } : {}),
            }
          : null;

        set({
          user: normalizedUser,
          token,
          userType,
          isAuthenticated: !!token,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          userType: null,
          isAuthenticated: false,
        });
      },

      getHeaders: () => {
        const token = get().token;
        return {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        };
      },

      getUserId: () => {
        const user = get().user;
        return user?._id || user?.id || null;
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

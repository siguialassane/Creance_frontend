import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  loading: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timestamp: number
  }>
}

interface UIActions {
  setSidebarOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>((set, get) => ({
  // État initial
  sidebarOpen: false,
  loading: false,
  notifications: [],

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setLoading: (loading) => set({ loading }),
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    const timestamp = Date.now()
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id, timestamp }]
    }))
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },
  
  clearNotifications: () => set({ notifications: [] }),
}))


"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export interface RecentItem {
  path: string;
  label: string;
  icon: string;
  timestamp: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  icon: string;
  timestamp: number;
  read: boolean;
}

interface NavigationContextType {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  favorites: string[];
  toggleFavorite: (path: string) => void;
  pinned: string[];
  togglePin: (path: string) => void;
  recentlyVisited: RecentItem[];
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, icon: string) => void;
  clearNotifications: () => void;
  markNotificationsAsRead: () => void;
  unreadCount: number;
  progressPercent: number;
  activeTheme: "green" | "blue" | "gold";
  setActiveTheme: (theme: "green" | "blue" | "gold") => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

// Help dictionary to find link labels and icons
export const ROUTE_META: Record<string, { label: string; icon: string }> = {
  "/": { label: "Home", icon: "home" },
  "/dashboard": { label: "Dashboard", icon: "dashboard" },
  "/cell-explorer": { label: "Cell Explorer", icon: "cell-explorer" },
  "/microorganisms": { label: "Microorganisms", icon: "microorganisms" },
  "/viruses": { label: "Viruses", icon: "viruses" },
  "/disease-explorer": { label: "Disease Explorer", icon: "disease-explorer" },
  "/rare-species": { label: "Rare Species", icon: "rare-species" },
  "/dna-genetics": { label: "DNA & Genetics", icon: "dna-genetics" },
  "/human-body": { label: "Human Body", icon: "human-body" },
  "/ecosystems": { label: "Ecosystems", icon: "ecosystems" },
  "/ecosystem-simulator": { label: "Ecosystem Sim", icon: "ecosystem-simulator" },
  "/tree-of-life": { label: "Tree of Life", icon: "tree-of-life" },
  "/photosynthesis": { label: "Photosynthesis", icon: "photosynthesis" },
  "/food-chain": { label: "Food Chain", icon: "food-chain" },
  "/learning-paths": { label: "Learning Paths", icon: "learning-paths" },
  "/gamification": { label: "Profile Hub", icon: "gamification" },
  "/virtual-lab": { label: "Virtual Lab", icon: "virtual-lab" },
  "/virtual-microscope": { label: "Virtual Microscope", icon: "virtual-microscope" },
  "/process-simulations": { label: "Process Sims", icon: "process-simulations" },
  "/research-hub": { label: "Research Hub", icon: "research-hub" },
  "/tutor": { label: "AI Tutor", icon: "tutor" },
  "/dictionary": { label: "Dictionary", icon: "dictionary" },
  "/quiz": { label: "Quiz", icon: "quiz" },
  "/knowledge": { label: "Knowledge Graph", icon: "tree-of-life" },
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Persistence States
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [recentlyVisited, setRecentlyVisited] = useState<RecentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeTheme, setActiveThemeState] = useState<"green" | "blue" | "gold">("green");

  const setActiveTheme = (t: "green" | "blue" | "gold") => {
    setActiveThemeState(t);
    localStorage.setItem("bio_nav_theme", t);
    // Apply class to HTML tag for styling updates
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("theme-green", "theme-blue", "theme-gold");
      root.classList.add(`theme-${t}`);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedFavs = localStorage.getItem("bio_nav_favorites");
        if (storedFavs) setFavorites(JSON.parse(storedFavs));

        const storedPinned = localStorage.getItem("bio_nav_pinned");
        if (storedPinned) setPinned(JSON.parse(storedPinned));

        const storedRecents = localStorage.getItem("bio_nav_recents");
        if (storedRecents) setRecentlyVisited(JSON.parse(storedRecents));

        const storedCollapsed = localStorage.getItem("bio_nav_collapsed");
        if (storedCollapsed) setSidebarCollapsed(storedCollapsed === "true");

        const storedTheme = localStorage.getItem("bio_nav_theme") as "green" | "blue" | "gold";
        if (storedTheme) {
          setActiveTheme(storedTheme);
        } else {
          setActiveTheme("green");
        }

        // Load notifications or set defaults
        const storedNotifs = localStorage.getItem("bio_nav_notifications");
        if (storedNotifs) {
          setNotifications(JSON.parse(storedNotifs));
        } else {
          const defaultNotifs: NotificationItem[] = [
            {
              id: "welcome",
              title: "Welcome to Biosphere",
              message: "Start your journey by exploring the 3D cell structures or testing your knowledge in AI Tutor.",
              icon: "🌱",
              timestamp: Date.now(),
              read: false,
            },
          ];
          setNotifications(defaultNotifs);
          localStorage.setItem("bio_nav_notifications", JSON.stringify(defaultNotifs));
        }
      } catch (e) {
        console.error("Failed to load navigation cache:", e);
      }
    }
  }, []);

  // Update progress score dynamically
  const updateProgress = () => {
    if (typeof window === "undefined") return;
    try {
      let completedCount = 0;
      const totalGoals = 4;

      // 1. Photosynthesis Certification
      if (localStorage.getItem("biosphere_lab_cert_photosynthesis") === "true") {
        completedCount++;
      }
      // 2. Catalysis Certification
      if (localStorage.getItem("biosphere_lab_cert_catalysis") === "true") {
        completedCount++;
      }
      // 3. User talk with AI Tutor
      if (localStorage.getItem("biosphere_tutor_talked") === "true") {
        completedCount++;
      }
      // 4. Score at least 50 points on the biology quiz
      const quizStats = JSON.parse(localStorage.getItem("bio_stats") || '{"points":0}');
      if (quizStats.points >= 50) {
        completedCount++;
      }

      setProgressPercent(Math.round((completedCount / totalGoals) * 100));
    } catch (e) {
      console.warn("Failed to update progress:", e);
    }
  };

  useEffect(() => {
    updateProgress();
    // Listen for storage changes to sync progress/achievements
    window.addEventListener("storage", updateProgress);
    return () => window.removeEventListener("storage", updateProgress);
  }, []);

  // Track path changes for recently visited list
  useEffect(() => {
    if (!pathname) return;

    // Trigger update progress
    updateProgress();

    // Find details for current path
    const meta = ROUTE_META[pathname] || {
      label: pathname.split("/").pop()?.toUpperCase() || "Details",
      icon: pathname.includes("viruses")
        ? "☣️"
        : pathname.includes("microorganisms")
        ? "🦠"
        : pathname.includes("rare-species")
        ? "🦁"
        : "🧬",
    };

    setRecentlyVisited((prev) => {
      const filtered = prev.filter((item) => item.path !== pathname);
      const updated = [
        {
          path: pathname,
          label: meta.label,
          icon: meta.icon,
          timestamp: Date.now(),
        },
        ...filtered,
      ].slice(0, 5); // Limit to top 5 recent paths
      
      localStorage.setItem("bio_nav_recents", JSON.stringify(updated));
      return updated;
    });
  }, [pathname]);

  const toggleFavorite = (path: string) => {
    setFavorites((prev) => {
      const next = prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path];
      localStorage.setItem("bio_nav_favorites", JSON.stringify(next));
      return next;
    });
  };

  const togglePin = (path: string) => {
    setPinned((prev) => {
      const next = prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path];
      localStorage.setItem("bio_nav_pinned", JSON.stringify(next));
      return next;
    });
  };

  const addNotification = (title: string, message: string, icon: string) => {
    setNotifications((prev) => {
      const newItem: NotificationItem = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        message,
        icon,
        timestamp: Date.now(),
        read: false,
      };
      const next = [newItem, ...prev].slice(0, 15); // cap at 15 notifications
      localStorage.setItem("bio_nav_notifications", JSON.stringify(next));
      return next;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("bio_nav_notifications");
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("bio_nav_notifications", JSON.stringify(next));
      return next;
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NavigationContext.Provider
      value={{
        searchOpen,
        setSearchOpen,
        shortcutsOpen,
        setShortcutsOpen,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed: (c) => {
          setSidebarCollapsed(c);
          localStorage.setItem("bio_nav_collapsed", String(c));
        },
        favorites,
        toggleFavorite,
        pinned,
        togglePin,
        recentlyVisited,
        notifications,
        addNotification,
        clearNotifications,
        markNotificationsAsRead,
        unreadCount,
        progressPercent,
        activeTheme,
        setActiveTheme,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

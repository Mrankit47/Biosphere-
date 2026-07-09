"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NavigationProvider, useNavigation } from "./NavigationContext";
import { ResponsiveSidebar } from "./ResponsiveSidebar";
import { HeaderNavbar } from "./HeaderNavbar";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { ShortcutsModal } from "./ShortcutsModal";
import { FloatingAIAssistant } from "./FloatingAIAssistant";

const NavigationEventsHandler: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    searchOpen,
    setSearchOpen,
    shortcutsOpen,
    setShortcutsOpen,
    addNotification,
  } = useNavigation();

  // Global Keyboard Shortcuts Event Listener
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Skip shortcuts if focusing input, textarea, or contentEditable elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Ctrl + K or Cmd + K (or '/' slash key) triggers Global Search
      if ((e.ctrlKey || e.metaKey) && key === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      } else if (e.key === "/" && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }

      // Shift + H -> Home
      if (e.shiftKey && e.key === "H") {
        e.preventDefault();
        router.push("/");
      }

      // Shift + T -> Tutor
      if (e.shiftKey && e.key === "T") {
        e.preventDefault();
        router.push("/tutor");
      }

      // Shift + P -> Profile Hub
      if (e.shiftKey && e.key === "P") {
        e.preventDefault();
        router.push("/gamification");
      }

      // Shift + L -> Learning Paths
      if (e.shiftKey && e.key === "L") {
        e.preventDefault();
        router.push("/learning-paths");
      }

      // '?' key triggers Keyboard Shortcuts sheet
      if (e.key === "?" && !searchOpen) {
        e.preventDefault();
        setShortcutsOpen(!shortcutsOpen);
      }
    };

    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, [searchOpen, setSearchOpen, shortcutsOpen, setShortcutsOpen, router]);

  // Achievement Unlock notifications when visiting specific pages
  useEffect(() => {
    if (!pathname) return;

    // Detect milestones and push system achievements
    if (pathname === "/tutor") {
      const talkedKey = "biosphere_tutor_talked";
      if (localStorage.getItem(talkedKey) !== "true") {
        localStorage.setItem(talkedKey, "true");
        addNotification(
          "🤖 Scholar Milestone Unlocked",
          "You've initiated a study session with the Biosphere AI Biology Tutor. (+50 XP)",
          "🏆"
        );
      }
    }
  }, [pathname, addNotification]);

  return null;
};

export const NavigationSystem: React.FC = () => {
  return (
    <>
      <NavigationEventsHandler />
      <ResponsiveSidebar />
      <HeaderNavbar />
      <GlobalSearchModal />
      <ShortcutsModal />
      <FloatingAIAssistant />
    </>
  );
};

"use client";

import LenisProvider from "@/components/ui/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import { NavigationSystem, NavigationProvider, MobileBottomNav, FloatingLearningToolbar, MentorProvider } from "@/components/ui/navigation";
import { AuthProvider, AuthGuard, AuthModal } from "@/components/ui/auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransition from "@/components/PageTransition";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <AuthProvider>
        <NavigationProvider>
          <MentorProvider>
            <CustomCursor />
            <NavigationSystem />
            <ErrorBoundary>
              <main className="biosphere-main-content">
                <AuthGuard>
                  <PageTransition>{children}</PageTransition>
                </AuthGuard>
              </main>
            </ErrorBoundary>
            <MobileBottomNav />
            <FloatingLearningToolbar />
            <AuthModal />
          </MentorProvider>
        </NavigationProvider>
      </AuthProvider>

      <style>{`
        .biosphere-main-content {
          padding-top: 80px;
          padding-left: 80px;
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: padding-left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        @media (max-width: 860px) {
          .biosphere-main-content {
            padding-left: 0px;
            padding-top: 80px;
            padding-bottom: 84px; /* Room for bottom mobile nav */
          }
        }

        /* Accent variables overrides for theme switcher selection */
        html.theme-blue {
          --ds-accent: #6366f1 !important;
          --ds-accent-muted: #818cf8 !important;
          --ds-border-accent: rgba(99, 102, 241, 0.4) !important;
          --ds-accent-faint: rgba(99, 102, 241, 0.08) !important;
          --ds-accent-subtle: rgba(99, 102, 241, 0.15) !important;
          --ds-glow-sm: 0 0 10px rgba(99, 102, 241, 0.25) !important;
          --ds-glow-md: 0 0 20px rgba(99, 102, 241, 0.4) !important;
        }

        html.theme-gold {
          --ds-accent: #facc15 !important;
          --ds-accent-muted: #fde047 !important;
          --ds-border-accent: rgba(250, 204, 21, 0.4) !important;
          --ds-accent-faint: rgba(250, 204, 21, 0.08) !important;
          --ds-accent-subtle: rgba(250, 204, 21, 0.15) !important;
          --ds-glow-sm: 0 0 10px rgba(250, 204, 21, 0.25) !important;
          --ds-glow-md: 0 0 20px rgba(250, 204, 21, 0.4) !important;
        }
      `}</style>
    </LenisProvider>
  );
}

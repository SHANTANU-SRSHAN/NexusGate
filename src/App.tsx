import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NetworkBackground } from './components/NetworkBackground';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AIAssistantDrawer } from './components/AI/AIAssistantDrawer';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { PyqExplorerView } from './views/PyqExplorerView';
import { QuestionSolverView } from './views/QuestionSolverView';
import { SolutionDetailView } from './views/SolutionDetailView';
import { PracticeModeView } from './views/PracticeModeView';
import { TestSeriesView } from './views/TestSeriesView';
import { LiveTestInterface } from './views/LiveTestInterface';
import { TestResultView } from './views/TestResultView';
import { SubjectsView } from './views/SubjectsView';
import { DiscussionsView } from './views/DiscussionsView';
import { AnalyticsView } from './views/AnalyticsView';
import { BookmarksView } from './views/BookmarksView';
import { HistoryView } from './views/HistoryView';
import { ProfileView } from './views/ProfileView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  // Fullscreen isolated live test experience
  if (activeTab === 'live-test') {
    return <LiveTestInterface />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView />;
      case 'pyqs':
        return <PyqExplorerView />;
      case 'solve':
        return <QuestionSolverView />;
      case 'solution':
        return <SolutionDetailView />;
      case 'practice':
        return <PracticeModeView />;
      case 'tests':
        return <TestSeriesView />;
      case 'test-result':
        return <TestResultView />;
      case 'subjects':
        return <SubjectsView />;
      case 'discussions':
        return <DiscussionsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'history':
        return <HistoryView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090C0B] text-slate-100 flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Live Animated Background */}
      <NetworkBackground />

      {/* Main Top Navigation */}
      <Navbar />

      <div className="flex-1 flex w-full relative z-10">
        {/* Desktop Sidebar (hidden on landing page to maximize hero impact, visible on app views) */}
        {activeTab !== 'landing' && <Sidebar />}

        {/* Scrollable View Container */}
        <main className="flex-1 pb-20 lg:pb-12 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <AIAssistantDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

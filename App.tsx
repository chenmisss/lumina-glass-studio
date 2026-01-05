import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginView from './components/LoginView';
import HistoryView from './components/HistoryView';
import HobbyistDashboard from './components/HobbyistDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import StudentProgressView from './components/StudentProgressView';
import PortfolioView from './components/PortfolioView';
import { generateGlassRecipe, generateGlassImage, generateRecipeFromImage } from './services/geminiService';
import { storageService } from './services/storageService';
import { AppState, GeneratedDesign, User, ViewMode, HistoryItem, UserRole } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<GeneratedDesign | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = storageService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (username: string, role: UserRole) => {
    const loggedInUser = storageService.login(username, role);
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setData(null);
    setAppState(AppState.IDLE);
    setCurrentView('dashboard');
  };

  const handleGenerate = async (prompt: string, image?: string | null) => {
    if (!user) return;

    try {
      setAppState(AppState.ANALYZING);
      setError(null);
      setCurrentView('dashboard');

      let newDesign: GeneratedDesign;

      if (image) {
        // Image-to-Recipe Flow
        newDesign = await generateRecipeFromImage(image, prompt);
      } else {
        // Text-to-Recipe Flow
        const recipe = await generateGlassRecipe(prompt);
        setAppState(AppState.RENDERING);
        const imageUrl = await generateGlassImage(recipe.visualPrompt);
        newDesign = { recipe, imageUrl };
      }

      storageService.saveDesign(user.id, newDesign);

      setData(newDesign);
      setAppState(AppState.COMPLETE);

    } catch (e: any) {
      console.error(e);
      if (e.message.includes("MISSING_API_KEY")) {
        const key = window.prompt("Please enter your Google Gemini API Key to use this feature (it will be saved locally):");
        if (key) {
          import('./services/geminiService').then(({ setApiKey }) => {
            setApiKey(key);
            // Retry generation
            handleGenerate(prompt, image);
          });
          return; // Exit error handler
        }
      }
      setError(e.message || "咨询 AI 玻璃大师时发生意外错误。");
      setAppState(AppState.ERROR);
    }
  };

  const handleSelectHistory = (item: HistoryItem, scrollToCompare = false) => {
    setData(item);
    setCurrentView('dashboard');
    setAppState(AppState.COMPLETE);

    if (scrollToCompare) {
      setTimeout(() => {
        const el = document.getElementById('comparison-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    if (user) {
      storageService.clearHistory(user.id);
      setCurrentView('dashboard');
      setTimeout(() => setCurrentView('history'), 10);
    }
  };

  const renderContent = () => {
    if (!user) {
      return <LoginView onLogin={handleLogin} />;
    }

    if (currentView === 'history') {
      if (user.role === 'owner') {
        return <StudentProgressView />;
      }

      const historyItems = storageService.getUserHistory(user.id);
      return (
        <HistoryView
          items={historyItems}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
        />
      );
    }

    // 新增作品集视图
    if (currentView === 'portfolio' && user.role === 'hobbyist') {
      const portfolioItems = storageService.getPortfolioItems(user.id);
      return <PortfolioView items={portfolioItems} onNavigate={setCurrentView} />;
    }

    if (user.role === 'owner') {
      return <OwnerDashboard user={user} />;
    } else {
      return (
        <HobbyistDashboard
          user={user}
          appState={appState}
          data={data}
          error={error}
          onGenerate={handleGenerate}
        />
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] bg-mesh bg-fixed bg-cover selection:bg-cyan-500 selection:text-white">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          user={user}
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={handleLogout}
        />

        <main className="flex-grow pt-4 md:pt-10">
          {renderContent()}
        </main>

        <footer className="py-6 md:py-8 text-center text-slate-500 text-xs md:text-sm relative z-10 px-4">
          <p>© {new Date().getFullYear()} Lumina AI 玻璃艺术工作室.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
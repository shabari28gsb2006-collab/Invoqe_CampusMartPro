import React, { createContext, useContext, useState, useEffect } from 'react';
import { SeasonalThemeType, ThemeConfig, CampaignSchedule } from '../types';
import { THEME_CONFIGS, INITIAL_SCHEDULES } from '../data/mockData';
import { apiEnabled, apiRequest } from '../services/api';

export type ViewportMode = 'responsive' | 'desktop' | 'mobile';

interface ThemeContextType {
  activeTheme: SeasonalThemeType;
  previewTheme: SeasonalThemeType | null;
  currentThemeConfig: ThemeConfig;
  schedules: CampaignSchedule[];
  isThemeStudioOpen: boolean;
  viewportMode: ViewportMode;
  setActiveTheme: (theme: SeasonalThemeType) => void;
  setPreviewTheme: (theme: SeasonalThemeType | null) => void;
  updateSchedule: (themeId: SeasonalThemeType, updates: Partial<CampaignSchedule>) => void;
  activateSchedule: (themeId: SeasonalThemeType) => void;
  setIsThemeStudioOpen: (open: boolean) => void;
  setViewportMode: (mode: ViewportMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState<SeasonalThemeType>(() => { try { return (localStorage.getItem('campusmart-theme') as SeasonalThemeType) || 'classic'; } catch { return 'classic'; } });
  const [previewTheme, setPreviewTheme] = useState<SeasonalThemeType | null>(null);
  const [schedules, setSchedules] = useState<CampaignSchedule[]>(() => { try { const saved = localStorage.getItem('campusmart-schedules'); return saved ? JSON.parse(saved) as CampaignSchedule[] : INITIAL_SCHEDULES; } catch { return INITIAL_SCHEDULES; } });
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('responsive');

  useEffect(() => {
    if (!apiEnabled) return;
    let cancelled = false;
    void apiRequest<{ themeId: SeasonalThemeType }>('/api/v1/marketplace/theme').then(result => {
      if (!cancelled && result.themeId in THEME_CONFIGS) setActiveTheme(result.themeId);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!apiEnabled || typeof sessionStorage === 'undefined' || !sessionStorage.getItem('campusmart-admin-token')) return;
    const campaigns = schedules.map(schedule => ({
      themeId: schedule.themeId,
      campaignName: schedule.campaignName,
      startAt: `${schedule.startDate}T${schedule.startTime}:00`,
      endAt: `${schedule.endDate}T${schedule.endTime}:00`,
      isEnabled: schedule.isActive,
      priority: schedule.isActive ? 10 : 0,
      bannerNote: schedule.bannerNote,
    }));
    void apiRequest('/api/v1/admin/themes', { method: 'PUT', body: JSON.stringify({ campaigns }) }).catch(error => console.error('Could not persist theme schedule:', error));
  }, [schedules]);

  const effectiveThemeKey = previewTheme || activeTheme;
  const currentThemeConfig = THEME_CONFIGS[effectiveThemeKey] || THEME_CONFIGS.classic;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = effectiveThemeKey;
    root.style.colorScheme = 'light';
    root.style.setProperty('--theme-primary', currentThemeConfig.primaryColor);
    root.style.setProperty('--theme-primary-dark', currentThemeConfig.primaryDark);
    root.style.setProperty('--theme-accent', currentThemeConfig.accentColor);
    root.style.setProperty('--theme-banner', currentThemeConfig.bannerGradient);
    try { localStorage.setItem('campusmart-theme', activeTheme); } catch { /* storage may be unavailable */ }
  }, [effectiveThemeKey, activeTheme, currentThemeConfig]);

  const updateSchedule = (themeId: SeasonalThemeType, updates: Partial<CampaignSchedule>) => {
    setSchedules(prev => { const next = prev.map(item => (item.themeId === themeId ? { ...item, ...updates } : item)); try { localStorage.setItem('campusmart-schedules', JSON.stringify(next)); } catch { /* storage may be unavailable */ } return next; });
  };

  const activateSchedule = (themeId: SeasonalThemeType) => {
    setSchedules(prev => { const next = prev.map(item => ({ ...item, isActive: item.themeId === themeId })); try { localStorage.setItem('campusmart-schedules', JSON.stringify(next)); } catch { /* storage may be unavailable */ } return next; });
    setActiveTheme(themeId);
  };

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        previewTheme,
        currentThemeConfig,
        schedules,
        isThemeStudioOpen,
        viewportMode,
        setActiveTheme,
        setPreviewTheme,
        updateSchedule,
        activateSchedule,
        setIsThemeStudioOpen,
        setViewportMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

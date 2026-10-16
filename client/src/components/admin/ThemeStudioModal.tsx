import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Palette, 
  Zap, 
  Flame, 
  Gift, 
  Sun, 
  GraduationCap,
  Eye,
  Check,
  Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShop } from '../../context/ShopContext';
import { THEME_CONFIGS } from '../../data/mockData';
import { SeasonalThemeType, CampaignSchedule } from '../../types';

export const ThemeStudioModal: React.FC = () => {
  const { 
    isThemeStudioOpen, 
    setIsThemeStudioOpen, 
    activeTheme, 
    previewTheme,
    setActiveTheme, 
    setPreviewTheme,
    schedules, 
    updateSchedule,
    activateSchedule 
  } = useTheme();

  const { showToast } = useShop();

  const [selectedThemeTab, setSelectedThemeTab] = useState<SeasonalThemeType>(previewTheme || activeTheme);
  const currentSchedule = schedules.find(s => s.themeId === selectedThemeTab) || schedules[0];

  const [campaignName, setCampaignName] = useState(currentSchedule.campaignName);
  const [startDate, setStartDate] = useState(currentSchedule.startDate);
  const [startTime, setStartTime] = useState(currentSchedule.startTime);
  const [endDate, setEndDate] = useState(currentSchedule.endDate);
  const [endTime, setEndTime] = useState(currentSchedule.endTime);
  const [isActive, setIsActive] = useState(currentSchedule.isActive);

  if (!isThemeStudioOpen) return null;

  const handleSelectThemeTab = (themeId: SeasonalThemeType) => {
    setSelectedThemeTab(themeId);
    const sched = schedules.find(s => s.themeId === themeId);
    if (sched) {
      setCampaignName(sched.campaignName);
      setStartDate(sched.startDate);
      setStartTime(sched.startTime);
      setEndDate(sched.endDate);
      setEndTime(sched.endTime);
      setIsActive(sched.isActive);
    }
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchedule(selectedThemeTab, {
      campaignName,
      startDate,
      startTime,
      endDate,
      endTime,
      isActive,
    });
    if (isActive) {
      activateSchedule(selectedThemeTab);
      setPreviewTheme(null);
      showToast(`Campaign "${campaignName}" activated as live theme!`);
    } else {
      showToast(`Campaign schedule saved for ${THEME_CONFIGS[selectedThemeTab].name}.`);
    }
  };

  const handleQuickActivate = (themeId: SeasonalThemeType) => {
    activateSchedule(themeId);
    setPreviewTheme(null);
    showToast(`Switched active theme to ${THEME_CONFIGS[themeId].name}`);
  };

  const handleTogglePreview = (themeId: SeasonalThemeType) => {
    if (previewTheme === themeId) {
      setPreviewTheme(null);
      showToast('Live preview turned off');
    } else {
      setPreviewTheme(themeId);
      showToast(`Previewing ${THEME_CONFIGS[themeId].name}`);
    }
  };

  const themeList: { id: SeasonalThemeType; name: string; icon: any; color: string; desc: string }[] = [
    { id: 'classic', name: 'Classic Blue', icon: GraduationCap, color: 'bg-blue-600', desc: 'Standard collegiate marketplace' },
    { id: 'diwali', name: 'Diwali Dhamaka', icon: Flame, color: 'bg-amber-600', desc: 'Festival of lights & campus gifts' },
    { id: 'christmas', name: 'Christmas / Winter', icon: Gift, color: 'bg-red-600', desc: 'Winter holiday cheer & secret Santa' },
    { id: 'pongal', name: 'Pongal / Sankranti', icon: Sun, color: 'bg-yellow-600', desc: 'Harvest mela & fresh tech starts' },
    { id: 'newyear', name: 'New Year 2027', icon: Zap, color: 'bg-indigo-600', desc: 'New semester tech kickoff' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col justify-between">
        {/* Top Header */}
        <div className="p-6 border-b border-gray-100 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Seasonal Theme Studio</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Admin Control
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Select, preview, schedule and activate festival campaigns
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsThemeStudioOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="p-6 space-y-6">
          {/* 1. Theme Selector Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
              <span>Select Theme to Configure</span>
              {previewTheme && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Previewing: {THEME_CONFIGS[previewTheme].name}
                </span>
              )}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {themeList.map((item) => {
                const Icon = item.icon;
                const isCurrentActive = activeTheme === item.id;
                const isSelectedTab = selectedThemeTab === item.id;
                const isPreviewing = previewTheme === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectThemeTab(item.id)}
                    className={`rounded-2xl p-3.5 border-2 transition-all cursor-pointer flex flex-col justify-between relative text-left ${
                      isSelectedTab 
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {isCurrentActive && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-xs bg-emerald-600 text-white font-bold text-[8px] uppercase tracking-wider">
                        Live
                      </span>
                    )}

                    <div>
                      <div className={`w-8 h-8 rounded-xl ${item.color} text-white flex items-center justify-center mb-2 shadow-2xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{item.desc}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePreview(item.id);
                        }}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                          isPreviewing ? 'bg-amber-500 text-white font-bold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{isPreviewing ? 'Active' : 'Preview'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickActivate(item.id);
                        }}
                        disabled={isCurrentActive}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors ${
                          isCurrentActive 
                            ? 'text-emerald-700 bg-emerald-50' 
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isCurrentActive ? 'Current' : 'Deploy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Campaign Scheduling Form for Selected Theme */}
          <div className="bg-slate-50 rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Campaign Scheduling: {THEME_CONFIGS[selectedThemeTab].name}</span>
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Set start and end dates/times to automate festival promotions
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Campaign Active:</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded-sm text-blue-600 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campaign Title / Internal Note
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Diwali Dhamaka Campus Mega Sale"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date & Time */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Start Date & Time</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700 font-medium"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700 font-medium"
                    />
                  </div>
                </div>

                {/* End Date & Time */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>End Date & Time</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700 font-medium"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Live Visual Properties Card */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Theme Visual Adaptations:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 block">Primary Color:</span>
                    <strong className="text-slate-800">{THEME_CONFIGS[selectedThemeTab].primaryColor}</strong>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 block">Festive Greeting:</span>
                    <strong className="text-slate-800 truncate block">{THEME_CONFIGS[selectedThemeTab].greetingText}</strong>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 block">Extra Student Perk:</span>
                    <strong className="text-emerald-600">+{THEME_CONFIGS[selectedThemeTab].extraDiscountPercent}% Cashback</strong>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 block">Banner Tag:</span>
                    <strong className="text-amber-600">{THEME_CONFIGS[selectedThemeTab].specialOfferBadge}</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleTogglePreview(selectedThemeTab)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Now</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Schedule & Activate</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-gray-50 rounded-b-3xl border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Active Live Theme: <strong className="text-slate-800">{THEME_CONFIGS[activeTheme].name}</strong></span>
          <button
            onClick={() => setIsThemeStudioOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

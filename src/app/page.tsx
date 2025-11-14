'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Page, KpiKey, TimeRange, ThemeKey, Dataset } from '@/lib/types';
import { THEMES, MOCK_DATASETS } from '@/lib/mock-data';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import DashboardPage from '@/components/DashboardPage';
import DatasetsPageContent from '@/components/DatasetsPageContent';
import Modal from '@/components/Modal';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeKpi, setActiveKpi] = useState<KpiKey>(KpiKey.REQUESTS);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.MONTH);
  const [activeTheme, setActiveTheme] = useState<ThemeKey>(ThemeKey.OCEAN);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalChartConfig, setModalChartConfig] = useState<{ chartType: 'line' | 'pie'; title: string; kpi?: KpiKey; } | null>(null);

  const theme = useMemo(() => THEMES[activeTheme], [activeTheme]);

  const cycleTheme = useCallback(() => {
    const keys = Object.keys(THEMES) as ThemeKey[];
    const idx = keys.indexOf(activeTheme);
    setActiveTheme(keys[(idx + 1) % keys.length]);
  }, [activeTheme]);

  const openChartModal = useCallback((chartType: 'line' | 'pie', title: string, kpi?: KpiKey) => {
    setModalChartConfig({ chartType, title, kpi });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalChartConfig(null);
  }, []);

  const renderMainContent = useCallback(() => {
    switch (activePage) {
      case Page.DASHBOARD:
        return (
          <DashboardPage
            datasets={datasets}
            activeKpi={activeKpi}
            setActiveKpi={setActiveKpi}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            theme={theme}
            openChartModal={openChartModal}
            setActivePage={setActivePage}
          />
        );
      case Page.DATASETS:
        return (
          <DatasetsPageContent
            datasets={datasets}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            theme={theme}
          />
        );
      case Page.ANALYTICS:
      case Page.SETTINGS:
        return (
          <div className={`flex-1 overflow-y-auto p-8 ${theme.app} ${theme.text}`}>
            <div className={`text-3xl font-bold ${theme.title} p-8`}>
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page (Coming Soon)
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [activePage, datasets, searchTerm, activeKpi, timeRange, theme, openChartModal]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${theme.app} ${theme.text}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} theme={theme} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar cycleTheme={cycleTheme} theme={theme} activePage={activePage} />
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      {isModalOpen && modalChartConfig && (
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={modalChartConfig.title}
            chartType={modalChartConfig.chartType}
            kpi={modalChartConfig.kpi}
            timeRange={timeRange}
            theme={theme}
        />
      )}
    </div>
  );
};

export default App;

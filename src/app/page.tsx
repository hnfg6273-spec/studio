"use client";

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { mockDatasets } from '@/lib/mock-data';
import Sidebar from '@/components/app/Sidebar';
import TopBar from '@/components/app/TopBar';
import DashboardView from '@/components/app/DashboardView';
import DatasetsPage from '@/components/app/DatasetsPage';
import ErrorBoundary from '@/components/app/ErrorBoundary';

export default function Home() {
  const [activePage, setActivePage] = React.useState('dashboard');
  const [datasets, setDatasets] = React.useState(mockDatasets);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [timeRange, setTimeRange] = React.useState('Month');

  const toggleDatasetStatus = (id: string, newStatus: string) => {
    setDatasets(currentDatasets =>
      currentDatasets.map(ds =>
        ds.id === id ? { ...ds, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] } : ds
      )
    );
  };

  const filteredDatasets = React.useMemo(() => {
    return datasets.filter(ds =>
      ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ds.type && ds.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ds.owner && ds.owner.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [datasets, searchTerm]);

  return (
    <ErrorBoundary>
      <div className="dark flex h-screen text-zinc-100 transition-colors duration-200 bg-[#0A0F1A] font-body">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#14253F]/90 via-[#126C86]/5 to-transparent">
          <TopBar onSearch={setSearchTerm} searchTerm={searchTerm} />

          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activePage === 'dashboard' ? (
                  <DashboardView
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    allDatasets={datasets}
                    toggleDatasetStatus={toggleDatasetStatus}
                    searchTerm={searchTerm}
                  />
                ) : (
                  <DatasetsPage
                    datasets={datasets}
                    toggleDatasetStatus={toggleDatasetStatus}
                    searchTerm={searchTerm}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

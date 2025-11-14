'use client';
import React, { useMemo } from 'react';
import { Dataset, Theme } from '@/lib/types';
import Icon from './Icon';
import DatasetTypeSelector from './DatasetTypeSelector';
import { getIcon } from '@/lib/utils';


const HeroSection: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isDark = theme.text !== 'text-zinc-900';
  const imageUrl = "https://i.postimg.cc/wMKCXy1V/Gemini-Generated-Image-vdgi6yvdgi6yvdgi-Photoroom-removebg-preview.png";

  return (
    <section className={`relative py-12 lg:py-20 px-4 sm:px-8 ${theme.heroBg || (isDark ? 'bg-slate-900' : 'bg-gray-100')} text-gray-100`}>
      <div className={`max-w-7xl mx-auto w-full ${isDark ? 'bg-slate-800/70' : 'bg-white'} backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-12 border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        
        <div className="lg:flex lg:space-x-12">
          {/* Left Content Area */}
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className={`text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Fresh Datasets, <br className="hidden sm:inline" />On Demand
            </h1>
            
            <p className={`text-lg sm:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-10 max-w-lg`}>
              Access high-quality, structured datasets without the hassle of web scraping or getting blocked.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"> 

              <button
                className="flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-500/30"
              >
                <Icon name="Search" className="w-5 h-5 mr-2" />
                Buy dataset
              </button>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="lg:w-1/2 h-64 md:h-96 relative flex items-center justify-center p-4">
            <img 
              data-ai-hint="data dashboard preview"
              src={imageUrl}
              alt="Data Dashboard Preview"
              className="w-full h-full object-contain rounded-xl transition duration-300"
              onError={(e) => { 
                e.currentTarget.onerror = null; 
                e.currentTarget.src="https://placehold.co/800x600/1E293B/C7D2FE?text=Image+Load+Error"; 
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface DatasetCardProps {
  dataset: Dataset;
  theme: Theme;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, theme }) => {
  const isDark = theme.text !== 'text-zinc-900';
  const cardBg = theme.cardBg || (isDark ? 'bg-slate-800/60' : 'bg-white');
  const cardBorder = theme.cardBorder || (isDark ? 'border-slate-700/80' : 'border-gray-200/80');
  const textColor = isDark ? 'text-slate-100' : 'text-slate-800';
  const subtleTextColor = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div
      className={`relative rounded-2xl p-6 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBg} border ${cardBorder}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-xl font-bold ${textColor}`}>{dataset.name}</h3>
        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
          <Icon name={getIcon(dataset.type)} className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
        </div>
      </div>
      <p className={`text-sm mb-6 h-10 ${subtleTextColor} text-ellipsis overflow-hidden`}>
        {dataset.description}
      </p>

      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex items-center space-x-2">
          <Icon name="Database" className={`w-4 h-4 ${subtleTextColor}`} />
          <span className={subtleTextColor}>{dataset.records} records</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="DownloadCloud" className={`w-4 h-4 ${subtleTextColor}`} />
          <span className={subtleTextColor}>{dataset.downloads} downloads</span>
        </div>
      </div>

      <button className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
        View Dataset
      </button>
    </div>
  );
};


interface DatasetsPageContentProps {
  datasets: Dataset[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  theme: Theme;
}

const DatasetsPageContent: React.FC<DatasetsPageContentProps> = ({
  datasets,
  searchTerm,
  setSearchTerm,
  theme,
}) => {
  const filteredDatasets = useMemo(() => {
    if (!searchTerm) return datasets;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return datasets.filter(ds =>
      ds.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      ds.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      ds.owner.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [datasets, searchTerm]);

  return (
    <div className={`flex-1 overflow-y-auto ${theme.sectionBg} ${theme.text}`}>
      <HeroSection theme={theme} />
      
      <DatasetTypeSelector theme={theme} />

      <div className="max-w-7xl mx-auto px-8 py-16 bg-black">
        <div className="relative mb-8 max-w-2xl mx-auto">
          <Icon name="Search" className={`w-5 h-5 text-zinc-400 absolute top-1/2 left-3 -translate-y-1/2 ${theme.text === 'text-zinc-900' ? 'text-zinc-500' : 'text-zinc-400'}`} />
          <input
            type="text"
            placeholder="Search for a dataset"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${theme.searchBg} ${theme.searchBorder} ${theme.text === 'text-zinc-900' ? 'text-zinc-900 placeholder-zinc-500 border-zinc-300' : 'text-white placeholder-zinc-400 border-[#2A497A]'}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDatasets.length > 0 ? (
            filteredDatasets.map(ds => (
              <DatasetCard key={ds.id} dataset={ds} theme={theme} />
            ))
          ) : (
            <div className="lg:col-span-3 text-center py-10 text-zinc-400">No datasets found matching your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetsPageContent;

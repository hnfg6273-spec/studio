'use client';
import React, { useMemo } from 'react';
import { Dataset, Theme } from '@/lib/types';
import Icon from './Icon';
import DatasetTypeSelector from './DatasetTypeSelector';

interface HeroSectionProps {
  theme: Theme;
}

const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  return (
    <section className={`relative py-20 lg:py-32 px-8 ${theme.heroBg} ${theme.text} overflow-hidden`}>
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
            <div className="flex items-center text-sm">
              <img src="https://assets-global.website-files.com/653063fcd0c776097d40f28e/653229b139031c54e0c81d86_trustpilot.svg" alt="Trustpilot" className="h-4 mr-2" />
              <span className="font-semibold text-green-400">4.5</span>
            </div>
            <div className="flex items-center text-sm">
              <img src="https://assets-global.website-files.com/653063fcd0c776097d40f28e/653229b139031c54e0c81d88_capterra.svg" alt="Capterra" className="h-4 mr-2" />
              <span className="font-semibold text-yellow-400">4.7</span>
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Get fresh datasets from popular websites
          </h1>
          <p className="text-lg text-zinc-300 mb-10 max-w-lg mx-auto lg:mx-0">
            No more maintaining scrapers or bypassing blocks – just structured and validated data tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
            <button className="flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg shadow-md hover:bg-white hover:text-blue-700 transition-colors">
              Contact sales <Icon name="ArrowRight" className="w-5 h-5 ml-2" />
            </button>
            <button className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2ZM12 11.2C12 10.428 12.628 9.8 13.4 9.8H21.2C22.296 9.8 23.2 10.704 23.2 11.8V21.2C23.2 22.296 22.296 23.2 21.2 23.2H13.4C12.628 23.2 12 22.572 12 21.8V11.2Z" />
              <path d="M22.5 12.5C22.5 12.5 22.5 12.5 22.5 12.5L22.5 12.5L22.5 12.5ZM24 10C24 4.477 19.523 0 14 0H10C4.477 0 0 4.477 0 10V14C0 19.523 4.477 24 10 24H14C19.523 24 24 19.523 24 14V10ZM22.5 12.5C22.5 12.5 22.5 12.5 22.5 12.5L22.5 12.5L22.5 12.5Z" />
                <path d="M12.0001 10.0001C12.0001 10.0001 12.0001 10.0001 12.0001 10.0001L12.0001 10.0001L12.0001 10.0001ZM12.0001 10.0001C12.0001 10.0001 12.0001 10.0001 12.0001 10.0001L12.0001 10.0001L12.0001 10.0001Z" />
                <path d="M10.1501 12.2999L12.0001 10.0001L13.8501 12.2999L13.1501 12.8999L12.0001 11.4999L10.8501 12.8999L10.1501 12.2999ZM12.0001 10.0001C12.0001 10.0001 12.0001 10.0001 12.0001 10.0001L12.0001 10.0001L12.0001 10.0001Z" />
                <path d="M14.28 11.16C14.28 11.16 14.28 11.16 14.28 11.16C14.28 11.16 14.28 11.16 14.28 11.16ZM12.0001 10.0001C12.0001 10.0001 12.0001 10.0001 12.0001 10.0001L12.0001 10.0001L12.0001 10.0001Z" />
                <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM12 4.4C14.093 4.4 15.8 6.107 15.8 8.2C15.8 10.293 14.093 12 12 12C9.907 12 8.2 10.293 8.2 8.2C8.2 6.107 9.907 4.4 12 4.4ZM12 20.8C9.664 20.8 7.6 19.387 6.556 17.387C6.012 16.32 5.597 15.19 5.398 14H18.602C18.403 15.19 17.988 16.32 17.444 17.387C16.393 19.387 14.336 20.8 12 20.8Z" fill="#fff"/>
              </svg>
              Buy dataset
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          {/* Placeholder for illustration */}
          <img data-ai-hint="data pipeline" src="https://storage.googleapis.com/aifire.appspot.com/images/data-pipeline.webp" alt="Data illustration" className="max-w-full h-auto w-[600px] object-contain" />
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
  return (
    <div className={`rounded-xl p-6 shadow-lg ${theme.cardBg} ${theme.cardBorder ? `border ${theme.cardBorder}` : ''} ${theme.text}`}>
      <h3 className="text-xl font-bold mb-2">{dataset.name}</h3>
      <p className={`text-sm mb-4 ${theme.tableCellSubtle} truncate`}>{dataset.description}</p>
      <div className="flex items-center space-x-4 mb-6 text-zinc-400">
        <div className="flex items-center space-x-1">
          <Icon name="Eye" className="w-4 h-4" />
          <span>{dataset.records}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Download" className="w-4 h-4" />
          <span>{dataset.downloads}</span>
        </div>
      </div>
      <button className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
        Buy Now <Icon name="ArrowRight" className="w-4 h-4 ml-2" />
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

      <div className="max-w-7xl mx-auto px-8 py-16">
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

import { Server, Database, FileText, HardDrive, Cloud } from 'lucide-react';

export const getIcon = (type: string) => {
  switch (type) {
    case 'Stream': return <Server className="w-4 h-4 text-blue-400" />;
    case 'Database': return <Database className="w-4 h-4 text-pink-400" />;
    case 'File': return <FileText className="w-4 h-4 text-teal-400" />;
    case 'Log': return <HardDrive className="w-4 h-4 text-orange-400" />;
    case 'Static': return <Cloud className="w-4 h-4 text-purple-400" />;
    default: return <FileText className="w-4 h-4 text-gray-400" />;
  }
};

export const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-500';
    case 'Paused': return 'bg-yellow-500';
    case 'Archived': return 'bg-zinc-500';
    case 'Error': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

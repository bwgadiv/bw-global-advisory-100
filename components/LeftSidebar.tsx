import React from 'react';
import { Zap, AlertTriangle, Lightbulb, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { CopilotInsight } from '../types';

interface LeftSidebarProps {
  insights: CopilotInsight[];
  isLoading: boolean;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ insights, isLoading }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-amber-600" />;
      case 'opportunity': return <Lightbulb size={16} className="text-emerald-600" />;
      case 'question': return <HelpCircle size={16} className="text-blue-600" />;
      default: return <Zap size={16} className="text-purple-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'opportunity': return 'bg-emerald-50 border-emerald-100';
      case 'question': return 'bg-blue-50 border-blue-100';
      default: return 'bg-purple-50 border-purple-100';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-stone-200 flex flex-col h-[calc(100vh-64px)] overflow-hidden shrink-0 hidden lg:flex">
      <div className="p-4 border-b border-stone-100 bg-stone-50/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-800 flex items-center gap-2">
            <span className="text-xl">🧠</span> BW Copilot
          </h2>
          {isLoading && <Loader2 size={16} className="animate-spin text-blue-500" />}
        </div>
        <p className="text-xs text-stone-500 mt-1">Live intelligence engine active</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {insights.length === 0 && !isLoading && (
          <div className="text-center py-10 text-stone-400 text-sm">
            Enter details to generate insights...
          </div>
        )}

        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`p-4 rounded-xl border ${getBgColor(insight.type)} shadow-sm transition-all hover:shadow-md cursor-pointer animate-in slide-in-from-left-4 duration-500`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIcon(insight.type)}
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 opacity-80">{insight.type}</span>
              </div>
              <div className="text-xs font-mono text-stone-400">{insight.confidence}% Conf.</div>
            </div>
            
            <h3 className="font-semibold text-stone-800 text-sm mb-1 leading-snug">{insight.title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-3">{insight.content}</p>
            
            <div className="flex items-center text-xs text-blue-600 font-medium group">
              <span>Explore Module</span>
              <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}

        <div className="p-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 mt-8">
           <h4 className="text-xs font-semibold text-stone-500 mb-2 uppercase">Suggested Modules</h4>
           <div className="space-y-2">
             <div className="flex items-center gap-2 text-xs text-stone-700 bg-white p-2 rounded border border-stone-100 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Rocket Engine (LAI)
             </div>
             <div className="flex items-center gap-2 text-xs text-stone-700 bg-white p-2 rounded border border-stone-100 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Matchmaking
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Save, 
  Cpu, Users, Globe, Target, ShieldCheck, 
  Activity, BarChart3, Lock, Briefcase, 
  Layers, Settings, Terminal, Database, FileText
} from 'lucide-react';
import { 
  INITIAL_PARAMETERS, 
  COUNTRIES, 
  SECTORS_LIST,
  MANDATE_TYPES,
  PARTNERSHIP_ROLES,
  RISK_APPETITE_LEVELS,
  TIME_HORIZONS,
  AVAILABLE_AGENTS,
  AVAILABLE_MODELS_CATEGORIZED,
  MISSION_TYPES,
  OPERATING_MODELS,
  SUCCESS_METRICS
} from '../constants';
import { ReportParameters } from '../types';

interface SystemInterfaceProps {
  onClose: () => void;
}

const TABS = [
  { id: 'identity', label: 'Identity & Access', icon: Lock },
  { id: 'org', label: 'Organization Profile', icon: Briefcase },
  { id: 'strategy', label: 'Strategic Mission', icon: Target },
  { id: 'execution', label: 'Execution Parameters', icon: Layers },
  { id: 'engine', label: 'Nexus Engine Config', icon: Cpu },
  { id: 'output', label: 'Output Configuration', icon: FileText },
];

export const SystemInterface: React.FC<SystemInterfaceProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('identity');
  const [params, setParams] = useState<ReportParameters>(INITIAL_PARAMETERS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const updateParam = (key: keyof ReportParameters, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowReport(true);
    }, 3000);
  };

  // --- SECTIONS ---

  const renderIdentity = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">User Identity</label>
            <input 
                type="text" 
                value={params.userName}
                onChange={(e) => updateParam('userName', e.target.value)}
                className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
            />
        </div>
         <div className="space-y-2">
            <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Department / Unit</label>
            <input 
                type="text" 
                value={params.userDepartment}
                onChange={(e) => updateParam('userDepartment', e.target.value)}
                className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
            />
        </div>
         <div className="space-y-2">
            <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Clearance Level</label>
            <select 
                value={params.userTier}
                onChange={(e) => updateParam('userTier', e.target.value)}
                className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
            >
                <option>Tier 1 (Executive)</option>
                <option>Tier 2 (Strategic)</option>
                <option>Tier 3 (Operational)</option>
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Base Jurisdiction</label>
            <select 
                value={params.userCountry}
                onChange={(e) => updateParam('userCountry', e.target.value)}
                className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
            >
                <option value="Global">Global / Headquarters</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
      </div>

      <div className="bg-bw-light/5 p-6 border border-white/10 rounded-sm">
        <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
                <h4 className="text-white font-bold mb-1">Secure Environment Active</h4>
                <p className="text-sm text-gray-400">
                    Session is encrypted end-to-end. All inputs are processed within the specific sovereign data instance corresponding to your selected jurisdiction.
                </p>
            </div>
        </div>
      </div>
    </div>
  );

  const renderOrganization = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Organization Name</label>
            <input 
                type="text" 
                value={params.organizationName}
                onChange={(e) => updateParam('organizationName', e.target.value)}
                placeholder="Enter entity name..."
                className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
            />
        </div>
         <div className="space-y-2">
            <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Organization Type</label>
             <select 
                value={params.organizationType}
                onChange={(e) => updateParam('organizationType', e.target.value)}
                className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
            >
                <option>Private Enterprise</option>
                <option>Government / Public Sector</option>
                <option>Sovereign Wealth Fund</option>
                <option>NGO / Non-Profit</option>
            </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Primary Sector</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SECTORS_LIST.map(sector => (
                <button
                    key={sector}
                    onClick={() => updateParam('industry', [sector])}
                    className={`px-3 py-2 text-xs text-left border transition-all rounded-sm ${
                        params.industry.includes(sector)
                        ? 'bg-bw-gold text-bw-navy border-bw-gold font-bold'
                        : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                >
                    {sector}
                </button>
            ))}
        </div>
      </div>
    </div>
  );

  const renderStrategy = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
            <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Primary Strategic Mandate</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar border border-gray-800 p-2 rounded-sm">
                {MISSION_TYPES.map((type) => (
                    <button
                        key={type.value}
                        onClick={() => updateParam('strategicIntent', type.label)}
                        className={`text-left px-4 py-3 rounded-sm border transition-all text-sm ${
                            params.strategicIntent === type.label 
                            ? 'bg-bw-gold text-bw-navy border-bw-gold font-bold' 
                            : 'bg-black/20 border-gray-700 text-gray-300 hover:border-gray-500'
                        }`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Risk Appetite</label>
                <select 
                    value={params.riskTolerance}
                    onChange={(e) => updateParam('riskTolerance', e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
                >
                    {RISK_APPETITE_LEVELS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Time Horizon</label>
                <select 
                    value={params.analysisTimeframe}
                    onChange={(e) => updateParam('analysisTimeframe', e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
                >
                    {TIME_HORIZONS.map(t => <option key={t.value} value={t.label}>{t.label}</option>)}
                </select>
            </div>
        </div>
    </div>
  );

  const renderExecution = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Target Operating Model</label>
                <select 
                    className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
                >
                    {OPERATING_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
            </div>
             <div className="space-y-2">
                <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Key Success Metric</label>
                <select 
                    className="w-full bg-black/40 border border-gray-700 p-3 text-white focus:border-bw-gold focus:outline-none rounded-sm"
                >
                    {SUCCESS_METRICS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs text-bw-gold font-mono uppercase tracking-wider">Desired Partnership Role</label>
            <div className="grid grid-cols-2 gap-3">
                 {PARTNERSHIP_ROLES.slice(0, 8).map(role => (
                    <button
                        key={role}
                        className={`text-left px-3 py-2 text-xs border rounded-sm transition-colors ${
                            params.partnerCapabilities.includes(role) // Using this field loosely for UI demo
                            ? 'border-bw-gold text-bw-gold bg-bw-gold/10'
                            : 'border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                        onClick={() => {
                             // Toggle logic placeholder
                        }}
                    >
                        {role}
                    </button>
                 ))}
            </div>
        </div>
    </div>
  );

  const renderEngine = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h4 className="text-white font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-bw-gold" /> Active Agent Swarm
                </h4>
                <span className="text-xs text-green-400 font-mono">ALL SYSTEMS ONLINE</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_AGENTS.map((agent) => (
                    <button
                        key={agent}
                        onClick={() => {
                            const newAgents = params.selectedAgents.includes(agent)
                                ? params.selectedAgents.filter(a => a !== agent)
                                : [...params.selectedAgents, agent];
                            updateParam('selectedAgents', newAgents);
                        }}
                        className={`text-xs font-mono px-3 py-2 rounded-sm border transition-all flex items-center justify-between ${
                            params.selectedAgents.includes(agent)
                            ? 'bg-bw-navy border-bw-gold text-white shadow-[0_0_10px_rgba(180,155,103,0.2)]'
                            : 'bg-black/20 border-gray-800 text-gray-500'
                        }`}
                    >
                        {agent}
                        <div className={`w-1.5 h-1.5 rounded-full ${params.selectedAgents.includes(agent) ? 'bg-green-400 animate-pulse' : 'bg-gray-700'}`}></div>
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h4 className="text-white font-bold flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-bw-gold" /> Mathematical Engines
                </h4>
            </div>
            <div className="space-y-4">
                {Object.entries(AVAILABLE_MODELS_CATEGORIZED).map(([category, models]) => (
                    <div key={category}>
                        <h5 className="text-xs text-gray-500 uppercase font-bold mb-2">{category}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {models.map(model => (
                                <button
                                    key={model}
                                    onClick={() => {
                                         const newModels = params.selectedModels.includes(model)
                                            ? params.selectedModels.filter(m => m !== model)
                                            : [...params.selectedModels, model];
                                        updateParam('selectedModels', newModels);
                                    }}
                                    className={`text-left text-xs px-3 py-2 rounded-sm border transition-all ${
                                        params.selectedModels.includes(model)
                                        ? 'bg-bw-gold/10 border-bw-gold text-bw-gold'
                                        : 'bg-transparent border-gray-800 text-gray-500'
                                    }`}
                                >
                                    {model}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderOutput = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="p-6 bg-black/40 border border-gray-700 rounded-sm">
            <h3 className="text-xl font-serif font-bold text-white mb-6">Configuration Summary</h3>
            
            <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Subject</span>
                    <span className="text-white">{params.organizationName || 'Not Specified'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Mission</span>
                    <span className="text-bw-gold text-right">{params.strategicIntent}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Jurisdiction</span>
                    <span className="text-white">{params.userCountry}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Active Agents</span>
                    <span className="text-white">{params.selectedAgents.length}</span>
                </div>
                 <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Selected Engines</span>
                    <span className="text-white">{params.selectedModels.length}</span>
                </div>
            </div>

            <button 
                onClick={handleExecute}
                className="w-full mt-8 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)]"
            >
                <Terminal className="w-5 h-5" />
                INITIALIZE NEXUS CORE
            </button>
        </div>
    </div>
  );

  const renderReportContent = () => (
    <div className="h-full flex flex-col bg-slate-950">
         {/* Report Header */}
         <div className="border-b border-gray-800 bg-bw-navy p-6 flex justify-between items-center shadow-md z-10">
            <div>
                <div className="flex items-center gap-2 text-xs text-bw-gold font-mono mb-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>CONFIDENTIAL // EYE ONLY</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-white">Strategic Execution Dossier</h2>
            </div>
            <div className="text-right">
                <div className="text-xs text-gray-500 font-mono">GENERATED FOR</div>
                <div className="text-white font-bold">{params.organizationName}</div>
            </div>
         </div>

         {/* Report Body */}
         <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            
            {/* Executive Summary Block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-sm">
                    <h3 className="text-bw-gold font-mono text-sm uppercase mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Executive Synthesis
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg mb-4">
                        Nexus AI has analyzed {params.industry[0] || 'your sector'} vectors against the strategic intent of <span className="text-white font-bold">"{params.strategicIntent}"</span>.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Our probabilistic models indicate a <span className="text-green-400 font-bold">87.4% Viability Score</span> for execution within the {params.analysisTimeframe} timeframe, provided that {params.riskTolerance} risk mitigation protocols are strictly observed. The primary opportunity lies in structural arbitrage within the {params.userCountry} market.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="bg-bw-navy border border-gray-700 p-6 rounded-sm">
                        <div className="text-gray-500 text-xs font-mono mb-1">NEXUS VIABILITY SCORE™</div>
                        <div className="text-5xl font-bold text-white mb-2">87<span className="text-2xl text-bw-gold">.4</span></div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-[87%]"></div>
                        </div>
                    </div>
                    <div className="bg-bw-navy border border-gray-700 p-6 rounded-sm">
                         <div className="text-gray-500 text-xs font-mono mb-1">EST. ECONOMIC IMPACT</div>
                         <div className="text-3xl font-bold text-white">$42.8M</div>
                         <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                            <Activity className="w-3 h-3" /> +12% vs Sector Avg
                         </div>
                    </div>
                </div>
            </div>

            {/* Strategic Vectors */}
            <div>
                <h3 className="text-white font-serif text-xl font-bold mb-6">Strategic Alignment Vectors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Regulatory Friction', val: 'Low', color: 'text-green-400' },
                        { label: 'Market Depth', val: 'High', color: 'text-green-400' },
                        { label: 'Talent Density', val: 'Moderate', color: 'text-yellow-400' },
                        { label: 'Capital Efficiency', val: 'High', color: 'text-green-400' }
                    ].map((item, i) => (
                        <div key={i} className="bg-black/20 border border-gray-800 p-4 rounded-sm">
                            <div className="text-xs text-gray-500 uppercase mb-2">{item.label}</div>
                            <div className={`text-xl font-bold ${item.color}`}>{item.val}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Agent Logs (Faux Terminal) */}
            <div className="bg-black border border-gray-800 rounded-sm font-mono text-xs p-4">
                <div className="flex items-center gap-2 border-b border-gray-800 pb-2 mb-2">
                    <Terminal className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">AGENT SWARM LOGS</span>
                </div>
                <div className="space-y-1 text-gray-500">
                    <div><span className="text-blue-400">[SCOUT]</span> Ingested 14,200 data points from {params.userCountry} registry.</div>
                    <div><span className="text-purple-400">[DIPLOMAT]</span> Analyzed local policy framework "Vision 2030". Compatibility: 94%.</div>
                    <div><span className="text-orange-400">[RISK]</span> Stress-testing currency volatility scenarios... PASSED.</div>
                    <div><span className="text-green-400">[CORE]</span> Final report compiled. Hash: 8f4a2c91.</div>
                </div>
            </div>

         </div>

         {/* Footer Actions */}
         <div className="p-6 border-t border-gray-800 bg-bw-navy flex justify-between items-center">
            <button 
                onClick={() => setShowReport(false)}
                className="text-gray-400 hover:text-white flex items-center gap-2 text-sm"
            >
                <ChevronLeft className="w-4 h-4" /> Return to Config
            </button>
            <div className="flex gap-4">
                 <button className="bg-white text-bw-navy px-6 py-3 rounded-sm font-bold text-sm hover:bg-gray-200 shadow-lg">
                    Download Full PDF
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col font-sans"
    >
        {/* Main Loading State */}
        <AnimatePresence>
            {isProcessing && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/95 z-[110] flex flex-col items-center justify-center font-mono"
                >
                    <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-8">
                        <motion.div 
                            className="h-full bg-bw-gold"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                        />
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">ACCESSING NEXUS CORE</div>
                    <div className="text-green-400 text-sm animate-pulse">
                        Allocating Computational Resources...
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-2 text-xs text-gray-500">
                        <div>> IVAS™ Engine: <span className="text-white">Active</span></div>
                        <div>> SPI™ Engine: <span className="text-white">Active</span></div>
                        <div>> Latency: <span className="text-white">12ms</span></div>
                        <div>> Security: <span className="text-white">Encrypted</span></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {showReport ? renderReportContent() : (
            <>
                {/* Top Navigation Bar */}
                <div className="h-16 border-b border-gray-800 bg-bw-navy flex items-center justify-between px-6 shadow-md z-20">
                    <div className="flex items-center gap-4">
                        <Cpu className="w-6 h-6 text-bw-gold" />
                        <div>
                            <div className="font-serif font-bold text-lg tracking-wide leading-none">Nexus <span className="text-bw-gold">Design Studio</span></div>
                            <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-0.5">Intelligence Operating System v4.1</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-500">
                            <div className="flex items-center gap-1"><Globe className="w-3 h-3" /> NETWORK: GLOBAL</div>
                            <div className="flex items-center gap-1"><Activity className="w-3 h-3" /> LATENCY: 0.4s</div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-400 hover:text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-bw-navy border-r border-gray-800 flex-shrink-0 flex flex-col z-10">
                        <div className="p-6">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Configuration Modules</div>
                            <nav className="space-y-1">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-medium transition-all border-l-2 ${
                                            activeTab === tab.id 
                                            ? 'bg-bw-gold/10 border-bw-gold text-white' 
                                            : 'border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                        }`}
                                    >
                                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-bw-gold' : 'text-gray-500'}`} />
                                        <span className="uppercase tracking-wide text-xs">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="mt-auto p-6 border-t border-gray-800 bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bw-gold to-yellow-600 flex items-center justify-center font-bold text-bw-navy">
                                    {params.userName.charAt(0) || 'G'}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-sm font-bold text-white truncate">{params.userName}</div>
                                    <div className="text-xs text-gray-500 truncate">{params.userTier}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto bg-slate-950 p-8 md:p-12 relative">
                        {/* Background Grid */}
                        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <div className="mb-10">
                                <h1 className="text-3xl font-serif font-bold text-white mb-2">{TABS.find(t => t.id === activeTab)?.label}</h1>
                                <div className="h-1 w-20 bg-bw-gold"></div>
                            </div>

                            {activeTab === 'identity' && renderIdentity()}
                            {activeTab === 'org' && renderOrganization()}
                            {activeTab === 'strategy' && renderStrategy()}
                            {activeTab === 'execution' && renderExecution()}
                            {activeTab === 'engine' && renderEngine()}
                            {activeTab === 'output' && renderOutput()}
                        </div>
                    </div>
                </div>
            </>
        )}
    </motion.div>
  );
};
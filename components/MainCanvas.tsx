
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Users, Target, Globe, ShieldCheck, Zap, 
  Layout, FileText, CheckCircle2, ChevronRight, 
  ChevronLeft, Play, Settings, Database, 
  Briefcase, Clock, AlertTriangle, Layers,
  ArrowRight, Search, Plus, Trash2, MapPin,
  TrendingUp, BarChart3, Scale, Info, Building2, MousePointerClick, Flag, History, PenTool,
  Network, Cpu, MessageSquare, Mic, Share2, ListTodo, ToggleLeft, ToggleRight, CheckSquare, Square,
  BrainCircuit, HelpCircle, Mail, Loader2, DollarSign, Wallet, Crosshair, Lock, Fingerprint,
  FileCheck, ScrollText, Compass, Printer, Edit3, ClipboardList, AlertOctagon, Eye, Microscope,
  Server, Lightbulb, Terminal, BookOpen
} from 'lucide-react';
import { ReportParameters, ReportData, GenerationPhase, LiveOpportunityItem, ReportSection, NeuroSymbolicState, CopilotInsight } from '../types';
import { 
    ORGANIZATION_TYPES, 
    REGIONS_AND_COUNTRIES, 
    INDUSTRIES, 
    ORGANIZATION_SCALE_BANDS,
    GLOBAL_DEPARTMENTS,
    GLOBAL_STRATEGIC_INTENTS,
    GLOBAL_CAPITAL_SOURCES,
    SECTOR_THEMES,
    TARGET_COUNTERPART_TYPES,
    STRATEGIC_LENSES,
    INDUSTRY_NICHES
} from '../constants';

// Module Imports
import RocketEngineModule from './RocketEngineModule';
import MatchmakingEngine from './MatchmakingEngine';
import HistoricalContextComponent from './HistoricalContextComponent';
import { TemporalAnalysisComponent } from './TemporalAnalysisComponent';
import { LetterGeneratorModal } from './LetterGeneratorModal';
import { AnalysisModal } from './AnalysisModal';
import { AddOpportunityModal } from './AddOpportunityModal';
import { ComparativeAnalysis } from './ComparativeAnalysis';
import ScenarioSimulator from './ScenarioSimulator'; 
import CompetitorMap from './CompetitorMap'; 
import { INITIAL_CHECKLIST, INITIAL_FORMULAS, NeuroSymbolicEngine } from '../services/ruleEngine'; 
import MultiAgentOrchestrator from '../services/MultiAgentOrchestrator';

// Icons
import { RocketIcon, MatchMakerIcon, GlobeIcon, BarChart, ActivityIcon } from './Icons';

interface MainCanvasProps {
  params: ReportParameters;
  setParams: (params: ReportParameters) => void;
  reportData: ReportData;
  isGenerating: boolean;
  generationPhase: GenerationPhase;
  generationProgress: number;
  onGenerate: () => void;
  reports: ReportParameters[];
  onOpenReport: (report: ReportParameters) => void;
  onDeleteReport: (id: string) => void;
  onNewAnalysis: () => void;
  onCopilotMessage?: (msg: CopilotInsight) => void;
}

const SelectOrInput = ({ label, value, options, onChange, placeholder = "Enter custom value...", fallbackList = [] }: any) => {
    const effectiveOptions = options.length > 0 ? options : fallbackList.map((s: string) => ({ value: s, label: s }));
    const [isCustomMode, setIsCustomMode] = useState(false);
    return (
        <div className="mb-1">
            <div className="flex justify-between items-end mb-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">{label}</label>
                <button onClick={() => setIsCustomMode(!isCustomMode)} className="text-[10px] text-blue-600 font-bold hover:underline">{isCustomMode ? "Select List" : "Manual Input"}</button>
            </div>
            {isCustomMode ? (
                <input className="w-full p-3 bg-white border border-stone-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-stone-800" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
            ) : (
                <select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-stone-800" value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="">Select Option...</option>
                    {effectiveOptions.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            )}
        </div>
    );
};

const MultiSelectWithSearch = ({ label, selectedValues, options, onChange, placeholder }: any) => {
    return (
        <div className="mb-4">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 block">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedValues.map((val: string) => (
                    <span key={val} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-red-100 hover:text-red-800" onClick={() => onChange(selectedValues.filter((v: string) => v !== val))}>{val} ×</span>
                ))}
            </div>
            <select className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs" onChange={(e) => { if (e.target.value && !selectedValues.includes(e.target.value)) onChange([...selectedValues, e.target.value]); }}>
                <option value="">{placeholder}</option>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
};

const NavButtons = ({ step, setStep, canNext, finalAction }: any) => (
    <div className="mt-12 pt-8 border-t border-stone-200 flex justify-between items-center w-full pb-8">
        <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-6 py-3 rounded-lg text-stone-600 font-bold hover:bg-stone-100 disabled:opacity-30 flex items-center gap-2 transition-all"><ChevronLeft size={16} /> Back</button>
        {step < 5 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext} className="px-8 py-3 bg-stone-900 text-white font-bold rounded-lg hover:bg-black disabled:opacity-50 flex items-center gap-2 shadow-lg transition-all">Next Step <ArrowRight size={16} /></button>
        ) : (
            <button onClick={finalAction} className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-1"><Fingerprint size={20} /> Authorize & Execute</button>
        )}
    </div>
);

const LoadingOverlay = ({ phase, progress }: { phase: string, progress: number }) => (
    <div className="absolute inset-0 bg-stone-50 z-50 flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 relative mb-8">
            <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-stone-900 rounded-full animate-spin"></div>
            <Cpu className="absolute inset-0 m-auto text-stone-900 w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-2 animate-pulse">Initializing Nexus Core</h3>
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest mb-8">Phase: <span className="text-blue-600 font-bold">{phase.replace('_', ' ')}</span></p>
        <div className="w-96 h-2 bg-stone-200 rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out" style={{width: `${progress}%`}}></div></div>
        <div className="text-xs text-stone-400 font-mono">
            {progress < 30 && "Ingesting strategic vectors..."}
            {progress >= 30 && progress < 60 && "Running agent swarm simulations..."}
            {progress >= 60 && progress < 90 && "Calculating failure probabilities..."}
            {progress >= 90 && "Finalizing intelligence dossier..."}
        </div>
    </div>
);

const MainCanvas: React.FC<MainCanvasProps> = ({ 
    params, setParams, reportData, isGenerating, generationPhase, generationProgress, onGenerate,
    reports, onOpenReport, onDeleteReport, onNewAnalysis, onCopilotMessage
}) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
    const [orchestratorResults, setOrchestratorResults] = useState<any>(null);
    const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [isComparativeModalOpen, setIsComparativeModalOpen] = useState(false);
    const [resultTab, setResultTab] = useState<'dossier' | 'simulation' | 'market'>('dossier');
    
    // Collaborative State
    const [activeRisk, setActiveRisk] = useState<string | null>(null);
    const [riskAnalysisText, setRiskAnalysisText] = useState<string>('');
    const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
    const [customRiskInput, setCustomRiskInput] = useState('');
    const [customRisks, setCustomRisks] = useState<{id: string, label: string}[]>([]);

    // Scroll Container Ref
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // "Confidential Briefing" State
    const [briefingSigned, setBriefingSigned] = useState(false);
    const [systemThinkingLog, setSystemThinkingLog] = useState<string[]>([]);

    const [neuroState, setNeuroState] = useState<NeuroSymbolicState>({
        checklist: INITIAL_CHECKLIST,
        formulas: INITIAL_FORMULAS,
        variableStore: {}
    });

    // Auto-scroll to top when step changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [step]);

    useEffect(() => {
        const newState = NeuroSymbolicEngine.validateGatekeeper(params, neuroState);
        setNeuroState(newState);
        if(JSON.stringify(newState) !== JSON.stringify(params.neuroSymbolicState)) {
            setParams({...params, neuroSymbolicState: newState});
        }
    }, [params.organizationName, params.country, params.industry, params.strategicIntent, params.revenueBand]); 

    useEffect(() => {
        if (generationPhase === 'complete' && step !== 6) {
            setStep(6);
        }
    }, [generationPhase]);

    // REACTIVE LISTENER: WATCH NOTES FOR MODULE ACTIVATION (Step 4 Logic)
    useEffect(() => {
        if (params.collaborativeNotes && params.collaborativeNotes.length > 5) {
            const note = params.collaborativeNotes.toLowerCase();
            let newModule = '';
            
            if (note.includes("risk") || note.includes("safe") || note.includes("protect")) {
                if (!params.selectedModules.includes('Risk Shield')) newModule = 'Risk Shield';
            }
            if (note.includes("money") || note.includes("finance") || note.includes("capital")) {
                if (!params.selectedModules.includes('Financial Modeling')) newModule = 'Financial Modeling';
            }
            if (note.includes("partner") || note.includes("jv") || note.includes("match")) {
                if (!params.selectedModules.includes('Symbiotic Matchmaking')) newModule = 'Symbiotic Matchmaking';
            }
            if (note.includes("supply") || note.includes("chain") || note.includes("logistics")) {
                if (!params.selectedModules.includes('Trade Simulator')) newModule = 'Trade Simulator';
            }

            if (newModule) {
                setParams(prev => ({ ...prev, selectedModules: [...prev.selectedModules, newModule] }));
                addToLog(`>> SYSTEM REACTION: Activating '${newModule}' based on note content.`);
            }
        }
    }, [params.collaborativeNotes]);

    const addToLog = (msg: string) => {
        setSystemThinkingLog(prev => [...prev.slice(-4), msg]); // Keep last 5
    };

    const handleParamChange = (key: keyof ReportParameters, value: any) => {
        setParams({ ...params, [key]: value });
    };

    const toggleArrayParam = (key: keyof ReportParameters, value: string) => {
        const current = (params[key] as string[]) || [];
        const updated = current.includes(value) 
            ? current.filter(item => item !== value)
            : [...current, value];
        setParams({ ...params, [key]: updated });
    };

    const addCustomRisk = () => {
        if (!customRiskInput.trim()) return;
        const newId = `custom_${Date.now()}`;
        setCustomRisks([...customRisks, { id: newId, label: customRiskInput }]);
        const current = params.partnershipSupportNeeds || [];
        handleParamChange('partnershipSupportNeeds', [...current, customRiskInput]);
        setCustomRiskInput('');
    };

    const handleGenerateReportWithOrchestrator = async () => {
        if (!briefingSigned) {
            alert("You must verify the Mission Profile by checking the 'Authorize' box before the system can release the final dossier.");
            return;
        }
        onGenerate(); 
        try {
            const results = await MultiAgentOrchestrator.synthesizeAnalysis({
                organizationProfile: params,
                query: params.problemStatement || "General Strategic Analysis",
                dataScope: 'comprehensive',
                includeCustomData: false
            });
            setOrchestratorResults(results);
        } catch (error) {
            console.error("Orchestration failed:", error);
        }
    };

    const calculateReadiness = () => {
        if (!params.organizationName || !params.country) return 0;
        let score = 10; 
        if (params.organizationType) score += 5;
        if (params.industry.length > 0) score += 10;
        if (params.problemStatement && params.problemStatement.length > 10) score += 15;
        if (params.strategicIntent.length > 0) score += 15;
        if (params.revenueBand) score += 5;
        if (params.riskTolerance) score += 5;
        if (params.partnershipSupportNeeds && params.partnershipSupportNeeds.length > 0) score += 10;
        if (params.selectedModules && params.selectedModules.length > 0) score += 25; 
        
        return Math.min(100, score);
    };

    // --- STEP RENDERING ---

    const renderStep1_Profile = () => {
        const currentSector = params.industry[0] || 'Default';
        const sectorTheme = SECTOR_THEMES[currentSector] || SECTOR_THEMES['Default'];
        const departmentOptionsRaw = GLOBAL_DEPARTMENTS;
        const departmentOptions = departmentOptionsRaw.map(d => ({ value: d, label: d }));

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm">
                        <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold text-stone-900">Organization DNA</h3>
                        <p className="text-sm text-stone-500">Comprehensive entity profiling for accurate modelling.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <div className="mb-6 border-b border-orange-200 pb-2">
                            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Corporate Identity</h4>
                            <p className="text-xs text-stone-500">Establish the legal and industrial baseline of the subject entity.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <SelectOrInput label="Legal Entity Structure" value={params.organizationType} options={ORGANIZATION_TYPES.map(t => ({ value: t, label: t }))} onChange={(val: string) => handleParamChange('organizationType', val)} placeholder="e.g. Special Purpose Vehicle (SPV)" fallbackList={ORGANIZATION_TYPES} />
                                <SelectOrInput label="Primary Industry Sector" value={params.industry[0] || ''} options={INDUSTRIES.map(i => ({ value: i.title, label: i.title }))} onChange={(val: string) => handleParamChange('industry', [val])} placeholder="e.g. Renewable Energy" fallbackList={INDUSTRIES.map(i => i.title)} />
                            </div>
                            <div className="space-y-4">
                                <div><label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Organization Name</label><input className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-stone-900 outline-none placeholder-stone-400" value={params.organizationName} onChange={(e) => handleParamChange('organizationName', e.target.value)} placeholder="e.g. Acme Global Industries" /></div>
                                <div><label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Headquarters Location</label><input className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:bg-white outline-none placeholder-stone-400" value={params.organizationAddress || ''} onChange={(e) => handleParamChange('organizationAddress', e.target.value)} placeholder="e.g. 123 Strategic Ave, London" /></div>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl border shadow-sm transition-colors duration-500 ${sectorTheme.bg} ${sectorTheme.border}`}>
                        <div className="mb-6 border-b border-orange-200 pb-2 flex justify-between items-start">
                            <div>
                                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Operational Context & User Role</h4>
                                <p className="text-xs text-stone-500">Define the scale of operations and the user's authority level.</p>
                            </div>
                            <span className="text-xl text-stone-400">{sectorTheme.icon}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <h5 className={`text-sm font-bold ${sectorTheme.text} border-l-2 border-stone-300 pl-2`}>Organizational Scale</h5>
                                <SelectOrInput label="Annual Revenue Band" value={params.revenueBand || ''} options={ORGANIZATION_SCALE_BANDS.revenue} onChange={(val: string) => handleParamChange('revenueBand', val)} placeholder="e.g. $2.5M USD" fallbackList={ORGANIZATION_SCALE_BANDS.revenue.map(r => r.label)} />
                                <SelectOrInput label="Global Headcount" value={params.headcountBand || ''} options={ORGANIZATION_SCALE_BANDS.headcount} onChange={(val: string) => handleParamChange('headcountBand', val)} placeholder="e.g. 15 FTEs" fallbackList={ORGANIZATION_SCALE_BANDS.headcount.map(h => h.label)} />
                            </div>
                            <div className="space-y-5">
                                <h5 className={`text-sm font-bold ${sectorTheme.text} border-l-2 border-stone-300 pl-2`}>Your Role Context</h5>
                                <div><label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Your Name</label><input className="w-full p-3 bg-white border border-stone-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-stone-900 placeholder-stone-400" value={params.userName} onChange={e => handleParamChange('userName', e.target.value)} placeholder="e.g. John Doe" /></div>
                                <SelectOrInput label="Department / Functional Unit" value={params.userDepartment} options={departmentOptions} onChange={(val: string) => handleParamChange('userDepartment', val)} placeholder="e.g. Strategic Planning Division" fallbackList={GLOBAL_DEPARTMENTS} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep2_Mandate = () => {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm"><Target className="w-6 h-6 text-red-600" /></div>
                    <div><h3 className="text-xl font-serif font-bold text-stone-900">Strategic Mandate</h3><p className="text-sm text-stone-500">Define mission vectors, narrative context, and success metrics.</p></div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
                    <div className="border-b border-orange-200 pb-2">
                        <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Multi-Vector Scoping</h4>
                        <p className="text-xs text-stone-500">Target multiple jurisdictions or sectors simultaneously for complex analysis.</p>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Primary Vector */}
                        <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                            <h5 className="text-xs font-bold text-stone-700 mb-3 flex items-center gap-2">
                                <span className="bg-stone-800 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">1</span>
                                Primary Strategic Vector
                            </h5>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-stone-500 block mb-1 uppercase">Target Region</label><select className="w-full p-2 bg-white border border-stone-200 rounded text-sm" value={params.region} onChange={(e) => handleParamChange('region', e.target.value)}><option value="">Select Region...</option>{REGIONS_AND_COUNTRIES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select></div>
                                <div><label className="text-xs font-bold text-stone-500 block mb-1 uppercase">Specific Country</label><select className="w-full p-2 bg-white border border-stone-200 rounded text-sm" value={params.country} onChange={(e) => handleParamChange('country', e.target.value)}><option value="">Select Country...</option>{REGIONS_AND_COUNTRIES.find(r => r.name === params.region)?.countries.map(c => (<option key={c} value={c}>{c}</option>)) || <option disabled>Select Region First</option>}</select></div>
                            </div>
                        </div>

                        {/* Secondary Vectors (Visual Placeholder for now) */}
                        <div className="p-4 bg-white border border-dashed border-stone-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-stone-50 transition-colors">
                            <Plus className="w-4 h-4 text-stone-400" />
                            <span className="text-sm font-bold text-stone-500">Add Secondary Vector (e.g. Logistics Hub)</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100">
                        <MultiSelectWithSearch label="Core Strategic Intent" options={GLOBAL_STRATEGIC_INTENTS} selectedValues={Array.isArray(params.strategicIntent) ? params.strategicIntent : [params.strategicIntent].filter(Boolean)} onChange={(values: string[]) => handleParamChange('strategicIntent', values)} placeholder="Select Mission Vectors..." />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
                    <div className="border-b border-orange-200 pb-2">
                        <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Strategic Context & Guardrails</h4>
                        <p className="text-xs text-stone-500">Provide the narrative logic and specific constraints for the AI.</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Problem Statement / Mission Context</label>
                            <textarea className="w-full p-4 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none resize-none focus:bg-white focus:ring-2 focus:ring-stone-900 transition-all placeholder-stone-400" rows={3} value={params.problemStatement} onChange={(e) => handleParamChange('problemStatement', e.target.value)} placeholder="Describe the specific challenge or opportunity driving this mandate..." />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep3_Calibration = () => {
        const allRisks = [...TARGET_COUNTERPART_TYPES, ...customRisks.map(r => r.label)]; 

        return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 mb-20">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm">
                    <Scale className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">Operational Mechanics</h3>
                    <p className="text-sm text-stone-500">Fine-tune the logic engine, risk vectors, and financial chassis.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* COLUMN 1: FINANCIAL & LOGIC */}
                <div className="space-y-8">
                    {/* Neuro-Symbolic Logic Card */}
                    <div className="bg-purple-900 text-white p-6 rounded-xl shadow-lg border border-purple-800 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold text-xs uppercase tracking-widest">
                                <BrainCircuit className="w-4 h-4" /> Neuro-Symbolic Logic Studio
                            </div>
                            <h4 className="text-lg font-bold mb-2">Override Standard AI Scoring?</h4>
                            <p className="text-purple-200 text-sm mb-4">
                                Define strict "Go/No-Go" logic (e.g., "If Debt/EBITDA > 3x, then REJECT"). Useful for compliance covenants.
                            </p>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white text-purple-900 font-bold text-xs rounded hover:bg-purple-50 transition-colors flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Consult Copilot to Configure
                                </button>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="logic-active" className="rounded text-purple-600 focus:ring-0" />
                                    <label htmlFor="logic-active" className="text-xs text-purple-200">Activate Logic Gatekeeper</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Capital Structure */}
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-5">
                        <div className="border-b border-orange-200 pb-2">
                            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Capital Structure & Funding
                            </h4>
                            <p className="text-xs text-stone-500">Define financial boundaries and funding sources.</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Budget Cap</label>
                                    <input 
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none placeholder-stone-400 font-mono"
                                        placeholder="$50M USD"
                                        value={params.calibration?.constraints?.budgetCap || ''}
                                        onChange={(e) => setParams({
                                            ...params,
                                            calibration: { ...params.calibration, constraints: { ...params.calibration?.constraints, budgetCap: e.target.value } }
                                        })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Primary Source</label>
                                    <SelectOrInput label="" value={params.fundingSource || ''} options={GLOBAL_CAPITAL_SOURCES.map(s => ({value: s, label: s}))} onChange={(val: string) => handleParamChange('fundingSource', val)} placeholder="E.g. Debt Financing" fallbackList={GLOBAL_CAPITAL_SOURCES} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: RISK & SENSITIVITY */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-full flex flex-col">
                        <div className="border-b border-orange-200 pb-2 mb-4">
                            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Risk Horizon & Sensitivities
                            </h4>
                            <p className="text-xs text-stone-500">Address specific regional concerns and calibrate risk models.</p>
                        </div>

                        {/* Risk Monitors Grid */}
                        <div className="flex-1">
                            <label className="text-xs font-bold text-stone-700 block mb-3 uppercase tracking-wide">Add Custom Risk Vectors</label>
                            <div className="mb-4 flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={customRiskInput}
                                    onChange={(e) => setCustomRiskInput(e.target.value)}
                                    placeholder="Add Custom Risk Vector..."
                                    className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded text-xs focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                                <button 
                                    onClick={addCustomRisk}
                                    disabled={!customRiskInput.trim()}
                                    className="px-3 py-2 bg-stone-800 text-white rounded text-xs font-bold hover:bg-black transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {params.partnershipSupportNeeds?.map((risk, i) => (
                                    <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-bold flex items-center gap-2">
                                        {risk} <button onClick={() => toggleArrayParam('partnershipSupportNeeds', risk)} className="hover:text-red-900">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )};

    // STEP 4: THE COLLABORATIVE WORKBENCH
    const renderStep4_Architecture = () => {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm"><Cpu className="w-6 h-6 text-purple-600" /></div>
                    <div><h3 className="text-xl font-serif font-bold text-stone-900">Neural Workbench</h3><p className="text-sm text-stone-500">Collaborative Interface: Configure modules via discussion or manual selection.</p></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
                    
                    {/* LEFT: THE SYSTEM BRAIN (Active Modules) */}
                    <div className="bg-stone-900 text-white p-6 rounded-xl shadow-lg border border-stone-800 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Cpu size={120} /></div>
                        
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-700">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-purple-400" /> Active Neural Modules
                            </h4>
                            <span className="text-xs font-mono text-stone-400">{params.selectedModules.length} Active</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {params.selectedModules.length === 0 ? (
                                <div className="text-center py-12 text-stone-600 text-sm italic">
                                    System Standby. Add notes to auto-provision modules.
                                </div>
                            ) : (
                                params.selectedModules.map((mod, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg animate-in slide-in-from-left-2">
                                        <span className="text-sm font-bold text-stone-200">{mod}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            <span className="text-[10px] font-mono text-green-400">RUNNING</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* System Log */}
                        <div className="mt-4 pt-4 border-t border-stone-800">
                            <div className="text-[10px] font-mono text-stone-500 mb-2 uppercase tracking-widest">System Logic Stream</div>
                            <div className="h-24 overflow-y-auto custom-scrollbar text-xs font-mono text-green-400 space-y-1">
                                {systemThinkingLog.map((log, i) => (
                                    <div key={i} className="opacity-80">
                                        <span className="text-stone-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                        {log}
                                    </div>
                                ))}
                                <div className="animate-pulse">_</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: THE COLLABORATIVE SCRATCHPAD */}
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
                            <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                                <Edit3 className="w-4 h-4 text-blue-600" /> Collaborative Scratchpad
                            </h4>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                                AI Listening
                            </span>
                        </div>
                        
                        <div className="flex-1 relative">
                            <textarea 
                                className="w-full h-full p-6 resize-none outline-none text-sm text-stone-700 leading-relaxed placeholder:text-stone-300 font-medium"
                                placeholder="Type your unstructured thoughts here (e.g., 'I am worried about currency risk in Vietnam'). The system will automatically interpret your concerns and activate the relevant analysis modules on the left..."
                                value={params.collaborativeNotes}
                                onChange={(e) => handleParamChange('collaborativeNotes', e.target.value)}
                            />
                            
                            {/* Real-time signals injection */}
                            <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end pointer-events-none">
                                {params.country && (
                                    <div className="bg-stone-900/90 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                                        <Globe className="w-3 h-3 inline mr-1 text-blue-400" />
                                        Live Feed: {params.country} Inflation stable at 3.2%
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    // STEP 5: OUTPUT ARCHITECT (New Location for Config)
    const renderStep5_Output = () => {
        const readiness = calculateReadiness();
        
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm"><Lock className="w-6 h-6 text-stone-700" /></div>
                    <div><h3 className="text-xl font-serif font-bold text-stone-900">Output Architect & Validation</h3><p className="text-sm text-stone-500">Configure final deliverables and authorize generation.</p></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* LEFT: CONFIGURATION */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                            <div className="border-b border-orange-200 pb-2 mb-4">
                                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Report Structure
                                </h4>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-stone-700 block mb-2 uppercase">Depth & Format</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button onClick={() => handleParamChange('reportLength', 'summary')} className={`p-3 rounded-lg border text-left flex items-center justify-between ${params.reportLength === 'summary' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-stone-200 hover:border-stone-300'}`}>
                                            <div><div className="font-bold text-sm text-stone-900">Flash Brief</div><div className="text-xs text-stone-500">3 Pages • Executive High-Level</div></div>
                                            <Zap className="w-4 h-4 text-orange-500" />
                                        </button>
                                        <button onClick={() => handleParamChange('reportLength', 'standard')} className={`p-3 rounded-lg border text-left flex items-center justify-between ${params.reportLength === 'standard' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-stone-200 hover:border-stone-300'}`}>
                                            <div><div className="font-bold text-sm text-stone-900">Standard Dossier</div><div className="text-xs text-stone-500">15 Pages • Comprehensive Logic</div></div>
                                            <FileText className="w-4 h-4 text-blue-500" />
                                        </button>
                                        <button onClick={() => handleParamChange('reportLength', 'comprehensive')} className={`p-3 rounded-lg border text-left flex items-center justify-between ${params.reportLength === 'comprehensive' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-stone-200 hover:border-stone-300'}`}>
                                            <div><div className="font-bold text-sm text-stone-900">Deep Dive</div><div className="text-xs text-stone-500">50+ Pages • Full Due Diligence</div></div>
                                            <Layers className="w-4 h-4 text-purple-500" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-stone-700 block mb-2 uppercase">Series Configuration</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 p-3 border border-stone-200 rounded-lg w-full cursor-pointer hover:bg-stone-50">
                                            <input type="radio" name="series" defaultChecked className="text-stone-900 focus:ring-stone-900" />
                                            <span className="text-sm font-bold text-stone-700">Single Integrated File</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 border border-stone-200 rounded-lg w-full cursor-pointer hover:bg-stone-50">
                                            <input type="radio" name="series" className="text-stone-900 focus:ring-stone-900" />
                                            <span className="text-sm font-bold text-stone-700">3-Part Series (Strat/Ops/Fin)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Historical Feasibility Pre-Check */}
                        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                                <History className="w-4 h-4" /> Historical Feasibility Pre-Check
                            </h4>
                            <HistoricalContextComponent params={params} />
                        </div>
                    </div>

                    {/* RIGHT: AUTHORIZATION */}
                    <div className="space-y-6">
                        <div className="bg-stone-900 text-white p-6 rounded-xl border border-stone-700 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Cpu size={80} />
                            </div>
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 border-b border-stone-700 pb-2">Intelligence Grid Status</h4>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-stone-400">Active Engines</span>
                                    <span className="font-mono text-green-400">{params.selectedModules?.length || 0} Online</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-stone-400">Agent Swarm</span>
                                    <span className="font-mono text-green-400">{params.selectedAgents?.length || 0} Deployed</span>
                                </div>
                            </div>

                            {/* Readiness Gauge */}
                            <div className="text-center pt-4 border-t border-stone-700">
                                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">Mission Readiness Score</p>
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-stone-800" />
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * readiness) / 100} className={`${readiness > 80 ? 'text-green-500' : readiness > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`} />
                                    </svg>
                                    <span className="absolute text-2xl font-black">{readiness}%</span>
                                </div>
                                <p className="text-xs text-stone-400 mt-2 italic">
                                    {readiness > 80 ? "Systems optimal for generation." : "Review required before proceeding."}
                                </p>
                            </div>
                        </div>

                        {/* 4. Authorization */}
                        <div className="bg-white p-6 rounded-xl border-2 border-stone-200 shadow-sm flex flex-col justify-center">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Command Authorization</h4>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <input 
                                    type="checkbox" 
                                    id="sign-off" 
                                    checked={briefingSigned} 
                                    onChange={(e) => setBriefingSigned(e.target.checked)}
                                    className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer" 
                                />
                                <label htmlFor="sign-off" className="text-sm font-bold text-stone-700 cursor-pointer select-none">
                                    I verify this mission profile is accurate.
                                </label>
                            </div>
                            
                            {briefingSigned && (
                                <div className="text-xs text-green-600 font-bold flex items-center gap-1 animate-in fade-in bg-green-50 p-2 rounded border border-green-100 mb-2">
                                    <CheckCircle2 size={14} /> Profile Locked & Signed
                                </div>
                            )}
                            
                            <p className="text-[10px] text-stone-400 leading-tight">
                                By signing off, you authorize the Nexus AI to utilize the selected engines and agents to generate the final classified dossier.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep6_Synthesis = () => (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 md:p-12 relative">
            {isGenerating && generationPhase !== 'complete' ? (
                <LoadingOverlay phase={generationPhase} progress={generationProgress} />
            ) : (
                <div className="w-full max-w-6xl text-left h-full flex flex-col animate-in fade-in duration-700">
                    <div className="flex justify-between items-end border-b border-stone-200 pb-2 mb-6 shrink-0">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-green-100"><CheckCircle2 size={14} /> Intelligence Ready</div>
                            <h1 className="text-3xl font-serif font-bold text-stone-900">Strategic Intelligence Hub</h1>
                            <p className="text-stone-500 mt-1">Prepared for {params.organizationName} targeting {params.country}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setResultTab('dossier')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${resultTab === 'dossier' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>Executive Dossier</button>
                            <button onClick={() => setResultTab('simulation')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${resultTab === 'simulation' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>Strategic Simulation</button>
                            <button onClick={() => setResultTab('market')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${resultTab === 'market' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>Competitive Landscape</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-20">
                        {resultTab === 'dossier' && (
                            <div className="space-y-8 animate-in fade-in">
                                <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm flex justify-between items-center sticky top-0 z-10">
                                    <div className="text-sm text-stone-600"><strong>Actions:</strong></div>
                                    <div className="flex gap-3">
                                        <button onClick={() => window.print()} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs transition-colors">Download PDF</button>
                                        <button onClick={() => setIsLetterModalOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm">
                                            <Mail size={14} /> Draft Strategic Outreach
                                        </button>
                                        <button onClick={() => setIsComparativeModalOpen(true)} className="px-4 py-2 bg-purple-50 text-purple-900 border border-purple-200 font-bold rounded-lg text-xs hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"><Scale size={14} /> Compare</button>
                                    </div>
                                </div>
                                {orchestratorResults && (
                                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2"><BrainCircuit className="w-5 h-5" /> Nexus Agent Synthesis</h3>
                                        <p className="text-sm text-indigo-800 italic mb-4">{orchestratorResults.synthesis.primaryInsight}</p>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div className="bg-white p-3 rounded border border-indigo-100"><span className="font-bold text-indigo-700 block mb-1">Recommended Next Steps</span><ul className="list-disc pl-4 text-stone-600 space-y-1">{orchestratorResults.synthesis.recommendedNextSteps.map((step: string, i: number) => (<li key={i}>{step}</li>))}</ul></div>
                                            <div className="bg-white p-3 rounded border border-indigo-100"><span className="font-bold text-indigo-700 block mb-1">Data Gaps Identified</span><ul className="list-disc pl-4 text-stone-600 space-y-1">{orchestratorResults.synthesis.dataGaps.map((gap: string, i: number) => (<li key={i}>{gap}</li>))}</ul></div>
                                        </div>
                                    </div>
                                )}
                                {/* Auto-injected modules based on logic */}
                                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"><div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-stone-800 flex items-center gap-2"><RocketIcon className="w-5 h-5 text-orange-500" /> Nexus Rocket Engine Results</div><RocketEngineModule params={params} /></div>
                                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"><div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-stone-800 flex items-center gap-2"><MatchMakerIcon className="w-5 h-5 text-blue-500" /> Strategic Partners</div><div className="p-6"><MatchmakingEngine params={params} autoRun={true} /></div></div>
                                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"><div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-stone-800 flex items-center gap-2"><History className="w-5 h-5 text-stone-600" /> Historical Context Engine</div><div className="p-6"><HistoricalContextComponent params={params} /></div></div>
                                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"><div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-stone-800 flex items-center gap-2"><Clock className="w-5 h-5 text-cyan-600" /> Temporal Phase Analysis</div><div className="p-6"><TemporalAnalysisComponent params={params} /></div></div>
                            </div>
                        )}
                        {resultTab === 'simulation' && (<div className="h-[600px] animate-in slide-in-from-right-4"><ScenarioSimulator /></div>)}
                        {resultTab === 'market' && (<div className="h-[600px] animate-in slide-in-from-right-4"><CompetitorMap clientName={params.organizationName} /></div>)}
                    </div>
                </div>
            )}
        </div>
    );

    const CollaborativeCanvas = () => {
        // Calculate dynamic readiness score based on filled fields
        const readiness = calculateReadiness();
        
        let statusText = "Initializing...";
        let refText = "UNREGISTERED";
        
        if (readiness === 0) statusText = "Awaiting Core Inputs";
        else if (readiness < 40) statusText = "Mapping Strategic Intent";
        else if (readiness < 70) {
            statusText = "Calibrating Risk Models";
            refText = params.id || "PENDING";
        } else {
            statusText = "Ready for Computation";
            refText = params.id || "READY";
        }

        return (
            <div className="h-full flex flex-col bg-stone-50 p-6 overflow-y-auto font-sans">
                
                {/* 1. Header & Status */}
                <div className="bg-white rounded-xl shadow-md border border-stone-200 p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${readiness > 60 ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Collaborative Mission Profile</span>
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-stone-900 leading-tight">
                                {params.reportName || params.organizationName || "Untitled Mission"}
                            </h2>
                            <p className="text-xs font-mono text-stone-500 mt-1 uppercase">
                                STATUS: <span className="text-blue-600 font-bold">{statusText}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-stone-200 transition-all duration-500">{readiness}%</div>
                            <div className="text-[9px] font-bold text-stone-400 uppercase">Mission Readiness</div>
                        </div>
                    </div>
                    
                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-3 gap-4 border-t border-stone-100 pt-4">
                        <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Entity</span>
                            <span className="text-sm font-bold text-stone-800">{params.organizationName || '---'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Jurisdiction</span>
                            <span className="text-sm font-bold text-stone-800">{params.country || '---'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Complexity</span>
                            <span className="text-sm font-bold text-stone-800 capitalize">{params.reportComplexity || 'Standard'}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Collaborative Strategic Notepad */}
                <div className="bg-white rounded-xl shadow-md border border-stone-200 p-0 flex flex-col flex-grow mb-6 overflow-hidden">
                    <div className="p-4 border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white flex justify-between items-center">
                        <h3 className="font-bold text-stone-800 flex items-center gap-2 text-sm">
                            <BrainCircuit className="w-4 h-4 text-purple-600" /> 
                            Collaborative Strategy Notepad
                        </h3>
                        <span className="text-[10px] text-stone-400 font-mono uppercase">AI LISTENING ACTIVE</span>
                    </div>
                    
                    <div className="flex-grow p-4 relative">
                        <textarea 
                            className="w-full h-full min-h-[200px] resize-none outline-none text-sm text-stone-700 leading-relaxed placeholder-stone-300 font-medium"
                            placeholder="Type unstructured thoughts, concerns, or specific directives here. The AI Copilot will read this in real-time to adjust system parameters and risk models..."
                            value={params.collaborativeNotes}
                            onChange={(e) => handleParamChange('collaborativeNotes', e.target.value)}
                        />
                        {/* Simulated AI Reaction Bubble */}
                        {params.collaborativeNotes && params.collaborativeNotes.length > 10 && (
                            <div className="absolute bottom-4 right-4 bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-lg shadow-lg text-xs max-w-xs animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 mb-1 font-bold">
                                    <MessageSquare className="w-3 h-3" /> Copilot Reaction
                                </div>
                                Analyzing note... Updating module selection logic to align with new input.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. System Logic Path (Reactive Log) */}
                <div className="bg-stone-900 rounded-xl p-5 border border-stone-700 animate-in fade-in shadow-lg">
                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-stone-800 pb-1">
                        <Terminal className="w-4 h-4" /> System Logic Path
                    </h4>
                    <div className="space-y-2 text-xs font-mono text-stone-400 h-32 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2">
                            <span className="text-stone-600">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                            <span>System Initialized. Listening to Collaborative Notepad...</span>
                        </div>
                        {systemThinkingLog.map((log, i) => (
                            <div key={i} className="flex items-center gap-2 animate-in slide-in-from-left-2">
                                <span className="text-stone-600">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                                <span className="text-purple-400">{log}</span>
                            </div>
                        ))}
                        <div className="animate-pulse text-green-500 font-bold">_</div>
                    </div>
                </div>

            </div>
        );
    };

    return (
        <div className="flex-1 w-full flex h-full bg-stone-50 font-sans text-stone-900 min-w-0">
            <div 
                ref={scrollContainerRef}
                className={`flex-1 flex flex-col border-r border-stone-200 bg-stone-50/30 transition-all duration-500 ${step === 6 ? 'w-0 opacity-0 hidden' : 'w-[60%] p-8 pb-32 overflow-y-auto'}`}
            >
                <div className="max-w-3xl mx-auto w-full">
                    <div className="mb-8">
                        <button onClick={() => setStep(Math.max(1, step - 1) as any)} disabled={step === 1} className="text-stone-400 hover:text-stone-800 mb-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider disabled:opacity-0 transition-opacity"><ChevronLeft size={14} /> Back</button>
                        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">{step === 1 && "Establish Organization DNA"}{step === 2 && "Strategic Mandate"}{step === 3 && "Operational Mechanics"}{step === 4 && "Neural Workbench"}{step === 5 && "Output Architect"}</h1>
                        <p className="text-stone-500 text-sm">{step === 1 && "Deep entity profiling: define scale, authority, and identity."}{step === 2 && "Define specific mission vectors, priorities, and success metrics."}{step === 3 && "Calibrate risk, procurement, and financial constraints."}{step === 4 && "Collaborative interface: Configure modules via discussion."}{step === 5 && "Configure final deliverables and authorize generation."}</p>
                    </div>
                    <div className="flex items-center space-x-2 mb-8">{[1, 2, 3, 4, 5, 6].map(num => (<React.Fragment key={num}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === num ? 'bg-stone-900 text-white shadow-md scale-110' : step > num ? 'bg-green-500 text-white' : 'bg-stone-200 text-stone-500'}`}>{step > num ? <CheckCircle2 size={14} /> : num}</div>{num < 6 && <div className={`h-1 w-8 rounded-full ${step > num ? 'bg-green-500' : 'bg-stone-200'}`} />} </React.Fragment>))}</div>
                    <div className="min-h-[400px]">
                        {step === 1 && renderStep1_Profile()}
                        {step === 2 && renderStep2_Mandate()}
                        {step === 3 && renderStep3_Calibration()}
                        {step === 4 && renderStep4_Architecture()}
                        {step === 5 && renderStep5_Output()}
                    </div>
                    <NavButtons 
                        step={step} 
                        setStep={setStep} 
                        canNext={!!params.organizationName}
                        finalAction={handleGenerateReportWithOrchestrator}
                    />
                </div>
            </div>
            <div className={`flex flex-col bg-white transition-all duration-500 ${step === 6 ? 'w-full' : 'w-[40%] shadow-xl'}`}>
                {step < 6 ? <CollaborativeCanvas /> : renderStep6_Synthesis()}
            </div>
            <AddOpportunityModal isOpen={isOpportunityModalOpen} onClose={() => setIsOpportunityModalOpen(false)} onSave={() => {}} />
            {isAnalysisModalOpen && params.activeOpportunity && (<AnalysisModal item={params.activeOpportunity} region={params.country || 'Global'} onClose={() => setIsAnalysisModalOpen(false)} />)}
            {isComparativeModalOpen && (<ComparativeAnalysis reports={reports} onClose={() => setIsComparativeModalOpen(false)} />)}
            <LetterGeneratorModal isOpen={isLetterModalOpen} onClose={() => setIsLetterModalOpen(false)} onGenerate={async (content) => { return new Promise(resolve => setTimeout(() => resolve(`To Whom It May Concern,\n\n regarding ${params.organizationName}...`), 1000)); }} reportContent={Object.values(reportData).map((s) => (s as ReportSection).content).join('\n')} reportParameters={params} />
        </div>
    );
};

export default MainCanvas;

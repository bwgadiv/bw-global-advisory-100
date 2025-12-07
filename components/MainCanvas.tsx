
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
  FileCheck, ScrollText, Compass, Printer, Edit3, ClipboardList, AlertOctagon, Eye, Microscope
} from 'lucide-react';
import { ReportParameters, ReportData, GenerationPhase, LiveOpportunityItem, ReportSection, NeuroSymbolicState, CopilotInsight } from '../types';
import { 
    ORGANIZATION_TYPES, 
    REGIONS_AND_COUNTRIES, 
    INDUSTRIES, 
    RISK_APPETITE_LEVELS, 
    TIME_HORIZONS,
    GLOBAL_CITY_DATABASE,
    ORGANIZATION_SCALE_BANDS,
    GLOBAL_DEPARTMENTS,
    GLOBAL_ROLES,
    GLOBAL_LEGAL_ENTITIES,
    GLOBAL_STRATEGIC_INTENTS,
    GLOBAL_CAPITAL_SOURCES,
    GLOBAL_OPERATIONAL_MODELS,
    DETAILED_PARTNER_CAPABILITIES,
    DETAILED_RISK_FACTORS,
    GLOBAL_INCENTIVES,
    SECTOR_THEMES,
    SECTOR_DEPARTMENTS,
    TARGET_COUNTERPART_TYPES,
    OUTPUT_FORMATS,
    LETTER_STYLES,
    REPORT_DEPTHS,
    AVAILABLE_AGENTS
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
import { ChecklistGatekeeper } from './ChecklistGatekeeper'; 
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

// Map internal module IDs to display info
const ENGINE_CATALOG = [
    { id: 'Nexus Rocket Engine', label: 'Nexus Rocket Engine', desc: 'Latent Asset Identification (LAI) & IVAS Scoring.', icon: RocketIcon, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { id: 'Symbiotic Matchmaking', label: 'Symbiotic Matchmaker', desc: 'Identify high-asymmetry partners globally.', icon: MatchMakerIcon, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'Historical Precedents', label: 'Historical Precedents', desc: 'Match strategy against 100 years of case studies.', icon: History, color: 'text-stone-600', bg: 'bg-stone-100', border: 'border-stone-200' },
    { id: 'Temporal Phase Analysis', label: 'Temporal Phase Analysis', desc: 'Lifecycle stage detection & progression modeling.', icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { id: 'Geopolitical Analysis', label: 'Geopolitical Forecast', desc: 'Regional stability, currency risk & trade barriers.', icon: GlobeIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'Governance Audit', label: 'Governance Audit', desc: 'Corruption index, regulatory friction & compliance.', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'Deep Reasoning', label: 'Deep Reasoning', desc: 'Adversarial logic check: "Deal Killers" vs "Hidden Gems".', icon: Layout, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'Financial Modeling', label: 'Financial Modeling', desc: 'Strategic Cash Flow (SCF) & Predictive Growth.', icon: BarChart, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { id: 'Trade Simulator', label: 'Trade Simulator', desc: 'Supply chain shock modeling & tariff impact.', icon: ActivityIcon, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { id: 'Sentiment Engine', label: 'Sentiment Engine', desc: 'Public perception & brand risk analysis.', icon: MessageSquare, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
];

// Base Risk Categories for dynamic generation
const BASE_RISK_CATEGORIES = [
    { id: 'regulatory', label: 'Regulatory Friction', icon: Scale },
    { id: 'currency', label: 'Currency Volatility', icon: TrendingUp },
    { id: 'supply', label: 'Supply Chain Fragility', icon: ActivityIcon },
    { id: 'labor', label: 'Labor/Talent Shortage', icon: Users },
    { id: 'ip', label: 'IP Protection', icon: ShieldCheck },
    { id: 'political', label: 'Political Instability', icon: AlertOctagon },
];

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
            <button onClick={finalAction} className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-1"><Fingerprint size={20} /> Sign-Off & Generate</button>
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
    
    // Risk State
    const [riskArea, setRiskArea] = useState(params.country || '');
    const [activeRisk, setActiveRisk] = useState<string | null>(null);
    const [riskAnalysisText, setRiskAnalysisText] = useState<string>('');
    const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);

    // Scroll Container Ref
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // "Confidential Briefing" State
    const [briefingSigned, setBriefingSigned] = useState(false);
    // Config State for Step 5
    const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>(['dossier']);
    const [strategicPosture, setStrategicPosture] = useState<string>('diplomatic');
    const [step5Context, setStep5Context] = useState<string>(''); // User commentary
    
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

    // Update risk area default if country changes
    useEffect(() => {
        if (params.country && (!riskArea || riskArea === 'Global')) {
            setRiskArea(params.country);
        }
    }, [params.country]);

    // Enhanced Copilot Messaging for "Live Consultant" feel
    useEffect(() => {
        if (!onCopilotMessage) return;
        
        let msg: CopilotInsight | null = null;
        
        if (step === 1) {
             msg = { type: 'insight', title: 'Consultant Active', description: 'I am calibrating the model to your organization\'s scale. Please ensure the Entity Type matches your legal structure for accurate tax/compliance forecasting.', confidence: 100 };
        } else if (step === 2) {
             msg = { type: 'strategy', title: 'Strategic Drift Check', description: 'Scanning your Problem Statement for ambiguity. A vague mandate like "Growth" yields generic results. Be specific about "Market Share" vs "Revenue".', confidence: 100 };
        } else if (step === 3) {
             msg = { type: 'warning', title: 'Logic Gatekeeper', description: 'I am monitoring for strict compliance rules. If you have "Go/No-Go" financial covenants (e.g. Debt/EBITDA < 3x), tell me so I can lock the logic engine.', confidence: 100 };
        } else if (step === 4) {
             msg = { type: 'insight', title: 'Full System Access', description: 'You have full control over the Intelligence Matrix. Activating more engines increases computation time but provides deeper cross-validation. I recommend keeping the Rocket Engine active.', confidence: 100 };
        } else if (step === 5) {
             msg = { type: 'question', title: 'Pre-Flight Verification', description: 'This is your final checkpoint. Please provide any additional context in the Executive Commentary field to refine the final output tone.', confidence: 100 };
        }

        if (msg) onCopilotMessage({ ...msg, id: Date.now().toString() });
        
    }, [step, params.country]);

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

    const toggleDeliverable = (id: string) => {
        setSelectedDeliverables(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // Risk Analysis Simulation
    const handleRiskClick = async (riskId: string, riskLabel: string) => {
        setActiveRisk(riskId);
        setIsAnalyzingRisk(true);
        // toggle in params if needed, or just view
        if (!params.partnershipSupportNeeds?.includes(riskLabel)) {
            toggleArrayParam('partnershipSupportNeeds', riskLabel);
        }
        
        // Mocking the "Deep Dive" content based on the location
        const mockDelay = 800;
        const location = riskArea || params.country || "Target Region";
        
        setTimeout(() => {
            let analysis = "";
            switch (riskId) {
                case 'regulatory': 
                    analysis = `INVESTOR CONCERN: ${location} is notorious for opaque licensing procedures. Foreign entities often face 6-12 month delays without a local joint venture. \n\nNEXUS MITIGATION: Deploy the 'Regulatory Navigation Index' to map specific agency bottlenecks. Use a local 'Special Purpose Vehicle' (SPV) to bypass Level-1 scrutiny.`;
                    break;
                case 'currency':
                    analysis = `INVESTOR CONCERN: Volatility in the local currency vs. USD creates a 15-20% margin risk for repatriation of profits. \n\nNEXUS MITIGATION: Structuring contracts in a hard-currency basket or utilizing a 'Synthetic Hedge' via operational expenses can neutralize this exposure.`;
                    break;
                case 'supply':
                    analysis = `INVESTOR CONCERN: Last-mile logistics in ${location} suffer from infrastructure fragmentation, leading to a 30% higher cost-per-unit than regional peers. \n\nNEXUS MITIGATION: We recommend a 'Hub-and-Spoke' distribution model leveraging Tier-2 logistics partners identified by the Matchmaking Engine.`;
                    break;
                default:
                    analysis = `INVESTOR CONCERN: General uncertainty regarding ${riskLabel} in ${location} increases the cost of capital by an estimated 250 basis points. \n\nNEXUS MITIGATION: Systematic monitoring and local insurance wrappers can reduce the perceived risk premium.`;
            }
            setRiskAnalysisText(analysis);
            setIsAnalyzingRisk(false);
        }, mockDelay);
    };

    const handleGenerateReportWithOrchestrator = async () => {
        if (!briefingSigned) {
            alert("You must verify and sign the Confidential Briefing before the system can release the final dossier.");
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

    // --- STEP RENDERING ---

    const renderStep1_Profile = () => {
        const currentSector = params.industry[0] || 'Default';
        const sectorTheme = SECTOR_THEMES[currentSector] || SECTOR_THEMES['Default'];
        const departmentOptionsRaw = SECTOR_DEPARTMENTS[currentSector] || GLOBAL_DEPARTMENTS;
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
                        {/* UPDATE: Orange header + Description */}
                        <div className="mb-6 border-b border-orange-200 pb-2">
                            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Corporate Identity</h4>
                            <p className="text-xs text-stone-500">Establish the legal and industrial baseline of the subject entity.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <SelectOrInput label="Legal Entity Structure" value={params.organizationType} options={GLOBAL_LEGAL_ENTITIES.map(t => ({ value: t, label: t }))} onChange={(val: string) => handleParamChange('organizationType', val)} placeholder="e.g. Special Purpose Vehicle (SPV)" fallbackList={ORGANIZATION_TYPES} />
                                <SelectOrInput label="Primary Industry Sector" value={params.industry[0] || ''} options={INDUSTRIES.map(i => ({ value: i.title, label: i.title }))} onChange={(val: string) => handleParamChange('industry', [val])} placeholder="e.g. Renewable Energy" fallbackList={INDUSTRIES.map(i => i.title)} />
                            </div>
                            <div className="space-y-4">
                                <div><label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Organization Name</label><input className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-stone-900 outline-none placeholder-stone-400" value={params.organizationName} onChange={(e) => handleParamChange('organizationName', e.target.value)} placeholder="e.g. Acme Global Industries" /></div>
                                <div><label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Headquarters Location</label><input className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:bg-white outline-none placeholder-stone-400" value={params.organizationAddress || ''} onChange={(e) => handleParamChange('organizationAddress', e.target.value)} placeholder="e.g. 123 Strategic Ave, London" /></div>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-xl border shadow-sm transition-colors duration-500 ${sectorTheme.bg} ${sectorTheme.border}`}>
                        {/* UPDATE: Orange header for Operational Context + Description */}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
                        {/* UPDATE: Orange header + Description */}
                        <div className="border-b border-orange-200 pb-2">
                            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Mission Architecture</h4>
                            <p className="text-xs text-stone-500">Define the core purpose and geographical focus of the operation.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <MultiSelectWithSearch label="Core Strategic Intent" options={GLOBAL_STRATEGIC_INTENTS} selectedValues={Array.isArray(params.strategicIntent) ? params.strategicIntent : [params.strategicIntent].filter(Boolean)} onChange={(values: string[]) => handleParamChange('strategicIntent', values)} placeholder="Select Mission Vectors..." />
                                <p className="text-[10px] text-blue-600 mt-1 flex items-center gap-1 font-medium"><Info size={10} /> Select multiple objectives to create a composite mission profile.</p>
                            </div>
                            <div><label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Target Region</label><select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-stone-800" value={params.region} onChange={(e) => handleParamChange('region', e.target.value)}><option value="">Select Region...</option>{REGIONS_AND_COUNTRIES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select></div>
                            <div><label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Specific Country</label><select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-stone-800" value={params.country} onChange={(e) => handleParamChange('country', e.target.value)}><option value="">Select Country...</option>{REGIONS_AND_COUNTRIES.find(r => r.name === params.region)?.countries.map(c => (<option key={c} value={c}>{c}</option>)) || <option disabled>Select Region First</option>}</select></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
                        {/* UPDATE: Orange header + Description */}
                        <div className="border-b border-orange-200 pb-2">
                            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Crosshair className="w-4 h-4" /> Targeting Mechanics
                            </h4>
                            <p className="text-xs text-stone-500">Identify the ideal partner or entity type for engagement.</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-stone-700 uppercase tracking-wide block mb-2">Target Counterpart DNA</span>
                            <MultiSelectWithSearch 
                                label="" 
                                options={TARGET_COUNTERPART_TYPES} 
                                selectedValues={Array.isArray(params.targetCounterpartType) ? params.targetCounterpartType : [params.targetCounterpartType].filter(Boolean)} 
                                onChange={(values: string[]) => handleParamChange('targetCounterpartType', values)} 
                                placeholder="E.g., Private Equity, State-Owned Enterprise..." 
                            />
                            <p className="text-[10px] text-blue-600 mt-1 flex items-center gap-1 font-medium"><Info size={10} /> Select multiple entity types to broaden the search scope.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
                    {/* UPDATE: Orange header + Description */}
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

    const renderStep3_Calibration = () => (
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
                    {/* Neuro-Symbolic Logic Card (Simplified Access) */}
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
                        {/* UPDATE: Orange header + Description */}
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
                            
                            {/* Ask Copilot Helper */}
                            <div className="p-3 bg-stone-50 rounded border border-stone-200 flex items-center gap-3 cursor-pointer hover:bg-stone-100 transition-colors">
                                <div className="bg-stone-200 p-1.5 rounded-full"><HelpCircle className="w-4 h-4 text-stone-600" /></div>
                                <div className="text-xs text-stone-500">Unsure about the optimal capital mix for {params.country || 'this region'}? <span className="underline font-bold text-stone-700">Ask Copilot.</span></div>
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

                        {/* Hyper-Local Context Input */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-stone-700 block mb-1 uppercase tracking-wide">Specific Area of Interest</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                                <input 
                                    type="text" 
                                    value={riskArea}
                                    onChange={(e) => setRiskArea(e.target.value)}
                                    placeholder="e.g. Ho Chi Minh City, District 1"
                                    className="w-full p-2.5 pl-10 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <p className="text-[10px] text-stone-400 mt-1 italic">Enter a city or zone to get hyper-local risk intelligence.</p>
                        </div>

                        {/* Risk Monitors Grid */}
                        <div className="flex-1">
                            <label className="text-xs font-bold text-stone-700 block mb-3 uppercase tracking-wide">Active Risk Monitors</label>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {BASE_RISK_CATEGORIES.map((risk) => (
                                    <button
                                        key={risk.id}
                                        onClick={() => handleRiskClick(risk.id, risk.label)}
                                        className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden group ${
                                            activeRisk === risk.id 
                                            ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-200 shadow-sm' 
                                            : 'bg-white border-stone-200 hover:border-orange-200 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <risk.icon className={`w-4 h-4 ${activeRisk === risk.id ? 'text-orange-600' : 'text-stone-400 group-hover:text-orange-400'}`} />
                                            {activeRisk === risk.id && <Eye className="w-3 h-3 text-orange-400 animate-pulse" />}
                                        </div>
                                        <div className={`text-xs font-bold ${activeRisk === risk.id ? 'text-stone-900' : 'text-stone-600'}`}>{risk.label}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Deep Dive Inspector Panel */}
                            {activeRisk && (
                                <div className="bg-stone-900 text-stone-300 p-5 rounded-xl border border-stone-700 animate-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between mb-3 border-b border-stone-700 pb-2">
                                        <h5 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                                            <Microscope className="w-3 h-3 text-orange-500" /> Deep Dive: {BASE_RISK_CATEGORIES.find(r => r.id === activeRisk)?.label}
                                        </h5>
                                        <span className="text-[9px] font-mono text-stone-500">{riskArea || 'Global'} Context</span>
                                    </div>
                                    
                                    {isAnalyzingRisk ? (
                                        <div className="py-4 text-center">
                                            <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto mb-2" />
                                            <p className="text-xs text-stone-500">Retrieving local intelligence...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 text-xs leading-relaxed">
                                            <div className="whitespace-pre-wrap">{riskAnalysisText}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4_Architecture = () => {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm"><Cpu className="w-6 h-6 text-purple-600" /></div>
                    <div><h3 className="text-xl font-serif font-bold text-stone-900">Intelligence Architecture</h3><p className="text-sm text-stone-500">Configure the active engine matrix and agent swarm for this mission.</p></div>
                </div>

                {/* Auto-Provisioning Visual */}
                <div className="bg-stone-50 p-8 rounded-xl shadow-sm border border-stone-200">
                    <div className="flex justify-between items-center mb-8 border-b border-orange-200 pb-4">
                        <div>
                            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> System Configuration
                            </h4>
                            <p className="text-xs text-stone-500">Select active modules for your analysis.</p>
                        </div>
                        <span className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {params.selectedModules?.length || 0} MODULES ACTIVE
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ENGINE_CATALOG.map((eng) => {
                            const isActive = (params.selectedModules || []).includes(eng.label);
                            return (
                                <div 
                                    key={eng.id} 
                                    onClick={() => toggleArrayParam('selectedModules', eng.label)}
                                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                                        isActive 
                                        ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500' 
                                        : 'bg-white border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`p-2 rounded-lg ${isActive ? eng.bg : 'bg-stone-100'}`}>
                                            <eng.icon className={`w-5 h-5 ${isActive ? eng.color : 'text-stone-400'}`} />
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? 'bg-blue-500 border-blue-500' : 'border-stone-300'}`}>
                                            {isActive && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                    </div>
                                    <h5 className={`font-bold text-sm ${isActive ? 'text-stone-900' : 'text-stone-500'}`}>{eng.label}</h5>
                                    <p className="text-[10px] text-stone-500 mt-1 leading-tight">{eng.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-stone-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4" /> Active Agent Swarm
                            </h4>
                            <span className="text-xs text-stone-500">{params.selectedAgents?.length || 0} Agents Deployed</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_AGENTS.map((agent) => {
                                const isAgentActive = (params.selectedAgents || []).includes(agent);
                                return (
                                    <button
                                        key={agent}
                                        onClick={() => toggleArrayParam('selectedAgents', agent)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
                                            isAgentActive
                                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                                            : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
                                        }`}
                                    >
                                        {agent}
                                        {isAgentActive && <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Copilot Note */}
                <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                        <h5 className="text-sm font-bold text-blue-900">Consultant's Note</h5>
                        <p className="text-xs text-blue-800 leading-relaxed mt-1">
                            I have pre-selected the optimal configuration based on your {params.industry[0]} focus in {params.country}. You can add or remove modules above to tailor the analysis depth.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderStep5_Output = () => {
        // PRE-FLIGHT DASHBOARD & STATEMENT OF WORK GENERATOR
        
        // Mock early AI Opinion based on params
        const generatePreAssessment = () => {
            if (!params.country || !params.industry[0]) return "Insufficient data for pre-assessment.";
            
            const riskLevel = params.riskTolerance === 'high' ? "aggressive" : "measured";
            return `Based on your intent to enter ${params.country} with a ${riskLevel} strategy in the ${params.industry[0]} sector, the Nexus Engine detects high regulatory friction but significant labor arbitrage opportunities. We recommend focusing the analysis on Supply Chain Resilience and Local Governance Mapping.`;
        };

        const preAssessment = generatePreAssessment();
        const targetSummary = `${params.country || 'Global'} (${params.region || 'Region'})`;
        const budgetSummary = params.calibration?.constraints?.budgetCap || 'Unspecified';
        const riskSummary = params.riskTolerance || 'Medium';
        
        // Generate dynamic letter content based on selections and user input
        const generateLiveLetter = () => {
            const today = new Date().toLocaleDateString();
            const deliverablesText = selectedDeliverables.map(d => {
                if(d === 'dossier') return 'Executive Intelligence Dossier';
                if(d === 'gov_letter') return 'Government Relations Strategy';
                if(d === 'financial_model') return 'Strategic Cash Flow (SCF) Model';
                if(d === 'risk_matrix') return 'Geopolitical Risk Matrix';
                return d;
            }).join(', ');

            return `To: ${params.userName || 'Principal'},\n\n` +
                   `Date: ${today}\n` +
                   `Subject: Statement of Work & Strategic Mandate for ${params.organizationName || 'Entity'} in ${params.country || 'Target Region'}\n\n` +
                   `The Nexus Intelligence System has ingested your parameters. We understand your core objective is to execute a **${params.strategicIntent || 'Strategic Initiative'}** within the **${params.industry[0] || 'Target'}** sector of **${params.country || 'the region'}**.\n\n` +
                   `**Preliminary Assessment:**\n` +
                   `${preAssessment}\n\n` +
                   `**Scope of Analysis:**\n` +
                   `Our analysis will be calibrated to a risk tolerance level of **${riskSummary}**, utilizing a capital structure framework capped at **${budgetSummary}**.\n` +
                   `We have activated the relevant **Political Risk**, **Supply Chain**, and **Financial Viability** engines to stress-test this mandate against 100 years of historical precedent.\n\n` +
                   `**Executive Context:**\n` +
                   `${step5Context ? step5Context : '(No additional context provided)'}\n\n` +
                   `**Deliverables Manifest:**\n` + 
                   `Based on your selection, we will generate: ${deliverablesText}.\n\n` +
                   `**Strategic Posture:**\n` +
                   `The analysis will adopt a **${strategicPosture}** tone to align with your market entry style.\n\n` +
                   `Please confirm this accurately reflects your intent. Upon signature, we will generate the classified dossier.`;
        };

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 mb-20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm"><Lock className="w-6 h-6 text-stone-700" /></div>
                    <div><h3 className="text-xl font-serif font-bold text-stone-900">Pre-Flight Command Dashboard</h3><p className="text-sm text-stone-500">Refine mission parameters, provide executive context, and confirm deliverables.</p></div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    
                    {/* 1. Nexus Preliminary Assessment (Early Opinion) */}
                    <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-xl p-6 shadow-md border border-stone-700">
                        <div className="flex items-center gap-2 mb-3">
                            <BrainCircuit className="w-5 h-5 text-bw-gold" />
                            <h4 className="text-sm font-bold uppercase tracking-widest text-bw-gold">Nexus Preliminary Assessment</h4>
                        </div>
                        <p className="text-sm leading-relaxed text-stone-200 italic">
                            "{preAssessment}"
                        </p>
                    </div>

                    {/* 2. Executive Context Input */}
                    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-b border-orange-200 pb-2">
                            <Edit3 className="w-4 h-4 text-orange-600" />
                            <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wide">Executive Commentary</h4>
                        </div>
                        <p className="text-xs text-stone-500 mb-3">Provide additional context, specific constraints, or nuance that the system should consider during generation.</p>
                        <textarea 
                            value={step5Context}
                            onChange={(e) => setStep5Context(e.target.value)}
                            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-stone-800 outline-none min-h-[120px]"
                            placeholder="e.g. 'We are particularly concerned about IP protection in this region. Prioritize legal safeguards over speed of entry.'"
                        />
                    </div>

                    {/* 3. Deliverables & Approach Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Output Selection */}
                        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                            <div className="border-b border-orange-200 pb-4 mb-4">
                                <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wide flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4" /> Deliverable Matrix
                                </h4>
                                <p className="text-xs text-stone-500 mt-1">Select the artifacts you need generated.</p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { id: 'dossier', label: 'Executive Intelligence Dossier', desc: 'Full strategic report (PDF)' },
                                    { id: 'gov_letter', label: 'Government Relations Letter', desc: 'Formal diplomatic outreach' },
                                    { id: 'financial_model', label: 'Financial Projection Model', desc: 'Excel-ready cash flow analysis' },
                                    { id: 'risk_matrix', label: 'Operational Risk Matrix', desc: 'Detailed threat assessment' }
                                ].map(item => {
                                    const isSelected = selectedDeliverables.includes(item.id);
                                    return (
                                        <div 
                                            key={item.id} 
                                            onClick={() => toggleDeliverable(item.id)}
                                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-orange-50 border-orange-200' : 'bg-white border-stone-100 hover:bg-stone-50'}`} 
                                        >
                                            <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-orange-600 border-orange-600' : 'border-stone-300'}`}>
                                                {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            <div>
                                                <div className={`text-sm font-bold ${isSelected ? 'text-orange-900' : 'text-stone-800'}`}>{item.label}</div>
                                                <div className="text-xs text-stone-500">{item.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Strategic Approach */}
                        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                            <div className="border-b border-blue-200 pb-4 mb-4">
                                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide flex items-center gap-2">
                                    <Compass className="w-4 h-4" /> Strategic Posture
                                </h4>
                                <p className="text-xs text-stone-500 mt-1">Define the tone and aggression level of the output.</p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { id: 'aggressive', label: 'Aggressive Expansion', desc: 'Focus on speed, disruption, and market capture.' },
                                    { id: 'diplomatic', label: 'Diplomatic Entry', desc: 'Focus on compliance, partnership, and government relations.' },
                                    { id: 'conservative', label: 'Risk-Averse Pilot', desc: 'Focus on minimal capital exposure and testing.' }
                                ].map(style => (
                                    <div 
                                        key={style.id} 
                                        onClick={() => setStrategicPosture(style.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${strategicPosture === style.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-stone-100 hover:bg-stone-50'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${strategicPosture === style.id ? 'border-blue-600' : 'border-stone-300'}`}>
                                            {strategicPosture === style.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-stone-800">{style.label}</div>
                                            <div className="text-xs text-stone-500">{style.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. The Statement of Work (Letter) */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-200 relative overflow-hidden">
                        {/* Watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] font-serif opacity-[0.02] pointer-events-none select-none">
                            CONFIDENTIAL
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8 border-b-2 border-stone-900 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold font-serif text-stone-900">Statement of Work & Strategic Understanding</h2>
                                    <p className="text-sm text-stone-500 mt-1">To: {params.userName}, {params.userDepartment}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Date</div>
                                    <div className="font-mono text-sm">{new Date().toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="prose prose-stone max-w-none text-sm leading-relaxed mb-8 whitespace-pre-line bg-stone-50 p-6 rounded-lg border border-stone-200 font-serif">
                                {generateLiveLetter()}
                            </div>

                            <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="sign-off" 
                                        checked={briefingSigned} 
                                        onChange={(e) => setBriefingSigned(e.target.checked)}
                                        className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer" 
                                    />
                                    <label htmlFor="sign-off" className="text-sm font-bold text-stone-700 cursor-pointer select-none">
                                        I verify this briefing is accurate and authorize generation.
                                    </label>
                                </div>
                                {briefingSigned && (
                                    <div className="text-xs text-green-600 font-bold flex items-center gap-1 animate-in fade-in">
                                        <CheckCircle2 size={14} /> Signed Digitally
                                    </div>
                                )}
                            </div>
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

    const LivePreview = () => {
        // Calculate dynamic readiness score based on filled fields
        const calculateReadiness = () => {
            // Strict Gate: No score until Name AND Country are present
            if (!params.organizationName || !params.country) return 0;

            let score = 0; 
            
            // Base score for passing the gate
            score += 10; 

            if (params.organizationType) score += 5;
            if (params.industry.length > 0) score += 10;
            if (params.problemStatement && params.problemStatement.length > 10) score += 20;
            if (params.strategicIntent.length > 0) score += 15;
            if (params.revenueBand) score += 10;
            if (params.riskTolerance) score += 10;
            if (params.selectedAgents.length > 0) score += 10;
            
            return Math.min(99, score);
        };

        const readiness = calculateReadiness();
        
        // Dynamic Header Logic: Title, Ref, Status evolve with input
        let statusText = "Awaiting Initialization";
        let refText = "UNREGISTERED";
        let reportTitle = params.reportName || "Untitled Mission";

        if (readiness === 0) {
            statusText = "Awaiting Core Inputs";
            refText = "PENDING";
        } else if (readiness < 20) {
            statusText = "Ingesting Entity Data";
            if(params.organizationName) reportTitle = `${params.organizationName} (Draft)`;
        } else if (readiness < 40) {
            statusText = "Mapping Strategic Intent";
            refText = "GENERATING HASH...";
            if(params.country) reportTitle = `Mission: ${params.country} Entry`;
        } else if (readiness < 70) {
            statusText = "Calibrating Risk Models";
            refText = params.id || "PENDING";
        } else {
            statusText = "Ready for Computation";
            refText = params.id || "READY";
        }
        
        // EMPTY STATE CHECK: If main identifiers are missing, show Standby UI
        if (!params.organizationName && !params.country) {
            return (
                <div className="h-full flex flex-col items-center justify-center bg-stone-50 p-8 text-center border-l border-stone-200">
                    <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Database className="w-10 h-10 text-stone-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-stone-400 uppercase tracking-widest mb-2">System Standby</h2>
                    <div className="h-1 w-12 bg-stone-300 rounded-full mb-4"></div>
                    <p className="text-stone-500 text-sm max-w-xs leading-relaxed">
                        Awaiting organization profile and mission parameters to initialize dossier generation.
                    </p>
                    <div className="mt-8 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-bounce delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-bounce delay-200"></div>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-4 font-mono">NEXUS_OS_v4.2 // IDLE</p>
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col bg-stone-50 p-8 overflow-y-auto font-sans">
                <div className="bg-white rounded-xl shadow-xl border border-stone-200 p-8 min-h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
                    
                    {/* Header - Now Dynamic */}
                    <div className="border-b-2 border-stone-900 pb-6 mb-8 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${readiness > 60 ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Confidential Briefing</span>
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight transition-all duration-300">{reportTitle}</h2>
                            <p className="text-stone-500 mt-2 text-sm font-mono uppercase tracking-wide flex items-center gap-2">
                                <span>Ref: <span className="text-stone-800 font-bold">{refText}</span></span>
                                <span className="text-stone-300">•</span>
                                <span>Status: <span className="text-blue-600 font-bold">{statusText}</span></span>
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-stone-200 transition-all duration-500">{readiness}%</div>
                            <div className="text-[9px] font-bold text-stone-400 uppercase">Mission Readiness</div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="space-y-8 flex-grow">
                        
                        {/* 1. Identity & Context */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                {/* UPDATE: Orange header */}
                                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3 border-b border-orange-200 pb-1">Principal Identity</h4>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-stone-900">{params.organizationName || 'Unidentified Entity'}</p>
                                    <p className="text-xs text-stone-500">{params.organizationType} • {params.revenueBand || 'Scale Unknown'}</p>
                                    <p className="text-xs text-stone-500 mt-1">{params.userName ? `Operator: ${params.userName}` : 'Operator: Pending'}</p>
                                </div>
                            </div>
                            <div>
                                {/* UPDATE: Orange header */}
                                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3 border-b border-orange-200 pb-1">Mission Vector</h4>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-stone-900">{params.country ? `Target: ${params.country}` : 'Target: Global'}</p>
                                    <p className="text-xs text-stone-500">{params.industry[0] || 'Sector Undefined'}</p>
                                    <p className="text-xs text-stone-500 mt-1 italic">
                                        Intent: {Array.isArray(params.strategicIntent) ? params.strategicIntent.join(', ') : params.strategicIntent || 'Pending'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Nexus Assessment (AI Perspective) */}
                        {step >= 2 && (
                            <div className="bg-stone-50 rounded-lg p-5 border border-stone-200 animate-in fade-in slide-in-from-bottom-2">
                                {/* UPDATE: Orange header */}
                                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-orange-200 pb-1">
                                    <BrainCircuit className="w-4 h-4" /> Nexus Assessment
                                </h4>
                                <p className="text-sm text-stone-700 leading-relaxed font-medium">
                                    {params.problemStatement 
                                        ? `I have analyzed your directive. The core challenge appears to be ${params.problemStatement.length > 50 ? 'complex market entry' : 'structural optimization'}. To solve this, I will cross-reference your specific constraints against 100 years of historical precedent in ${params.region || 'the target region'}.`
                                        : "Awaiting core problem statement to formulate strategic assessment."}
                                </p>
                            </div>
                        )}

                        {/* 3. Proposed Architecture */}
                        {step >= 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-2">
                                {/* UPDATE: Orange header */}
                                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3 border-b border-orange-200 pb-1">Architecture Verified</h4>
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-800 font-medium flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> System engines have been auto-calibrated to {params.country}.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Agreement */}
                    <div className="mt-8 border-t-2 border-stone-100 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="text-[10px] text-stone-400 max-w-xs leading-tight">
                                <Lock className="w-3 h-3 inline mr-1" />
                                <strong>Human-in-the-Loop Protocol:</strong> System confidence caps at 99%. The final 1% requires your strategic sign-off.
                            </div>
                        </div>
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
                        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">{step === 1 && "Establish Organization DNA"}{step === 2 && "Strategic Mandate"}{step === 3 && "Operational Mechanics"}{step === 4 && "Intelligence Architecture"}{step === 5 && "Confidential Briefing"}</h1>
                        <p className="text-stone-500 text-sm">{step === 1 && "Deep entity profiling: define scale, authority, and identity."}{step === 2 && "Define specific mission vectors, priorities, and success metrics."}{step === 3 && "Calibrate risk, procurement, and financial constraints."}{step === 4 && "System auto-provisions AI agents based on mission profile."}{step === 5 && "Verify strategic understanding before generating final dossier."}</p>
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
                {step < 6 ? <LivePreview /> : renderStep6_Synthesis()}
            </div>
            <AddOpportunityModal isOpen={isOpportunityModalOpen} onClose={() => setIsOpportunityModalOpen(false)} onSave={() => {}} />
            {isAnalysisModalOpen && params.activeOpportunity && (<AnalysisModal item={params.activeOpportunity} region={params.country || 'Global'} onClose={() => setIsAnalysisModalOpen(false)} />)}
            {isComparativeModalOpen && (<ComparativeAnalysis reports={reports} onClose={() => setIsComparativeModalOpen(false)} />)}
            <LetterGeneratorModal isOpen={isLetterModalOpen} onClose={() => setIsLetterModalOpen(false)} onGenerate={async (content) => { return new Promise(resolve => setTimeout(() => resolve(`To Whom It May Concern,\n\n regarding ${params.organizationName}...`), 1000)); }} reportContent={Object.values(reportData).map((s) => (s as ReportSection).content).join('\n')} reportParameters={params} />
        </div>
    );
};

export default MainCanvas;

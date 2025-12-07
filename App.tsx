
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReportParameters, 
  CopilotInsight, 
  ReportData, 
  ReportSection,
  GenerationPhase
} from './types';
import { INITIAL_PARAMETERS } from './constants';
import CommandCenter from './components/CommandCenter'; 
import MonitorDashboard from './components/MonitorDashboard';
import MainCanvas from './components/MainCanvas';
import RightSidebar from './components/RightSidebar';
import { LandingPage } from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import { LegalInfoHub } from './components/LegalInfoHub';
import { ArchitectPage } from './components/ArchitectPage';
import { PartnerManagement } from './components/PartnerManagement';
import { Gateway } from './components/Gateway';
import { StrategicCanvas } from './components/StrategicCanvas';
import useEscapeKey from './hooks/useEscapeKey';
import { generateCopilotInsights, generateReportSectionStream, askCopilot } from './services/geminiService';
import { generateBenchmarkData } from './services/mockDataGenerator';
import { calculateSPI } from './services/engine';
import { LayoutGrid, Globe, ShieldCheck, Layers, LayoutDashboard, Plus } from 'lucide-react';

// --- TYPES & INITIAL STATE ---
const initialSection: ReportSection = { id: '', title: '', content: '', status: 'pending' };

const initialReportData: ReportData = {
  executiveSummary: { ...initialSection, id: 'exec', title: 'Executive Summary' },
  marketAnalysis: { ...initialSection, id: 'market', title: 'Background & Market Dossier' },
  recommendations: { ...initialSection, id: 'rec', title: 'Strategic Analysis & Options' },
  implementation: { ...initialSection, id: 'imp', title: 'Engagement & Execution Playbook' },
  financials: { ...initialSection, id: 'fin', title: 'Financial Projections' },
  risks: { ...initialSection, id: 'risk', title: 'Risk Mitigation Strategy' },
};

type ViewMode = 'command-center' | 'live-feed' | 'admin-dashboard' | 'legal-hub' | 'architect' | 'report-generator' | 'partner-management' | 'gateway' | 'strategic-canvas';

const App: React.FC = () => {
    // --- STATE ---
    const [params, setParams] = useState<ReportParameters>(INITIAL_PARAMETERS);
    const [viewMode, setViewMode] = useState<ViewMode>('command-center');
    const [hasEntered, setHasEntered] = useState(false);
    
    // Load saved reports OR generate benchmarks if empty
    const [savedReports, setSavedReports] = useState<ReportParameters[]>(() => {
        try {
          const saved = localStorage.getItem('bw-nexus-reports-unified');
          if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed.length > 0) return parsed;
          }
          // If no data exists, inject the 100 benchmark events
          console.log("Initializing Nexus Benchmark Data...");
          return generateBenchmarkData(100);
        } catch (e) {
          return generateBenchmarkData(100);
        }
    });
    
    const [legalSection, setLegalSection] = useState<string | undefined>(undefined);

    // Generation State
    const [insights, setInsights] = useState<CopilotInsight[]>([]);
    const [isCopilotLoading, setIsCopilotLoading] = useState(false);
    const [reportData, setReportData] = useState<ReportData>(initialReportData);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [genPhase, setGenPhase] = useState<GenerationPhase>('idle');
    const [genProgress, setGenProgress] = useState(0);

    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem('bw-nexus-reports-unified', JSON.stringify(savedReports));
    }, [savedReports]);

    // Copilot Auto-Gen - ONLY runs if valid input exists
    useEffect(() => {
        const timer = setTimeout(async () => {
          // STRICT CHECK: Do not run if fields are empty
          if ((viewMode === 'report-generator') && params.organizationName && params.country && params.organizationName.length > 2 && insights.length === 0) {
            setIsCopilotLoading(true);
            const newInsights = await generateCopilotInsights(params);
            setInsights(newInsights);
            setIsCopilotLoading(false);
          }
        }, 1500);
        return () => clearTimeout(timer);
    }, [params.organizationName, params.country, params.strategicIntent, viewMode]);

    // --- ACTIONS ---
    const handleEscape = useCallback(() => {
        if (viewMode !== 'command-center') {
            setViewMode('command-center');
        }
    }, [viewMode]);

    useEscapeKey(handleEscape);

    const handleEnterApp = () => {
        setHasEntered(true);
        setViewMode('command-center');
    };

    const startNewMission = () => {
        const newParams = { 
            ...INITIAL_PARAMETERS, 
            id: Math.random().toString(36).substr(2, 9), 
            createdAt: Date.now().toString(),
            // STRICT FRESH START with proper empty values for placeholders
            organizationName: '',
            userName: '',
            userDepartment: '',
            country: '',
            strategicIntent: '',
            problemStatement: '',
            industry: [],
            region: '',
            organizationType: '', // Reset type
            organizationSubType: ''
        };
        setParams(newParams);
        setReportData(initialReportData);
        setInsights([]);
        // UPDATED: Start directly in the Unified Control Matrix
        setViewMode('report-generator'); 
    };

    const loadReport = (report: ReportParameters) => {
        setParams(report);
        setReportData(initialReportData);
        setInsights([]);
        // Always load into Unified Control Matrix
        setViewMode('report-generator');
    };

    const deleteReport = (id: string) => {
        setSavedReports(prev => prev.filter(r => r.id !== id));
    };

    const openLegal = (section?: string) => {
        setLegalSection(section);
        setViewMode('legal-hub');
        setHasEntered(true);
    };

    const handleAskCopilot = async (query: string) => {
        setIsCopilotLoading(true);
        try {
          const response = await askCopilot(query, params);
          setInsights(prev => [response, ...prev]);
        } catch (e) {
          console.error("Copilot error", e);
        } finally {
          setIsCopilotLoading(false);
        }
    };

    const handleGenerateReport = useCallback(async () => {
        setIsGeneratingReport(true);
        setGenPhase('intake');
        setGenProgress(5);
        
        // Calculate Scores using Math Engine
        const spiResult = calculateSPI(params);
        
        // Calculate mock IVAS/SCF proxies for the dashboard visuals
        // (In full production these would be distinct calls, here we derive for the dashboard)
        const marketPotential = Math.round(spiResult.breakdown.find(b => b.label === 'Economic Readiness')?.value || 50);
        const riskFactors = Math.round(100 - (spiResult.breakdown.find(b => b.label === 'Political Stability')?.value || 50));

        const updatedScore = {
            totalScore: spiResult.spi,
            marketPotential: marketPotential,
            riskFactors: riskFactors
        };

        const updatedParams = { 
            ...params, 
            opportunityScore: updatedScore,
            status: 'generating' as const 
        };
        
        setParams(updatedParams);

        // Save to repository immediately
        setSavedReports(prev => {
            const existing = prev.findIndex(r => r.id === params.id);
            if (existing >= 0) return prev.map((r, i) => i === existing ? updatedParams : r);
            return [updatedParams, ...prev];
        });

        // Sim Phases
        await new Promise(r => setTimeout(r, 2000));
        setGenPhase('orchestration'); setGenProgress(25);
        await new Promise(r => setTimeout(r, 3000));
        setGenPhase('modeling'); setGenProgress(50);
        await new Promise(r => setTimeout(r, 2000));
        setGenPhase('synthesis'); setGenProgress(75);

        // Generate Sections
        const sectionsToGenerate = ['executiveSummary', 'marketAnalysis', 'recommendations', 'implementation', 'financials', 'risks'];
        for (const sectionKey of sectionsToGenerate) {
            setReportData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey as keyof ReportData], status: 'generating' } }));
            await generateReportSectionStream(sectionKey, updatedParams, (chunk) => {
                setReportData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey as keyof ReportData], content: chunk } }));
            });
            setReportData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey as keyof ReportData], status: 'completed' } }));
        }

        setGenPhase('complete');
        setGenProgress(100);
        setIsGeneratingReport(false);
        setSavedReports(prev => prev.map(r => r.id === params.id ? { ...r, status: 'complete' } : r));
    }, [params]);


    // --- RENDER ---
    if (!hasEntered) {
        return <LandingPage onEnter={handleEnterApp} onOpenLegal={openLegal} />;
    }

    if (viewMode === 'admin-dashboard') {
        return (
            <div className="h-screen flex flex-col">
                <AdminDashboard />
                <button 
                    onClick={() => setViewMode('command-center')}
                    className="fixed bottom-6 right-6 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-lg text-xs font-bold hover:bg-black transition-colors"
                >
                    Exit Admin Mode
                </button>
            </div>
        );
    }

    if (viewMode === 'legal-hub') {
        return <LegalInfoHub onBack={() => setViewMode('command-center')} initialSection={legalSection} />;
    }

    if (viewMode === 'architect') {
        return <ArchitectPage onBack={() => setViewMode('command-center')} />;
    }

    return (
        <div className="h-screen w-full bg-stone-50 font-sans text-stone-900 flex flex-col overflow-hidden">
            
            {/* PLATINUM HEADER */}
            <header className="bg-white border-b border-stone-200 z-50 shadow-sm h-16 flex-shrink-0 flex items-center justify-between px-6 relative">
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-50"></div>
                
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode('command-center')}>
                    <div className="w-9 h-9 bg-bw-navy rounded-lg flex items-center justify-center shadow-lg border border-bw-navy group-hover:border-bw-gold transition-colors">
                        <LayoutGrid className="w-5 h-5 text-bw-gold" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-bw-navy leading-none tracking-tight group-hover:text-bw-navy/80 transition-colors">
                            BW Nexus AI
                        </h1>
                        <span className="text-[9px] text-bw-gold font-bold uppercase tracking-widest">Intelligence OS</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center bg-stone-100/50 p-1 rounded-lg border border-stone-200">
                    <button
                        onClick={() => setViewMode('report-generator')}
                        className={`flex items-center gap-2 px-6 py-1.5 rounded-md text-xs font-bold transition-all ${
                            viewMode === 'report-generator'
                            ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-200'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Control Matrix
                    </button>
                    <button
                        onClick={() => setViewMode('live-feed')}
                        className={`flex items-center gap-2 px-6 py-1.5 rounded-md text-xs font-bold transition-all ${
                            viewMode === 'live-feed'
                            ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-200'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        System Monitor
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setViewMode('admin-dashboard')}
                        className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                        title="Admin Console"
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={startNewMission}
                        className="hidden lg:flex items-center gap-2 text-xs font-bold text-white bg-bw-navy hover:bg-bw-gold hover:text-bw-navy px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus size={14} /> New Mission
                    </button>
                </div>
            </header>

            {/* MAIN WORKSPACE */}
            <main className="flex-grow w-full overflow-hidden bg-stone-50 flex">
                
                {/* 1. COMMAND CENTER (DASHBOARD) */}
                {viewMode === 'command-center' && (
                    <CommandCenter 
                        savedReports={savedReports}
                        onCreateNew={startNewMission}
                        onLoadReport={loadReport}
                        onOpenInstant={() => setViewMode('partner-management')} 
                        onOpenSimulator={() => setViewMode('live-feed')}
                    />
                )}

                {/* 2. PARTNER MANAGEMENT */}
                {viewMode === 'partner-management' && (
                    <PartnerManagement />
                )}

                {/* 3. SYSTEM MONITOR (Formerly Live Feed) */}
                {viewMode === 'live-feed' && (
                    <MonitorDashboard reports={savedReports} />
                )}

                {/* 4. UNIFIED CONTROL MATRIX (SUPER SYSTEM) */}
                {viewMode === 'report-generator' && (
                    <div className="flex flex-1 w-full overflow-hidden">
                        <MainCanvas 
                            params={params}
                            setParams={setParams}
                            reportData={reportData}
                            isGenerating={isGeneratingReport}
                            generationPhase={genPhase}
                            generationProgress={genProgress}
                            onGenerate={handleGenerateReport}
                            reports={savedReports}
                            onOpenReport={loadReport}
                            onDeleteReport={deleteReport}
                            onNewAnalysis={startNewMission} 
                        />
                        <RightSidebar 
                            insights={insights}
                            isCopilotLoading={isCopilotLoading}
                            onAskCopilot={handleAskCopilot}
                        />
                    </div>
                )}
            </main>

            {/* SYSTEM FOOTER */}
            <footer className="bg-white border-t border-stone-200 py-2 px-6 z-40 flex justify-between items-center text-[9px] text-stone-400 uppercase tracking-widest font-medium shrink-0">
                <div className="flex items-center gap-4">
                    <span className="cursor-default">&copy; {new Date().getFullYear()} BW Global Advisory</span>
                    <span className="w-px h-3 bg-stone-300"></span>
                    <span className="cursor-default">ABN: 55 978 113 300</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => openLegal('privacy')} className="hover:text-stone-600 transition-colors">Privacy</button>
                    <button onClick={() => openLegal('terms')} className="hover:text-stone-600 transition-colors">Terms</button>
                </div>
            </footer>
        </div>
    );
};

export default App;

import React, { useState, useEffect } from "react";
import { Globe, FileText, Target, Zap, Activity, CheckCircle, Cpu } from 'lucide-react';

const SCENARIOS = [
    {
        id: 1,
        title: "Market Entry: Renewable Energy",
        context: { region: "Southeast Asia", industry: "Solar & Wind", capital: "$150M USD" },
        report: {
            docTitle: "Strategic Viability Assessment: SEA Energy Grid",
            summary: "Current grid instability in Vietnam and Philippines presents a high-value arbitrage opportunity for independent power producers (IPP).",
            rationale: "High solar irradiance combined with new Feed-in-Tariff (FiT) policies creates optimal entry window."
        },
        logs: [
            "Initializing Nexus Core v4.0...", "Ingesting context: SEA Energy Grid...",
            "Drafting Executive Summary...", "Scanning regulatory frameworks...",
            "Identifying high-asymmetry partners...", "Calculating IVAS scores...", "Finalizing Dossier..."
        ],
        matches: [
            { name: "Mekong Clean Power", location: "Vietnam", score: 94, readiness: "Priority" },
            { name: "Philippine Agro-Solar", location: "Philippines", score: 86, readiness: "High" }
        ]
    },
    {
        id: 2,
        title: "Supply Chain Resilience",
        context: { region: "Eastern Europe", industry: "Manufacturing", capital: "$75M USD" },
        report: {
            docTitle: "Supply Chain De-Risking: Euro-Zone Mfg",
            summary: "Rising labor costs in East Asia necessitate a near-shoring strategy. Poland and Romania offer 40% lower opex with EU market access.",
            rationale: "Tier-2 supplier networks in Gdansk show 91% compatibility with assembly requirements."
        },
        logs: [
            "Switching Context: Euro-Zone Logistics...", "Synthesizing labor arbitrage data...",
            "Mapping Tier-2 supplier networks...", "Detecting latent industrial assets...",
            "Drafting Strategic Rationale...", "Optimizing for Activation Velocity..."
        ],
        matches: [
            { name: "Gdansk Maritime Services", location: "Poland", score: 91, readiness: "Priority" },
            { name: "Bucharest Tech Park", location: "Romania", score: 84, readiness: "High" }
        ]
    }
];

export default function MatchmakingDemo() {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [phase, setPhase] = useState(0); 
    const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
    const [typedTitle, setTypedTitle] = useState("");
    const [typedSummary, setTypedSummary] = useState("");
    const [showMatches, setShowMatches] = useState(false);
    
    const currentScenario = SCENARIOS[scenarioIndex];

    useEffect(() => {
        let timeout: any;
        let titleInterval: any;
        let summaryInterval: any;

        const runSimulation = async () => {
            setPhase(0); setShowMatches(false); setTypedTitle(""); setTypedSummary(""); setVisibleLogs([]);
            
            await new Promise(r => setTimeout(r, 500));
            setVisibleLogs(prev => [...prev, `> SYSTEM: New Mission Received`]);
            await new Promise(r => setTimeout(r, 400));
            setVisibleLogs(prev => [...prev, `> PARAMS: ${currentScenario.context.industry} | ${currentScenario.context.region}`]);
            
            setPhase(1);
            setVisibleLogs(prev => [...prev, `> AGENT: Strategist drafting executive brief...`]);
            
            let titleIdx = 0;
            const fullTitle = currentScenario.report.docTitle;
            titleInterval = setInterval(() => {
                setTypedTitle(fullTitle.substring(0, titleIdx));
                titleIdx++;
                if (titleIdx > fullTitle.length) clearInterval(titleInterval);
            }, 30);
            
            await new Promise(r => setTimeout(r, 1000));

            let sumIdx = 0;
            const fullSum = currentScenario.report.summary;
            summaryInterval = setInterval(() => {
                setTypedSummary(fullSum.substring(0, sumIdx));
                sumIdx++;
                if (sumIdx > fullSum.length) clearInterval(summaryInterval);
            }, 15);

            await new Promise(r => setTimeout(r, 1500));
            setPhase(2);
            for (let i = 3; i < currentScenario.logs.length; i++) {
                await new Promise(r => setTimeout(r, 600));
                setVisibleLogs(prev => [...prev, `> ${currentScenario.logs[i]}`]);
            }

            setPhase(3);
            setShowMatches(true);
            setVisibleLogs(prev => [...prev, `> DOSSIER COMPLETE.`]);

            timeout = setTimeout(() => {
                setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
            }, 8000);
        };

        runSimulation();
        return () => { clearTimeout(timeout); clearInterval(titleInterval); clearInterval(summaryInterval); };
    }, [scenarioIndex]);

    return (
        <div className="bg-stone-900 flex flex-col md:flex-row h-[500px] border border-stone-800 rounded-2xl overflow-hidden shadow-2xl font-sans">
            <div className="w-full md:w-1/3 bg-black p-6 flex flex-col border-r border-stone-800 relative">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    <span className="ml-auto text-[10px] font-mono text-stone-600 tracking-wider">NEXUS_OS_v4.1</span>
                </div>
                <div className="mb-8 pl-2 border-l-2 border-stone-800">
                    <h3 className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-1">Engine Status</h3>
                    <div className="flex items-center gap-3">
                        {phase === 1 || phase === 2 ? <Activity className="w-5 h-5 text-blue-500 animate-pulse" /> : phase === 3 ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Cpu className="w-5 h-5 text-stone-600" />}
                        <span className={`text-lg font-mono font-bold ${phase === 1 || phase === 2 ? 'text-blue-400' : phase === 3 ? 'text-green-400' : 'text-stone-300'}`}>
                            {phase === 0 ? "STANDBY" : phase === 1 ? "DRAFTING" : phase === 2 ? "MATCHING" : "COMPLETE"}
                        </span>
                    </div>
                </div>
                <div className="flex-grow font-mono text-[10px] leading-relaxed space-y-2 overflow-hidden text-green-400/90 relative">
                    {visibleLogs.map((log, i) => (
                        <div key={i} className="animate-in fade-in border-l-2 border-transparent pl-2 hover:border-green-900/50 transition-colors truncate">
                            <span className="opacity-40 mr-2 text-green-200">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>{log}
                        </div>
                    ))}
                    {(phase === 1 || phase === 2) && <div className="animate-pulse text-green-500 pl-2">_</div>}
                </div>
            </div>

            <div className="w-full md:w-2/3 bg-stone-100 p-8 relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className={`w-full max-w-lg bg-white shadow-xl rounded-sm border border-stone-200 min-h-[400px] flex flex-col transition-all duration-700 transform ${phase > 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="p-6 border-b border-stone-100 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-3 opacity-50">
                                <Globe className="w-3 h-3 text-stone-400" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Nexus Intelligence Dossier</span>
                            </div>
                            <h2 className="text-xl font-serif font-bold text-stone-900 leading-tight min-h-[3rem]">{typedTitle}</h2>
                        </div>
                        {phase === 3 && <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider animate-in fade-in">Verified</div>}
                    </div>
                    <div className="p-6 flex-grow space-y-6">
                        <div className={`transition-opacity duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText className="w-3 h-3" /> Executive Summary</h4>
                            <p className="text-xs text-stone-700 leading-relaxed font-serif border-l-2 border-blue-500 pl-3 min-h-[3rem]">{typedSummary}</p>
                        </div>
                        <div className={`transition-all duration-700 delay-300 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap className="w-3 h-3" /> Strategic Rationale</h4>
                            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded border border-stone-100">{currentScenario.report.rationale}</p>
                        </div>
                        {showMatches && (
                            <div className="animate-in slide-in-from-bottom-2 fade-in">
                                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-3 h-3" /> Identified Partners</h4>
                                <div className="space-y-2">
                                    {currentScenario.matches.map((m, i) => (
                                        <div key={i} className="flex justify-between items-center p-2 border border-stone-200 rounded hover:border-blue-300 transition-colors bg-white shadow-sm">
                                            <div>
                                                <div className="font-bold text-xs text-stone-900">{m.name}</div>
                                                <div className="text-[9px] text-stone-500 uppercase">{m.location} • {m.readiness}</div>
                                            </div>
                                            <div className="text-right"><div className="text-sm font-bold text-blue-600">{m.score}</div><div className="text-[8px] text-stone-400 font-bold uppercase">Score</div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

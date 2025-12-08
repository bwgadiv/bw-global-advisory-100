
import React, { useState, useEffect } from 'react';
import { Moon, Shield, Flame, Terminal, MessageSquare, ArrowRight, Activity } from 'lucide-react';

const USE_CASES = [
    {
        title: "The 2 AM Epiphany",
        icon: <Moon className="w-6 h-6 text-indigo-400" />,
        quote: "Woke up with a concern about currency risk? Don't wait for Monday.",
        action: "Type it into the Workbench. Get a risk mitigation strategy before breakfast."
    },
    {
        title: "The Silent Board Member",
        icon: <Shield className="w-6 h-6 text-emerald-400" />,
        quote: "In a negotiation? Feed the counter-party's terms into the Notepad.",
        action: "Let the AI run a 'Deal Killer' analysis in the background while you talk."
    },
    {
        title: "The Devil's Advocate",
        icon: <Flame className="w-6 h-6 text-red-400" />,
        quote: "Think your strategy is perfect? Ask the Workbench to 'Attack this Plan.'",
        action: "It will simulate adversarial scenarios to find your blind spots."
    }
];

export const WorkbenchFeature: React.FC = () => {
    const [typedText, setTypedText] = useState('');
    const fullText = "I'm worried about port congestion affecting my supply chain in Vietnam...";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.substring(0, index));
            index++;
            if (index > fullText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-bw-navy text-white relative overflow-hidden border-t border-stone-800">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#b49b67 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest mb-6 text-bw-gold">
                        <Activity className="w-4 h-4" /> Live Collaboration Layer
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                        The Neural Workbench: <br/>
                        <span className="text-stone-400">Your Always-On Strategic Partner.</span>
                    </h2>
                    <p className="text-lg text-stone-300 leading-relaxed">
                        You provide the raw intent. We provide the architectural logic. 
                        It acts as a friction-free bridge between your intuition and our calculation.
                    </p>
                </div>

                {/* The Visual Demo (Split Screen) */}
                <div className="grid lg:grid-cols-2 gap-0 border border-stone-700 rounded-xl overflow-hidden shadow-2xl mb-20 bg-black/40 backdrop-blur-sm">
                    
                    {/* Left: User Input */}
                    <div className="p-8 border-b lg:border-b-0 lg:border-r border-stone-700 bg-white/5">
                        <div className="flex items-center gap-2 mb-4 text-stone-400 text-xs font-bold uppercase tracking-widest">
                            <MessageSquare className="w-4 h-4" /> Your Strategic Notepad
                        </div>
                        <div className="h-48 font-serif text-xl text-white/90 leading-relaxed">
                            "{typedText}<span className="animate-pulse text-bw-gold">|</span>"
                        </div>
                        <div className="text-xs text-stone-500 mt-4">Status: Listening...</div>
                    </div>

                    {/* Right: System Reaction */}
                    <div className="p-8 bg-black/60 font-mono text-xs relative">
                        <div className="flex items-center gap-2 mb-6 text-green-500 font-bold uppercase tracking-widest">
                            <Terminal className="w-4 h-4" /> System Logic Path
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-center animate-in slide-in-from-left-4 fade-in duration-500 delay-100">
                                <span className="text-stone-500">[00:01]</span>
                                <span className="text-blue-400">DETECTED INTENT:</span>
                                <span className="text-white">Logistics Risk / Supply Chain</span>
                            </div>
                            <div className="flex gap-3 items-center animate-in slide-in-from-left-4 fade-in duration-500 delay-300">
                                <span className="text-stone-500">[00:02]</span>
                                <span className="text-purple-400">ACTIVATING:</span>
                                <span className="text-white">Trade Disruption Simulator</span>
                            </div>
                            <div className="flex gap-3 items-center animate-in slide-in-from-left-4 fade-in duration-500 delay-500">
                                <span className="text-stone-500">[00:03]</span>
                                <span className="text-orange-400">RETRIEVING:</span>
                                <span className="text-white">Vietnam Port Throughput Data (2024)</span>
                            </div>
                            <div className="flex gap-3 items-center animate-in slide-in-from-left-4 fade-in duration-500 delay-700">
                                <span className="text-stone-500">[00:04]</span>
                                <span className="text-green-400">GENERATING:</span>
                                <span className="text-white">Mitigation Strategy Beta...</span>
                            </div>
                        </div>
                        
                        {/* Floating Badge */}
                        <div className="absolute bottom-6 right-6 px-3 py-1 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-[10px] font-bold uppercase">
                            Auto-Provisioning Active
                        </div>
                    </div>
                </div>

                {/* The Use Cases */}
                <div className="grid md:grid-cols-3 gap-8">
                    {USE_CASES.map((useCase, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors group">
                            <div className="mb-6 p-3 bg-white/5 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                                {useCase.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">{useCase.title}</h3>
                            <p className="text-stone-300 text-sm mb-4 italic">"{useCase.quote}"</p>
                            <div className="h-px w-full bg-white/10 mb-4"></div>
                            <p className="text-stone-400 text-xs font-medium leading-relaxed flex gap-2">
                                <ArrowRight className="w-4 h-4 shrink-0 text-bw-gold" />
                                {useCase.action}
                            </p>
                        </div>
                    ))}
                </div>

                {/* The "Clarifier" Disclaimer */}
                <div className="mt-20 p-8 bg-stone-100 rounded-sm text-center border-l-4 border-bw-gold shadow-lg">
                    <h4 className="text-bw-navy font-serif font-bold text-2xl mb-3">The Great Clarifier.</h4>
                    <p className="text-stone-600 max-w-3xl mx-auto leading-relaxed">
                        This system is not designed to compete with human expertise. Whether you are an <strong>expert</strong> performing daily due diligence, or a <strong>novice</strong> unsure of where to start, the Neural Workbench exists to clarify confusion. It organizes the chaos of regional data into a coherent structure, allowing you to build with confidence.
                    </p>
                </div>

            </div>
        </section>
    );
};

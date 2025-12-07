
import React, { useState } from 'react';
import { ReportParameters } from '../types';
import { 
    Terminal, Play, CheckCircle2, ShieldAlert, 
    Globe, Lock, ArrowRight, FileText, Cpu, Target, Layers
} from 'lucide-react';

interface CommandCenterProps {
    savedReports: ReportParameters[];
    onCreateNew: () => void;
    onLoadReport: (report: ReportParameters) => void;
    onOpenInstant: () => void;
    onOpenSimulator: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ 
    onCreateNew,
    onOpenSimulator
}) => {
    const [accepted, setAccepted] = useState(false);

    return (
        <div className="h-full w-full flex-1 bg-stone-50 flex items-start justify-center p-6 pt-16 pb-24 font-sans overflow-y-auto">
            <div className="max-w-6xl w-full bg-white shadow-2xl border border-stone-200 rounded-sm overflow-hidden flex flex-col md:flex-row min-h-[650px]">
                
                {/* Left Panel: Introduction */}
                <div className="md:w-7/12 bg-bw-navy p-12 text-white flex flex-col relative overflow-hidden">
                    {/* Background Tech pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}>
                    </div>

                    <div className="relative z-10 mb-auto">
                        <div className="flex items-center gap-2 text-bw-gold font-bold tracking-widest text-xs uppercase mb-6">
                            <Layers size={14} /> Nexus Intelligence OS v4.2
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight text-white">
                            Early-Stage Clarity for <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bw-gold to-white">
                                Regional Markets.
                            </span>
                        </h1>
                        <div className="text-gray-300 text-sm leading-relaxed mb-10 border-l-2 border-bw-gold pl-6 max-w-xl space-y-4">
                            <p>
                                <strong>This system does not replace your current infrastructure.</strong> It is designed for early-stage understanding, bridging the critical data gap inherent in doing business with regional cities across the world.
                            </p>
                            <p>
                                Whether operating as a standalone engine or integrated into your existing stack, it calculates the "missing layer" of intelligence—local regulatory friction, cultural alignment, and operational viability—before you commit capital.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-8">
                        {/* Step 01 */}
                        <div className="flex gap-5 group">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-bw-gold/30 bg-bw-gold/10 flex items-center justify-center text-bw-gold font-bold text-lg group-hover:bg-bw-gold group-hover:text-bw-navy transition-all duration-300">
                                01
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                                    Input Context <Target size={14} className="text-bw-gold opacity-50" />
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                                    <strong>How to use:</strong> Simply define your target regional city (e.g., "Newcastle", "Da Nang") and your intent (e.g., "Manufacturing Hub"). The system instantly calibrates against local economic physics.
                                </p>
                            </div>
                        </div>

                        {/* Step 02 */}
                        <div className="flex gap-5 group">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-bw-gold/30 bg-bw-gold/10 flex items-center justify-center text-bw-gold font-bold text-lg group-hover:bg-bw-gold group-hover:text-bw-navy transition-all duration-300">
                                02
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                                    Gap Analysis <Cpu size={14} className="text-bw-gold opacity-50" />
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                                    <strong>The Mechanism:</strong> Our agent swarm cross-references your intent against 100 years of regional data to identify specific "blind spots" your current global systems might miss.
                                </p>
                            </div>
                        </div>

                        {/* Step 03 */}
                        <div className="flex gap-5 group">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-bw-gold/30 bg-bw-gold/10 flex items-center justify-center text-bw-gold font-bold text-lg group-hover:bg-bw-gold group-hover:text-bw-navy transition-all duration-300">
                                03
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                                    The Deliverable <FileText size={14} className="text-bw-gold opacity-50" />
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                                    <strong>What you receive:</strong> A concrete "Pre-Feasibility Dossier". This contains a calculated <strong>Success Probability Score</strong>, a vetted <strong>Partner Shortlist</strong>, and a roadmap to navigate local complexity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Terms & Entry */}
                <div className="md:w-5/12 p-10 flex flex-col bg-stone-50 border-l border-stone-200">
                    <div className="flex-1">
                        <h3 className="text-bw-navy font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-bw-gold" /> Terms of Engagement & Compliance
                        </h3>

                        <div className="space-y-4 text-xs text-stone-600 bg-white p-6 rounded-sm border border-stone-200 h-80 overflow-y-auto custom-scrollbar shadow-inner">
                            <p><strong className="text-stone-900 block mb-1">1. Complementary System Architecture</strong> This system is an "Early-Stage Intelligence Layer". It is designed to operate upstream of your existing CRM, ERP, or Investment Committee processes. It provides the initial "Go/No-Go" signals for regional engagement.</p>
                            
                            <p><strong className="text-stone-900 block mb-1">2. Decision Support & Authority</strong> BW Global Advisory provides insights for informational purposes. The Nexus OS outputs are probabilistic. Users operating at 'Novice' levels should verify insights with 'Expert' domain holders. Strategic decisions remain the sole responsibility of the user.</p>
                            
                            <p><strong className="text-stone-900 block mb-1">3. Data Privacy & Sovereignty</strong> We adhere to strict GDPR and local data sovereignty laws. Custom operational data (Revenue, Headcount) and specific strategic intents are isolated. No user-specific data is used to train public foundation models.</p>
                            
                            <p><strong className="text-stone-900 block mb-1">4. Financial & Operational Models</strong> The SCF (Strategic Cash Flow) and IVAS (Investment Viability Assessment) models are simulations based on provided Operational Scale and historical benchmarks. They do not constitute financial advice and scale dynamically with input granularity.</p>
                            
                            <p><strong className="text-stone-900 block mb-1">5. Historical Context & Predictive Limits</strong> The system utilizes a proprietary dataset spanning ~1925-2025 (100 Years) to identify long-wave economic cycles and failure patterns. Users acknowledge that past performance is used for predictive modeling only. Black swan events outside the training data may impact accuracy.</p>
                            
                            <p><strong className="text-stone-900 block mb-1">6. Autonomous Agent Liability</strong> The system deploys semi-autonomous AI agents ("Scout", "Diplomat", "Strategist") to construct intelligence dossiers. While these agents operate within strict ethical guardrails, their outputs are generative. Users must validate critical data points.</p>
                            
                            <p><strong className="text-stone-900 block mb-1">7. Neuro-Symbolic Logic Gatekeepers</strong> The "Gatekeeper Protocol" enforces logical consistency checks on user inputs. The system reserves the right to halt analysis if inputs contradict established economic physics or fail the 100-Point checklist, ensuring integrity of the final dossier.</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-stone-200 pt-8">
                        <label className="flex items-center gap-3 cursor-pointer mb-8 select-none group">
                            <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${accepted ? 'bg-bw-navy border-bw-navy' : 'bg-white border-stone-300 group-hover:border-bw-navy'}`}>
                                {accepted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
                            <span className="text-sm font-bold text-stone-700">I accept terms to unlock system access</span>
                        </label>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={onCreateNew}
                                disabled={!accepted}
                                className="w-full bg-bw-navy text-white py-4 px-6 rounded-sm font-bold text-sm uppercase tracking-wide flex items-center justify-between gap-2 hover:bg-bw-gold hover:text-bw-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg group"
                            >
                                <span className="flex items-center gap-3">{!accepted ? <Lock size={16} /> : <Play size={16} />} Initialize Intelligence Hub</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <button 
                                onClick={onOpenSimulator}
                                className="w-full bg-white text-stone-600 border border-stone-300 py-3 px-6 rounded-sm font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-stone-100 hover:text-stone-900 transition-all"
                            >
                                <Globe size={14} />
                                View System Monitor
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CommandCenter;

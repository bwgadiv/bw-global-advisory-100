import React from 'react';
import { Database, Filter, Scale, FileText } from 'lucide-react';

const steps = [
  { 
      id: '01',
      icon: <Database className="w-6 h-6" />,
      title: 'Historical Context Ingestion', 
      desc: 'The system ingests your mission parameters and instantly cross-references them against a century of economic case studies, identifying the root causes of failure for similar ventures before analysis begins.' 
  },
  { 
      id: '02',
      icon: <Filter className="w-6 h-6" />,
      title: 'Adversarial Stress-Testing', 
      desc: 'We reject "Tier-1 Bias"—the flawed assumption that strategies from mature markets work everywhere. The system’s agents actively attack your strategy, simulating real-world friction to expose hidden failure points.' 
  },
  { 
      id: '03',
      icon: <Scale className="w-6 h-6" />,
      title: 'Arbitrage Quantification', 
      desc: 'Our core engines (IVAS™, SPI™) calculate the arbitrage opportunity. We find "Asymmetry"—high value, low visibility—and quantify the gap between a region’s market perception and its actual economic potential.' 
  },
  { 
      id: '04',
      icon: <FileText className="w-6 h-6" />,
      title: 'Probabilistic Dossier', 
      desc: 'The output is not a generic report. It is a "Probability Dossier" containing a calculated success score and a deterministic roadmap to mitigate the exact failure points identified in the stress-testing phase.' 
  },
];

export const Insights: React.FC = () => {
  return (
    <section id="methodology" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
                <h2 className="text-bw-gold font-bold uppercase tracking-widest text-xs mb-3">Methodology</h2>
                <h3 className="text-3xl font-serif font-bold text-bw-navy mb-6">Industrialized Intelligence.</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Most firms offer opinions. The BWGA System provides mathematical proof. We have industrialized the process of strategic foresight into a repeatable, four-stage analytical loop that replaces guesswork with calculation.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    This is not a static database; it is an active simulation. Autonomous AI agents model how your specific strategy will interact with the real-world friction of your target market, predicting outcomes before capital is deployed.
                </p>
                <div className="p-6 bg-bw-navy text-white rounded-sm border-l-4 border-bw-gold">
                    <div className="text-xl font-serif italic mb-4">"We don't find the safe bet. We calculate the mispriced one."</div>
                    <div className="text-xs font-bold text-bw-gold uppercase tracking-widest">— The Nexus Mandate</div>
                </div>
            </div>

            <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {steps.map((step) => (
                        <div key={step.id} className="relative group">
                            <div className="absolute -inset-2 bg-stone-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative p-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-white border border-stone-200 rounded-lg flex items-center justify-center text-bw-navy shadow-sm group-hover:border-bw-gold transition-colors">
                                        {step.icon}
                                    </div>
                                    <span className="text-4xl font-bold text-stone-200 group-hover:text-stone-300 transition-colors">{step.id}</span>
                                </div>
                                <h4 className="text-lg font-bold text-bw-navy mb-2">{step.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-stone-200 pl-4 group-hover:border-bw-gold transition-colors">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};
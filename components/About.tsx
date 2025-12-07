
import React from 'react';
import { Cpu, Globe, Activity, Layers } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="identity" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            
            {/* Left: Text Content */}
            <div>
                <div className="mb-12">
                    <h2 className="text-bw-gold font-bold uppercase tracking-widest text-xs mb-3">System Philosophy</h2>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-bw-navy leading-tight mb-6">
                    The Interface Between <br/>Global Capital and Regional Reality.
                    </h3>
                </div>

                <div className="space-y-12">
                    {/* Our Mandate */}
                    <div className="relative pl-8 border-l-2 border-stone-200 hover:border-bw-gold transition-colors duration-300 group">
                        <div className="absolute -left-[9px] top-0 bg-white py-1 transition-transform group-hover:scale-110">
                            <Globe className="w-4 h-4 text-bw-gold" />
                        </div>
                        <h4 className="text-xl font-bold text-bw-navy mb-3">Our Global Mandate</h4>
                        <h5 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-2">Visibility Creates Opportunity.</h5>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            We operate on the belief that economic potential is evenly distributed, but visibility is not. Our mandate is to illuminate the value in regional markets that are often overshadowed by major global hubs.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-sm mt-2">
                            By providing a standardized, mathematical assessment of these regions, we lower the risk barrier for international investors and allow local economies to prove their worth based on data, not just reputation.
                        </p>
                    </div>

                    {/* Operational Philosophy */}
                    <div className="relative pl-8 border-l-2 border-stone-200 hover:border-bw-gold transition-colors duration-300 group">
                        <div className="absolute -left-[9px] top-0 bg-white py-1 transition-transform group-hover:scale-110">
                            <Cpu className="w-4 h-4 text-bw-gold" />
                        </div>
                        <h4 className="text-xl font-bold text-bw-navy mb-3">Deterministic Intelligence</h4>
                        <h5 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-2">Calculated, Not Curated.</h5>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            This is not a consultancy that sells subjective advice. This is an <strong>Intelligence Operating System</strong>. 
                        </p>
                        <p className="text-gray-600 leading-relaxed text-sm mt-2">
                            It ingests strategic intent and stress-tests it against a century of economic precedent, replacing "expert opinion" with calculated probability. We don't guess if a strategy will work; we calculate the likelihood of it failing.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: The Visual */}
            <div className="relative h-full min-h-[500px] flex items-center justify-center">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-3/4 h-full bg-stone-100 rounded-sm -z-10 transform translate-x-4 translate-y-4"></div>
                
                {/* Main Image Container */}
                <div className="relative h-full w-full rounded-sm overflow-hidden shadow-2xl border border-stone-200 group">
                    <img 
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2301" 
                        alt="Global Architecture" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-bw-navy/20 mix-blend-multiply pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>
                    
                    {/* Floating Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 border-l-4 border-bw-gold shadow-lg">
                        <div className="flex items-center gap-4">
                            <Activity className="w-8 h-8 text-bw-navy animate-pulse" />
                            <div>
                                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">System Status</div>
                                <div className="text-lg font-bold text-bw-navy leading-none">Operational & Calculating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 pt-12">
            {[
                { val: '21', label: 'Proprietary Engines', icon: <Layers className="w-4 h-4 mb-2 text-bw-gold" /> },
                { val: '100y', label: 'Economic Cycles Indexed', icon: <Activity className="w-4 h-4 mb-2 text-bw-gold" /> },
                { val: '9+', label: 'Autonomous Agent Nodes', icon: <Cpu className="w-4 h-4 mb-2 text-bw-gold" /> },
                { val: '195', label: 'Jurisdictions Mapped', icon: <Globe className="w-4 h-4 mb-2 text-bw-gold" /> },
            ].map((stat, i) => (
                <div key={i} className="text-center md:text-left group cursor-default">
                    {stat.icon}
                    <div className="text-4xl font-serif font-bold text-bw-navy group-hover:text-bw-gold transition-colors duration-300">{stat.val}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">{stat.label}</div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

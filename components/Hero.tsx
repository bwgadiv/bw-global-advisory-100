
import React, { useEffect, useState } from 'react';
import { ArrowDown, Activity, Database, Radio, ScanLine, Binary } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onOpenSystem: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSystem }) => {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center bg-bw-navy">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2600&q=80" 
          alt="Urban Complexity" 
          className="w-full h-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bw-navy via-bw-navy/95 to-bw-navy/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 md:px-12 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left: The Narrative */}
            <div className="lg:col-span-7 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-bw-gold/10 border border-bw-gold/30 rounded-full text-bw-gold text-xs font-bold uppercase tracking-widest mb-6">
                        <Binary size={14} /> The Intelligence Gap
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-[1.1] mb-8">
                        We didn't just build a database. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bw-gold to-white">
                            We codified the physics of an invisible economy.
                        </span>
                    </h1>

                    <div className="space-y-8 text-lg text-gray-300 max-w-3xl leading-relaxed font-light border-l-2 border-stone-700 pl-6">
                        <p className="text-white font-medium">
                            Regional markets are not chaotic; they are simply complex. They operate on a different frequency than global capitals, driven by relationships and informal networks.
                        </p>
                        <p>
                            We architected the <strong className="text-bw-gold">Regional Intelligence Core</strong> to decode this frequency. It is not a passive consultancy tool; it is a deterministic engine designed to translate the specific "blind spots" of regional expansion into the language of global capital.
                        </p>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                        <div onClick={onOpenSystem} className="cursor-pointer group flex items-center gap-4 flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-bw-gold flex items-center justify-center shadow-lg shadow-bw-gold/20 group-hover:bg-white transition-all duration-300">
                                <ArrowDown className="text-bw-navy w-6 h-6 transition-colors" />
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase tracking-widest mb-1">Initiate Protocol</span>
                                <span className="text-white font-bold text-lg group-hover:text-bw-gold transition-colors">Enter The System</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right: The Visual */}
            <div className="lg:col-span-5 relative">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative"
                >
                    {/* Visual Element */}
                    <div className="h-[400px] w-full rounded-sm overflow-hidden border border-gray-700 bg-black/80 shadow-2xl relative group mb-6">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20"></div>
                        
                        {/* Scanning Effect */}
                        <div 
                            className="absolute inset-0 border-b-2 border-bw-gold/50 shadow-[0_0_20px_rgba(180,155,103,0.3)] z-20 transition-all duration-100 ease-linear"
                            style={{ height: `${scanLine}%` }}
                        />
                        
                        {/* Data Points */}
                        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-red-500 rounded-full" />
                        
                        <div className="absolute bottom-[40%] right-[30%] w-2 h-2 bg-bw-gold rounded-full animate-ping delay-700" />
                        <div className="absolute bottom-[40%] right-[30%] w-2 h-2 bg-bw-gold rounded-full delay-700" />

                        {/* HUD */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] font-mono text-gray-500 uppercase">
                            <span>Target: Regional Blind Spots</span>
                            <span>Parsing Economic Physics...</span>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg max-w-xs">
                                <ScanLine className="w-8 h-8 text-bw-gold mx-auto mb-2 animate-pulse" />
                                <div className="text-white font-bold text-lg">System Active</div>
                                <div className="text-xs text-gray-400 mt-1">Calculated Probability Engine</div>
                            </div>
                        </div>
                    </div>

                    {/* Narrative Callout */}
                    <div className="bg-stone-900 border-l-4 border-bw-gold p-6 rounded-r-lg shadow-xl relative overflow-hidden">
                        <h3 className="text-bw-gold font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                            <Radio className="w-4 h-4 animate-pulse" /> The Core Mandate
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed relative z-10">
                            "We don't guess. We calculate. By giving regional markets a standardized data language, we give them a fair chance to compete for global capital."
                        </p>
                    </div>
                </motion.div>
            </div>

        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { LayoutGrid, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenSystem: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSystem }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-bw-navy/95 backdrop-blur-md py-4 shadow-xl border-b border-white/5' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-bw-gold/50 transition-colors shadow-lg">
                <LayoutGrid className="w-5 h-5 text-bw-gold" />
            </div>
            <div className="flex flex-col">
                <h1 className={`text-lg font-bold leading-none tracking-tight ${scrolled ? 'text-white' : 'text-white'}`}>
                    BW Global AI
                </h1>
                <span className="text-[9px] text-bw-gold font-bold uppercase tracking-widest">Intelligence Core</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenSystem}
            className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-bold text-bw-navy transition-all duration-300 bg-bw-gold rounded-sm hover:bg-white focus:outline-none"
          >
            <span className="relative text-xs uppercase tracking-wider flex items-center">
              System Access <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

        </div>
      </div>
    </nav>
  );
};

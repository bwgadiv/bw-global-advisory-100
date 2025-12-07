
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useEscapeKey from '../hooks/useEscapeKey';
import { X, Mail, Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { ReportParameters } from '../types';
import { PrecedentMatchingEngine } from '../services/historicalDataEngine';

interface LetterGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (reportContent: string, reportParameters: any) => Promise<string>;
  reportContent: string;
  reportParameters: any;
}

export const LetterGeneratorModal: React.FC<LetterGeneratorModalProps> = ({ 
  isOpen, 
  onClose, 
  onGenerate, 
  reportContent, 
  reportParameters 
}) => {
  useEscapeKey(onClose);
  const [letterContent, setLetterContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [letterType, setLetterType] = useState<'formal' | 'precedent_based' | 'strategic' | 'investment'>('strategic');

  const generatePrecedentBasedLetter = useCallback((): string => {
    const precedents = PrecedentMatchingEngine.findMatches(reportParameters as ReportParameters, 0.65);
    const bestMatch = precedents[0];
    const caseStudy = bestMatch?.historicalCase;

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const orgName = reportParameters.organizationName || 'Our Organization';
    const country = reportParameters.country || 'your target market';
    
    // Fallback if no precedent
    if (!caseStudy) return generateFormalLetter();

    const roiAchieved = caseStudy.outcomes.roiAchieved ? `${caseStudy.outcomes.roiAchieved}x ROI` : 'significant value creation';

    return `
${today}

To: Minister of Investment / Economic Development Board
Re: STRATEGIC FDI PROPOSAL - ${orgName.toUpperCase()} MARKET ENTRY

Dear [Name/Title],

${orgName} has completed a comprehensive strategic assessment of the ${country} market. Our deterministic analysis, powered by the Nexus Intelligence Engine, indicates a high-probability alignment between our operational capabilities and your national economic objectives.

EVIDENCE-BASED PRECEDENT:
Our due diligence team has analyzed historical investment patterns and identified a critical precedent: the ${caseStudy.id} initiative in ${caseStudy.country} (${caseStudy.year}).

That initiative achieved:
• ${caseStudy.outcomes.jobsCreated?.toLocaleString() || 'Significant'} high-value jobs created
• ${roiAchieved}
• ${caseStudy.outcomes.result === 'success' ? 'Sustainable, long-term operations' : 'Critical infrastructure development'}

We believe ${orgName} is positioned to replicate and exceed these metrics.

PROPOSED ENGAGEMENT:
We are prepared to deploy an initial capital investment (est. ${reportParameters.calibration?.constraints?.budgetCap || 'TBD'}) focused on:
1. ${reportParameters.strategicIntent || 'Market Expansion'}
2. Technology Transfer & Skills Development
3. Supply Chain Integration

TIMELINE:
Our models indicate an optimal entry window within the next ${reportParameters.expansionTimeline || '12 months'}. We request an exploratory dialogue to discuss specific incentive frameworks that would accelerate this timeline.

We await your guidance on the appropriate next steps.

Sincerely,

[Your Name]
${orgName}
[Your Title]
[Contact Information]
`;
  }, [reportParameters]);

  const generateFormalLetter = (): string => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const orgName = reportParameters.organizationName || 'Our Organization';
    const country = reportParameters.country || 'your target market';

    return `
${today}

To Whom It May Concern,

PARTNERSHIP OPPORTUNITY: Strategic Investment in ${country}

${orgName} is exploring partnership opportunities in ${country} and believes your organization would be an excellent match for this initiative.

OPPORTUNITY OVERVIEW:
We are seeking to establish operations in ${country} with the strategic intent to ${reportParameters.strategicIntent || 'expand our market presence'}. This represents a significant opportunity for mutual value creation.

KEY CONSIDERATIONS:
• Target Region: ${country}
• Investment Scale: ${reportParameters.calibration?.constraints?.budgetCap || 'TBD'}
• Target Partners: ${reportParameters.targetCounterpartType || 'Strategic partners'}
• Timeline: ${reportParameters.expansionTimeline || '18-24 months'} to positive ROI

NEXT STEPS:
We would like to propose an initial meeting to discuss:
1. Your organization's capabilities and interest in this market
2. Potential areas of collaboration and partnership structure
3. Commercial terms and mutual value creation

We anticipate reaching a framework agreement within 60 days.

ENGAGEMENT:
Please respond to indicate your availability for a call or meeting within the next two weeks.

Best regards,

[Your Name]
${orgName}
[Your Title]
[Your Contact Information]
`;
  };

  const generateLetterContent = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setCopySuccess('');

    // Simulate "thinking" time for the consultancy feel
    await new Promise(r => setTimeout(r, 1200));

    try {
      let content = '';
      if (letterType === 'precedent_based') {
        content = generatePrecedentBasedLetter();
      } else if (letterType === 'formal') {
        content = generateFormalLetter();
      } else {
        // Default to precedent based for now as it's the "smartest"
        content = generatePrecedentBasedLetter(); 
      }
      setLetterContent(content);
    } catch (e) {
      setError("Failed to generate letter content.");
    } finally {
      setIsGenerating(false);
    }
  }, [letterType, generatePrecedentBasedLetter]);

  useEffect(() => {
    if (isOpen) {
      generateLetterContent();
    }
  }, [isOpen, letterType, generateLetterContent]);

  const handleCopyToClipboard = () => {
    if (!letterContent) return;
    navigator.clipboard.writeText(letterContent).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white border border-stone-200 rounded-xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-stone-100 bg-stone-50 flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-sm">
                  <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">Strategic Outreach Engine</h2>
                <p className="text-xs text-stone-500">Auto-generate correspondence based on analytical findings.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 bg-stone-200/50 p-1 rounded-lg w-fit">
            {(['formal', 'precedent_based', 'strategic'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLetterType(type as any)}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                  letterType === type
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {type === 'formal' && 'Standard Formal'}
                {type === 'precedent_based' && 'Evidence-Based (AI)'}
                {type === 'strategic' && 'Gov. Relations'}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-8 bg-stone-50/30">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-500 gap-4">
              <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
              <div className="text-center">
                  <p className="font-bold text-stone-900">Synthesizing Outreach Strategy...</p>
                  <p className="text-xs text-stone-400 mt-1">Calibrating tone for {reportParameters.country} cultural norms</p>
              </div>
            </div>
          ) : (
            <div className="relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <FileText size={100} />
                </div>
                <textarea
                readOnly
                value={letterContent}
                className="w-full h-[500px] p-8 bg-white border border-stone-200 rounded-lg text-stone-800 font-serif text-sm leading-relaxed resize-none focus:outline-none shadow-sm"
                placeholder="Letter content will appear here..."
                />
            </div>
          )}
        </main>

        <footer className="p-4 border-t border-stone-200 flex-shrink-0 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            {letterType === 'precedent_based' && (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Optimized using historical success factors</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {copySuccess && (
              <span className="text-xs text-green-600 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                <CheckCircle className="w-3 h-3" /> {copySuccess}
              </span>
            )}
            <button
              onClick={handleCopyToClipboard}
              disabled={isGenerating || !letterContent}
              className="px-6 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-black transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Copy to Clipboard
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

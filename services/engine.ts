import { 
    ReportParameters, 
    MarketShare, 
    MarketOpportunity, 
    DiversificationAnalysis,
    OrchResult,
    RROI_Index,
    SEAM_Blueprint,
    SymbioticPartner,
    SPIResult,
    EthicalCheckResult,
    EthicsStatus,
    EthicsFlag,
    MitigationStep
} from '../types';
import { GLOBAL_CITY_DATABASE } from '../constants';

// --- 1. MARKET DIVERSIFICATION ENGINE ---

export class MarketDiversificationEngine {
  static calculateHHI(markets: MarketShare[]): number {
    return markets.reduce((acc, m) => acc + Math.pow(m.share, 2), 0);
  }

  static analyzeConcentration(markets: MarketShare[]): DiversificationAnalysis {
    const hhi = this.calculateHHI(markets);
    let riskLevel: DiversificationAnalysis['riskLevel'] = 'Diversified';
    let analysis = "Portfolio is well-balanced.";

    if (hhi > 2500) {
      riskLevel = 'High Concentration';
      analysis = "Significant dependency on primary market detected. Recommendation: Immediate diversification.";
    } else if (hhi > 1500) {
      riskLevel = 'Moderate Concentration';
      analysis = "Portfolio shows moderate concentration. Monitor key market volatility.";
    }

    // Mock recommendations based on typical diversification strategies
    const recommendedMarkets: MarketOpportunity[] = [
      {
        country: 'Vietnam',
        growthRate: 6.8,
        easeOfEntry: 65,
        talentAvailability: 70,
        innovationIndex: 55,
        regulatoryFriction: 60,
        marketSize: '$400B',
        opportunityScore: 88,
        recommendedStrategy: 'Supply Chain Hedge',
        rationale: 'High growth potential with lower labor costs creates an ideal hedge against East Asian concentration.'
      },
      {
        country: 'Poland',
        growthRate: 4.5,
        easeOfEntry: 80,
        talentAvailability: 85,
        innovationIndex: 75,
        regulatoryFriction: 30,
        marketSize: '$700B',
        opportunityScore: 82,
        recommendedStrategy: 'Nearshoring Hub',
        rationale: 'Excellent technical talent pool and EU market access offers stability and quality.'
      },
      {
        country: 'Mexico',
        growthRate: 3.2,
        easeOfEntry: 75,
        talentAvailability: 65,
        innovationIndex: 60,
        regulatoryFriction: 45,
        marketSize: '$1.3T',
        opportunityScore: 79,
        recommendedStrategy: 'Logistics Proximity',
        rationale: 'Strategic proximity to North American markets minimizes logistics risks.'
      }
    ];

    return {
      hhiScore: hhi,
      riskLevel,
      concentrationAnalysis: analysis,
      recommendedMarkets
    };
  }
}

// --- 2. INVESTMENT VELOCITY & ACTIVATION SCORE (IVAS) ENGINE ---

const calculateIVAS = (marketSizeUSD: number, partnerQualityScore: number, regulatoryFriction: number) => {
    // Formula: IVAS = (OppQuantum * 0.45) + (SymbioticConfidence * 0.45) + ((1 - Friction) * 0.1)
    
    // 1. Opportunity Quantum (Log-normalized market size)
    // Assuming a baseline 'huge' market is $1T (1e12), log10 is 12.
    // We normalize this to a 0-100 scale.
    const logSize = Math.log10(marketSizeUSD);
    const oppQuantum = Math.min(100, Math.max(0, (logSize / 12) * 100));

    // 2. Symbiotic Confidence
    // Derived from Partner Quality (0-100)
    const symbioticConfidence = partnerQualityScore;

    // 3. Friction
    // Regulatory barrier estimate (0.0 - 1.0). Lower friction is better.
    const frictionInv = 1 - regulatoryFriction; // 0 to 1 scale where 1 is frictionless

    const IVAS = (oppQuantum * 0.45) + (symbioticConfidence * 0.45) + (frictionInv * 100 * 0.1);

    return {
        score: Math.round(IVAS),
        breakdown: {
            opportunityQuantum: Math.round(oppQuantum),
            symbioticConfidence: Math.round(symbioticConfidence),
            frictionImpact: Math.round(frictionInv * 100)
        }
    };
};

export const runOpportunityOrchestration = async (regionProfile: any): Promise<OrchResult> => {
    // Simulate processing time
    await new Promise(r => setTimeout(r, 1800));
    
    // Extract parameters for IVAS
    const marketSize = (regionProfile.gdp?.totalBillionUSD || 100) * 1000000000 * 0.1; // Rough proxy for addressable market, defaults if missing
    const partnerQuality = 85; // Simulated high-quality partner find
    const friction = 0.3; // Moderate friction (0.3)

    const ivasResult = calculateIVAS(marketSize, partnerQuality, friction);

    // Calculate SCF (Strategic Cash Flow) - Simplified Projection
    const totalImpact = marketSize * 0.005; // 0.5% market capture
    const jobs = Math.round(totalImpact / 150000); // $150k per job created metric

    return {
        details: {
            lais: [{
                title: `${regionProfile.country || 'Target Region'} Strategic Hub`,
                description: `Latent asset identified: Underutilized capacity in ${regionProfile.rawFeatures?.[0]?.name || 'Logistics'}.`,
                components: ["Infrastructure", "Market Access"]
            }],
            ivas: {
                ivasScore: ivasResult.score,
                activationMonths: Math.round(24 * (1 - (ivasResult.score / 100))) + 6, // Higher score = faster activation
                breakdown: { 
                    activationFriction: friction > 0.5 ? "High" : "Low", 
                    opportunityQuantum: ivasResult.breakdown.opportunityQuantum > 80 ? "High" : "Medium" 
                }
            },
            scf: {
                totalEconomicImpactUSD: totalImpact,
                directJobs: jobs,
                indirectJobs: jobs * 2.5, // Multiplier effect
                annualizedImpact: totalImpact / 5 // 5 year horizon
            }
        },
        nsilOutput: `
<nsil:analysis_report mode="Orchestrated" version="4.2">
  <executive_summary>
    <overall_score>${ivasResult.score}</overall_score>
    <strategic_outlook>IVAS score indicates ${(ivasResult.score > 75 ? 'Rapid' : 'Moderate')} activation potential.</strategic_outlook>
    <key_findings>Market size supports expansion; Regulatory friction is manageable.</key_findings>
  </executive_summary>
  <match_score value="${partnerQuality}" confidence="High">
    <rationale>Partner ecosystem aligns with Opportunity Quantum.</rationale>
  </match_score>
</nsil:analysis_report>`
    };
};

// --- 3. RROI ENGINE ---

// Helper to generate a deterministic number from string
const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

export const generateRROI = async (params: ReportParameters): Promise<RROI_Index> => {
    // Deterministic Calculation based on Region + Industry
    
    // Base scores from City Database if available
    const cityData = GLOBAL_CITY_DATABASE[params.country];
    
    let infra = 70;
    let talent = 70;
    let biz = 70;
    
    if (cityData) {
        infra = (cityData.infrastructure.transportation + cityData.infrastructure.digital) * 5;
        talent = cityData.talentPool.skillsAvailability * 10;
        biz = cityData.businessEnvironment.easeOfDoingBusiness * 10;
    }

    // Industry modifiers
    const isTech = params.industry.includes('Technology');
    const isFinance = params.industry.includes('Banking');
    
    if (isTech) talent += 5; // Tech assumes high talent reliance
    if (isFinance) biz += 5;

    // Cap at 100
    infra = Math.min(100, infra);
    talent = Math.min(100, talent);
    biz = Math.min(100, biz);
    const market = Math.min(100, (infra + biz) / 2 + 5);

    const overall = Math.round((infra * 0.3) + (talent * 0.3) + (biz * 0.2) + (market * 0.2));

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                overallScore: overall,
                summary: `The Regional Readiness & Opportunity Index for ${params.country} (${params.region}) indicates ${overall > 75 ? 'strong' : 'moderate'} alignment with your strategic intent. Key drivers include ${infra > talent ? 'Infrastructure' : 'Talent Pool'}.`,
                components: {
                    infrastructure: { name: "Infrastructure Readiness", score: Math.round(infra), analysis: "Digital and physical logistics networks evaluated." },
                    talent: { name: "Talent Availability", score: Math.round(talent), analysis: "Skilled labor pool depth for sector." },
                    regulatory: { name: "Regulatory Ease", score: Math.round(biz), analysis: "Bureaucratic friction assessment." },
                    market: { name: "Market Maturity", score: Math.round(market), analysis: "Demand stability and competition index." }
                }
            });
        }, 1200);
    });
};

// --- 4. SEAM ENGINE ---

export const generateSEAM = async (params: ReportParameters): Promise<SEAM_Blueprint> => {
    const seed = hashString((params.organizationName || 'org') + (params.region || 'global'));
    const score = 70 + (seed % 25); // Range 70-95

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                score: score,
                ecosystemHealth: score > 85 ? "Thriving" : "Emerging",
                partners: [
                    { name: `National ${params.industry[0] || 'Trade'} Board`, role: "Regulator / Enabler", synergy: 90 },
                    { name: "Regional Logistics Alliance", role: "Supply Chain", synergy: 85 },
                    { name: `${params.country || 'Target'} Tech Institute`, role: "Talent Pipeline", synergy: 82 },
                    { name: "Global Chamber of Commerce", role: "Network Access", synergy: 75 }
                ],
                gaps: [
                    "Specialized legal counsel for cross-border IP.",
                    "Last-mile logistics in rural zones."
                ]
            });
        }, 1500);
    });
};

// --- 5. SYMBIOTIC MATCHING ENGINE ---

export const generateSymbioticMatches = async (params: ReportParameters): Promise<SymbioticPartner[]> => {
    // Simulated Matchmaking with deterministic names based on region
    const regionPrefix = params.region === 'Asia-Pacific' ? 'Asian' : params.region === 'Europe' ? 'Euro' : 'Global';
    const country = params.country || "Target Market";

    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    entityName: `${regionPrefix} Innovations Group`,
                    location: country,
                    entityType: "Private Enterprise",
                    symbiosisScore: 94,
                    asymmetryAnalysis: "High capital efficiency. They have excess manufacturing capacity that matches your production needs.",
                    mutualBenefit: "You get low-cost production; they get utilization of idle assets.",
                    riskFactors: ["Currency fluctuation"]
                },
                {
                    entityName: `${country} Development Fund`,
                    location: params.region || "Regional Capital",
                    entityType: "Government Agency",
                    symbiosisScore: 89,
                    asymmetryAnalysis: "They offer non-dilutive grants for tech transfer.",
                    mutualBenefit: "You get capital; they get economic development KPIs met.",
                    riskFactors: ["Bureaucratic timeline"]
                },
                {
                    entityName: "Orion Logistics",
                    location: "Logistics Hub",
                    entityType: "Service Provider",
                    symbiosisScore: 85,
                    asymmetryAnalysis: "Deep local distribution network but lacks digital tracking.",
                    mutualBenefit: "You provide the digital layer; they provide physical reach.",
                    riskFactors: ["Integration complexity"]
                }
            ]);
        }, 1800);
    });
};

// --- 6. ETHICS & COMPLIANCE ENGINE ---

export const runEthicalSafeguards = (params: ReportParameters): EthicalCheckResult => {
    const flags: EthicsFlag[] = [];
    let score = 100;
    let status: EthicsStatus = 'PASS';

    // Rule 1: Sanctions Check (Mocked basic keyword check)
    const sanctionedEntities = ['North Korea', 'Iran', 'Crimea', 'SpecificSanctionedEntity'];
    const isSanctioned = sanctionedEntities.some(e => (params.country || '').includes(e) || (params.problemStatement || '').includes(e));
    
    if (isSanctioned) {
        flags.push({ name: 'Sanctions Match', flag: 'BLOCK', reason: 'Jurisdiction or entity appears on OFAC/UN sanctions list.', evidence: ['OFAC List Match'] });
        score = 0;
        status = 'BLOCK';
    }

    // Rule 2: High Risk Industry
    const highRiskIndustries = ['Defense', 'Extraction', 'Mining', 'Gambling'];
    if (params.industry.some(i => highRiskIndustries.includes(i))) {
        flags.push({ name: 'High-Risk Industry', flag: 'CAUTION', reason: 'Sector requires enhanced due diligence (EDD) and ESIA documentation.', evidence: ['Sector Analysis'] });
        score -= 20;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    // Rule 3: CPI (Corruption Perception) Check (Simplified)
    const lowCPICountries = ['SomeHighRiskCountry', 'AnotherRiskyOne']; // Placeholders
    if (lowCPICountries.includes(params.country)) {
        flags.push({ name: 'CPI Threshold', flag: 'CAUTION', reason: 'Region falls below CPI threshold of 40.', evidence: ['Transparency International Index'] });
        score -= 15;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    // Rule 4: Data Completeness (Transparency)
    if (!params.organizationName || params.organizationName.length < 3) {
        flags.push({ name: 'Anonymous Actor', flag: 'CAUTION', reason: 'Insufficient entity identification provided.', evidence: ['Input Validation'] });
        score -= 10;
        if (status !== 'BLOCK') status = 'CAUTION';
    }

    const mitigation: MitigationStep[] = [];
    if (status === 'BLOCK') {
        mitigation.push({ step: "Immediate Halt", detail: "Transaction/Analysis cannot proceed under current compliance rules." });
        mitigation.push({ step: "Legal Review", detail: "Escalate to General Counsel for sanctions validation." });
    } else if (status === 'CAUTION') {
        mitigation.push({ step: "Enhanced Due Diligence", detail: "Trigger Level-3 forensic audit on local partners." });
        mitigation.push({ step: "Anti-Bribery Certification", detail: "Require ISO 37001 certification from counterparties." });
    } else {
        mitigation.push({ step: "Standard Monitor", detail: "Proceed with standard quarterly compliance reviews." });
    }

    return {
        passed: status !== 'BLOCK',
        score: Math.max(0, score),
        overallFlag: status,
        flags: flags,
        mitigation: mitigation,
        timestamp: new Date().toISOString(),
        version: "4.2.0"
    };
};

// --- 7. SUCCESS PROBABILITY INDEX (SPI) ENGINE ---

const WEIGHTS = {
    ER: 0.25, // Economic Readiness
    SP: 0.20, // Symbiotic Fit
    PS: 0.15, // Political Stability
    PR: 0.15, // Partner Reliability
    EA: 0.10, // Ethics/Compliance
    CA: 0.10, // Activation Velocity
    UT: 0.05  // User Transparency
};

const calculateTransparencyScore = (params: ReportParameters): number => {
    let score = 0;
    if (params.organizationName) score += 20;
    if (params.strategicIntent) score += 20;
    if (params.problemStatement && params.problemStatement.length > 20) score += 20;
    if (params.industry.length > 0) score += 20;
    if (params.calibration?.constraints?.budgetCap) score += 20;
    return score;
};

const getRegionRiskScore = (region: string, country: string): number => {
    // Simplified lookup - in prod this would query a risk DB
    const riskMap: Record<string, number> = {
        'Singapore': 95, 'United Kingdom': 88, 'United States': 90, 
        'Germany': 92, 'Vietnam': 65, 'Indonesia': 60, 
        'Brazil': 55, 'Nigeria': 40
    };
    return riskMap[country] || (region === 'Asia-Pacific' ? 70 : 60);
};

export const calculateSPI = (params: ReportParameters): SPIResult => {
    // 1. Calculate Component Scores (Ci)
    
    // Economic Readiness (ER)
    // Derived from Infrastructure & Labor stats of target country
    const targetCityData = GLOBAL_CITY_DATABASE[params.country] || Object.values(GLOBAL_CITY_DATABASE)[0];
    let ER = 70; // Default if not found
    
    if (targetCityData) {
         const infraScore = (targetCityData.infrastructure.transportation + targetCityData.infrastructure.digital) * 5; // Scale to 100
         const laborScore = (targetCityData.talentPool.skillsAvailability) * 10;
         ER = (infraScore + laborScore) / 2;
    }

    // Symbiotic Fit (SP)
    // Heuristic: Does the user have capabilities the region needs? (Mocked logic for demo)
    const hasTech = params.industry.includes('Technology');
    const regionNeedsTech = params.region === 'Asia-Pacific' || params.region === 'Middle East';
    const SP = hasTech && regionNeedsTech ? 90 : 70;

    // Political Stability (PS)
    const PS = getRegionRiskScore(params.region, params.country);

    // Partner Reliability (PR)
    // Base on due diligence depth selected
    const PR = params.dueDiligenceDepth === 'Deep' ? 95 : params.dueDiligenceDepth === 'Standard' ? 80 : 60;

    // Ethics/Compliance (EA)
    const ethicsResult = runEthicalSafeguards(params);
    const EA = ethicsResult.score;

    // Activation Velocity (CA)
    // Inverse to timeline duration (shorter is not always better, realistic is better)
    const CA = params.expansionTimeline === '6 months' ? 60 : 85; // 6mo might be rushed

    // User Transparency (UT)
    const UT = calculateTransparencyScore(params);

    // 2. Calculate Weighted Sum
    const rawSPI = (
        (ER * WEIGHTS.ER) +
        (SP * WEIGHTS.SP) +
        (PS * WEIGHTS.PS) +
        (PR * WEIGHTS.PR) +
        (EA * WEIGHTS.EA) +
        (CA * WEIGHTS.CA) +
        (UT * WEIGHTS.UT)
    );

    // 3. Confidence Interval
    const ciDelta = 12 * (1 - (UT / 100));
    
    return {
        spi: Math.round(rawSPI),
        ciLow: Math.round(rawSPI - ciDelta),
        ciHigh: Math.round(rawSPI + ciDelta),
        breakdown: [
            { label: 'Economic Readiness', value: Math.round(ER) },
            { label: 'Symbiotic Fit', value: Math.round(SP) },
            { label: 'Political Stability', value: Math.round(PS) },
            { label: 'Partner Reliability', value: Math.round(PR) },
            { label: 'Ethical Alignment', value: Math.round(EA) },
            { label: 'Activation Velocity', value: Math.round(CA) },
            { label: 'Transparency', value: Math.round(UT) }
        ]
    };
};

export const generateFastSuggestion = async (input: string, context: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`${input} (Optimized for ${context})`);
        }, 600);
    });
};
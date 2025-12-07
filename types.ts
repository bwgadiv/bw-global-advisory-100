
import React from 'react';

export type SkillLevel = 'novice' | 'experienced' | 'expert';

// --- NEURO-SYMBOLIC TYPES ---

export type ChecklistStatus = 'pending' | 'satisfied' | 'failed' | 'skipped';

export interface ChecklistItem {
    id: string;
    label: string;
    category: 'Identity' | 'Strategy' | 'Financial' | 'Risk' | 'Compliance';
    status: ChecklistStatus;
    value?: any;
    required: boolean;
    description: string;
    validationRule?: string; // e.g., "value > 1000"
    dependencies?: string[]; // IDs of other items that must be satisfied first
}

export interface DynamicFormula {
    id: string;
    name: string;
    expression: string; // e.g., "revenue * 0.2 - risk_score"
    variables: string[]; // ["revenue", "risk_score"]
    description?: string;
    isSystem?: boolean; // If true, cannot be deleted
}

export interface NeuroSymbolicState {
    checklist: ChecklistItem[];
    formulas: DynamicFormula[];
    variableStore: Record<string, number | string | boolean>; // The "Memory" of the logic engine
}

// --- EXISTING TYPES ---

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  stat?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface CopilotOption {
  id: string;
  title: string;
  rationale: string;
}

export interface ChatMessage {
  id?: string;
  role?: 'user' | 'model';
  sender?: 'user' | 'copilot' | 'system';
  text: string;
  isStreaming?: boolean;
  isThinking?: boolean;
  thinkingStep?: string;
  options?: CopilotOption[];
  meta?: { followUp?: string };
}

export interface OpportunityScore {
    totalScore: number;
    marketPotential: number;
    riskFactors: number;
}

export interface ReportParameters {
  // Identity
  reportName: string;
  userName: string;
  userDepartment: string;
  skillLevel: string;
  userCountry: string;
  userCity?: string;
  userTier: string;
  
  // Organization Deep Profile
  organizationName: string;
  organizationType: string;
  organizationSubType: string;
  organizationAddress?: string;
  organizationWebsite?: string;
  revenueBand?: string;
  headcountBand?: string;
  yearsOperation?: string;
  decisionAuthority?: string;
  
  customOrganizationType?: string;
  customOrganizationSubType?: string;
  region: string;
  country: string;
  industry: string[];
  nicheAreas?: string[];
  customIndustry: string;
  tier: string[];
  
  // Strategy & Mandate
  strategicIntent: string[]; // UPDATED to array for multi-select
  strategicMode: string;
  problemStatement: string;
  idealPartnerProfile: string;
  targetPartner?: string;
  analysisTimeframe: string;
  strategicObjectives: string[];
  strategicLens?: string[];
  priorityThemes?: string[]; 
  targetCounterpartType?: string[]; // UPDATED to array for multi-select
  successMetrics?: string[];
  specificOpportunity?: string; // Granular opportunity selection
  targetIncentives?: string[]; // Incentives sought
  
  // Execution & Operations
  relationshipStage: string;
  dueDiligenceDepth: string;
  partnerCapabilities: string[];
  operationalPriority: string;
  riskTolerance: string;
  expansionTimeline: string;
  partnershipSupportNeeds: string[];
  fundingSource?: string; 
  procurementMode?: string; 
  politicalSensitivities?: string[];

  // Metadata
  id: string;
  createdAt: string;
  status: string;
  
  // Historical Outcome Data (For Comparative Analysis)
  outcome?: 'Success' | 'Failure' | 'Stalled' | 'Ongoing';
  outcomeReason?: string;
  actualReturnMultiplier?: number; // e.g. 1.5x ROI
  
  // UI Helpers
  selectedAgents: string[];
  selectedModels: string[];
  selectedModules: string[];
  analyticalModules: string[];
  aiPersona: string[];
  customAiPersona: string;
  intelligenceCategory?: string;
  activeOpportunity?: LiveOpportunityItem;
  
  // Output Config
  reportLength: string;
  outputFormat: string;
  letterStyle: string;
  stakeholderPerspectives: string[];
  includeCrossSectorMatches: boolean;
  matchCount: number;
  partnerDiscoveryMode: boolean;
  searchScope: string;
  intentTags: string[];
  comparativeContext: string[];
  additionalContext: string;
  opportunityScore: OpportunityScore;
  calibration?: { 
    constraints?: { budgetCap?: string, capitalMix?: { debt: number, equity: number, grant: number } };
    capabilitiesHave?: string[];
    capabilitiesNeed?: string[];
    riskHorizon?: string[];
    operationalChassis?: { taxStructure?: string, entityPreference?: string };
  };

  // --- NEW: Neuro-Symbolic Integration ---
  neuroSymbolicState?: NeuroSymbolicState;
}

export interface GlobalCityData {
    city: string;
    country: string;
    region: string;
    population: number;
    talentPool: { laborCosts: number; educationLevel: number; skillsAvailability: number };
    infrastructure: { transportation: number; digital: number; utilities: number };
    businessEnvironment: { easeOfDoingBusiness: number; corruptionIndex: number; regulatoryQuality: number };
    marketAccess: { domesticMarket: number; exportPotential: number; regionalConnectivity: number };
    gdp: { totalBillionUSD: number; perCapitaUSD: number };
}

// --- ENGINE INTERFACES ---

export interface RegionProfile {
    id: string;
    name: string;
    country: string;
    population: number;
    gdp: number;
    rawFeatures: { name: string; rarityScore: number; relevanceScore: number; marketProxy: number }[];
}

export interface MarketShare {
  country: string;
  share: number;
}

export interface MarketOpportunity {
  country: string;
  growthRate: number;
  easeOfEntry: number;
  talentAvailability: number;
  innovationIndex: number;
  regulatoryFriction: number;
  marketSize: string;
  opportunityScore: number;
  recommendedStrategy: string;
  rationale: string;
}

export interface DiversificationAnalysis {
  hhiScore: number;
  riskLevel: 'Diversified' | 'Moderate Concentration' | 'High Concentration' | 'Critical Dependency';
  concentrationAnalysis: string;
  recommendedMarkets: MarketOpportunity[];
}

export interface OrchResult {
    details: {
        lais?: any[];
        ivas?: any;
        scf?: any;
    };
    nsilOutput: string;
}

export interface RROI_Component {
    name: string;
    score: number;
    analysis: string;
}

export interface RROI_Index {
    overallScore: number;
    summary: string;
    components: {
        infrastructure: RROI_Component;
        talent: RROI_Component;
        regulatory: RROI_Component;
        market: RROI_Component;
    };
}

export interface SEAM_Partner {
    name: string;
    role: string;
    synergy: number;
}

export interface SEAM_Blueprint {
    score: number;
    ecosystemHealth: string;
    partners: SEAM_Partner[];
    gaps: string[];
}

export interface SymbioticPartner {
    entityName: string;
    location: string;
    entityType: string;
    symbiosisScore: number;
    asymmetryAnalysis: string;
    mutualBenefit: string;
    riskFactors: string[];
}

export interface SPI_BreakdownItem {
    label: string;
    value: number;
}

export interface SPIResult {
    spi: number;
    ciLow: number;
    ciHigh: number;
    breakdown: SPI_BreakdownItem[];
}

export type EthicsStatus = 'PASS' | 'CAUTION' | 'BLOCK';

export interface EthicsFlag {
    name: string;
    flag: 'BLOCK' | 'CAUTION';
    reason: string;
    evidence: string[];
}

export interface MitigationStep {
    step: string;
    detail: string;
}

export interface EthicalCheckResult {
    passed: boolean;
    score: number;
    overallFlag: EthicsStatus;
    flags: EthicsFlag[];
    mitigation: MitigationStep[];
    timestamp: string;
    version: string;
}

// --- HISTORICAL ENGINE INTERFACES ---

export interface CaseOutcome {
  result: 'success' | 'failure' | 'mixed';
  roiAchieved?: number;
  jobsCreated?: number;
  timeToMarket?: string;
  keyLearnings: string[];
}

export interface HistoricalCase {
  id: string;
  title: string;
  entity: string;
  sector: string;
  country: string;
  year: number;
  strategy: string;
  investmentSizeMillionUSD: number;
  outcomes: CaseOutcome;
}

export interface CaseSimilarity {
  overall: number;
  sectorMatch: number;
  regionMatch: number;
  strategyMatch: number;
}

export interface PrecedentMatch {
  historicalCase: HistoricalCase;
  similarity: CaseSimilarity;
  probabilityOfSuccess: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  applicableFactors: {
    successFactors: string[];
    warnings: string[];
    timingConsiderations: string[];
    investmentProfile: string;
  };
  timeToMaturity?: number;
}

// --- APP & GENERATION INTERFACES ---

export type GenerationPhase = 'idle' | 'intake' | 'orchestration' | 'modeling' | 'synthesis' | 'complete';

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'generating' | 'completed';
}

export interface ReportData {
  executiveSummary: ReportSection;
  marketAnalysis: ReportSection;
  recommendations: ReportSection;
  implementation: ReportSection;
  financials: ReportSection;
  risks: ReportSection;
}

export interface CopilotInsight {
  id?: string;
  type: 'risk' | 'opportunity' | 'strategy' | 'insight' | 'warning' | 'question';
  title: string;
  description?: string;
  content?: string;
  confidence?: number;
}

export interface LiveOpportunityItem {
  project_name: string;
  country: string;
  sector: string;
  value: string;
  summary: string;
  source_url: string;
  isUserAdded?: boolean;
  ai_feasibility_score?: number;
  ai_risk_assessment?: string;
}

export interface MatchCandidate {
    location: GlobalCityData;
    matchScore: number;
    matchReasons: string[];
    improvementAreas: string[];
    transitionChallenges: string[];
}

export interface RelocationStrategy {
    timeline: string;
    resourceRequirements: string[];
    riskMitigation: string[];
    successProbability: number;
}

export interface AlternativeLocationMatch {
  originalLocation: GlobalCityData;
  matchedLocations: MatchCandidate[];
  relocationStrategy: RelocationStrategy;
}

export interface DeepReasoningAnalysis {
    verdict: 'Strong Buy' | 'Consider' | 'Hard Pass';
    dealKillers: string[];
    hiddenGems: string[];
    reasoningChain: string[];
    counterIntuitiveInsight: string;
}

export interface GenerativeModel {
    modelName: string;
    summary: string;
    description?: string;
    corePrinciples: { principle: string; rationale: string }[];
}

export interface GeopoliticalAnalysisResult {
    stabilityScore: number;
    currencyRisk: string;
    inflationTrend: string;
    forecast: string;
    regionalConflictRisk: number;
    tradeBarriers: string[];
}

export interface GovernanceAuditResult {
    governanceScore: number;
    corruptionRisk: string;
    regulatoryFriction: number;
    transparencyIndex: number;
    redFlags: string[];
    complianceRoadmap: string[];
}

export interface ModuleScore {
    totalScore: number;
    complexityLevel: number;
    implementationTimeline: number;
}

export interface ComplexityScore {
    totalScore: number;
    technicalComplexity: number;
    regulatoryCompliance: number;
}
export interface CanvasModule {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    component: React.ComponentType<any>;
    status: 'active' | 'inactive' | 'completed' | 'locked';
    phase: string;
}

// --- TEMPORAL ANALYSIS ---

export interface TemporalAnalysis {
  regionProfile: { country: string; region: string };
  analysisYear: number;
  currentPhase: {
    overall: 'nascent' | 'emerging' | 'developing' | 'mature' | 'post_mature';
    bySector: Record<string, string>;
    confidenceScore: number;
  };
  progression: {
    currentPhase: 'nascent' | 'emerging' | 'developing' | 'mature' | 'post_mature';
    yearsInPhase: number;
    estimatedYearsToNextPhase: number;
    historicalPaceMonths: number;
    accelerators: string[];
    decelerators: string[];
    trajectoryRisk: 'accelerating' | 'on_track' | 'slowing' | 'at_risk';
  };
  historicalComparables: {
    region: string;
    year: number;
    phaseAtThatTime: string;
    whatHappenedNext: string;
    investments: string[];
    outcomeQuality: 'success' | 'failure' | 'mixed';
  }[];
  trajectoryRisk: 'accelerating' | 'on_track' | 'slowing' | 'at_risk';
}

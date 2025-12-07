import type { ReportParameters, OpportunityScore } from '../types';

// ============================================
// MISSING FORMULAS ENGINE (9 Formulas)
// ============================================

/**
 * BATNA+ (Best Alternative to Negotiated Agreement Plus)
 * Measures the strength of alternatives if negotiation fails
 * Higher score = stronger walkaway position
 * Range: 0-100
 */
export const calculateBARNA = (params: ReportParameters): number => {
  let batnaScore = 50; // Baseline

  // Factor 1: Alternative markets availability (20 points)
  const regionScore = params.region === 'Asia-Pacific' ? 15 :
                     params.region === 'Europe' ? 12 :
                     params.region === 'Americas' ? 10 : 5;
  batnaScore += regionScore;

  // Factor 2: Company size/resources (15 points)
  const resourcesScore = params.organizationWebsite ? 5 : 0;
  const revenueScore = params.revenueBand === 'over_1b' ? 10 :
                       params.revenueBand === '250m_1b' ? 7 :
                       params.revenueBand === '50m_250m' ? 4 : 0;
  batnaScore += resourcesScore + revenueScore;

  // Factor 3: Industry diversification (20 points)
  const industryDiversification = (params.industry?.length || 0) * 3;
  batnaScore += Math.min(20, industryDiversification);

  // Factor 4: Time flexibility (15 points)
  const timelineScore = params.expansionTimeline === '5_plus_years' ? 15 :
                        params.expansionTimeline === '3_5_years' ? 12 :
                        params.expansionTimeline === '1_2_years' ? 8 : 3;
  batnaScore += timelineScore;

  // Factor 5: Risk tolerance (10 points)
  const riskScore = params.riskTolerance === 'opportunistic' ? 10 :
                    params.riskTolerance === 'high' ? 7 :
                    params.riskTolerance === 'moderate' ? 4 : 0;
  batnaScore += riskScore;

  // Factor 6: Alternative partnerships (10 points)
  const partnerscore = params.partnerDiscoveryMode ? 8 : 0;
  batnaScore += partnerscore;

  return Math.min(100, batnaScore);
};

/**
 * NVI (Negotiation Value Index)
 * Quantifies value creation potential in negotiation
 * Measures gap between current offer and ideal outcome
 * Range: 0-100 (higher = more value capture potential)
 */
export const calculateNVI = (params: ReportParameters): number => {
  let nviScore = 40; // Conservative baseline

  // Factor 1: Strategic objectives clarity (15 points)
  const stratObjectives = params.strategicObjectives?.length || 0;
  nviScore += Math.min(15, stratObjectives * 3);

  // Factor 2: Success metrics definition (15 points)
  const successMetrics = params.successMetrics?.length || 0;
  nviScore += Math.min(15, successMetrics * 3);

  // Factor 3: Specific opportunity targeting (20 points)
  const hasSpecificOpp = params.specificOpportunity ? 15 : 0;
  nviScore += hasSpecificOpp;

  // Factor 4: Market timing (20 points)
  const timelineScore = params.analysisTimeframe === '0_6_months' ? 15 :
                        params.analysisTimeframe === '6_12_months' ? 12 :
                        params.analysisTimeframe === '1_2_years' ? 8 : 0;
  nviScore += timelineScore;

  // Factor 5: Leverage through data (15 points)
  const dataAdvantage = params.additionalContext ? 8 : 0;
  const comparativeContext = (params.comparativeContext?.length || 0) * 1.5;
  nviScore += Math.min(15, dataAdvantage + comparativeContext);

  // Factor 6: Cross-sector opportunity (10 points)
  const crossSectorScore = params.includeCrossSectorMatches ? 10 : 0;
  nviScore += crossSectorScore;

  return Math.min(100, nviScore);
};

/**
 * CAP (Counterparty Analysis Protocol)
 * Assesses counterparty's motivations, constraints, and decision authority
 * Range: 0-100 (higher = better counterparty understanding)
 */
export const calculateCAP = (params: ReportParameters): number => {
  let capScore = 45;

  // Factor 1: Counterparty clarity (20 points)
  const hasCounterparty = params.targetCounterpartType ? 10 : 0;
  const idealPartner = params.idealPartnerProfile ? 10 : 0;
  capScore += hasCounterparty + idealPartner;

  // Factor 2: Decision authority identification (20 points)
  const authorityScore = params.decisionAuthority === 'board' ? 20 :
                         params.decisionAuthority === 'executive' ? 15 :
                         params.decisionAuthority === 'director' ? 10 :
                         params.decisionAuthority === 'project_lead' ? 5 : 0;
  capScore += authorityScore;

  // Factor 3: Motivation understanding (20 points)
  const strategicIntent = params.strategicIntent ? 10 : 0;
  const incentives = (params.targetIncentives?.length || 0) * 2;
  capScore += Math.min(20, strategicIntent + incentives);

  // Factor 4: Constraint awareness (20 points)
  const constraints = params.calibration?.constraints?.budgetCap ? 8 : 0;
  const sensitivities = (params.politicalSensitivities?.length || 0) * 1.5;
  capScore += Math.min(20, constraints + sensitivities);

  // Factor 5: Information asymmetry advantage (10 points)
  const infoAdvantage = params.intelligenceCategory ? 10 : 0;
  capScore += infoAdvantage;

  // Factor 6: Relationship history (10 points)
  const relationshipScore = params.relationshipStage === 'active_negotiation' ? 10 :
                            params.relationshipStage === 'exploratory' ? 5 : 0;
  capScore += relationshipScore;

  return Math.min(100, capScore);
};

/**
 * AGI (Accelerated Growth Index)
 * Forecasts speed of market penetration and revenue growth
 * Range: 0-100 (higher = faster growth potential)
 */
export const calculateAGI = (params: ReportParameters): number => {
  let agiScore = 50;

  // Factor 1: Market opportunity size (25 points)
  // Proxy: target incentives and sector attractiveness
  const incentiveCount = (params.targetIncentives?.length || 0) * 2;
  agiScore += Math.min(25, incentiveCount);

  // Factor 2: Competitive advantage (20 points)
  const capabilitiesHave = (params.calibration?.capabilitiesHave?.length || 0) * 2;
  const industryExpertise = params.industry?.length || 0;
  agiScore += Math.min(20, Math.max(capabilitiesHave, industryExpertise * 2));

  // Factor 3: Execution speed capability (20 points)
  const timelineScore = params.expansionTimeline === '0_6_months' ? 20 :
                        params.expansionTimeline === '6_12_months' ? 15 :
                        params.expansionTimeline === '1_2_years' ? 10 : 0;
  agiScore += timelineScore;

  // Factor 4: Resource availability (20 points)
  const fundingScore = params.fundingSource ? 10 : 0;
  const headcountScore = params.headcountBand === 'over_5000' ? 10 :
                         params.headcountBand === '1000_5000' ? 8 : 0;
  agiScore += fundingScore + headcountScore;

  // Factor 5: Market readiness (15 points)
  const marketReadiness = params.strategicLens?.includes('market') ? 10 : 0;
  const priorityThemes = (params.priorityThemes?.length || 0);
  agiScore += Math.min(15, marketReadiness + priorityThemes);

  return Math.min(100, agiScore);
};

/**
 * PRI (Portfolio Risk Index)
 * Assesses concentration risk and downside protection
 * Range: 0-100 (higher = better risk management)
 */
export const calculatePRI = (params: ReportParameters): number => {
  let priScore = 50;

  // Factor 1: Geographic diversification (25 points)
  const regionCount = params.country ? 5 : 0;
  priScore += Math.min(25, regionCount);

  // Factor 2: Sector diversification (25 points)
  const sectorCount = (params.industry?.length || 0) * 4;
  priScore += Math.min(25, sectorCount);

  // Factor 3: Revenue concentration management (20 points)
  const tier = (params.tier?.length || 0);
  const partnerCount = params.matchCount || 1;
  const concentrationScore = (tier + partnerCount) * 3;
  priScore += Math.min(20, concentrationScore);

  // Factor 4: Risk mitigation mechanisms (20 points)
  const riskTolerance = params.riskTolerance === 'high' ? 5 :
                        params.riskTolerance === 'moderate' ? 15 :
                        params.riskTolerance === 'very_low' ? 10 : 0;
  const hedgingFactors = (params.partnershipSupportNeeds?.length || 0);
  priScore += Math.min(20, riskTolerance + hedgingFactors);

  // Factor 5: Outcome tracking (10 points)
  const outcomeTracking = params.outcome ? 10 : 0;
  priScore += outcomeTracking;

  return Math.min(100, priScore);
};

/**
 * VCI (Value Creation Index)
 * Quantifies synergy potential and value multiplication
 * Range: 0-100 (higher = more value creation)
 */
export const calculateVCI = (params: ReportParameters): number => {
  let vciScore = 45;

  // Factor 1: Synergy identification (25 points)
  const strategicLenses = (params.strategicLens?.length || 0) * 3;
  vciScore += Math.min(25, strategicLenses);

  // Factor 2: Capability gap filling (25 points)
  const capabilitiesNeed = (params.calibration?.capabilitiesNeed?.length || 0) * 3;
  const capabilitiesHave = (params.calibration?.capabilitiesHave?.length || 0) * 1.5;
  vciScore += Math.min(25, Math.max(capabilitiesNeed, capabilitiesHave));

  // Factor 3: Revenue multiplication potential (20 points)
  const industryDiversity = (params.industry?.length || 0) * 4;
  vciScore += Math.min(20, industryDiversity);

  // Factor 4: Cost reduction opportunity (20 points)
  const operationalPriority = params.operationalPriority ? 10 : 0;
  const procurementMode = params.procurementMode ? 10 : 0;
  vciScore += Math.min(20, operationalPriority + procurementMode);

  // Factor 5: Market expansion (10 points)
  const crossSector = params.includeCrossSectorMatches ? 10 : 0;
  vciScore += crossSector;

  return Math.min(100, vciScore);
};

/**
 * RNI (Regulatory Navigation Index)
 * Measures ability to navigate regulatory framework complexity
 * Range: 0-100 (higher = better regulatory positioning)
 */
export const calculateRNI = (params: ReportParameters): number => {
  let rniScore = 50;

  // Factor 1: Regulatory experience (20 points)
  const skillLevel = params.skillLevel === 'expert' ? 20 :
                     params.skillLevel === 'experienced' ? 12 :
                     params.skillLevel === 'novice' ? 5 : 0;
  rniScore += skillLevel;

  // Factor 2: Compliance infrastructure (20 points)
  const complianceCapabilities = params.calibration?.capabilitiesHave?.some(c => 
    c.toLowerCase().includes('compliance') || c.toLowerCase().includes('legal')
  ) ? 15 : 0;
  rniScore += complianceCapabilities;

  // Factor 3: Political sensitivities management (20 points)
  const sensitivitiesCount = (params.politicalSensitivities?.length || 0) * 2;
  rniScore += Math.min(20, sensitivitiesCount);

  // Factor 4: Policy advocacy capability (20 points)
  const policyAdvocacy = params.strategicIntent?.includes('policy') ? 15 : 0;
  rniScore += policyAdvocacy;

  // Factor 5: Precedent tracking (10 points)
  const historicalOutcome = params.outcome ? 10 : 0;
  rniScore += historicalOutcome;

  // Factor 6: Government relations (10 points)
  const govRelations = params.decisionAuthority === 'board' ? 10 :
                       params.decisionAuthority === 'executive' ? 7 : 0;
  rniScore += govRelations;

  return Math.min(100, rniScore);
};

/**
 * ATI (Adaptability & Transition Index)
 * Measures organizational adaptability to new market dynamics
 * Range: 0-100 (higher = more adaptable)
 */
export const calculateATI = (params: ReportParameters): number => {
  let atiScore = 50;

  // Factor 1: Change management capability (20 points)
  const skillScore = params.skillLevel === 'expert' ? 20 :
                     params.skillLevel === 'experienced' ? 12 : 5;
  atiScore += skillScore;

  // Factor 2: Resource flexibility (20 points)
  const headcount = params.headcountBand === 'under_50' ? 10 :
                    params.headcountBand === '50_250' ? 15 :
                    params.headcountBand === '250_1000' ? 18 : 20;
  atiScore += headcount;

  // Factor 3: Strategic flexibility (20 points)
  const strategicOptions = (params.strategicObjectives?.length || 0) * 3;
  atiScore += Math.min(20, strategicOptions);

  // Factor 4: Learning organization traits (20 points)
  const learningCapabilities = (params.partnershipSupportNeeds?.length || 0) * 2;
  atiScore += Math.min(20, learningCapabilities);

  // Factor 5: Risk tolerance for adaptation (20 points)
  const adaptiveRisk = params.riskTolerance === 'opportunistic' ? 20 :
                       params.riskTolerance === 'high' ? 15 :
                       params.riskTolerance === 'moderate' ? 10 : 5;
  atiScore += adaptiveRisk;

  return Math.min(100, atiScore);
};

/**
 * ESI (Execution Superiority Index)
 * Measures operational execution capability and track record
 * Range: 0-100 (higher = better execution)
 */
export const calculateESI = (params: ReportParameters): number => {
  let esiScore = 50;

  // Factor 1: Experience level (25 points)
  const experience = params.skillLevel === 'expert' ? 25 :
                     params.skillLevel === 'experienced' ? 15 :
                     params.skillLevel === 'novice' ? 5 : 0;
  esiScore += experience;

  // Factor 2: Track record (25 points)
  const trackRecord = params.outcome === 'Success' ? 25 :
                      params.outcome === 'Ongoing' ? 15 :
                      params.outcome === 'Stalled' ? 10 : 0;
  esiScore += trackRecord;

  // Factor 3: Operational readiness (25 points)
  const operationalCapabilities = (params.calibration?.capabilitiesHave?.length || 0) * 3;
  esiScore += Math.min(25, operationalCapabilities);

  // Factor 4: Resource allocation (25 points)
  const resourceAllocation = params.fundingSource ? 15 : 0;
  const teamSize = params.headcountBand === 'over_5000' ? 10 : 0;
  esiScore += Math.min(25, resourceAllocation + teamSize);

  return Math.min(100, esiScore);
};

/**
 * ISI (Innovation Strength Index)
 * Assesses innovation capability and technological advantage
 * Range: 0-100 (higher = more innovative)
 */
export const calculateISI = (params: ReportParameters): number => {
  let isiScore = 45;

  // Factor 1: R&D focus (25 points)
  const rndFocus = (params.industry?.some(ind => 
    ['Technology', 'Biotech', 'Semiconductors'].includes(ind)
  )) ? 20 : 0;
  isiScore += rndFocus;

  // Factor 2: IP portfolio (20 points)
  const ipStrength = params.successMetrics?.some(m => m.includes('Innovation')) ? 15 : 0;
  isiScore += ipStrength;

  // Factor 3: Tech stack modernity (20 points)
  const techAdvance = params.strategicLens?.includes('technological') ? 15 : 0;
  isiScore += techAdvance;

  // Factor 4: Talent quality (20 points)
  const talentScore = params.skillLevel === 'expert' ? 20 :
                      params.skillLevel === 'experienced' ? 12 : 0;
  isiScore += talentScore;

  // Factor 5: Innovation pipeline (15 points)
  const innovationThemes = (params.priorityThemes?.length || 0) * 2;
  isiScore += Math.min(15, innovationThemes);

  return Math.min(100, isiScore);
};

/**
 * OSI (Operational Sustainability Index)
 * Measures long-term operational viability
 * Range: 0-100 (higher = more sustainable)
 */
export const calculateOSI = (params: ReportParameters): number => {
  let osiScore = 50;

  // Factor 1: Financial sustainability (25 points)
  const financialScore = params.revenueBand === 'over_1b' ? 25 :
                         params.revenueBand === '250m_1b' ? 20 :
                         params.revenueBand === '50m_250m' ? 15 : 10;
  osiScore += financialScore;

  // Factor 2: Market position (20 points)
  const marketPosition = params.decisionAuthority === 'board' ? 20 :
                         params.decisionAuthority === 'executive' ? 15 : 10;
  osiScore += marketPosition;

  // Factor 3: Operational maturity (20 points)
  const operationalMaturity = (params.yearsOperation === '5_plus_years' || params.yearsOperation === '10_plus_years') ? 20 :
                              params.yearsOperation === '2_5_years' ? 12 : 5;
  osiScore += operationalMaturity;

  // Factor 4: Risk mitigation (20 points)
  const riskMitigation = (params.partnershipSupportNeeds?.length || 0) * 2;
  osiScore += Math.min(20, riskMitigation);

  // Factor 5: Resilience (15 points)
  const resilience = params.riskTolerance === 'moderate' || params.riskTolerance === 'high' ? 15 : 5;
  osiScore += resilience;

  return Math.min(100, osiScore);
};

// Export all formula calculations
export const MissingFormulasEngine = {
  calculateBARNA,
  calculateNVI,
  calculateCAP,
  calculateAGI,
  calculatePRI,
  calculateVCI,
  calculateRNI,
  calculateATI,
  calculateESI,
  calculateISI,
  calculateOSI
};

export default MissingFormulasEngine;
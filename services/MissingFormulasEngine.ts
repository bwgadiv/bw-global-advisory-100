
import type { ReportParameters } from '../types';

// ============================================================================
// THE NEXUS PROPRIETARY LOGIC LAYER (21 ENGINES)
// ============================================================================
// This engine implements the "Case Observation Derivatives" listed in the technical manual.
// These are heuristic models designed to quantify qualitative strategic vectors.

// --- STRATEGIC DERIVATIVES ---

/**
 * 1. BARNA (Best Alternative to Negotiated Agreement Plus)
 * Strategic Lever: Negotiation Power
 */
export const calculateBARNA = (params: ReportParameters): number => {
  let score = 50; 
  if (params.region === 'Asia-Pacific' || params.region === 'Europe') score += 10;
  if (params.fundingSource === 'Internal Cashflow') score += 15;
  if (params.industry.length > 1) score += 10;
  return Math.min(100, score);
};

/**
 * 2. NVI (Negotiation Value Index)
 * Strategic Lever: Deal Value
 */
export const calculateNVI = (params: ReportParameters): number => {
  let score = 40;
  score += (params.strategicObjectives?.length || 0) * 5;
  if (params.specificOpportunity) score += 10;
  if (params.targetIncentives && params.targetIncentives.length > 0) score += 15;
  return Math.min(100, score);
};

/**
 * 3. RROI (Regional Readiness & Opportunity Index)
 */
export const calculateRROI_Scalar = (params: ReportParameters): number => {
    return params.country === 'Vietnam' || params.country === 'India' ? 85 : 
           params.country === 'Singapore' ? 95 : 65;
};

/**
 * 4. SEAM (Strategic Ecosystem Alignment Map)
 */
export const calculateSEAM_Scalar = (params: ReportParameters): number => {
    return params.industry.includes('Technology') ? 88 : 72;
};

/**
 * 5. LAI (Latent Asset Identification)
 */
export const calculateLAI_Scalar = (params: ReportParameters): number => {
    const developing = ['Vietnam', 'Indonesia', 'Nigeria', 'Brazil', 'Mexico'];
    return developing.includes(params.country) ? 90 : 60;
};

/**
 * 6. CRI (Cultural Resonance Index) - NEW
 * Strategic Lever: Social License
 */
export const calculateCRI = (params: ReportParameters): number => {
    let score = 60;
    if (params.region === 'Asia-Pacific' && params.organizationType === 'Private Enterprise') score += 10;
    if (params.region === 'Europe' && params.industry.includes('Manufacturing')) score += 10;
    if (params.strategicIntent.includes('Partnership')) score += 15;
    return Math.min(100, score);
};

// --- OPERATIONAL DERIVATIVES ---

/**
 * 7. CAP (Counterparty Analysis Protocol)
 */
export const calculateCAP = (params: ReportParameters): number => {
  let score = 50;
  if (params.idealPartnerProfile.length > 20) score += 20;
  if (params.targetCounterpartType && params.targetCounterpartType.length > 0) score += 15;
  return Math.min(100, score);
};

/**
 * 8. AGI (Accelerated Growth Index)
 */
export const calculateAGI = (params: ReportParameters): number => {
  let score = 50;
  score += (params.targetIncentives?.length || 0) * 5;
  if (params.expansionTimeline === '0_6_months') score += 25;
  else if (params.expansionTimeline === '6_12_months') score += 15;
  return Math.min(100, score);
};

/**
 * 9. VCI (Value Creation Index)
 */
export const calculateVCI = (params: ReportParameters): number => {
  let score = 60;
  score += (params.strategicLens?.length || 0) * 5;
  score += (params.calibration?.capabilitiesNeed?.length || 0) * 2;
  return Math.min(100, score);
};

/**
 * 10. ATI (Adaptability & Transition Index)
 */
export const calculateATI = (params: ReportParameters): number => {
  let score = 55;
  if (params.skillLevel === 'expert') score += 20;
  if (params.skillLevel === 'experienced') score += 10;
  score += (params.strategicObjectives?.length || 0) * 3;
  return Math.min(100, score);
};

/**
 * 11. ESI (Execution Superiority Index)
 */
export const calculateESI = (params: ReportParameters): number => {
  let score = 50;
  if (params.headcountBand === 'over_10000') score += 30;
  else if (params.headcountBand === '1000_5000') score += 20;
  if (params.fundingSource === 'Internal Cashflow') score += 15;
  return Math.min(100, score);
};

/**
 * 12. ISI (Innovation Strength Index)
 */
export const calculateISI = (params: ReportParameters): number => {
  let score = 40;
  const techSectors = ['Technology', 'Biotech', 'Fintech', 'Energy (Renewables)'];
  const isTech = params.industry.some(i => techSectors.some(t => i.includes(t)));
  if (isTech) score += 30;
  if (params.priorityThemes?.includes('Innovation')) score += 20;
  return Math.min(100, score);
};

/**
 * 13. OSI (Operational Sustainability Index)
 */
export const calculateOSI = (params: ReportParameters): number => {
  let score = 60;
  if (params.revenueBand === 'over_1b') score += 20;
  if (params.revenueBand === '250m_1b') score += 10;
  score += (params.partnershipSupportNeeds?.length || 0) * 3;
  return Math.min(100, score);
};

/**
 * 14. TCO (Total Cost of Ownership - Regional) - NEW
 * Operational Lever: Efficiency
 */
export const calculateTCO = (params: ReportParameters): number => {
    let efficiency = 50;
    if (params.country === 'Vietnam' || params.country === 'India') efficiency += 30; // Labor arb advantage
    if (params.operationalPriority === 'Efficiency') efficiency += 10;
    return efficiency;
};

// --- RISK DERIVATIVES ---

/**
 * 15. PRI (Portfolio Risk Index)
 */
export const calculatePRI = (params: ReportParameters): number => {
  let safetyScore = 50;
  const stable = ['Singapore', 'Germany', 'USA', 'UK', 'Japan'];
  if (stable.includes(params.country)) safetyScore += 20;
  if (params.industry.includes('Crypto') || params.industry.includes('Mining')) safetyScore -= 10;
  return Math.min(100, safetyScore);
};

/**
 * 16. RNI (Regulatory Navigation Index)
 */
export const calculateRNI = (params: ReportParameters): number => {
  let score = 50;
  if (params.skillLevel === 'expert') score += 25;
  if (params.strategicIntent.some(i => i.includes('Government'))) score += 15;
  return Math.min(100, score);
};

/**
 * 17. SRA (Sovereign Risk Assessment) - NEW
 * Risk Lever: Political Stability
 */
export const calculateSRA = (params: ReportParameters): number => {
    let safety = 70;
    if (['Singapore', 'USA', 'Germany', 'Japan'].includes(params.country)) safety += 25;
    if (params.riskTolerance === 'very_low') safety -= 10;
    return Math.min(100, safety);
};

/**
 * 18. IDV (Institutional Distance Vector) - NEW
 * Risk Lever: Governance Gap
 */
export const calculateIDV = (params: ReportParameters): number => {
    let gapScore = 50; // Lower is better (less distance)
    const userOrigin = params.userCountry || 'Global';
    if (userOrigin === params.country) gapScore = 10; // Same country
    else if (params.region === 'Asia-Pacific' && params.country === 'Vietnam') gapScore = 60; // Example
    else gapScore = 40;
    
    // Invert for "Success Score" logic (High IDV score = High Capability to bridge gap)
    return Math.min(100, 100 - gapScore + (params.skillLevel === 'expert' ? 20 : 0));
};

export const MissingFormulasEngine = {
  calculateBARNA,
  calculateNVI,
  calculateRROI_Scalar,
  calculateSEAM_Scalar,
  calculateLAI_Scalar,
  calculateCRI,
  calculateCAP,
  calculateAGI,
  calculateVCI,
  calculateATI,
  calculateESI,
  calculateISI,
  calculateOSI,
  calculateTCO,
  calculatePRI,
  calculateRNI,
  calculateSRA,
  calculateIDV
};

export default MissingFormulasEngine;

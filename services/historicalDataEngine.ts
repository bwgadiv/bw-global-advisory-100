import { ReportParameters, HistoricalCase, PrecedentMatch } from '../types';

export const CASE_STUDIES: HistoricalCase[] = [
    {
        id: 'CS-001',
        title: 'Project Sunburst: Renewable Energy Entry',
        entity: 'SolarGlobal Ltd',
        sector: 'Energy',
        country: 'Vietnam',
        year: 2021,
        strategy: 'Joint Venture',
        investmentSizeMillionUSD: 120,
        outcomes: {
            result: 'success',
            roiAchieved: 2.8,
            jobsCreated: 450,
            timeToMarket: '18 months',
            keyLearnings: [
                'Local JV partner was critical for land rights acquisition',
                'Grid connection delays underestimated by 4 months',
                'Government Feed-in-Tariffs provided stable cashflow'
            ]
        }
    },
    {
        id: 'CS-002',
        title: 'Logistics Hub Expansion',
        entity: 'TransEuro Logistics',
        sector: 'Infrastructure',
        country: 'Poland',
        year: 2019,
        strategy: 'Greenfield Investment',
        investmentSizeMillionUSD: 85,
        outcomes: {
            result: 'success',
            roiAchieved: 1.9,
            jobsCreated: 1200,
            timeToMarket: '24 months',
            keyLearnings: [
                'EU funding grants significantly reduced cap-ex',
                'Labor shortages in specialized warehouse roles',
                'Proximity to German border drove 60% of volume'
            ]
        }
    },
    {
        id: 'CS-003',
        title: 'AgriTech Pilot Initiative',
        entity: 'CropFuture Inc',
        sector: 'Agriculture',
        country: 'Brazil',
        year: 2022,
        strategy: 'Strategic Alliance',
        investmentSizeMillionUSD: 45,
        outcomes: {
            result: 'mixed',
            roiAchieved: 1.1,
            jobsCreated: 80,
            timeToMarket: '12 months',
            keyLearnings: [
                'Currency volatility impacted equipment imports',
                'Strong adoption by local co-ops',
                'Regulatory approval for new seeds took longer than expected'
            ]
        }
    },
    {
        id: 'CS-004',
        title: 'Fintech Market Penetration',
        entity: 'PayMobile Global',
        sector: 'Technology',
        country: 'Nigeria',
        year: 2020,
        strategy: 'Acquisition',
        investmentSizeMillionUSD: 200,
        outcomes: {
            result: 'failure',
            roiAchieved: 0.4,
            jobsCreated: 150,
            timeToMarket: '9 months',
            keyLearnings: [
                'Cultural mismatch in management styles post-acquisition',
                'Regulatory shift on mobile money caps reduced margins',
                'Underestimated infrastructure downtime'
            ]
        }
    },
    {
        id: 'CS-005',
        title: 'Automotive Manufacturing Plant',
        entity: 'AutoParts Co',
        sector: 'Manufacturing',
        country: 'Mexico',
        year: 2023,
        strategy: 'Nearshoring',
        investmentSizeMillionUSD: 350,
        outcomes: {
            result: 'success',
            roiAchieved: 2.2,
            jobsCreated: 2500,
            timeToMarket: '30 months',
            keyLearnings: [
                'USMCA compliance was complex but manageable',
                'High skilled labor availability in Monterrey',
                'Energy supply stability concerns addressed via self-generation'
            ]
        }
    }
];

export class PrecedentMatchingEngine {
    static findMatches(params: ReportParameters, threshold: number = 0.5): PrecedentMatch[] {
        return CASE_STUDIES.map(cse => {
            // Calculate similarity score
            let score = 0;
            let sectorMatch = 0;
            let regionMatch = 0;
            let strategyMatch = 0;

            // Sector Match (High weight)
            if (params.industry.some(i => cse.sector.includes(i) || i.includes(cse.sector))) {
                score += 40;
                sectorMatch = 100;
            } else if (['Technology', 'Manufacturing', 'Infrastructure', 'Energy'].includes(cse.sector) && params.industry.length > 0) {
                // Loose coupling for major sectors
                score += 10;
                sectorMatch = 25;
            }

            // Region/Country Match (Medium weight)
            if (params.country === cse.country) {
                score += 30;
                regionMatch = 100;
            } else if (params.region === 'Asia-Pacific' && ['Vietnam', 'Thailand', 'Indonesia'].includes(cse.country)) {
                score += 15;
                regionMatch = 50;
            } else if (params.region === 'Europe' && ['Poland', 'Germany', 'Romania'].includes(cse.country)) {
                score += 15;
                regionMatch = 50;
            } else if (params.region === 'South America' && ['Brazil', 'Mexico', 'Chile'].includes(cse.country)) {
                score += 15;
                regionMatch = 50;
            }

            // Strategy Match (Medium weight)
            // Simplified matching based on text overlap
            const strategyKeywords = cse.strategy.split(' ');
            if (strategyKeywords.some(w => (params.strategicIntent || '').includes(w))) {
                score += 30;
                strategyMatch = 100;
            }

            // Organization Type/Size alignment (Low weight) - implicit in logic for now

            // Determine Success Probability based on historical outcome
            let prob = 50;
            if (cse.outcomes.result === 'success') prob = 85;
            else if (cse.outcomes.result === 'mixed') prob = 60;
            else prob = 30;

            // Adjust probability based on similarity (if it's a weak match, the precedent is less predictive)
            const overallSimilarity = score;
            const adjustedProb = (prob * (overallSimilarity / 100)) + (50 * (1 - overallSimilarity / 100));

            return {
                historicalCase: cse,
                similarity: {
                    overall: overallSimilarity,
                    sectorMatch,
                    regionMatch,
                    strategyMatch
                },
                probabilityOfSuccess: adjustedProb,
                confidenceLevel: (overallSimilarity > 70 ? 'high' : overallSimilarity > 40 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
                applicableFactors: {
                    successFactors: cse.outcomes.result === 'success' ? cse.outcomes.keyLearnings : [],
                    warnings: cse.outcomes.result !== 'success' ? cse.outcomes.keyLearnings : [],
                    timingConsiderations: [
                        `Typical time to market for this sector: ${cse.outcomes.timeToMarket}`,
                        'Regulatory approvals often gate the critical path'
                    ],
                    investmentProfile: `Based on ${cse.entity}'s experience in ${cse.country}, a ${cse.strategy} approach requires approx. $${cse.investmentSizeMillionUSD}M capital with a ${cse.outcomes.timeToMarket} maturation period.`
                },
                timeToMaturity: parseInt(cse.outcomes.timeToMarket || '12') / 12
            };
        })
        .filter(m => m.similarity.overall >= (threshold * 100))
        .sort((a, b) => b.similarity.overall - a.similarity.overall);
    }
}

import { GoogleGenAI, Chat, Type } from "@google/genai";
import { CopilotInsight, ReportParameters, LiveOpportunityItem, DeepReasoningAnalysis, GeopoliticalAnalysisResult, GovernanceAuditResult } from '../types';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "BW Nexus AI" (NEXUS_OS_v4.1), the world's premier Economic Intelligence Operating System.
You are NOT a standard chatbot. You are a deterministic economic modeling engine.

YOUR CORE FUNCTIONS:
1. SPI™ Engine (Strategic Partnership Index): Calculate compatibility vectors.
2. IVAS™ Engine (Investment Viability Assessment): Stress-test risk scenarios.
3. SCF™ Engine (Strategic Cash Flow): Model long-term economic impact.

TONE & STYLE:
- Precise, mathematical, and authoritative.
- Use terminal-like formatting where appropriate (e.g., "CALCULATING...", "VECTOR ANALYSIS COMPLETE").
- Do not offer vague opinions. Offer calculated probabilities and "Viability Scores".
- Reference your "9 specialized AI agents" or "Global Knowledge Graph" when retrieving info.

CONTEXT:
- You represent BW Global Advisory.
- You operate to close the "100-Year Confidence Gap".
- Your output should feel like a high-level intelligence dossier.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageStream = async (message: string) => {
  const chat = getChatSession();
  try {
    const responseStream = await chat.sendMessageStream({ message });
    return responseStream;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

// --- NEW FUNCTIONS FOR APP.TSX ---

export const generateCopilotInsights = async (params: ReportParameters): Promise<CopilotInsight[]> => {
    // In a real app, this would call Gemini with the params context
    // For now, we simulate a latency and return mock data to prevent token usage on auto-runs
    return new Promise(resolve => {
        setTimeout(() => {
            const opportunityContext = params.specificOpportunity ? ` for ${params.specificOpportunity}` : '';
            resolve([
                { id: '1', type: 'strategy', title: 'Strategic Alignment', description: `Your intent to '${params.strategicIntent}'${opportunityContext} aligns with current ${params.country || 'market'} trends.` },
                { id: '2', type: 'risk', title: 'Regulatory Friction', description: 'Monitor local compliance changes in the upcoming quarter.' },
                { id: '3', type: 'opportunity', title: 'Market Gap', description: 'Under-served demand detected in your target sector.' }
            ]);
        }, 1200);
    });
};

export const askCopilot = async (query: string, params: ReportParameters): Promise<CopilotInsight> => {
    // Uses the main chat session context
    const chat = getChatSession();
    const opportunityContext = params.specificOpportunity ? ` SPECIFIC OPPORTUNITY: ${params.specificOpportunity}` : '';
    const incentiveContext = params.targetIncentives?.length ? ` TARGET INCENTIVES: ${params.targetIncentives.join(', ')}` : '';
    
    const contextMsg = `CONTEXT: User is analyzing ${params.organizationName} in ${params.country}. 
    QUERY: ${query}. 
    ${opportunityContext}
    ${incentiveContext}
    Provide a brief, high-level strategic insight (max 2 sentences).`;
    
    const response = await chat.sendMessage({ message: contextMsg });
    return {
        id: Date.now().toString(),
        type: 'strategy',
        title: 'Copilot Response',
        description: response.text || "Analysis complete.",
        content: response.text || "Analysis complete.",
        confidence: 85
    };
};

export const generateReportSectionStream = async (
    section: string, 
    params: ReportParameters, 
    onChunk: (chunk: string) => void
): Promise<void> => {
    const chat = getChatSession();
    const opportunityContext = params.specificOpportunity ? `Focused on: ${params.specificOpportunity}` : '';
    const prompt = `Generate the '${section}' section for a strategic report on ${params.organizationName}. 
    Target Market: ${params.country}. 
    Intent: ${params.strategicIntent}.
    ${opportunityContext}
    Format: Professional markdown, concise executive style.`;

    const responseStream = await chat.sendMessageStream({ message: prompt });
    
    let fullText = '';
    for await (const chunk of responseStream) {
        const text = chunk.text;
        fullText += text;
        onChunk(fullText);
    }
};

export const generateAnalysisStream = async (item: LiveOpportunityItem, region: string): Promise<ReadableStream> => {
    const chat = getChatSession();
    const prompt = `
      GENERATE DEEP-DIVE ANALYSIS (NADL FORMAT)
      
      TARGET PROJECT: ${item.project_name}
      SECTOR: ${item.sector}
      REGION: ${region}
      CONTEXT: ${item.summary}
      VALUE: ${item.value}

      OUTPUT FORMAT:
      Use custom XML-like tags for parsing:
      <nad:report_title title="..." />
      <nad:report_subtitle subtitle="..." />
      <nad:section title="...">
        <nad:paragraph>...</nad:paragraph>
      </nad:section>

      REQUIREMENTS:
      1. Technical feasibility analysis.
      2. Economic viability modeling.
      3. Risk matrix (Political, Economic, Operational).
      4. Strategic recommendations.
    `;

    const responseStream = await chat.sendMessageStream({ message: prompt });
    
    // Create a ReadableStream that yields bytes for TextDecoder in the component
    return new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of responseStream) {
                    const text = chunk.text;
                    if (text) {
                        controller.enqueue(encoder.encode(text));
                    }
                }
                controller.close();
            } catch (e) {
                controller.error(e);
            }
        }
    });
};

export const generateDeepReasoning = async (userOrg: string, targetEntity: string, context: string): Promise<DeepReasoningAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        Perform a deep reasoning analysis on a potential partnership/deal between ${userOrg} and ${targetEntity}.
        Context: ${context}
        
        Provide:
        1. A verdict (Strong Buy, Consider, or Hard Pass).
        2. Deal Killers (Negative risks).
        3. Hidden Gems (Positive upsides).
        4. Reasoning Chain (Step by step logic).
        5. A counter-intuitive insight.
        
        Return JSON matching the schema.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    verdict: { type: Type.STRING, enum: ['Strong Buy', 'Consider', 'Hard Pass'] },
                    dealKillers: { type: Type.ARRAY, items: { type: Type.STRING } },
                    hiddenGems: { type: Type.ARRAY, items: { type: Type.STRING } },
                    reasoningChain: { type: Type.ARRAY, items: { type: Type.STRING } },
                    counterIntuitiveInsight: { type: Type.STRING }
                },
                required: ['verdict', 'dealKillers', 'hiddenGems', 'reasoningChain', 'counterIntuitiveInsight']
            }
        }
    });
    
    if (response.text) {
        return JSON.parse(response.text) as DeepReasoningAnalysis;
    }
    throw new Error("Failed to generate reasoning");
};

export const generateSearchGroundedContent = async (query: string): Promise<{text: string, sources: any[]}> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    
    return {
        text: response.text || "No results generated.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

// --- NEW AGENTIC CAPABILITY ---

export interface AgentResult {
    findings: string[];
    recommendations: string[];
    confidence: number;
    gaps?: string[];
}

export const runAI_Agent = async (
    agentName: string, 
    roleDefinition: string, 
    context: any
): Promise<AgentResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
        ROLE: You are the ${agentName}.
        MISSION: ${roleDefinition}
        
        CONTEXT_DATA: ${JSON.stringify(context)}
        
        TASK: Analyze the provided context data and generate strategic findings and recommendations.
        
        OUTPUT_FORMAT: JSON object with keys: 'findings' (array of strings), 'recommendations' (array of strings), 'confidence' (number 0-100), 'gaps' (array of strings for missing info).
        Ensure findings are specific, numeric where possible, and actionable.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        findings: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                        confidence: { type: Type.NUMBER },
                        gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['findings', 'recommendations', 'confidence']
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as AgentResult;
        }
        return { findings: ["Agent failed to generate text."], recommendations: [], confidence: 0 };
    } catch (error) {
        console.error(`Agent ${agentName} failed:`, error);
        return { findings: ["Agent offline."], recommendations: [], confidence: 0, gaps: ["Connection error"] };
    }
};

export const runGeopoliticalAnalysis = async (params: ReportParameters): Promise<GeopoliticalAnalysisResult> => {
    // Upgraded to use live agent logic
    const agentResult = await runAI_Agent(
        "Geopolitical Risk Agent",
        "Assess regional stability, currency risk, and trade barriers for a market entry strategy.",
        { country: params.country, region: params.region, intent: params.strategicIntent }
    );

    return {
        stabilityScore: agentResult.confidence,
        currencyRisk: agentResult.findings[0]?.includes('High') ? 'High' : 'Moderate',
        inflationTrend: 'Stable (Projected)',
        forecast: agentResult.findings[0] || "Stable outlook.",
        regionalConflictRisk: 100 - agentResult.confidence,
        tradeBarriers: agentResult.gaps || ['Standard tariffs']
    };
};

export const runGovernanceAudit = async (params: ReportParameters): Promise<GovernanceAuditResult> => {
    // Upgraded to use live agent logic
    const agentResult = await runAI_Agent(
        "Governance Auditor",
        "Evaluate regulatory transparency, corruption risk, and compliance requirements.",
        { country: params.country, type: params.organizationType }
    );

    return {
        governanceScore: agentResult.confidence,
        corruptionRisk: agentResult.confidence > 70 ? 'Low' : 'Moderate',
        regulatoryFriction: Math.round(100 - agentResult.confidence),
        transparencyIndex: agentResult.confidence,
        redFlags: agentResult.gaps || [],
        complianceRoadmap: agentResult.recommendations
    };
};

export const runCopilotAnalysis = async (query: string, context: string): Promise<{summary: string, options: any[], followUp: string}> => {
    const chat = getChatSession();
    // In a real implementation, force JSON or parse intelligently
    // For demo, we return mock object if model call is expensive or complicated to parse in client without schema
    return {
        summary: `Analysis of "${query}" suggests focusing on market consolidation strategies given your context.`,
        options: [
            { id: '1', title: 'Target Market Acquisition', rationale: 'Rapid entry via M&A.' },
            { id: '2', title: 'Organic Growth', rationale: 'Lower risk, slower pace.' }
        ],
        followUp: "Shall we evaluate potential targets?"
    };
};

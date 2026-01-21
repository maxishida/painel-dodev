
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Project, Task, TeamMember } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Tool Definitions ---

const createTaskTool: FunctionDeclaration = {
  name: 'createTask',
  description: 'Creates a new task. Use this when the user explicitly asks to add a work item.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'Title of the task' },
      area: { type: Type.STRING, description: 'Area: frontend, backend, design, devops, mobile, qa' },
      priority: { type: Type.STRING, description: 'high, medium, low' },
      assignee: { type: Type.STRING, description: 'Name of team member' }
    },
    required: ['title', 'area', 'priority']
  }
};

const analyzeCVTool: FunctionDeclaration = {
  name: 'analyzeCV',
  description: 'Analyzes a CV content to extract skills and suggest a role.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      candidateName: { type: Type.STRING },
      extractedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
      suggestedRole: { type: Type.STRING },
      experienceSummary: { type: Type.STRING }
    },
    required: ['candidateName', 'suggestedRole']
  }
};

const createProjectTool: FunctionDeclaration = {
  name: 'createProject',
  description: 'Creates a new client project.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Project internal name' },
      client: { type: Type.STRING, description: 'Client name' },
      category: { type: Type.STRING, description: 'production, development, tools, maintenance' },
      description: { type: Type.STRING, description: 'Short description' }
    },
    required: ['name', 'client', 'category']
  }
};

const scheduleMeetingTool: FunctionDeclaration = {
  name: 'scheduleMeeting',
  description: 'Schedules a meeting.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      time: { type: Type.STRING },
      date: { type: Type.STRING }
    },
    required: ['title', 'time']
  }
};

const generateBudgetTool: FunctionDeclaration = {
  name: 'generateBudget',
  description: 'Calculates and generates a budget proposal based on requirements.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      clientName: { type: Type.STRING },
      items: { 
        type: Type.ARRAY, 
        items: {
            type: Type.OBJECT,
            properties: {
                toolName: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                description: { type: Type.STRING }
            }
        }
      },
      setupFee: { type: Type.NUMBER },
      totalMonthly: { type: Type.NUMBER }
    },
    required: ['clientName', 'totalMonthly', 'items']
  }
};

const updateMarketPricesTool: FunctionDeclaration = {
  name: 'updateMarketPrices',
  description: 'Triggers the frontend to update market prices.',
  parameters: {
    type: Type.OBJECT,
    properties: {
       confirm: { type: Type.BOOLEAN }
    }
  }
};

// --- Service Class ---

export class OrchestratorService {
  private chatSession: any;

  constructor() {
    this.initChat('general');
  }

  private initChat(mode: 'general' | 'market' = 'general', contextInstructions?: string) {
    const model = 'gemini-3-flash-preview'; 
    
    let baseInstruction = '';
    let tools: any[] = [];

    if (mode === 'market') {
        baseInstruction = `
            You are the AI Marketing & Sales Engineer for a Dev Agency (Deep Search Enabled).
            
            CORE ROLES:
            1. **Budget Architect**: Create detailed price proposals. ALWAYS use USD.
            2. **Deep Search Analyst**: You have access to real-time pricing via Google Search Grounding.
            3. **Tech Stack Consultant**: Compare Databases, LLMs, and Cloud options.
            
            KNOWLEDGE BASE (Verify with Search if user asks for latest):
            - **LLMs (New Generation):** Gemini 3.0 Flash/Pro, GPT-5 Preview, Claude 3.7. 
              *Critical*: Distinguish between Input, Output, and Cached tokens.
            - **Databases (Serverless & Edge):** Supabase (Postgres), Neon, PlanetScale, Upstash (Redis).
            - **Cloud:** Hetzner (Low cost EU), AWS (Standard), DigitalOcean.
            
            BEHAVIOR:
            - **VERIFICATION:** If the user asks for specific prices, use Google Search to verify if your internal data is outdated.
            - **COMPARISON:** When comparing DBs, mention "Serverless", "Cold Starts", and "Edge Latency".
            - **SALES:** If client wants "cheap cloud", suggest Hetzner. If "fastest dev velocity", suggest Supabase.
            - When asked to "Generate Price", use the 'generateBudget' tool.
        `;
        // Enable Google Search for Market Agent to fulfill "Deep Search" promise
        tools = [
             { functionDeclarations: [generateBudgetTool, updateMarketPricesTool] },
             { googleSearch: {} }
        ];
    } else {
        baseInstruction = `
            You are the AI Operational Manager for a High-Tech Dev Agency.
            
            CORE ROLES:
            1. **HR & Talent**: Parse CVs, extract skills, suggest roles, and assign candidates to projects.
            2. **Project Manager**: Manage project lifecycles.
            3. **Dispatcher**: Assign tasks.
            
            BEHAVIOR:
            - If a CV is uploaded, use 'analyzeCV'.
            - Be precise, authoritative, and data-driven.
        `;
        tools = [{ functionDeclarations: [createTaskTool, scheduleMeetingTool, createProjectTool, analyzeCVTool] }];
    }

    this.chatSession = ai.chats.create({
      model: model,
      config: {
        systemInstruction: contextInstructions ? `${baseInstruction}\n\nCONTEXT:\n${contextInstructions}` : baseInstruction,
        tools: tools
      }
    });
  }

  public setContext(project?: Project, team?: TeamMember[], mode: 'general' | 'market' = 'general') {
    let contextStr = `Mode: ${mode.toUpperCase()}.`;
    
    if (project) {
        contextStr += `\nProject: ${project.name} (${project.status}).`;
    }
    if (team) {
        contextStr += `\nTeam Available: ${team.length} members.`;
    }

    this.initChat(mode, contextStr);
  }

  async sendMessage(
    message: string, 
    contextFiles: string[],
    actionCallbacks: { 
      onCreateTask?: (task: any) => void,
      onScheduleMeeting?: (meeting: any) => void,
      onCreateProject?: (project: any) => void,
      onGenerateBudget?: (budget: any) => void,
      onUpdatePrices?: () => void
    }
  ): Promise<string> {
    if (!apiKey) return "API Key not found.";

    try {
      let finalPrompt = message;
      if (contextFiles.length > 0) {
        finalPrompt += `\n[System: Analyzed files: ${contextFiles.join(', ')}.]`;
      }

      const result = await this.chatSession.sendMessage({ message: finalPrompt });
      
      let responseText = "";

      // Check for grounding (Google Search) results
      const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks && groundingChunks.length > 0) {
        responseText += "\n\n[Sources Found:]\n";
        groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
                responseText += `- ${chunk.web.title}: ${chunk.web.uri}\n`;
            }
        });
        responseText += "\n";
      }

      const toolCalls = result.functionCalls;
      if (toolCalls && toolCalls.length > 0) {
        const functionResponses = [];
        for (const call of toolCalls) {
           const args = call.args as any;
           
           if (call.name === 'createTask' && actionCallbacks.onCreateTask) {
             actionCallbacks.onCreateTask(args);
             functionResponses.push({ id: call.id, name: call.name, response: { result: 'Task Created' } });
             responseText += `[Task Created: ${args.title}] `;
           } 
           else if (call.name === 'scheduleMeeting' && actionCallbacks.onScheduleMeeting) {
             actionCallbacks.onScheduleMeeting(args);
             functionResponses.push({ id: call.id, name: call.name, response: { result: 'Meeting Scheduled' } });
             responseText += `[Meeting Set: ${args.title}] `;
           }
           else if (call.name === 'createProject' && actionCallbacks.onCreateProject) {
             actionCallbacks.onCreateProject(args);
             functionResponses.push({ id: call.id, name: call.name, response: { result: 'Project Initialized' } });
             responseText += `[Project Initialized: ${args.name}] `;
           }
           else if (call.name === 'analyzeCV') {
             functionResponses.push({ id: call.id, name: call.name, response: { result: 'CV Parsed' } });
             responseText += `[CV Analisado: ${args.candidateName}]\nSkills: ${args.extractedSkills?.join(', ')}`;
           }
           else if (call.name === 'generateBudget' && actionCallbacks.onGenerateBudget) {
             actionCallbacks.onGenerateBudget(args);
             functionResponses.push({ id: call.id, name: call.name, response: { result: 'Budget Generated' } });
             responseText += `[Orçamento Gerado para ${args.clientName}: Total Mensal $${args.totalMonthly}] `;
           }
           else if (call.name === 'updateMarketPrices' && actionCallbacks.onUpdatePrices) {
             actionCallbacks.onUpdatePrices();
             functionResponses.push({ id: call.id, name: call.name, response: { result: 'Prices Updated' } });
             responseText += `[Deep Search: Preços Atualizados via Grounding] `;
           }
        }
        
        const finalResponse = await this.chatSession.sendToolResponse({ functionResponses });
        responseText += finalResponse.text;
      } else {
        responseText += result.text;
      }

      return responseText;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error connecting to AI Core.";
    }
  }
}

export const geminiOrchestrator = new OrchestratorService();

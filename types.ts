
export type ProjectArea = 'frontend' | 'backend' | 'devops' | 'mobile' | 'design' | 'qa' | 'general' | 'data';

export type ProjectStatus = 'planning' | 'development' | 'production' | 'maintenance' | 'completed';
export type ProjectCategory = 'production' | 'development' | 'tools' | 'maintenance';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  skills: string[];
  experience?: string; // Years or level
  bio?: string; // Extracted from CV
  schedule?: string; // e.g., "09:00 - 18:00"
  workload?: number; // 0-100%
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  startDate: string;
  deadline: string;
  progress: number;
  teamIds: string[]; 
  techStack?: string[];
  roadmap?: { step: string; status: 'done' | 'current' | 'pending'; date?: string }[];
}

export interface Task {
  id: string;
  projectId?: string; 
  title: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  area: ProjectArea; 
  assignee: string; // Team Member ID
  description?: string;
  dueDate?: string;
  estimatedHours?: number;
}

export interface Meeting {
  id: string;
  projectId?: string;
  title: string;
  time: string;
  date: string; 
  type: 'client' | 'internal' | 'review';
  attendees?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachments?: string[];
}

// --- Market / Finance Types ---

export type MarketCategory = 'api_ai' | 'cloud_infra' | 'deploy' | 'rag_tools' | 'image_gen' | 'video_gen' | 'payment_gateways';

export interface ToolVariant {
  name: string; // e.g., "Input", "Output", "Cached", "Audio In"
  price: number;
  unit: string;
}

export interface ToolSpecs {
  contextWindow?: string; // e.g., "128k", "2M"
  maxOutput?: string;
  modalities?: string[]; // e.g., ["Text", "Image", "Video", "Audio"]
  latency?: string; // e.g., "Low", "Medium"
  releaseDate?: string;
}

export interface MarketTool {
  id: string;
  name: string;
  category: MarketCategory;
  price: number; // Base price for sorting/display
  currency: 'USD' | 'BRL';
  unit: string; // Display unit
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  provider?: string;
  description?: string;
  website?: string;
  docsUrl?: string;
  specs?: ToolSpecs;
  variants?: ToolVariant[];
}

export interface BudgetProposal {
  id: string;
  clientName: string;
  totalMonthly: number;
  setupFee: number;
  items: { toolName: string; cost: number; description: string }[];
  status: 'draft' | 'generated';
}

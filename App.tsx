
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsGrid } from './components/StatsGrid';
import { Kanban } from './components/Kanban';
import { ChatWidget } from './components/ChatWidget';
import { ProjectsView, TeamView, CalendarView, RagView, FinanceView } from './components/Pages';
import { ProjectDetail } from './components/ProjectDetail';
import { OperationalTable } from './components/OperationalTable';
import { MarketPrice } from './components/MarketPrice';
import { Task, Meeting, Project, TeamMember, MarketTool } from './types';

// --- RICH MOCK DATA ---
const MOCK_TEAM: TeamMember[] = [
  { 
    id: 't1', name: 'Lucas Silva', role: 'Senior Full Stack', status: 'online', avatar: 'https://picsum.photos/seed/lucas/100', 
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'], experience: '7 anos', bio: 'Expert em arquitetura de microserviços e liderança técnica.', workload: 85, schedule: '08:00 - 17:00'
  },
  { 
    id: 't2', name: 'Aria Mendes', role: 'Lead UI/UX Designer', status: 'busy', avatar: 'https://picsum.photos/seed/aria/100', 
    skills: ['Figma', 'CSS Animations', 'Design Systems'], experience: '5 anos', bio: 'Focada em acessibilidade e design systems escaláveis.', workload: 60, schedule: '10:00 - 19:00'
  },
  { 
    id: 't3', name: 'Ricardo O.', role: 'DevOps Engineer', status: 'offline', avatar: 'https://picsum.photos/seed/ricardo/100', 
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'], experience: '4 anos', bio: 'Automação de infraestrutura e otimização de custos de nuvem.', workload: 20, schedule: '09:00 - 18:00'
  },
];

const MOCK_PROJECTS: Project[] = [
  { 
    id: 'p1', name: 'Dashboard Corporativo V2', client: 'Internal', description: 'Painel administrativo principal com integração AI.', status: 'development', category: 'development',
    startDate: '2023-10-01', deadline: '2023-12-15', progress: 65, teamIds: ['t1', 't2'], techStack: ['React', 'Gemini'],
    roadmap: [
        { step: 'Definição de Requisitos', status: 'done', date: '01/10' },
        { step: 'Prototipação UI', status: 'done', date: '15/10' },
        { step: 'Integração Backend', status: 'current', date: 'Now' },
        { step: 'QA & Testes', status: 'pending' },
    ]
  },
  { 
    id: 'p2', name: 'E-commerce Sneakers', client: 'Shopify Clone', description: 'Marketplace mobile-first para tênis de luxo.', status: 'planning', category: 'development',
    startDate: '2023-11-01', deadline: '2024-03-01', progress: 10, teamIds: ['t1', 't3'],
    roadmap: [
        { step: 'Kick-off', status: 'done', date: '01/11' },
        { step: 'Setup AWS', status: 'current', date: 'Now' },
        { step: 'MVP Development', status: 'pending' },
    ]
  },
  { 
    id: 'p3', name: 'App Financeiro Mobile', client: 'FinTech X', description: 'Manutenção do app legado e hotfixes.', status: 'production', category: 'production',
    startDate: '2023-01-01', deadline: 'Continuous', progress: 100, teamIds: ['t1'],
    roadmap: [
        { step: 'Lançamento v1.0', status: 'done' },
        { step: 'Monitoramento', status: 'current' },
        { step: 'Patch de Segurança', status: 'pending' }
    ]
  },
];

const MOCK_TASKS: Task[] = [
  { id: '1', projectId: 'p1', title: 'Implementar Auth JWT', status: 'in-progress', priority: 'high', area: 'backend', assignee: 't1' },
  { id: '2', projectId: 'p1', title: 'Refinar Dark Mode', status: 'backlog', priority: 'medium', area: 'design', assignee: 't2' },
  { id: '3', projectId: 'p2', title: 'Setup Terraform', status: 'in-progress', priority: 'high', area: 'devops', assignee: 't3' },
];

const MOCK_MEETINGS: Meeting[] = [
  { id: 'm1', title: 'Sprint Review', time: '14:00', date: new Date().toISOString().split('T')[0], type: 'client' },
  { id: 'm2', title: 'Daily', time: '09:00', date: '2023-10-26', type: 'internal' } 
];

// --- DEEP SEARCH DATASET (ROBUST & EXTENDED) ---
const MOCK_TOOLS: MarketTool[] = [
    // --- LLMs (Next Gen) ---
    { 
      id: 'llm1', name: 'Gemini 3.0 Pro', category: 'api_ai', price: 2.50, currency: 'USD', unit: 'per_1k_tokens', trend: 'stable', lastUpdated: 'Deep Search: Now', provider: 'Google',
      description: 'Modelo de raciocínio avançado. Janela de contexto massiva e capacidades de agente nativas.',
      docsUrl: 'https://ai.google.dev/',
      specs: { contextWindow: '5M+', maxOutput: '16k', modalities: ['Text', 'Audio', 'Video', 'Code'], releaseDate: 'Preview 2025' },
      variants: [
        { name: 'Input Tokens', price: 2.50, unit: '/1M tokens' },
        { name: 'Output Tokens', price: 7.50, unit: '/1M tokens' },
        { name: 'Context Caching', price: 0.25, unit: '/1M tokens/hour' }
      ]
    },
    { 
      id: 'llm2', name: 'Gemini 3.0 Flash', category: 'api_ai', price: 0.15, currency: 'USD', unit: 'per_1k_tokens', trend: 'down', lastUpdated: 'Deep Search: Now', provider: 'Google',
      description: 'Otimizado para altíssima velocidade e baixo custo. Ideal para tarefas de alto volume e análise de vídeo em tempo real.',
      docsUrl: 'https://ai.google.dev/',
      specs: { contextWindow: '2M', maxOutput: '8k', latency: 'Ultra Low', releaseDate: 'Preview 2025' },
      variants: [
        { name: 'Input Tokens', price: 0.15, unit: '/1M tokens' },
        { name: 'Output Tokens', price: 0.45, unit: '/1M tokens' },
        { name: 'Cached Input', price: 0.015, unit: '/1M tokens' }
      ]
    },
    { 
      id: 'llm3', name: 'GPT-5 Preview (o2)', category: 'api_ai', price: 5.00, currency: 'USD', unit: 'per_1k_tokens', trend: 'up', lastUpdated: 'Deep Search: 4h ago', provider: 'OpenAI',
      description: 'Modelo de raciocínio profundo "Orion". Capacidade de auto-correção e planejamento multi-passo.',
      specs: { contextWindow: '500k', maxOutput: '32k', modalities: ['Text', 'Image'] },
      variants: [
        { name: 'Input (Thinking)', price: 5.00, unit: '/1M tokens' },
        { name: 'Output', price: 15.00, unit: '/1M tokens' }
      ]
    },
    { 
      id: 'llm5', name: 'Claude 3.7 Opus', category: 'api_ai', price: 15.00, currency: 'USD', unit: 'per_1k_tokens', trend: 'stable', lastUpdated: 'Yesterday', provider: 'Anthropic',
      description: 'Excelência em escrita criativa e nuances complexas.',
      specs: { contextWindow: '200k', maxOutput: '4k' },
      variants: [
        { name: 'Input', price: 15.00, unit: '/1M tokens' },
        { name: 'Output', price: 75.00, unit: '/1M tokens' }
      ]
    },
    {
        id: 'llm6', name: 'Azure OpenAI GPT-4o', category: 'api_ai', price: 2.50, currency: 'USD', unit: 'per_1k_tokens', trend: 'stable', lastUpdated: 'Deep Search: Now', provider: 'Microsoft Azure',
        description: 'Implementação Enterprise do GPT-4o. Compliance, segurança VNET e filtros de conteúdo regionais.',
        specs: { contextWindow: '128k', maxOutput: '4k', modalities: ['Text', 'Image'] },
        variants: [
            { name: 'Standard S0', price: 2.50, unit: '/1M input' },
            { name: 'Provisioned', price: 0.00, unit: 'Custom (PTU)' }
        ]
    },
    {
        id: 'llm7', name: 'Mistral Large 2', category: 'api_ai', price: 2.00, currency: 'USD', unit: 'per_1k_tokens', trend: 'down', lastUpdated: 'Deep Search: Now', provider: 'Mistral AI',
        description: 'Modelo europeu de ponta. Excelente em código e multilinguagem (EN, FR, DE, ES, IT).',
        specs: { contextWindow: '128k', maxOutput: '8k' },
        variants: [
            { name: 'Input', price: 2.00, unit: '/1M tokens' },
            { name: 'Output', price: 6.00, unit: '/1M tokens' }
        ]
    },

    // --- DEPLOY & INFRA (ROBUST) ---
    { 
        id: 'dep1', name: 'Vercel Pro', category: 'deploy', price: 20.00, currency: 'USD', unit: 'per_seat/mo', trend: 'stable', lastUpdated: 'Deep Search: Now', provider: 'Vercel',
        description: 'Frontend Cloud. Otimizado para Next.js. Edge Functions e Analytics integrados.',
        specs: { latency: 'Global Edge', modalities: ['Next.js', 'React', 'Svelte'] },
        variants: [
            { name: 'Pro Seat', price: 20.00, unit: '/mo' },
            { name: 'Bandwidth', price: 40.00, unit: '/100GB extra' },
            { name: 'Serverless Function', price: 0.60, unit: '/GB-hour' }
        ]
    },
    {
        id: 'dep2', name: 'Cloudflare Workers', category: 'deploy', price: 5.00, currency: 'USD', unit: 'monthly', trend: 'down', lastUpdated: 'Deep Search: Now', provider: 'Cloudflare',
        description: 'Serverless compute na borda (Edge). 0ms cold start. KV Store e Durable Objects.',
        specs: { latency: '<10ms (Global)', modalities: ['JS', 'Rust', 'Wasm'] },
        variants: [
            { name: 'Workers Paid', price: 5.00, unit: '/mo (10M requests)' },
            { name: 'Requests', price: 0.30, unit: '/1M requests extra' },
            { name: 'Duration', price: 0.02, unit: '/1M GB-sec' }
        ]
    },
    {
        id: 'dep3', name: 'Railway', category: 'deploy', price: 5.00, currency: 'USD', unit: 'monthly (base)', trend: 'up', lastUpdated: 'Deep Search: Now', provider: 'Railway',
        description: 'Infraestrutura PaaS simplificada. Deploy a partir de repo GH. Suporte a Dockerfile nativo.',
        specs: { latency: 'US-West/East', modalities: ['Docker', 'Node', 'Python'] },
        variants: [
            { name: 'Pro Plan', price: 5.00, unit: '/mo subscription' },
            { name: 'RAM Usage', price: 10.00, unit: '/GB/mo' },
            { name: 'CPU Usage', price: 20.00, unit: '/vCPU/mo' }
        ]
    },
    {
        id: 'dep4', name: 'Render', category: 'deploy', price: 19.00, currency: 'USD', unit: 'monthly', trend: 'stable', lastUpdated: 'Deep Search: Now', provider: 'Render',
        description: 'Cloud unificada. Alternativa robusta ao Heroku. Discos SSD persistentes e Private Networking.',
        variants: [
            { name: 'Team Plan', price: 19.00, unit: '/user/mo' },
            { name: 'Compute Starter', price: 7.00, unit: '/mo' }
        ]
    },

    // --- DATABASES (ROBUST) ---
    { 
        id: 'db1', name: 'Supabase', category: 'cloud_infra', price: 25.00, currency: 'USD', unit: 'monthly', trend: 'stable', lastUpdated: 'Deep Search: Now', provider: 'Supabase Inc.',
        description: 'A alternativa Open Source ao Firebase. PostgreSQL completo com Realtime, Auth e Edge Functions.',
        specs: { latency: 'Global Edge', releaseDate: 'Stable', modalities: ['Postgres', 'Auth', 'Storage'] },
        variants: [
            { name: 'Pro Plan', price: 25.00, unit: '/project/mo' },
            { name: 'Database Size', price: 0.125, unit: '/GB over limit' }
        ]
    },
    { 
        id: 'db3', name: 'Neon', category: 'cloud_infra', price: 0.00, currency: 'USD', unit: 'usage_based', trend: 'down', lastUpdated: 'Deep Search: Now', provider: 'Neon',
        description: 'Postgres Serverless. Separação de compute e storage. Branching de banco de dados instantâneo.',
        specs: { latency: 'Cold Start <300ms', modalities: ['Serverless Postgres'] },
        variants: [
            { name: 'Compute', price: 0.16, unit: '/compute-hour' },
            { name: 'Storage', price: 0.00, unit: 'Free Tier Available' }
        ]
    },
    
    // --- VIDEO & IMAGE ---
    {
        id: 'vid3', name: 'Sora', category: 'video_gen', price: 0.00, currency: 'USD', unit: 'Invite Only', trend: 'stable', lastUpdated: 'Deep Search: Now', provider: 'OpenAI',
        description: 'Modelo de difusão de vídeo da OpenAI. Atualmente em fase de Red Teaming e acesso restrito.',
        specs: { maxOutput: '60s', modalities: ['Text-to-Video', 'Looping'], releaseDate: 'Red Teaming' },
        variants: [
            { name: 'Red Teaming Access', price: 0.00, unit: 'Invite Only' }
        ]
    },
    { 
        id: 'vid1', name: 'Runway Gen-3 Alpha', category: 'video_gen', price: 0.50, currency: 'USD', unit: 'per_second', trend: 'up', lastUpdated: 'Deep Search: 1h ago', provider: 'RunwayML',
        description: 'SOTA em controle temporal e realismo.',
        specs: { maxOutput: '10s', modalities: ['Text-to-Video', 'Image-to-Video'] },
        variants: [
            { name: 'Gen-3 Turbo', price: 0.25, unit: '/second' },
            { name: 'Gen-3 Alpha', price: 0.50, unit: '/second' }
        ]
    },
];

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false); // Global Modal State

  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view !== 'project-detail') setSelectedProjectId(null);
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('project-detail');
  };

  const handleTaskCreate = (newTask: Task) => setTasks(prev => [newTask, ...prev]);
  const handleMeetingSchedule = (newMeeting: Meeting) => setMeetings(prev => [...prev, newMeeting]);
  
  // Updated Project Creation
  const handleProjectCreate = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setShowProjectModal(false);
    setCurrentView('project-detail'); // Immediate redirect
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Pass navigation handlers to StatsGrid for interactivity */}
            <StatsGrid 
                tasksCount={tasks.filter(t => t.status !== 'done').length} 
                onNavigate={handleNavigate} 
            />
            <OperationalTable tasks={tasks} team={team} projects={projects} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[500px]">
              <div className="xl:col-span-2 flex flex-col gap-8 h-full">
                <div className="flex-1 min-h-0">
                  <Kanban tasks={tasks} />
                </div>
              </div>
              <div className="xl:col-span-1 h-full flex flex-col">
                 <ChatWidget 
                   contextMode="general"
                   meetings={meetings}
                   onTaskCreate={handleTaskCreate} 
                   onMeetingSchedule={handleMeetingSchedule} 
                   onProjectCreate={handleProjectCreate}
                 />
              </div>
            </div>
          </div>
        );
      case 'projects':
        return (
            <>
                <ProjectsView projects={projects} onSelectProject={handleSelectProject} />
                {/* Manual override button within view */}
                <div className="fixed bottom-6 right-6 md:hidden">
                    <button onClick={() => setShowProjectModal(true)} className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg text-white">
                        +
                    </button>
                </div>
            </>
        );
      case 'project-detail':
        const proj = projects.find(p => p.id === selectedProjectId);
        if (!proj) return <div>Project not found</div>;
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
             <div className="xl:col-span-2 h-full overflow-hidden">
                <ProjectDetail 
                    project={proj} 
                    tasks={tasks} 
                    team={team} 
                    onBack={() => handleNavigate('projects')} 
                    onUpdateProject={handleProjectUpdate}
                    onTaskCreate={handleTaskCreate}
                />
             </div>
             <div className="xl:col-span-1 h-full flex flex-col">
                <div className="mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Gestor do Projeto (IA)</div>
                <ChatWidget 
                   contextProject={proj}
                   contextMode="general"
                   meetings={meetings}
                   onTaskCreate={handleTaskCreate} 
                   onMeetingSchedule={handleMeetingSchedule} 
                   onProjectCreate={handleProjectCreate}
                 />
             </div>
          </div>
        );
      case 'team':
        return <TeamView team={team} tasks={tasks} projects={projects} />;
      case 'tasks':
        return <Kanban tasks={tasks} />;
      case 'calendar':
        return <CalendarView meetings={meetings} onAddMeeting={handleMeetingSchedule} />;
      case 'market':
        return <MarketPrice initialTools={MOCK_TOOLS} onGenerateBudgetProposal={() => {}} />;
      case 'rag':
        return <RagView />;
      case 'finance':
        return <FinanceView />;
      default:
        return <div>View not found</div>;
    }
  };

  // Simple New Project Modal Component
  const NewProjectModal = () => {
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#16161a] p-8 rounded-2xl border border-purple-500/30 w-full max-w-lg shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">🚀</div>
                    Novo Projeto
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 font-bold block mb-2">Nome do Projeto</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#1e1e24] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="Ex: Dashboard SaaS" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 font-bold block mb-2">Cliente / Empresa</label>
                        <input value={client} onChange={e => setClient(e.target.value)} className="w-full bg-[#1e1e24] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" placeholder="Ex: Internal, Acme Corp" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 font-bold block mb-2">Categoria</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['development', 'production'].map(cat => (
                                <div key={cat} className="bg-[#1e1e24] border border-gray-700 p-3 rounded-lg text-center cursor-pointer hover:border-purple-500 text-sm text-gray-300 capitalize">
                                    {cat}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setShowProjectModal(false)} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Cancelar</button>
                    <button 
                        onClick={() => handleProjectCreate({
                            id: Date.now().toString(),
                            name: name || 'Novo Projeto',
                            client: client || 'Internal',
                            description: 'Projeto criado manualmente.',
                            status: 'planning',
                            category: 'development',
                            startDate: new Date().toISOString().split('T')[0],
                            deadline: 'TBD',
                            progress: 0,
                            teamIds: []
                        })}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                        Criar Projeto
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d0d0d] text-gray-300 font-sans selection:bg-purple-500/30">
      <Sidebar 
        meetings={meetings} 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onNewProject={() => setShowProjectModal(true)} // Hooked up correctly
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>

      {showProjectModal && <NewProjectModal />}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

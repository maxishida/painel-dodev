
import React, { useState } from 'react';
import { Project, Task, TeamMember } from '../types';
import { Kanban } from './Kanban';

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  team: TeamMember[];
  onBack: () => void;
  onUpdateProject?: (project: Project) => void;
  onTaskCreate?: (task: Task) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, tasks, team, onBack, onUpdateProject }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ description: project.description, status: project.status });

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectTeam = team.filter(t => project.teamIds.includes(t.id));

  const handleSaveEdit = () => {
    if (onUpdateProject) {
        onUpdateProject({ ...project, description: editForm.description, status: editForm.status });
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          Voltar
        </button>
        <div className="flex gap-3">
             <button className="px-4 py-2 border border-purple-500/30 text-purple-400 rounded-lg text-sm hover:bg-purple-500/10">Gerar Relatório</button>
             <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm font-medium hover:bg-purple-500">Configurações</button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border p-6 rounded-2xl mb-6 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
             <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    project.category === 'production' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 
                    project.category === 'development' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-500' :
                    'bg-gray-700/50 border-gray-600 text-gray-400'
                 }`}>
                  {project.category}
                 </span>
             </div>
             <p className="text-gray-400 text-sm max-w-2xl">{project.description}</p>
          </div>
          <div className="text-right">
             <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status Atual</div>
             <div 
                className="text-lg font-bold text-white flex items-center justify-end gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsEditing(true)}
                title="Clique para editar"
             >
                <span className={`w-3 h-3 rounded-full animate-pulse ${
                    project.status === 'production' ? 'bg-green-500' :
                    project.status === 'development' ? 'bg-blue-500' :
                    'bg-yellow-500'
                }`}></span>
                {project.status.toUpperCase().replace('-', ' ')}
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
             </div>
          </div>
        </div>
        
        {/* Timeline Visualization */}
        <div className="relative pt-6 pb-2">
            <div className="absolute top-[34px] left-0 w-full h-1 bg-gray-800 rounded-full z-0"></div>
            <div className="relative z-10 flex justify-between">
                {[
                    { id: 'planning', label: 'Planejamento' }, 
                    { id: 'development', label: 'Desenvolvimento' }, 
                    { id: 'production', label: 'Produção' }, 
                    { id: 'maintenance', label: 'Manutenção' }
                ].map((step, idx) => {
                    // Logic to determine active state based on project status index
                    const statuses = ['planning', 'development', 'production', 'maintenance', 'completed'];
                    const currentIdx = statuses.indexOf(project.status);
                    const stepIdx = statuses.indexOf(step.id);
                    const isCompleted = stepIdx <= currentIdx;
                    const isCurrent = stepIdx === currentIdx;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                                isCurrent ? 'bg-purple-500 border-purple-500 scale-125 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 
                                isCompleted ? 'bg-cyan-500 border-cyan-500' : 'bg-dark-card border-gray-600'
                            }`}></div>
                            <span className={`text-xs font-medium ${isCurrent ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6">
        {['overview', 'tasks', 'team'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab 
                ? 'border-purple-500 text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab === 'overview' ? 'Visão Geral' : tab === 'tasks' ? 'Tarefas & Roadmap' : 'Equipe Alocada'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* AI Insight Card */}
             <div className="bg-[#1c1c21] p-5 rounded-xl border border-purple-500/20 shadow-[0_0_15px_-5px_rgba(168,85,247,0.1)]">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </div>
                    <h3 className="text-white font-semibold">Análise Operacional (IA)</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                   {project.status === 'production' 
                    ? "Projeto em ambiente produtivo. Foco atual deve ser monitoramento de estabilidade e hotfixes. Nenhuma anomalia crítica detectada nas últimas 24h."
                    : "Desenvolvimento ativo. Velocidade da equipe está 15% acima da média. Gargalo potencial identificado na fase de QA prevista para a próxima semana."}
                </p>
                <div className="p-3 bg-black/30 rounded border border-gray-800 text-xs text-gray-400">
                    <strong>Próxima Ação Recomendada:</strong> {project.status === 'production' ? 'Rotacionar chaves de API.' : 'Revisar PRs pendentes do Frontend.'}
                </div>
             </div>

             {/* Roadmap List */}
             <div className="bg-[#1c1c21] p-5 rounded-xl border border-gray-800">
                <h3 className="text-white font-semibold mb-4">Próximos Passos (Timeline)</h3>
                <div className="space-y-4">
                    {project.roadmap?.map((step, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${step.status === 'done' ? 'bg-green-500' : step.status === 'current' ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                                {i !== (project.roadmap?.length || 0) - 1 && <div className="w-px h-full bg-gray-800 my-1"></div>}
                            </div>
                            <div>
                                <h4 className={`text-sm font-medium ${step.status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{step.step}</h4>
                                {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                            </div>
                        </div>
                    )) || <div className="text-sm text-gray-500">Roadmap não definido.</div>}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'tasks' && (
           <Kanban tasks={projectTasks} />
        )}

        {activeTab === 'team' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
             {projectTeam.map(member => (
               <div key={member.id} className="bg-[#1c1c21] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                 <div className="relative">
                   <img src={member.avatar} className="w-12 h-12 rounded-full object-cover" alt={member.name} />
                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1c1c21] ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                 </div>
                 <div>
                   <h4 className="text-white font-medium">{member.name}</h4>
                   <span className="text-xs text-gray-500">{member.role}</span>
                   <div className="flex gap-1 mt-1">
                      {member.skills.slice(0, 2).map(skill => (
                        <span key={skill} className="text-[9px] px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">{skill}</span>
                      ))}
                   </div>
                 </div>
               </div>
             ))}
             <button className="border border-dashed border-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-colors h-24">
               + Alocar Recurso
             </button>
           </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#16161a] p-6 rounded-2xl border border-gray-700 w-full max-w-lg shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Editar Projeto</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Status</label>
                        <select 
                            className="w-full bg-[#1e1e24] border border-gray-700 rounded p-2 text-white outline-none focus:border-purple-500"
                            value={editForm.status}
                            onChange={(e) => setEditForm({...editForm, status: e.target.value as any})}
                        >
                            <option value="planning">Planejamento</option>
                            <option value="development">Desenvolvimento</option>
                            <option value="production">Produção</option>
                            <option value="maintenance">Manutenção</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Descrição</label>
                        <textarea 
                            className="w-full bg-[#1e1e24] border border-gray-700 rounded p-2 text-white outline-none focus:border-purple-500 h-32 resize-none"
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                    <button onClick={handleSaveEdit} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium">Salvar Alterações</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

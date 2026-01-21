import React, { useState } from 'react';
import { Project, TeamMember, Meeting, Task, ProjectCategory } from '../types';

// --- Projects List View ---
export const ProjectsView = ({ projects, onSelectProject }: { projects: Project[], onSelectProject: (id: string) => void }) => {
  const categories: ProjectCategory[] = ['production', 'development', 'tools', 'maintenance'];
  
  const getCategoryColor = (cat: ProjectCategory) => {
    switch(cat) {
        case 'production': return 'text-red-400 border-red-500/30';
        case 'development': return 'text-cyan-400 border-cyan-500/30';
        case 'tools': return 'text-purple-400 border-purple-500/30';
        case 'maintenance': return 'text-orange-400 border-orange-500/30';
        default: return 'text-gray-400 border-gray-500/30';
    }
  };

  return (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-white">Central de Projetos</h2>
        <p className="text-sm text-gray-500">Visão categorizada por ciclo de vida</p>
      </div>
      <button className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm hover:bg-purple-500 flex items-center gap-2 shadow-lg shadow-purple-500/20">
        <span className="text-xl leading-none">+</span> Novo Projeto
      </button>
    </div>

    {categories.map(cat => {
        const catProjects = projects.filter(p => p.category === cat);
        if (catProjects.length === 0) return null;

        return (
            <div key={cat} className="space-y-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${getCategoryColor(cat).split(' ')[0]} border-gray-800`}>
                    {cat === 'tools' ? 'Ferramentas Internas' : cat}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catProjects.map(p => (
                    <div key={p.id} onClick={() => onSelectProject(p.id)} className={`bg-dark-card border border-dark-border p-6 rounded-2xl cursor-pointer hover:border-opacity-100 transition-all hover:translate-y-[-2px] group relative overflow-hidden ${getCategoryColor(cat).split(' ')[1]}`}>
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                         <svg className={`w-24 h-24 ${getCategoryColor(cat).split(' ')[0]}`} fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold bg-black/30 backdrop-blur-sm ${getCategoryColor(cat).split(' ')[0]}`}>{p.status}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white transition-colors">{p.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{p.description}</p>
                        
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Progresso</span>
                                    <span>{p.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${cat === 'production' ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${p.progress}%` }}></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                                <span className="text-xs text-gray-500">Deadline: {p.deadline}</span>
                                <div className="flex -space-x-2">
                                    {p.teamIds.map(id => (
                                        <div key={id} className="w-6 h-6 rounded-full bg-gray-700 border border-dark-card"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        );
    })}
  </div>
  );
};

// --- Team View with CV Parsing ---
export const TeamView = ({ team, tasks, projects }: { team: TeamMember[], tasks: Task[], projects: Project[] }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const memberTasks = selectedMember ? tasks.filter(t => t.assignee === selectedMember.id) : [];
  const memberProjects = selectedMember ? projects.filter(p => p.teamIds.includes(selectedMember.id)) : [];

  return (
  <div className="space-y-6 relative">
    <div className="flex justify-between items-center">
      <div>
         <h2 className="text-2xl font-bold text-white">Gestão de Equipe</h2>
         <p className="text-sm text-gray-500">Baseado em Competências e IA</p>
      </div>
      <div className="flex gap-3">
        <button className="px-4 py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 text-sm hover:border-cyan-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            Upload CV / PDF
        </button>
        <button className="px-4 py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">
            Adicionar Membro
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {team.map(member => (
        <div key={member.id} onClick={() => setSelectedMember(member)} className="bg-dark-card p-6 rounded-2xl border border-dark-border text-center relative overflow-hidden group cursor-pointer hover:border-cyan-500/50 transition-all">
          <div className={`absolute top-0 left-0 w-full h-1 ${member.status === 'online' ? 'bg-green-500' : member.status === 'busy' ? 'bg-red-500' : 'bg-gray-600'}`}></div>
          <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-dark-bg ring-2 ring-gray-800 group-hover:ring-cyan-500 transition-all" />
          <h3 className="text-lg font-bold text-white">{member.name}</h3>
          <p className="text-sm text-cyan-400 mb-1">{member.role}</p>
          <p className="text-xs text-gray-500 mb-4">{member.experience || 'N/A XP'}</p>
          
          <div className="flex flex-wrap justify-center gap-1 mb-4">
             {member.skills.slice(0, 3).map(s => <span key={s} className="px-2 py-0.5 bg-gray-800 rounded text-[10px] text-gray-300">{s}</span>)}
             {member.skills.length > 3 && <span className="px-2 py-0.5 bg-gray-800 rounded text-[10px] text-gray-300">+{member.skills.length - 3}</span>}
          </div>
          
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-4">
              <div className="bg-purple-500 h-full" style={{ width: `${member.workload || 50}%` }}></div>
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-[9px] text-gray-500">Carga</span>
             <span className="text-[9px] text-purple-400">{member.workload || 50}%</span>
          </div>
        </div>
      ))}
    </div>

    {/* Member Detail Modal (Overlay) */}
    {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
            <div className="bg-[#16161a] border border-gray-700 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-[#1c1c21] flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <img src={selectedMember.avatar} className="w-24 h-24 rounded-full border-4 border-dark-card" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedMember.name}</h2>
                            <p className="text-cyan-400 text-lg">{selectedMember.role}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg> {selectedMember.schedule || 'Horário Comercial'}</span>
                                <span>•</span>
                                <span>{selectedMember.experience}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedMember(null)} className="text-gray-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Bio & Skills */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">Bio (Extraída do CV)</h3>
                            <p className="text-sm text-gray-300 leading-relaxed bg-[#1c1c21] p-4 rounded-xl border border-gray-800">
                                {selectedMember.bio || "Especialista focado em entregas de alta performance. Histórico comprovado em arquitetura escalável e liderança técnica."}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">Stack Técnica</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedMember.skills.map(s => <span key={s} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-xs text-cyan-400">{s}</span>)}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Work Context */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">Projetos Ativos</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {memberProjects.map(p => (
                                    <div key={p.id} className="bg-[#1c1c21] p-3 rounded-lg border border-gray-800 flex justify-between items-center">
                                        <span className="text-white font-medium">{p.name}</span>
                                        <span className="text-[10px] uppercase bg-gray-700 px-2 py-0.5 rounded text-gray-300">{p.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">Tarefas em Execução</h3>
                            <div className="space-y-2">
                                {memberTasks.map(t => (
                                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-dark-bg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${t.priority === 'high' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                            <span className={`text-sm ${t.status === 'done' ? 'line-through text-gray-600' : 'text-gray-300'}`}>{t.title}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 capitalize">{t.status}</span>
                                    </div>
                                ))}
                                {memberTasks.length === 0 && <p className="text-sm text-gray-500">Nenhuma tarefa atribuída.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
  </div>
  );
};

// --- Calendar View with Manual Control ---
export const CalendarView = ({ meetings, onAddMeeting }: { meetings: Meeting[], onAddMeeting?: (m: Meeting) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '', type: 'internal' });

  const handleSave = () => {
    if (onAddMeeting && newMeeting.title && newMeeting.date) {
        onAddMeeting({
            id: Date.now().toString(),
            title: newMeeting.title,
            date: newMeeting.date,
            time: newMeeting.time || '09:00',
            type: newMeeting.type as any
        });
        setShowModal(false);
        setNewMeeting({ title: '', date: '', time: '', type: 'internal' });
    }
  };

  return (
  <div className="h-full flex flex-col relative">
     <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">Calendário Corporativo</h2>
      <div className="flex gap-2">
         <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-purple-600 rounded-lg text-sm text-white font-medium hover:bg-purple-500 flex items-center gap-2">
            + Novo Evento
         </button>
      </div>
    </div>
    
    <div className="flex-1 bg-dark-card border border-dark-border rounded-2xl p-6 overflow-y-auto">
       <div className="space-y-4">
         {meetings.map(m => (
           <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#1c1c21] border border-gray-800 hover:border-purple-500/50 transition-colors group">
              <div className="flex flex-col items-center justify-center w-16 h-16 bg-dark-bg rounded-lg border border-gray-700">
                 <span className="text-xs text-gray-500">{m.date.split('-')[1]}/{m.date.split('-')[0]}</span>
                 <span className="text-xl font-bold text-white">{m.date.split('-')[2]}</span>
              </div>
              <div className="flex-1">
                 <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">{m.title}</h3>
                 <p className="text-sm text-gray-500 flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                     {m.time} • <span className="uppercase text-xs font-bold tracking-wide">{m.type}</span>
                 </p>
              </div>
              <button className="px-4 py-2 text-sm border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-colors">Editar</button>
           </div>
         ))}
       </div>
    </div>

    {/* Manual Event Modal */}
    {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#16161a] p-6 rounded-2xl border border-gray-700 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Adicionar Evento Manualmente</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Título</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1e1e24] border border-gray-700 rounded p-2 text-white focus:border-purple-500 outline-none" 
                            value={newMeeting.title}
                            onChange={e => setNewMeeting({...newMeeting, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Data</label>
                            <input 
                                type="date" 
                                className="w-full bg-[#1e1e24] border border-gray-700 rounded p-2 text-white focus:border-purple-500 outline-none"
                                value={newMeeting.date}
                                onChange={e => setNewMeeting({...newMeeting, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Hora</label>
                            <input 
                                type="time" 
                                className="w-full bg-[#1e1e24] border border-gray-700 rounded p-2 text-white focus:border-purple-500 outline-none"
                                value={newMeeting.time}
                                onChange={e => setNewMeeting({...newMeeting, time: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                         <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Tipo</label>
                         <select 
                            className="w-full bg-[#1e1e24] border border-gray-700 rounded p-2 text-white focus:border-purple-500 outline-none"
                            value={newMeeting.type}
                            onChange={e => setNewMeeting({...newMeeting, type: e.target.value})}
                         >
                             <option value="internal">Interno</option>
                             <option value="client">Cliente</option>
                             <option value="review">Review</option>
                         </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium">Salvar Evento</button>
                </div>
            </div>
        </div>
    )}
  </div>
);
};

// --- RAG View Placeholder ---
export const RagView = () => (
    <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-dark-card rounded-2xl border border-dashed border-gray-700">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Central de Documentos RAG</h2>
        <p className="text-gray-500 max-w-md">Faça upload de PDFs técnicos e documentação para indexar no motor de busca vetorial do Agente.</p>
        <button className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500">
            Upload Documento
        </button>
    </div>
);

// --- Finance View Placeholder ---
export const FinanceView = () => (
    <div className="h-full space-y-6">
        <h2 className="text-2xl font-bold text-white">Gestão Financeira</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-dark-card p-6 rounded-2xl border border-gray-700">
                 <div className="text-sm text-gray-500 mb-1">Receita Mensal</div>
                 <div className="text-3xl font-bold text-green-400">R$ 45.200</div>
             </div>
             <div className="bg-dark-card p-6 rounded-2xl border border-gray-700">
                 <div className="text-sm text-gray-500 mb-1">Custos Infra (Cloud)</div>
                 <div className="text-3xl font-bold text-red-400">R$ 2.950</div>
             </div>
             <div className="bg-dark-card p-6 rounded-2xl border border-gray-700">
                 <div className="text-sm text-gray-500 mb-1">Lucro Líquido</div>
                 <div className="text-3xl font-bold text-white">R$ 42.250</div>
             </div>
        </div>
        <div className="bg-dark-card p-8 rounded-2xl border border-gray-700 flex items-center justify-center h-64">
             <p className="text-gray-500">Gráfico de Fluxo de Caixa (Em Breve)</p>
        </div>
    </div>
);

import React from 'react';
import { Task, TeamMember, Project } from '../types';

interface OperationalTableProps {
  tasks: Task[];
  team: TeamMember[];
  projects: Project[];
}

export const OperationalTable: React.FC<OperationalTableProps> = ({ tasks, team, projects }) => {
  // Merge data for the view
  const rows = tasks.filter(t => t.status !== 'done' && t.status !== 'backlog').map(task => {
    const member = team.find(m => m.id === task.assignee) || { name: 'Unassigned', avatar: '', status: 'offline' };
    const project = projects.find(p => p.id === task.projectId) || { name: 'Internal', category: 'maintenance' };
    return { task, member, project };
  });

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Painel de Execução</h2>
          <p className="text-xs text-gray-500">Monitoramento em tempo real da equipe</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-300 hover:bg-gray-700">Filtrar por Status</button>
           <button className="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs hover:bg-purple-600/30">Otimizar com IA</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-[#1c1c21] text-xs uppercase font-medium text-gray-500">
            <tr>
              <th className="px-6 py-4">Funcionário</th>
              <th className="px-6 py-4">Projeto / Categoria</th>
              <th className="px-6 py-4">Tarefa Atual</th>
              <th className="px-6 py-4">Prioridade</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Carga</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rows.map(({ task, member, project }: any) => (
              <tr key={task.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                        <img className="w-8 h-8 rounded-full object-cover" src={member.avatar || 'https://ui-avatars.com/api/?name=Unassigned'} alt=""/>
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-dark-card rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    </div>
                    <div>
                        <div className="font-medium text-white">{member.name}</div>
                        <div className="text-[10px] text-gray-500">{member.schedule || '09:00 - 18:00'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-300">{project.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                     <span className={`w-1.5 h-1.5 rounded-full ${project.category === 'production' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                     <span className="text-[10px] capitalize">{project.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                    <span className="text-white group-hover:text-cyan-400 transition-colors">{task.title}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                    task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                    task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full w-2/3 animate-pulse"></div>
                     </div>
                     <span className="text-[10px]">Em execução</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-300">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        85%
                    </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Nenhuma tarefa em execução ativa no momento.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

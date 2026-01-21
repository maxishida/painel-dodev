import React from 'react';
import { Task, ProjectArea } from '../types';

interface KanbanProps {
  tasks: Task[];
}

const areaColors: Record<string, string> = {
  frontend: 'text-blue-400 bg-blue-400/10',
  backend: 'text-purple-400 bg-purple-400/10',
  design: 'text-pink-400 bg-pink-400/10',
  devops: 'text-orange-400 bg-orange-400/10',
  general: 'text-gray-400 bg-gray-400/10',
  qa: 'text-green-400 bg-green-400/10'
};

export const Kanban: React.FC<KanbanProps> = ({ tasks }) => {
  const backlog = tasks.filter(t => t.status === 'backlog');
  const inProgress = tasks.filter(t => t.status === 'in-progress');
  const done = tasks.filter(t => t.status === 'done');

  return (
    <div className="bg-dark-card p-6 border border-cyan-500/30 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)] relative rounded-2xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Quadro de Tarefas</h2>
        <div className="flex gap-2">
           <span className="text-xs text-gray-500">Live Sync</span>
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto pr-1">
        <KanbanColumn title="BACKLOG" tasks={backlog} color="green" />
        <KanbanColumn title="EM PROGRESSO" tasks={inProgress} color="blue" />
        <KanbanColumn title="CONCLUÍDO" tasks={done} color="gray" isDone />
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, tasks, color, isDone }: any) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-xs font-semibold text-gray-500 uppercase flex justify-between">
       {title}
       <span className="text-[10px] bg-gray-800 px-2 rounded-full">{tasks.length}</span>
    </h3>
    <div className="space-y-3 min-h-[100px]">
      {tasks.map((task: Task) => (
        <div key={task.id} className={`bg-[#1c1c21] p-4 rounded-lg border border-gray-800 relative group hover:border-${color}-500/50 transition-colors shadow-sm`}>
          {!isDone && (
            <div className="flex justify-between items-center mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${areaColors[task.area] || areaColors.general}`}>
                {task.area}
              </span>
              <div className="flex items-center gap-1">
                 <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              </div>
            </div>
          )}
          
          <h4 className={`text-sm font-medium text-white mb-3 ${isDone ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
            <span className="text-xs text-gray-500">{task.assignee}</span>
            {task.dueDate && <span className="text-[10px] text-gray-600">{task.dueDate}</span>}
          </div>
        </div>
      ))}
      
      {tasks.length === 0 && (
         <div className="h-24 border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-600">Vazio</span>
         </div>
      )}
    </div>
  </div>
);

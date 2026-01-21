
import React from 'react';
import { Meeting } from '../types';

interface SidebarProps {
  meetings: Meeting[];
  currentView: string;
  onNavigate: (view: string) => void;
  onNewProject?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ meetings, currentView, onNavigate, onNewProject }) => {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-dark-border flex flex-col justify-between overflow-y-auto bg-[#0d0d0d] hidden md:flex">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
            <span className="text-lg">AI</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Painel do Dev
          </h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          <NavItem 
            active={currentView === 'dashboard'} 
            onClick={() => onNavigate('dashboard')} 
            icon={<DashboardIcon />} 
            label="Dashboard" 
          />
          <NavItem 
            active={currentView === 'projects' || currentView === 'project-detail'} 
            onClick={() => onNavigate('projects')} 
            icon={<ProjectIcon />} 
            label="Projetos" 
          />
          <NavItem 
            active={currentView === 'tasks'} 
            onClick={() => onNavigate('tasks')} 
            icon={<TaskIcon />} 
            label="Minhas Tarefas" 
          />
          <NavItem 
            active={currentView === 'market'} 
            onClick={() => onNavigate('market')} 
            icon={<ChartIcon />} 
            label="Market Price" 
            count="Novo"
          />
          <NavItem 
            active={currentView === 'calendar'} 
            onClick={() => onNavigate('calendar')} 
            icon={<CalendarIcon />} 
            label="Calendário" 
          />
          <NavItem 
            active={currentView === 'team'} 
            onClick={() => onNavigate('team')} 
            icon={<TeamIcon />} 
            label="Equipe" 
          />
        </nav>

        {/* Personal */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">PESSOAL</h3>
          <nav className="space-y-1">
            <NavItem 
                active={currentView === 'rag'}
                onClick={() => onNavigate('rag')}
                icon={<FileIcon />} 
                label="Docs RAG" 
                small 
            />
            <NavItem 
                active={currentView === 'finance'}
                onClick={() => onNavigate('finance')}
                icon={<FinanceIcon />} 
                label="Financeiro" 
                small 
            />
          </nav>
        </div>

        {/* CTA - Now opens modal directly */}
        <button 
            onClick={onNewProject} 
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glow-border-purple text-white hover:bg-white/5 transition-all group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          <span className="font-medium">Novo Projeto</span>
        </button>
      </div>

      {/* Meetings */}
      <div className="p-6 border-t border-dark-border">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">HOJE</h3>
        <div className="space-y-3">
          {meetings.slice(0, 2).map((m) => (
            <div key={m.id} className="bg-dark-input rounded-lg p-3 flex items-start gap-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onNavigate('calendar')}>
              <div className={`w-8 h-8 rounded flex items-center justify-center ${m.type === 'client' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-white truncate max-w-[120px]">{m.title}</p>
                <p className="text-[10px] text-gray-500">{m.time} - {m.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

// Subcomponents & Icons
const NavItem = ({ active, icon, label, count, small, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center ${count ? 'justify-between' : ''} px-4 ${small ? 'py-2' : 'py-3'} rounded-xl transition-all ${active ? 'animate-border-pulse-green border border-green-500/30 text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'} gap-4 group`}
  >
    <div className="flex items-center gap-3">
      <div className={`${active ? 'text-green-400' : 'group-hover:text-gray-200'}`}>{icon}</div>
      <span className={small ? 'text-sm' : ''}>{label}</span>
    </div>
    {count && <span className="text-xs bg-yellow-600/20 text-yellow-500 px-1.5 py-0.5 rounded">{count}</span>}
  </button>
);

const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>;
const ProjectIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>;
const TaskIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>;
const ChartIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>;
const CalendarIcon = ({className = "w-5 h-5"}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>;
const TeamIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>;
const FileIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>;
const FinanceIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>;

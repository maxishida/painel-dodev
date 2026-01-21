
import React from 'react';

export const StatsGrid = ({ tasksCount, onNavigate }: { tasksCount: number, onNavigate: (view: string) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Tasks */}
      <div 
        onClick={() => onNavigate('tasks')}
        className="bg-dark-card p-5 glow-border-red flex flex-col justify-between h-32 rounded-2xl group hover:bg-[#1a1a20] transition-all cursor-pointer hover:scale-[1.02]"
      >
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          <span className="text-sm font-semibold">Tarefas de Hoje</span>
        </div>
        <div>
          <span className="font-bold text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] text-5xl">{tasksCount}</span>
          <span className="text-lg text-red-400 ml-1">Pendentes</span>
        </div>
      </div>

      {/* Next Meeting */}
      <div 
        onClick={() => onNavigate('calendar')}
        className="bg-dark-card p-5 glow-border-cyan flex flex-col justify-between h-32 relative overflow-hidden rounded-2xl group hover:bg-[#1a1a20] transition-all cursor-pointer hover:scale-[1.02]"
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
            <span className="text-sm font-semibold">Próxima Reunião</span>
          </div>
          <span className="text-xs text-gray-400 bg-dark-bg px-2 py-1 rounded">16.00</span>
        </div>
        <div>
          <div className="font-bold text-white mb-1 text-4xl">Amanhã</div>
          <div className="text-sm text-gray-400">Meeting com Cliente</div>
        </div>
      </div>

      {/* Budgets */}
      <div 
        onClick={() => onNavigate('market')}
        className="bg-dark-card p-5 glow-border-purple flex flex-col justify-between h-32 rounded-2xl group hover:bg-[#1a1a20] transition-all cursor-pointer hover:scale-[1.02]"
      >
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          <span className="text-sm font-semibold">Orçamentos Ativos</span>
        </div>
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-white text-5xl">3</span>
            <span className="text-sm text-gray-400">Em Andamento</span>
          </div>
          <div className="text-xs text-gray-500">Aprovado 1 Rejeitado 1</div>
        </div>
      </div>

      {/* Cost */}
      <div 
        onClick={() => onNavigate('finance')}
        className="bg-dark-card p-5 glow-border-blue flex flex-col justify-between h-32 rounded-2xl group hover:bg-[#1a1a20] transition-all cursor-pointer hover:scale-[1.02]"
      >
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          <span className="text-sm font-semibold">Custo Estimado</span>
        </div>
        <div>
          <div className="font-bold text-white text-3xl">R$ 2.950,00</div>
          <div className="text-xs text-gray-500 mt-1">Aprovado 1 Enviado 1</div>
        </div>
      </div>
    </div>
  );
};

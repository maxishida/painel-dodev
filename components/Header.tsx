import React from 'react';

export const Header = () => {
  return (
    <header className="h-20 border-b border-dark-border flex items-center justify-between px-8 bg-[#0d0d0d] shrink-0 z-10">
      {/* Search */}
      <div className="w-1/3 hidden md:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </span>
          <input className="w-full pl-10 pr-4 py-2 bg-dark-input border-none rounded-lg text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-shadow" placeholder="Procurar projetos, tarefas, membros..." type="text"/>
        </div>
      </div>
      
      {/* Mobile Title */}
      <div className="md:hidden text-white font-bold">Painel do Dev</div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Status Box */}
        <div className="hidden md:block relative p-[1px] rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-pulse-slow">
          <div className="bg-dark-bg rounded-lg px-4 py-2 relative flex justify-center items-center text-center">
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              "Meta do Dia: Foco e Eficiência Máxima."
            </span>
          </div>
        </div>

        {/* Notifications */}
        <button className="text-gray-400 hover:text-white relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-dark-bg animate-ping"></span>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-dark-bg"></span>
        </button>

        {/* Profile */}
        <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-700 cursor-pointer hover:border-cyan-400 transition-colors">
          <img alt="User" className="h-full w-full object-cover" src="https://picsum.photos/200/200?random=1" />
        </div>
      </div>
    </header>
  );
};


import React, { useState } from 'react';
import { MarketTool, BudgetProposal } from '../types';
import { ChatWidget } from './ChatWidget';

interface MarketPriceProps {
  initialTools: MarketTool[];
  onGenerateBudgetProposal: (proposal: BudgetProposal) => void;
}

export const MarketPrice: React.FC<MarketPriceProps> = ({ initialTools, onGenerateBudgetProposal }) => {
  const [tools, setTools] = useState<MarketTool[]>(initialTools);
  const [activeProposal, setActiveProposal] = useState<BudgetProposal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingText, setLoadingText] = useState('Atualizar Preços');
  const [selectedTool, setSelectedTool] = useState<MarketTool | null>(null);
  
  // Comparison State
  const [compareList, setCompareList] = useState<MarketTool[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleUpdatePrices = () => {
    setIsUpdating(true);
    setLoadingText('Connecting to Adyen API...');
    
    setTimeout(() => setLoadingText('Fetching Pika/Sora Status...'), 800);
    setTimeout(() => setLoadingText('Crawling Hetzner/DO...'), 1600);
    setTimeout(() => setLoadingText('Syncing Global Forex...'), 2400);

    setTimeout(() => {
        const updatedTools = tools.map(t => ({
            ...t,
            price: t.price > 0 ? t.price * (0.98 + Math.random() * 0.05) : 0, // Keep free items free
            lastUpdated: 'Agora (Real-time)',
            trend: Math.random() > 0.5 ? 'up' : 'down' as const
        }));
        setTools(updatedTools);
        setIsUpdating(false);
        setLoadingText('Atualizar Preços');
    }, 3000);
  };

  const handleBudgetCreated = (budget: any) => {
    const newProposal: BudgetProposal = {
        id: Date.now().toString(),
        clientName: budget.clientName,
        items: budget.items,
        setupFee: budget.setupFee || 0,
        totalMonthly: budget.totalMonthly,
        status: 'generated'
    };
    setActiveProposal(newProposal);
    onGenerateBudgetProposal(newProposal);
  };

  const toggleCompare = (tool: MarketTool, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (compareList.find(t => t.id === tool.id)) {
        setCompareList(prev => prev.filter(t => t.id !== tool.id));
    } else {
        if (compareList.length >= 2) {
            // Optional: Alert user or replace oldest. Keeping simple max 2 for VS view.
            return; 
        }
        setCompareList(prev => [...prev, tool]);
    }
  };

  const downloadPDF = () => {
    if(!activeProposal) return;
    const content = `
    ORÇAMENTO OFICIAL - PAINEL DO DEV
    ---------------------------------
    Cliente: ${activeProposal.clientName}
    Data: ${new Date().toLocaleDateString()}
    
    ITENS MENSAIS:
    ${activeProposal.items.map(i => `- ${i.toolName}: $${i.cost} (${i.description})`).join('\n')}
    
    ---------------------------------
    TOTAL MENSAL: $${activeProposal.totalMonthly.toFixed(2)}
    SETUP FEE: $${activeProposal.setupFee.toFixed(2)}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Orcamento_${activeProposal.clientName}.txt`;
    a.click();
  };

  const renderToolCategory = (category: string, title: string) => (
    <div className="mb-6">
        <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 border-b border-gray-800 pb-1">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.filter(t => t.category === category).map(tool => {
                const isSelected = compareList.some(t => t.id === tool.id);
                const isDisabled = compareList.length >= 2 && !isSelected;

                return (
                    <div 
                        key={tool.id} 
                        onClick={() => setSelectedTool(tool)}
                        className={`bg-[#1c1c21] p-4 rounded-xl border flex justify-between items-center cursor-pointer group hover:bg-[#202026] transition-all relative overflow-hidden ${
                            isSelected ? 'border-purple-500 bg-purple-500/5' : 'border-gray-800 hover:border-cyan-500/50'
                        } ${isUpdating ? 'opacity-50 animate-pulse' : ''}`}
                    >
                        {/* Compare Toggle */}
                        <div 
                            onClick={(e) => toggleCompare(tool, e)}
                            className={`absolute top-2 right-2 w-5 h-5 rounded border flex items-center justify-center transition-colors z-10 ${
                                isSelected ? 'bg-purple-600 border-purple-600 text-white' : 
                                isDisabled ? 'border-gray-800 bg-gray-900 cursor-not-allowed opacity-30' :
                                'border-gray-600 hover:border-purple-400 text-transparent hover:text-purple-400'
                            }`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path></svg>
                        </div>

                        <div>
                            <div className="font-bold text-white flex items-center gap-2 pr-6">
                            {tool.name}
                            {tool.provider && <span className="text-[9px] px-1.5 py-0.5 bg-gray-700 rounded text-gray-400 font-normal">{tool.provider}</span>}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase flex items-center gap-2">
                                {tool.unit.replace(/_/g, ' ')}
                                <span className="text-cyan-600 group-hover:text-cyan-400">Ver Detalhes →</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-cyan-400">
                                {tool.price === 0 ? (
                                    <span className="text-sm text-green-400 uppercase">Free / Invite</span>
                                ) : (
                                    <>
                                        {tool.currency === 'USD' ? '$' : 'R$'} {tool.price.toFixed(tool.price < 0.1 ? 4 : 2)}
                                    </>
                                )}
                            </div>
                            <div className={`text-[10px] flex items-center justify-end gap-1 ${tool.trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                            {tool.trend === 'up' ? '▲' : '▼'} {tool.lastUpdated}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full relative">
        {/* Main Dashboard Area */}
        <div className="xl:col-span-2 overflow-y-auto custom-scrollbar pr-2 pb-24">
            
            {/* Header / Actions */}
            <div className="flex justify-between items-center mb-8 bg-dark-card p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]">
                <div>
                    <h2 className="text-2xl font-bold text-white">Deep Search Market</h2>
                    <p className="text-sm text-gray-400">Preços em tempo real de APIs Globais, Cloud e Pagamentos.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleUpdatePrices}
                        disabled={isUpdating}
                        className="px-4 py-2 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/10 flex items-center gap-2 min-w-[180px] justify-center"
                    >
                        {isUpdating ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                <span>{loadingText}</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                <span>Simular Deep Search</span>
                            </>
                        )}
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:opacity-90 flex items-center gap-2">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                         Relatórios
                    </button>
                </div>
            </div>

            {/* Price Tables */}
            {renderToolCategory('api_ai', 'LLMs & AI Models')}
            {renderToolCategory('payment_gateways', 'Pagamentos & Fintech')}
            {renderToolCategory('image_gen', 'Geração de Imagens & Design')}
            {renderToolCategory('video_gen', 'Vídeo Generativo')}
            {renderToolCategory('cloud_infra', 'Cloud & Database')}
            {renderToolCategory('deploy', 'Deploy & Serverless')}
            {renderToolCategory('rag_tools', 'RAG & Vetores')}

            {/* Active Proposal View */}
            {activeProposal && (
                <div className="mt-8 bg-[#1c1c21] rounded-2xl border border-green-500/30 overflow-hidden animate-border-pulse-green">
                    <div className="p-4 bg-green-500/10 border-b border-green-500/20 flex justify-between items-center">
                        <h3 className="text-green-400 font-bold flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                            Proposta Gerada: {activeProposal.clientName}
                        </h3>
                        <button onClick={downloadPDF} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500">
                            Download PDF
                        </button>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-sm text-gray-300">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-500 text-left">
                                    <th className="pb-2">Item / Ferramenta</th>
                                    <th className="pb-2">Descrição</th>
                                    <th className="pb-2 text-right">Custo Mensal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {activeProposal.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-3 font-medium text-white">{item.toolName}</td>
                                        <td className="py-3 text-gray-500">{item.description}</td>
                                        <td className="py-3 text-right text-cyan-400">${item.cost.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-gray-700 font-bold text-white">
                                    <td className="pt-4">TOTAL MENSAL ESTIMADO</td>
                                    <td></td>
                                    <td className="pt-4 text-right text-xl">${activeProposal.totalMonthly.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="pt-1 text-gray-500 text-xs">Setup Fee (Único)</td>
                                    <td></td>
                                    <td className="pt-1 text-right text-gray-400 text-xs">${activeProposal.setupFee.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>

        {/* AI Agent Panel */}
        <div className="xl:col-span-1 h-full flex flex-col">
            <div className="mb-2 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Agente de Marketing</span>
            </div>
            <ChatWidget 
                contextMode="market"
                onTaskCreate={() => {}} 
                onMeetingSchedule={() => {}} 
                onProjectCreate={() => {}}
                onGenerateBudgetProposal={handleBudgetCreated}
                onUpdatePrices={handleUpdatePrices}
            />
        </div>

        {/* Floating Compare Dock */}
        {compareList.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-[#16161a]/90 backdrop-blur-md border border-purple-500/50 rounded-2xl p-3 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.5)] flex items-center gap-4 animate-slide-up">
                <div className="flex -space-x-3 pl-2">
                    {compareList.map((item) => (
                        <div key={item.id} className="w-10 h-10 rounded-full bg-[#27272a] border-2 border-[#16161a] flex items-center justify-center text-xs font-bold text-white relative group">
                            {item.name.substring(0, 2).toUpperCase()}
                            <button 
                                onClick={(e) => toggleCompare(item, e)}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {compareList.length < 2 && (
                         <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-600 text-xs">
                            +1
                         </div>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-700"></div>
                
                <div className="flex items-center gap-3 pr-2">
                    <button 
                        onClick={() => setCompareList([])}
                        className="text-xs font-medium text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wide px-2"
                    >
                        Limpar
                    </button>

                    <button 
                        disabled={compareList.length < 2}
                        onClick={() => setShowCompareModal(true)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all ${
                            compareList.length === 2 
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:scale-105' 
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Comparar ({compareList.length}/2)
                    </button>
                </div>
            </div>
        )}

        {/* Tool Detail Modal */}
        {selectedTool && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedTool(null)}>
                <div className="bg-[#16161a] border border-cyan-500/30 w-full max-w-3xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                    
                    {/* Modal Header */}
                    <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gradient-to-r from-[#16161a] to-[#1e1e24]">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center text-2xl">
                                {selectedTool.category === 'api_ai' ? '🤖' : 
                                 selectedTool.category === 'video_gen' ? '🎬' :
                                 selectedTool.category === 'image_gen' ? '🎨' :
                                 selectedTool.category === 'payment_gateways' ? '💳' :
                                 selectedTool.category === 'cloud_infra' ? '☁️' : '🔧'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{selectedTool.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-cyan-400 font-medium">{selectedTool.provider}</span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">{selectedTool.category.replace(/_/g, ' ')}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedTool(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        </button>
                    </div>
                    
                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sobre a Ferramenta</h3>
                            <p className="text-gray-300 text-sm leading-relaxed bg-[#1c1c21] p-4 rounded-xl border border-gray-800/50">
                                {selectedTool.description || "Descrição detalhada não disponível para este item."}
                            </p>
                        </div>
                        
                        {/* Specifications Grid */}
                        {selectedTool.specs && (
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                    Especificações Técnicas
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {Object.entries(selectedTool.specs).map(([key, value]) => (
                                        <div key={key} className="bg-dark-bg p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                                            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wide">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                            <div className="text-sm text-white font-medium truncate" title={Array.isArray(value) ? value.join(', ') : value}>
                                                {Array.isArray(value) ? value.join(', ') : value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variants Table */}
                        {selectedTool.variants && (
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                    Planos & Variações
                                </h3>
                                <div className="border border-gray-800 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-[#1e1e24] text-xs text-gray-400 uppercase font-semibold">
                                            <tr>
                                                <th className="px-5 py-3">Modelo / Tipo</th>
                                                <th className="px-5 py-3 text-right">Preço Unitário</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800 bg-[#16161a]">
                                            {selectedTool.variants.map((v, i) => (
                                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-5 py-3 font-medium text-gray-300">{v.name}</td>
                                                    <td className="px-5 py-3 text-right text-cyan-400 font-mono">
                                                        {selectedTool.currency === 'USD' ? '$' : 'R$'}{v.price.toFixed(4)} 
                                                        <span className="text-xs text-gray-600 ml-1">{v.unit}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-gray-800 bg-[#16161a] flex gap-4">
                         {selectedTool.docsUrl && (
                            <a 
                                href={selectedTool.docsUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex-1 py-3 bg-[#1e1e24] hover:bg-[#25252b] border border-gray-700 rounded-xl text-center text-sm text-white transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="text-gray-400 group-hover:text-white transition-colors">Ler Documentação</span>
                                <svg className="w-4 h-4 text-gray-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                            </a>
                        )}
                        <button 
                            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-center text-sm text-white font-bold shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02]"
                            onClick={() => {
                                setSelectedTool(null);
                            }}
                        >
                            Adicionar ao Orçamento
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Comparison Modal (Versus Mode) */}
        {showCompareModal && compareList.length === 2 && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                <div className="bg-[#16161a] w-full max-w-5xl h-[90vh] rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden relative">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1c1c21]">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-purple-500">⚡</span> Comparativo Lado a Lado
                        </h2>
                        <button onClick={() => setShowCompareModal(false)} className="text-gray-500 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        <div className="grid grid-cols-2 gap-8 relative">
                            {/* VS Badge */}
                            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center font-black text-white italic border-4 border-[#16161a] shadow-lg">
                                VS
                            </div>

                            {compareList.map((item, idx) => (
                                <div key={item.id} className={`flex flex-col gap-6 ${idx === 0 ? 'text-right' : 'text-left'}`}>
                                    {/* Header Info */}
                                    <div className={`flex flex-col ${idx === 0 ? 'items-end' : 'items-start'}`}>
                                        <div className="text-3xl font-bold text-white mb-1">{item.name}</div>
                                        <div className="text-sm text-cyan-400 bg-cyan-900/20 px-3 py-1 rounded-full mb-4 inline-block">
                                            {item.provider}
                                        </div>
                                        <div className="text-4xl font-mono font-bold text-white mb-1">
                                            {item.price === 0 ? 'Free' : `${item.currency === 'USD' ? '$' : 'R$'}${item.price.toFixed(item.price < 0.1 ? 4 : 2)}`}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                            {item.unit.replace(/_/g, ' ')}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className={`p-4 rounded-xl bg-[#1c1c21] border border-gray-800 text-sm text-gray-400 leading-relaxed min-h-[100px] ${idx === 0 ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                                        {item.description}
                                    </div>

                                    {/* Specs Comparison */}
                                    <div>
                                        <h4 className={`text-xs font-bold text-gray-500 uppercase mb-4 ${idx === 0 ? 'mr-1' : 'ml-1'}`}>Especificações</h4>
                                        <div className="space-y-2">
                                            {item.specs ? Object.entries(item.specs).map(([key, val]) => (
                                                <div key={key} className={`flex flex-col ${idx === 0 ? 'items-end' : 'items-start'} py-2 border-b border-gray-800/50`}>
                                                    <span className="text-[10px] text-gray-600 uppercase font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <span className="text-sm text-white font-medium">
                                                        {Array.isArray(val) ? val.join(', ') : val}
                                                    </span>
                                                </div>
                                            )) : <div className="text-sm text-gray-600 italic">Sem dados técnicos.</div>}
                                        </div>
                                    </div>

                                    {/* Variant Table */}
                                    <div>
                                        <h4 className={`text-xs font-bold text-gray-500 uppercase mb-4 ${idx === 0 ? 'mr-1' : 'ml-1'}`}>Variações de Preço</h4>
                                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                                            {item.variants && item.variants.map((v, i) => (
                                                <div key={i} className={`flex justify-between items-center p-3 text-sm ${i % 2 === 0 ? 'bg-[#1e1e24]' : 'bg-transparent'}`}>
                                                    <span className="text-gray-400">{v.name}</span>
                                                    <span className="text-cyan-400 font-mono">${v.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        )}
    </div>
  );
};

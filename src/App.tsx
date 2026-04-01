import { useState, useEffect } from 'react';
import { CheckCircle, PlayCircle, Download, Calculator, Lock, LayoutDashboard, ChevronRight, Award, Trophy, Check, Settings, Save, AlertTriangle, Repeat, DollarSign } from 'lucide-react';

import defaultData from './data.json';

// Types
type ProjectData = {
  id: number;
  name: string;
  time: string;
  cost: string;
  videoUrl: string;
  icon: string;
  desc: string;
  feeds: string;
  income: string;
  materials: string[];
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appData, setAppData] = useState<ProjectData[]>(defaultData.projects);
  const [progressData, setProgressData] = useState<Record<string, boolean[]>>({});
  const [adminClickCount, setAdminClickCount] = useState(0);

  // Initialize progress arrays based on the loaded data length
  useEffect(() => {
    const saved = localStorage.getItem('rural_progress');
    const initialProgress: Record<string, boolean[]> = {};
    
    appData.forEach(p => {
       initialProgress[p.id.toString()] = new Array(p.materials.length || 0).fill(false);
    });

    if (saved) {
       const parsed = JSON.parse(saved);
       appData.forEach(p => {
          const id = p.id.toString();
          if (parsed[id]) {
             initialProgress[id] = initialProgress[id].map((_, i) => parsed[id][i] || false);
          }
       });
    }
    setProgressData(initialProgress);
  }, [appData]);

  // Save Progress to Local Storage
  useEffect(() => {
    if (Object.keys(progressData).length > 0) {
       localStorage.setItem('rural_progress', JSON.stringify(progressData));
    }
  }, [progressData]);

  const handleToggleChecklist = (projectId: string, index: number) => {
    setProgressData(prev => {
      const newArray = [...prev[projectId]];
      newArray[index] = !newArray[index];
      return { ...prev, [projectId]: newArray };
    });
  };

  const getProjProgress = (id: number) => {
    const arr = progressData[id.toString()];
    if (!arr || arr.length === 0) return 0;
    return Math.round((arr.filter(Boolean).length / arr.length) * 100);
  };

  const totalTasks = Object.values(progressData).flat().length || 1;
  const completedTasks = Object.values(progressData).flat().filter(Boolean).length;
  const globalProgress = Math.round((completedTasks / totalTasks) * 100);

  // Secret Admin Login trigger (Click avatar 5 times)
  const handleAvatarClick = () => {
     if (adminClickCount + 1 >= 5) {
        setActiveTab('admin');
        setAdminClickCount(0);
     } else {
        setAdminClickCount(prev => prev + 1);
     }
  };
  
  return (
    <div className="min-h-screen flex bg-[#0a0f0a] text-zinc-100 font-dmsans selection:bg-brand/30">
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 bg-surface-1 border-r border-white/5 flex-col hidden md:flex h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-sora font-bold text-brand">Sítio 360°</h1>
          <p className="text-xs text-zinc-400 mt-1">Área de Membros Premium</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Visão Geral" />
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Os 7 Módulos</p>
          </div>
          {appData.map(p => (
            <NavItem key={p.id} active={activeTab === `proj-${p.id}`} onClick={() => setActiveTab(`proj-${p.id}`)} icon={<span>{p.icon}</span>} label={p.name} />
          ))}
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ferramentas extras</p>
          </div>
          <NavItem active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} icon={<Calculator size={20} />} label="Calculadora de Custo" />
          <NavItem active={activeTab === 'downloads'} onClick={() => setActiveTab('downloads')} icon={<Download size={20} />} label="Baixar Plantas (PDF)" />
          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Conquistas</p>
          </div>
          <NavItem active={activeTab === 'certificate'} onClick={() => setActiveTab('certificate')} icon={<Award size={20} />} label="Certificado" />
          
          {/* Secret Admin Menu Item */}
          {activeTab === 'admin' && (
             <div className="pt-6">
                <NavItem active={true} onClick={() => {}} icon={<Settings size={20} />} label="Modo Administrador" />
             </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
         {/* Top Header */}
         <header className="h-16 border-b border-white/5 bg-surface-1/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8">
            <div className="flex items-center text-xs sm:text-sm text-zinc-400">
              <span className="font-semibold text-zinc-200 hidden sm:block">Fase de Implantação:</span>
              <div className="ml-0 sm:ml-4 w-24 sm:w-48 h-2 sm:h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5 relative">
                 <div className="h-full bg-gradient-to-r from-brand-dark to-brand transition-all duration-500" style={{ width: `${globalProgress}%` }} />
                 {globalProgress === 100 && <span className="absolute inset-0 bg-white/20 animate-pulse"></span>}
              </div>
              <span className={`ml-3 font-medium transition-colors ${globalProgress === 100 ? 'text-brand drop-shadow-[0_0_10px_rgba(139,195,74,0.8)]' : 'text-zinc-300'}`}>{globalProgress}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-xs font-bold border border-[#FFD700]/20 items-center gap-1">
                 ★ PLANO COMPLETO
              </span>
              <button 
                onClick={handleAvatarClick} 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-3 flex items-center justify-center border border-white/10 text-sm hover:scale-105 transition-transform"
                title="Avatar"
              >👤</button>
            </div>
         </header>

         {/* Content Area */}
         <div className="flex-1 overflow-auto p-4 sm:p-8">
            <div className="max-w-5xl mx-auto pb-24 sm:pb-8">
               {activeTab === 'dashboard' && <DashboardView projects={appData} onNavigate={(id: number) => setActiveTab(`proj-${id}`)} getProjProgress={getProjProgress} />}
               {activeTab === 'calculator' && <CalculatorView />}
               {activeTab === 'downloads' && <DownloadsView />}
               {activeTab === 'certificate' && <CertificateView progress={globalProgress} />}
               {activeTab === 'admin' && <AdminDashboardView projects={appData} onUpdateProjects={setAppData} />}
               {activeTab.startsWith('proj-') && progressData[activeTab.replace('proj-', '')] && (
                  <ProjectDetailView 
                     project={appData.find(p => p.id.toString() === activeTab.replace('proj-', ''))!} 
                     progress={progressData[activeTab.replace('proj-', '')]} 
                     onToggle={(idx: number) => handleToggleChecklist(activeTab.replace('proj-', ''), idx)} 
                  />
               )}
            </div>
         </div>
         
         {/* Mobile Nav */}
         <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-1 border-t border-white/5 flex items-center justify-around z-50">
             <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center w-16 h-full ${activeTab === 'dashboard' ? 'text-brand' : 'text-zinc-500'}`}>
                 <LayoutDashboard size={20} />
                 <span className="text-[10px] mt-1 font-medium">Início</span>
             </button>
             <button onClick={() => setActiveTab('proj-1')} className={`flex flex-col items-center justify-center w-16 h-full ${activeTab.startsWith('proj-') ? 'text-brand' : 'text-zinc-500'}`}>
                 <PlayCircle size={20} />
                 <span className="text-[10px] mt-1 font-medium">Módulos</span>
             </button>
             <button onClick={() => setActiveTab('calculator')} className={`flex flex-col items-center justify-center w-16 h-full ${activeTab === 'calculator' ? 'text-brand' : 'text-zinc-500'}`}>
                 <Calculator size={20} />
                 <span className="text-[10px] mt-1 font-medium">Custos</span>
             </button>
         </div>
      </main>
    </div>
  );
}

// ==========================================
// Reusable Components
// ==========================================
function NavItem({ active, icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? 'bg-brand/10 text-brand' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
    >
      <span className="flex items-center justify-center w-5 text-lg">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

// ==========================================
// Views
// ==========================================

function DashboardView({ projects, onNavigate, getProjProgress }: { projects: ProjectData[], onNavigate: (id: number) => void, getProjProgress: (id: number) => number }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="inline-block px-3 py-1 bg-brand/10 text-brand rounded-full text-[10px] sm:text-xs font-semibold mb-3 border border-brand/20 tracking-wider">
         SISTEMA INTEGRADO
      </div>
      <h2 className="text-2xl sm:text-4xl font-sora font-bold mb-3 tracking-tight">O Ciclo Sítio 360° ♻️</h2>
      <p className="text-zinc-400 mb-8 sm:mb-10 text-sm sm:text-lg max-w-2xl leading-relaxed">
         Aqui cada projeto alimenta o outro. Siga a trilha dos 7 módulos e transforme seu terreno em uma propriedade autossustentável e lucrativa.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((proj) => {
          const progress = getProjProgress(proj.id);
          const isDone = progress === 100;
          return (
          <div key={proj.id} onClick={() => onNavigate(proj.id)} className={`glass-panel p-5 sm:p-6 cursor-pointer hover:border-brand/40 transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(139,195,74,0.05)] md:hover:-translate-y-1 relative overflow-hidden ${isDone ? 'border-brand/30 bg-brand/5' : ''}`}>
            {isDone && <div className="absolute top-0 right-0 w-16 h-16 bg-brand/20 rounded-bl-full translate-x-8 -translate-y-8 flex items-end justify-start pb-4 pl-4 text-brand"><Award size={16}/></div>}
            
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-white/5 flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-all duration-300 shadow-inner ${isDone ? 'bg-brand/20' : 'bg-surface-2 group-hover:bg-brand/10'}`}>
                {proj.icon}
              </div>
              <div className={`text-[10px] sm:text-xs font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isDone ? 'bg-brand/10 text-brand' : 'bg-surface-3 text-zinc-400'}`}>
                <CheckCircle size={12} /> {progress}%
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold font-sora mb-2">{proj.name}</h3>
            <p className="text-xs text-zinc-500 line-clamp-2 mb-4 h-8">{proj.desc}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
               <span className="text-brand text-xs sm:text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                  Entrar no Módulo <ChevronRight size={16} className="ml-1" />
               </span>
               <PlayCircle size={20} className="text-zinc-600 group-hover:text-brand transition-colors" />
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}

function ProjectDetailView({ project, progress, onToggle }: { project: ProjectData, progress: boolean[], onToggle: (idx: number) => void }) {
  if (!project) return <div>Módulo não encontrado</div>;

  const currentPercent = Math.round((progress.filter(Boolean).length / progress.length) * 100) || 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
         <div className="flex items-center gap-2 text-brand">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full border border-brand/20">Módulo 0{project.id}</span>
            <span className="text-2xl ml-2">{project.icon}</span>
         </div>
         {currentPercent === 100 && (
            <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-brand bg-brand/10 px-4 py-1.5 rounded-full border border-brand/30 animate-pulse w-fit">
               <Trophy size={16} /> MÓDULO CONCLUÍDO
            </span>
         )}
      </div>
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-sora font-bold mb-4 sm:mb-6 tracking-tight">{project.name}</h2>
      <p className="text-zinc-400 text-sm md:text-base max-w-3xl mb-8 leading-relaxed">{project.desc}</p>
      
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center mb-8 relative overflow-hidden group w-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
         {project.videoUrl && project.videoUrl.trim() !== '' ? (
            <iframe 
               src={project.videoUrl} 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
               className="w-full h-full absolute inset-0 z-20"
            ></iframe>
         ) : (
            <>
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
               <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1592424001807-f39b6fc921c3?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
               <div className="z-20 text-center px-4">
                  <PlayCircle size={48} className="mx-auto text-zinc-600 mb-3" />
                  <p className="text-zinc-400 font-medium text-sm">A aula em vídeo será liberada em breve.</p>
               </div>
            </>
         )}
      </div>

      {/* INTEGRAÇÃO 360 - Destaque Principal do Novo Produto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
         <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 flex flex-col justify-center">
            <h4 className="text-brand font-bold flex items-center gap-2 mb-3 font-sora text-sm uppercase tracking-wide">
               <Repeat size={18} /> Ciclo do Sistema
            </h4>
            <p className="text-zinc-300 text-sm leading-relaxed">{project.feeds}</p>
         </div>
         <div className="bg-[#FFD835]/5 border border-[#FFD835]/20 rounded-2xl p-6 flex flex-col justify-center">
            <h4 className="text-[#FFD835] font-bold flex items-center gap-2 mb-3 font-sora text-sm uppercase tracking-wide">
               <DollarSign size={18} /> Resultado Financeiro
            </h4>
            <p className="text-zinc-300 text-sm leading-relaxed">{project.income}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
         {/* Checklist Column */}
         <div className="col-span-1 lg:col-span-2 space-y-8">
             <div className="glass-panel p-5 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold font-sora mb-4 sm:mb-6 flex items-center gap-2">
                   <CheckCircle className="text-brand shrink-0" size={20} /> Seu Checklist de Tarefas
                </h3>
                
                <ul className="space-y-2 sm:space-y-3">
                   {project.materials.map((item, i) => {
                      const isChecked = progress[i];
                      return (
                      <li key={i} onClick={() => onToggle(i)} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer group select-none hover:-translate-y-0.5 ${isChecked ? 'bg-brand/5 border-brand/30' : 'bg-surface-1/50 border-white/5 hover:border-brand/20 hover:bg-surface-2'}`}>
                         <div className={`mt-0.5 shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-md border flex items-center justify-center transition-colors duration-300 ${isChecked ? 'bg-brand border-brand text-black shadow-[0_0_10px_rgba(139,195,74,0.4)]' : 'border-zinc-500 group-hover:border-brand/50 text-transparent'}`}>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={4} />
                         </div>
                         <span className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                            {item}
                         </span>
                      </li>
                   )})}
                </ul>
                {(!project.materials || project.materials.length === 0) && (
                   <p className="text-zinc-500 text-sm text-center py-6">Nenhuma tarefa listada neste módulo.</p>
                )}
             </div>
         </div>

         {/* Side Widgets Column */}
         <div className="space-y-4">
            <div className="glass-panel p-5 sm:p-6 bg-gradient-to-br from-surface-2 to-surface-1 border-t-2 border-t-brand">
               <h3 className="text-base sm:text-lg font-bold font-sora mb-2">Informações Técnicas</h3>
               <div className="space-y-3 mt-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Tempo de obra:</span>
                      <span className="font-semibold">{project.time}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Custo estimado:</span>
                      <span className="font-semibold text-brand">{project.cost}</span>
                   </div>
               </div>
            </div>

            <div className="glass-panel p-5 sm:p-6 border-brand/20 bg-brand/5 relative overflow-hidden">
               <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand/20 rounded-full blur-2xl"></div>
               <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/20 text-brand flex items-center justify-center mb-4 relative z-10">
                  <Download size={20} />
               </div>
               <h3 className="text-base sm:text-lg font-bold font-sora mb-2 text-brand relative z-10">Planta e Medidas</h3>
               <p className="text-xs sm:text-sm text-zinc-400 mb-6 relative z-10">Arquivos técnicos para impressão.</p>
               <button className="w-full py-2.5 sm:py-3 rounded-xl bg-brand hover:bg-brand-hover text-black text-sm font-semibold transition-all shadow-[0_0_20px_rgba(139,195,74,0.3)] flex items-center justify-center gap-2 relative z-10">
                  <Download size={18} /> Baixar PDF Original
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function CalculatorView() {
  return (
     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-4 inline-block px-3 py-1 bg-[#FDD835]/10 text-[#FDD835] rounded-full text-[10px] sm:text-xs font-semibold border border-[#FDD835]/20">
           INCLUSO NO PLANO COMPLETO
        </div>
        <h2 className="text-2xl sm:text-3xl font-sora font-bold mb-3 tracking-tight">Calculadora Financeira</h2>
        <p className="text-zinc-400 mb-8 sm:mb-10 text-sm sm:text-lg max-w-2xl">Não tenha surpresas orçamentárias. Configure o preço dos materiais locais e saiba exatamente quanto vai investir.</p>
        
        <div className="glass-panel p-8 text-center text-zinc-500 italic">
            Visualizador da calculadora estático (Módulo Opcional).
        </div>
     </div>
  )
}

function DownloadsView() {
    return (
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl sm:text-3xl font-sora font-bold mb-3 tracking-tight">Arquivos e Bônus</h2>
          <p className="text-zinc-400 mb-8 sm:mb-10 text-sm sm:text-lg">Todo o material de apoio para montar seu Sítio 360°.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                  { name: "Guia Oficial Sítio 360°", desc: "PDF completo com os 7 módulos integrados.", locked: false },
                  { name: "Plantas e Medidas", desc: "Plantas ilustradas com medidas em cm.", locked: false },
                  { name: "Planilha de Custos", desc: "Automatizada por região do Brasil.", locked: false },
                  { name: "Calendário Implantação", desc: "Mes a mes, o que plantar e construir.", locked: false },
                  { name: "Guia Ferramentas", desc: "Ferramentas essenciais para iniciar.", locked: false },
                  { name: "Guia de Monetização", desc: "Ouro: Como lucrar nas Redes Sociais.", locked: false, gold: true },
                  { name: "30 Ideias de Conteúdo", desc: "Ouro: Roteiros prontos para gravar.", locked: false, gold: true },
                  { name: "Telegram VIP", desc: "Acesso à comunidade de bioconstrutores.", locked: false }
              ].map((item, i) => (
                  <div key={i} className={`glass-panel p-5 sm:p-6 flex flex-col ${item.locked ? 'opacity-80' : item.gold ? 'border-[#FDD835]/30 bg-gradient-to-b from-[#FDD835]/5 to-transparent' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.locked ? 'bg-surface-3 text-zinc-500' : item.gold ? 'bg-[#FDD835]/20 text-[#FDD835]' : 'bg-brand/10 text-brand'}`}>
                              {item.locked ? <Lock size={20} /> : <Download size={20} />}
                          </div>
                      </div>
                      <h3 className={`text-base sm:text-lg font-bold font-sora mb-1 ${item.gold ? 'text-[#FDD835]' : 'text-white'}`}>{item.name}</h3>
                      <p className="text-xs sm:text-sm text-zinc-400 mb-5 sm:mb-6">{item.desc}</p>
                      <button className={`mt-auto w-full py-2.5 sm:py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all rounded-lg ${item.gold ? 'bg-[#FDD835] text-black hover:scale-[1.02] shadow-[0_0_15px_rgba(253,216,53,0.3)]' : 'bg-brand text-black hover:bg-brand-hover hover:scale-[1.02]'}`}>
                          Baixar Resíduo
                      </button>
                  </div>
              ))}
          </div>
       </div>
    )
}

function CertificateView({ progress }: { progress: number }) {
   if (progress < 100) {
      return (
         <div className="animate-in fade-in flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-full bg-surface-2 border border-white/5 flex items-center justify-center text-zinc-600 mb-6 shadow-xl">
               <Award className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-sora font-bold mb-3">Certificado Inativo 🔒</h2>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-8">Conclua 100% dos checklists para liberar.</p>
         </div>
      );
   }

   return (
      <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
          <h2 className="text-3xl font-sora font-bold mb-8 text-white drop-shadow-md">Certificado Liberado</h2>
          <button className="px-8 py-4 rounded-xl bg-brand hover:bg-brand-hover text-black font-bold text-lg shadow-lg flex items-center gap-3">
             <Download size={24} /> Emitir em PDF
          </button>
      </div>
   );
}


// ==========================================
// Admin Environment View
// ==========================================

function AdminDashboardView({ projects, onUpdateProjects }: { projects: ProjectData[], onUpdateProjects: (data: ProjectData[]) => void }) {
   const [localData, setLocalData] = useState<ProjectData[]>(() => JSON.parse(JSON.stringify(projects)));

   const handleChange = (id: number, field: keyof ProjectData, value: string) => {
      setLocalData(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
   };

   const handleMaterialChange = (id: number, matIndex: number, val: string) => {
      setLocalData(prev => prev.map(p => {
         if (p.id !== id) return p;
         const newMats = [...p.materials];
         newMats[matIndex] = val;
         return { ...p, materials: newMats };
      }));
   };

   const addMaterial = (id: number) => {
      setLocalData(prev => prev.map(p => {
         if (p.id !== id) return p;
         return { ...p, materials: [...p.materials, "Nova tarefa (clique para editar)"] };
      }));
   };

   const removeMaterial = (id: number, matIndex: number) => {
      setLocalData(prev => prev.map(p => {
         if (p.id !== id) return p;
         const newMats = [...p.materials];
         newMats.splice(matIndex, 1);
         return { ...p, materials: newMats };
      }));
   };

   const handleExportJSON = () => {
      onUpdateProjects(localData);
      const fileData = JSON.stringify({ projects: localData }, null, 2);
      const blob = new Blob([fileData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
   };

   return (
      <div className="animate-in fade-in">
         <div className="mb-4 inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/20 flex w-fit items-center gap-2">
           <AlertTriangle size={14} /> MODO ADMINISTRADOR (Sítio 360)
         </div>
         <h2 className="text-3xl font-sora font-bold mb-6">Painel de Criação</h2>
         
         <div className="sticky top-16 sm:top-20 z-40 bg-surface-1/90 backdrop-blur pb-4 pt-2 mb-6 border-b border-white/5">
            <button onClick={handleExportJSON} className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand hover:bg-brand-hover text-black font-bold flex items-center justify-center gap-2 shadow-lg">
               <Save size={18} /> Salvar & Exportar (data.json)
            </button>
         </div>

         <div className="space-y-6">
            {localData.map((proj) => (
               <div key={proj.id} className="glass-panel p-4 sm:p-6 border-l-4 border-l-brand/50">
                  <div className="flex items-center gap-2 mb-4 text-brand">
                     <span className="text-xl">{proj.icon}</span>
                     <h3 className="font-sora font-bold text-lg">Módulo {proj.id} - Editor</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="block text-xs text-zinc-400 mb-1">Título</label>
                        <input type="text" value={proj.name} onChange={(e) => handleChange(proj.id, 'name', e.target.value)} className="w-full bg-surface-3 border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-brand" />
                     </div>
                     <div>
                        <label className="block text-xs text-zinc-400 mb-1">Custo Estimado</label>
                        <input type="text" value={proj.cost} onChange={(e) => handleChange(proj.id, 'cost', e.target.value)} className="w-full bg-surface-3 border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-brand" />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-xs text-zinc-400 mb-1">Descrição</label>
                        <textarea value={proj.desc} onChange={(e) => handleChange(proj.id, 'desc', e.target.value)} className="w-full bg-surface-3 border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-brand" rows={2}/>
                     </div>
                     <div>
                        <label className="block text-xs text-zinc-400 mb-1">Ciclo Sustentável (Feeds)</label>
                        <textarea value={proj.feeds} onChange={(e) => handleChange(proj.id, 'feeds', e.target.value)} className="w-full bg-surface-3 border border-white/10 rounded-md py-2 px-3 text-sm text-zinc-300 focus:outline-none focus:border-brand" rows={2}/>
                     </div>
                     <div>
                        <label className="block text-xs text-zinc-400 mb-1">Renda Financeira (Income)</label>
                        <textarea value={proj.income} onChange={(e) => handleChange(proj.id, 'income', e.target.value)} className="w-full bg-surface-3 border border-white/10 rounded-md py-2 px-3 text-sm text-yellow-400 focus:outline-none focus:border-brand" rows={2}/>
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-xs text-zinc-400 mb-1">Link do Vídeo Embed</label>
                        <input type="text" value={proj.videoUrl} onChange={(e) => handleChange(proj.id, 'videoUrl', e.target.value)} className="w-full bg-surface-3 border border-white/10 rounded-md py-2 px-3 text-sm text-brand" />
                     </div>
                  </div>

                  <div className="bg-surface-2 p-4 rounded-xl border border-white/5">
                     <h4 className="text-sm font-bold mb-3">Checklist (Aparece pro Aluno marcar)</h4>
                     <div className="space-y-2 mb-3">
                        {proj.materials.map((mat, idx) => (
                           <div key={idx} className="flex gap-2">
                              <input type="text" value={mat} onChange={(e) => handleMaterialChange(proj.id, idx, e.target.value)} className="flex-1 bg-surface-3 rounded py-1.5 px-3 text-sm text-white" />
                              <button onClick={() => removeMaterial(proj.id, idx)} className="text-red-400 p-1">✕</button>
                           </div>
                        ))}
                     </div>
                     <button onClick={() => addMaterial(proj.id)} className="text-xs font-semibold text-brand px-3 py-1.5 rounded bg-brand/10">+ Adicionar</button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

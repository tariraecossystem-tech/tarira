import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  HardHat, 
  GraduationCap, 
  Layers, 
  Users, 
  X,
  ExternalLink,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { JobVacancy } from '../modals/TariraJobApplicationModal';

interface TariraJobVacanciesManagerProps {
  vacancies: JobVacancy[];
  onAddVacancy: (vacancy: Partial<JobVacancy>) => Promise<any>;
  onUpdateVacancy: (id: string, updates: Partial<JobVacancy>) => Promise<any>;
  onDeleteVacancy: (id: string) => Promise<any>;
  onClearMockups: () => Promise<any>;
  jobApplicationsCount?: number;
  onNavigateToPublicJobs?: () => void;
  supabaseConnected?: boolean;
}

const PROVINCES = [
  'Todas as Províncias',
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa',
  'Remoto'
];

export const TariraJobVacanciesManager: React.FC<TariraJobVacanciesManagerProps> = ({
  vacancies,
  onAddVacancy,
  onUpdateVacancy,
  onDeleteVacancy,
  onClearMockups,
  jobApplicationsCount = 0,
  onNavigateToPublicJobs,
  supabaseConnected = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'quadros' | 'oficios'>('all');
  const [provinceFilter, setProvinceFilter] = useState('Todas as Províncias');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sourcing' | 'screening' | 'upcoming' | 'closed'>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<JobVacancy | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearingMockups, setIsClearingMockups] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'quadros' as 'quadros' | 'oficios',
    department: '',
    location: 'Maputo Cidade',
    province: 'Maputo Cidade',
    type: 'Tempo Inteiro',
    contractDuration: 'Contrato Permanente',
    isLongTermTechnicalContract: false,
    status: 'sourcing' as 'sourcing' | 'screening' | 'upcoming' | 'closed',
    statusLabel: '',
    summary: '',
    requirementsText: '',
    expectedOpenings: '1 vaga aberta'
  });

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const mockupCount = useMemo(() => {
    return vacancies.filter(v => v.isMockup || [
      'tech-dev', 'tech-clima', 'finance-audit', 'elec-industrial', 
      'ops-logistics', 'civil-plumbing', 'commercial-b2b', 'hr-talent', 
      'solar-renewable', 'eng-civil-nampula', 'electromech-tete', 'agri-manica'
    ].includes(v.id)).length;
  }, [vacancies]);

  const realCount = vacancies.length - mockupCount;

  const filteredVacancies = useMemo(() => {
    return vacancies.filter(v => {
      const matchSearch = 
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCat = categoryFilter === 'all' || v.category === categoryFilter;
      const matchProv = provinceFilter === 'Todas as Províncias' || v.province === provinceFilter;
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;

      return matchSearch && matchCat && matchProv && matchStatus;
    });
  }, [vacancies, searchTerm, categoryFilter, provinceFilter, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingVacancy(null);
    setFormData({
      title: '',
      category: 'quadros',
      department: '',
      location: 'Maputo Cidade',
      province: 'Maputo Cidade',
      type: 'Tempo Inteiro',
      contractDuration: 'Contrato 12 Meses (Renovável)',
      isLongTermTechnicalContract: false,
      status: 'sourcing',
      statusLabel: 'Sourcing Ativo',
      summary: '',
      requirementsText: '',
      expectedOpenings: '1 vaga'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vacancy: JobVacancy) => {
    setEditingVacancy(vacancy);
    setFormData({
      title: vacancy.title,
      category: vacancy.category,
      department: vacancy.department,
      location: vacancy.location,
      province: vacancy.province || 'Maputo Cidade',
      type: vacancy.type,
      contractDuration: vacancy.contractDuration || (vacancy.category === 'oficios' ? 'Contrato Técnico de Curta, Média e Longa Duração' : 'Contrato Permanente'),
      isLongTermTechnicalContract: Boolean(vacancy.isLongTermTechnicalContract),
      status: vacancy.status,
      statusLabel: vacancy.statusLabel || '',
      summary: vacancy.summary,
      requirementsText: (vacancy.requirements || []).join('\n'),
      expectedOpenings: vacancy.expectedOpenings
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.department.trim()) {
      showToast('Por favor, preencha o título e o departamento da vaga.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const requirements = formData.requirementsText
        .split('\n')
        .map(r => r.trim())
        .filter(Boolean);

      const payload: Partial<JobVacancy> = {
        title: formData.title.trim(),
        category: formData.category,
        department: formData.department.trim(),
        location: formData.location.trim(),
        province: formData.province,
        type: formData.type.trim(),
        contractDuration: formData.contractDuration.trim(),
        isLongTermTechnicalContract: formData.category === 'oficios' ? true : formData.isLongTermTechnicalContract,
        status: formData.status,
        statusLabel: formData.statusLabel.trim() || (formData.status === 'sourcing' ? 'Sourcing Ativo' : formData.status === 'screening' ? 'Em Triagem' : formData.status === 'closed' ? 'Fechada' : 'Abertura Iminente'),
        summary: formData.summary.trim(),
        requirements,
        expectedOpenings: formData.expectedOpenings.trim() || '1 vaga',
        isMockup: false // Vagas criadas no admin são sempre reais
      };

      if (editingVacancy) {
        await onUpdateVacancy(editingVacancy.id, payload);
        showToast(`Vaga "${payload.title}" atualizada e sincronizada com o Supabase com sucesso!`, 'success');
      } else {
        await onAddVacancy(payload);
        showToast(`Nova vaga real "${payload.title}" criada e publicada com sucesso!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Erro ao gravar vaga.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (vacancy: JobVacancy) => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente a vaga "${vacancy.title}"?\nEsta ação será refletida de imediato no Supabase e no portal público.`)) {
      return;
    }
    try {
      await onDeleteVacancy(vacancy.id);
      showToast(`Vaga "${vacancy.title}" eliminada com sucesso.`, 'info');
    } catch (err: any) {
      showToast('Erro ao excluir vaga.', 'error');
    }
  };

  const handleClearAllMockups = async () => {
    if (!window.confirm(`CONFIRMAÇÃO DE LIMPEZA DE MOCKUPS:\n\nTem certeza que deseja excluir TODAS as ${mockupCount} vagas fictícias/mockups?\n\nEsta operação vai limpar permanentemente os dados de teste no Supabase e deixar o portal de vagas 100% limpo para receber exclusivamente vagas reais.`)) {
      return;
    }

    setIsClearingMockups(true);
    try {
      await onClearMockups();
      showToast('Todas as vagas fictícias foram excluídas com sucesso! O sistema está pronto para receber vagas reais.', 'success');
    } catch (err: any) {
      showToast('Erro ao excluir vagas fictícias.', 'error');
    } finally {
      setIsClearingMockups(false);
    }
  };

  return (
    <div id="job-vacancies-crud-manager" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-4 rounded-xl shadow-lg border flex items-center justify-between text-sm font-medium transition-all duration-300 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-black/5 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header com Status Supabase */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-600 text-white flex items-center justify-center shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gestão do Portal de Vagas & Carreiras</h2>
              <p className="text-xs text-slate-500">Módulo CRUD com sincronização em tempo real com o Supabase</p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Supabase Sincronizado
          </div>

          {onNavigateToPublicJobs && (
            <button
              onClick={onNavigateToPublicJobs}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              title="Abrir página pública de vagas"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Portal Público
            </button>
          )}

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md transition shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            Nova Vaga Real
          </button>
        </div>
      </div>

      {/* Alerta de Mockups / Exclusão em Lote */}
      {mockupCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Detectadas {mockupCount} vagas de teste/mockup no sistema
                </h3>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  Para colocar o portal em produção pronto a receber exclusivamente vagas reais publicadas por si, pode excluir todas as vagas fictícias com um único clique.
                </p>
              </div>
            </div>

            <button
              onClick={handleClearAllMockups}
              disabled={isClearingMockups}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60 rounded-xl shadow transition whitespace-nowrap"
            >
              {isClearingMockups ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  A excluir mockups...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Excluir Todas as Vagas Fictícias
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Painel de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total de Vagas</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{vacancies.length}</span>
            <span className="text-xs text-slate-400 font-medium">({realCount} reais)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tarira Recruit (Quadros)</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-blue-600">
              {vacancies.filter(v => v.category === 'quadros').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tarira Connect (Ofícios)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <HardHat className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-600">
              {vacancies.filter(v => v.category === 'oficios').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Candidaturas Recebidas</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-purple-600">{jobApplicationsCount}</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar vagas por título, departamento, província..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro por Categoria */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded-lg transition ${categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('quadros')}
                className={`px-3 py-1 rounded-lg transition ${categoryFilter === 'quadros' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Recruit (Quadros)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('oficios')}
                className={`px-3 py-1 rounded-lg transition ${categoryFilter === 'oficios' ? 'bg-white text-emerald-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Connect (Ofícios)
              </button>
            </div>

            {/* Filtro por Província */}
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="py-2 px-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Filtro por Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-2 px-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todos os Estados</option>
              <option value="sourcing">Sourcing Ativo</option>
              <option value="screening">Em Triagem</option>
              <option value="upcoming">Abertura Iminente</option>
              <option value="closed">Fechada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Vagas */}
      {filteredVacancies.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Nenhuma vaga encontrada</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            {searchTerm || categoryFilter !== 'all' || provinceFilter !== 'Todas as Províncias'
              ? 'Nenhuma vaga corresponde aos filtros selecionados. Tente ajustar os parâmetros de pesquisa.'
              : 'Não existem vagas registadas no sistema. Comece por criar a sua primeira vaga real clicando no botão abaixo.'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Publicar Primeira Vaga Real
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVacancies.map((vacancy) => {
            const isMockup = vacancy.isMockup || [
              'tech-dev', 'tech-clima', 'finance-audit', 'elec-industrial', 
              'ops-logistics', 'civil-plumbing', 'commercial-b2b', 'hr-talent', 
              'solar-renewable', 'eng-civil-nampula', 'electromech-tete', 'agri-manica'
            ].includes(vacancy.id);

            return (
              <div 
                key={vacancy.id} 
                className={`bg-white rounded-xl p-5 border transition-all hover:shadow-md ${
                  isMockup ? 'border-amber-200/80 bg-amber-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      {/* Badge Real vs Mockup */}
                      {isMockup ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-300">
                          Mockup / Teste
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Vaga Real
                        </span>
                      )}

                      {/* Badge Categoria */}
                      {vacancy.category === 'quadros' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          Tarira Recruit (Quadros)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <HardHat className="w-3 h-3" />
                          Tarira Connect (Ofícios)
                        </span>
                      )}

                      {/* Badge Status */}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        vacancy.status === 'sourcing' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : vacancy.status === 'screening'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : vacancy.status === 'closed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {vacancy.statusLabel || (vacancy.status === 'sourcing' ? 'Sourcing Ativo' : vacancy.status === 'screening' ? 'Em Triagem' : vacancy.status === 'closed' ? 'Fechada' : 'Abertura Iminente')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{vacancy.title}</h3>
                    
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {vacancy.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {vacancy.location} {vacancy.province ? `(${vacancy.province})` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {vacancy.contractDuration || vacancy.type}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        {vacancy.expectedOpenings}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {vacancy.summary}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
                    <button
                      onClick={() => handleOpenEditModal(vacancy)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(vacancy)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                      title="Excluir vaga"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 my-8">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingVacancy ? 'Editar Vaga' : 'Criar Nova Vaga Real'}
                  </h3>
                  <p className="text-xs text-slate-500">Sincronização imediata com a base de dados Supabase</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Título da Vaga */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título da Posição / Especialidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Engenheiro de Manutenção Mecânica Industrial"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Categoria e Departamento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoria da Vaga *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value as 'quadros' | 'oficios';
                      setFormData({ 
                        ...formData, 
                        category: newCat,
                        contractDuration: newCat === 'oficios' 
                          ? 'Contrato Técnico de Curta, Média e Longa Duração'
                          : 'Contrato 12 Meses (Renovável)'
                      });
                    }}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="quadros">Tarira Recruit (Quadros Superiores & Médios)</option>
                    <option value="oficios">Tarira Connect (Ofícios & Contratos Técnicos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Departamento / Área Técnica *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Manutenção Predial & Industrial"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Província e Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Província *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {PROVINCES.filter(p => p !== 'Todas as Províncias').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Localização Detalhada / Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maputo Cidade e Matola"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Duração e Vagas Previstas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duração / Regime Contratual
                  </label>
                  <input
                    type="text"
                    placeholder={formData.category === 'oficios' ? 'Contrato Técnico de Curta, Média e Longa Duração' : 'Contrato Permanente'}
                    value={formData.contractDuration}
                    onChange={(e) => setFormData({ ...formData, contractDuration: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vagas Previstas / Openings
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2 vagas abertas, Alocação contínua"
                    value={formData.expectedOpenings}
                    onChange={(e) => setFormData({ ...formData, expectedOpenings: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Status do Sourcing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estado do Processo Seletivo *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const st = e.target.value as any;
                      setFormData({ 
                        ...formData, 
                        status: st,
                        statusLabel: st === 'sourcing' ? 'Sourcing Ativo' : st === 'screening' ? 'Em Triagem' : st === 'closed' ? 'Fechada' : 'Abertura Iminente'
                      });
                    }}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="sourcing">Sourcing Ativo (Recebendo candidaturas)</option>
                    <option value="screening">Em Triagem (Homologação de talentos)</option>
                    <option value="upcoming">Abertura Iminente (Pré-cadastro)</option>
                    <option value="closed">Fechada (Concluída)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rótulo Personalizado do Status (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Sourcing Ativo Connect, Shortlist Aberta"
                    value={formData.statusLabel}
                    onChange={(e) => setFormData({ ...formData, statusLabel: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Resumo da Vaga */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resumo / Âmbito do Trabalho *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva as principais atribuições, enquadramento e objetivos desta posição..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Requisitos (um por linha) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requisitos & Critérios de Triagem (1 requisito por linha) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Exemplo:&#10;Licenciatura em Engenharia Mecânica ou carteira profissional&#10;Mínimo de 3 anos de experiência em manutenção predial&#10;Conhecimento de normas de segurança e EPI&#10;Disponibilidade imediata em Maputo"
                  value={formData.requirementsText}
                  onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Footer com Botões */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl shadow-md transition shadow-emerald-600/20"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      A gravar no Supabase...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      {editingVacancy ? 'Guardar Alterações' : 'Publicar Vaga Real'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

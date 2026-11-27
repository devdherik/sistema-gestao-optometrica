import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  Store, 
  Plus, 
  UserPlus, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Eye
} from 'lucide-react';
import { dashboardService, pacienteService } from '../services/api';
import './InicioView.css';

function InicioView({ 
  onNovoAtendimento, 
  onCadastrarPaciente, 
  onVerProntuarioPorId 
}) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarDashboard = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const resumo = await dashboardService.obterResumo();
      setDados(resumo);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setErro('Não foi possível carregar as informações do painel.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  // Formatação de data padrão BR (DD/MM/AAAA)
  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    try {
      const partes = dataStr.split('T')[0].split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return dataStr;
    } catch {
      return dataStr;
    }
  };

  const handleAbrirProntuario = async (pacienteId) => {
    if (!pacienteId || !onVerProntuarioPorId) return;
    try {
      const pac = await pacienteService.buscarPorId(pacienteId);
      onVerProntuarioPorId(pac);
    } catch (err) {
      console.error('Erro ao carregar paciente para prontuário:', err);
    }
  };

  return (
    <div className="inicio-container">
      
      {/* 1. Cabeçalho de Boas-Vindas e Ações Rápidas */}
      <section className="inicio-header-card">
        <div className="inicio-header-info">
          <h1 className="inicio-titulo">
            Bem-vindo(a) ao sistema
          </h1>
          <p className="inicio-subtitulo">
            Acompanhe o movimento geral do consultório e os próximos retornos clínicos.
          </p>
        </div>

        <div className="inicio-acoes-rapidas">
          <button 
            type="button" 
            className="btn-inicio-primario"
            onClick={onNovoAtendimento}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Novo atendimento</span>
          </button>

          <button 
            type="button" 
            className="btn-inicio-secundario"
            onClick={onCadastrarPaciente}
          >
            <UserPlus size={18} />
            <span>Cadastrar paciente</span>
          </button>
        </div>
      </section>

      {/* 2. Cartões de Métricas / Indicadores Rápidos (KPIs) */}
      <section className="inicio-kpis-grid">
        {/* KPI 1: Pacientes Cadastrados */}
        <div className="kpi-card">
          <div className="kpi-icone-box kpi-icone-verde">
            <Users size={22} />
          </div>
          <div className="kpi-conteudo">
            <span className="kpi-rotulo">Pacientes Cadastrados</span>
            <strong className="kpi-valor">
              {carregando ? '...' : dados?.totalPacientes ?? 0}
            </strong>
          </div>
        </div>

        {/* KPI 2: Atendimentos no Mês */}
        <div className="kpi-card">
          <div className="kpi-icone-box kpi-icone-azul">
            <ClipboardList size={22} />
          </div>
          <div className="kpi-conteudo">
            <span className="kpi-rotulo">Consultas Este Mês</span>
            <strong className="kpi-valor">
              {carregando ? '...' : dados?.consultasMes ?? 0}
            </strong>
          </div>
        </div>

        {/* KPI 3: Atendimentos Hoje */}
        <div className="kpi-card">
          <div className="kpi-icone-box kpi-icone-ambar">
            <Calendar size={22} />
          </div>
          <div className="kpi-conteudo">
            <span className="kpi-rotulo">Consultas Hoje</span>
            <strong className="kpi-valor">
              {carregando ? '...' : dados?.consultasHoje ?? 0}
            </strong>
          </div>
        </div>

        {/* KPI 4: Óticas Parceiras */}
        <div className="kpi-card">
          <div className="kpi-icone-box kpi-icone-esmeralda">
            <Store size={22} />
          </div>
          <div className="kpi-conteudo">
            <span className="kpi-rotulo">Óticas Parceiras</span>
            <strong className="kpi-valor">
              {carregando ? '...' : dados?.totalOpticas ?? 0}
            </strong>
          </div>
        </div>
      </section>

      {/* 3. Dois Painéis Centrais (Lado a Lado) - Opção A */}
      <div className="inicio-paineis-grid">
        
        {/* Painel Esquerdo: Últimos Atendimentos Realizados */}
        <section className="painel-card">
          <div className="painel-header">
            <div className="painel-titulo-wrapper">
              <Clock size={18} className="painel-icone-titulo" />
              <h2>Últimos atendimentos realizados</h2>
            </div>
            <span className="painel-badge-count">
              {dados?.ultimosAtendimentos?.length || 0} recentes
            </span>
          </div>

          <div className="painel-conteudo">
            {carregando ? (
              <div className="painel-feedback">
                <Loader2 size={24} className="spinner" />
                <span>Carregando atendimentos...</span>
              </div>
            ) : !dados?.ultimosAtendimentos || dados.ultimosAtendimentos.length === 0 ? (
              <div className="painel-vazio">
                <p>Nenhuma consulta realizada até o momento.</p>
              </div>
            ) : (
              <div className="lista-atendimentos-recentes">
                {dados.ultimosAtendimentos.map((atendimento) => (
                  <div key={atendimento.id} className="item-atendimento-recente">
                    <div className="item-atendimento-info">
                      <div className="item-paciente-topo">
                        <strong className="item-nome-paciente">
                          {atendimento.nomePaciente || 'Paciente não identificado'}
                        </strong>
                        <span className="item-tag-origem">
                          {atendimento.nomeOptica || 'Particular'}
                        </span>
                      </div>
                      
                      <div className="item-atendimento-detalhe">
                        <span>Data: <strong>{formatarData(atendimento.dataAtendimento)}</strong></span>
                        {atendimento.queixaPrincipal && (
                          <span className="item-queixa-resumo">
                            • {atendimento.queixaPrincipal.length > 50 
                              ? `${atendimento.queixaPrincipal.slice(0, 50)}...` 
                              : atendimento.queixaPrincipal}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn-item-prontuario"
                      onClick={() => handleAbrirProntuario(atendimento.pacienteId)}
                      title="Ver prontuário"
                    >
                      <span>Prontuário</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}

export default InicioView;

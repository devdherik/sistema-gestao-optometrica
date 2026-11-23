import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Calendar, 
  Phone, 
  User, 
  ShieldAlert,
  X,
  Store,
  Printer,
  Eye,
  Check,
  ChevronRight
} from 'lucide-react';
import { pacienteService, atendimentoService } from '../services/api';
import './ProntuarioPacienteView.css';

function ProntuarioPacienteView({ 
  paciente, 
  onVoltar, 
  onEditarCadastro, 
  onNovaConsulta, 
  onPacienteExcluido,
  notificacaoExterna,
  onLimparNotificacaoExterna,
  onImprimirReceita
}) {
  const [atendimentos, setAtendimentos] = useState([]);
  const [carregandoAtendimentos, setCarregandoAtendimentos] = useState(true);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: 'erro' | 'sucesso', texto: '' }

  // Recebe notificação vinda de outra ação (ex: consulta recém-finalizada)
  useEffect(() => {
    if (notificacaoExterna) {
      setAviso(notificacaoExterna);
      if (onLimparNotificacaoExterna) {
        onLimparNotificacaoExterna();
      }
    }
  }, [notificacaoExterna, onLimparNotificacaoExterna]);

  // Limpa o aviso automaticamente após 6 segundos
  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(() => {
      setAviso(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [aviso]);

  // Carregar histórico de atendimentos do paciente
  useEffect(() => {
    if (paciente && paciente.id) {
      carregarHistorico(paciente.id);
    }
  }, [paciente]);

  const carregarHistorico = async (pacienteId) => {
    try {
      setCarregandoAtendimentos(true);
      const lista = await atendimentoService.obterHistoricoPorPaciente(pacienteId);
      setAtendimentos(lista || []);
    } catch (err) {
      console.error('Erro ao carregar histórico de atendimentos:', err);
    } finally {
      setCarregandoAtendimentos(false);
    }
  };

  // Exclusão do paciente (com confirmação em dois passos, idêntica ao CRUD de óticas)
  const handleExcluirPaciente = async () => {
    if (!confirmandoExclusao) {
      setConfirmandoExclusao(true);
      return;
    }

    setConfirmandoExclusao(false);
    setAviso(null);
    setExcluindo(true);

    try {
      await pacienteService.excluir(paciente.id);
      if (onPacienteExcluido) {
        onPacienteExcluido(paciente);
      }
      onVoltar();
    } catch (err) {
      setAviso({
        tipo: 'erro',
        texto: err.message || 'Não é possível excluir o paciente pois ele possui atendimentos vinculados.'
      });
    } finally {
      setExcluindo(false);
    }
  };

  // Iniciais do nome para o avatar circular
  const obterIniciais = (nome) => {
    if (!nome) return 'P';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  // Cálculo da idade a partir da Data de Nascimento (YYYY-MM-DD)
  const calcularIdade = (dataNasc) => {
    if (!dataNasc) return null;
    try {
      const nasc = new Date(dataNasc + 'T12:00:00');
      const hoje = new Date();
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      return idade >= 0 ? idade : null;
    } catch {
      return null;
    }
  };

  // Formatação de data (DD/MM/AAAA)
  const formatarData = (dataStr) => {
    if (!dataStr) return 'Não informada';
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

  // Formata data por extenso: "20 de outubro de 2026"
  const formatarDataExtenso = (dataStr) => {
    if (!dataStr) return 'Data não informada';
    try {
      const d = new Date(dataStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(d);
    } catch {
      return formatarData(dataStr);
    }
  };

  // Formata hora: "10:30"
  const formatarHora = (dataStr) => {
    if (!dataStr) return '';
    try {
      const d = new Date(dataStr);
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    } catch {
      return '';
    }
  };

  // Formata dioptrias com sinal: "-1.25", "+1.75", "Plano"
  const formatarGrau = (num, ehEixo = false) => {
    if (num === null || num === undefined || num === '') return '—';
    const n = Number(num);
    if (isNaN(n)) return '—';
    if (ehEixo) return `${n}°`;
    return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
  };

  if (!paciente) return null;

  const idade = calcularIdade(paciente.dataNascimento);
  const codigoProntuario = `PAC-${String(paciente.id).padStart(5, '0')}`;
  const totalConsultas = atendimentos.length;

  return (
    <div className="prontuario-container">
      {/* 1. Botão Voltar */}
      <div className="prontuario-topo-navegacao">
        <button type="button" className="btn-voltar" onClick={onVoltar}>
          <ArrowLeft size={16} />
          <span>Voltar para pacientes</span>
        </button>
      </div>

      {/* 2. Cabeçalho Principal */}
      <div className="prontuario-header">
        <div>
          <h1 className="prontuario-titulo">Perfil do paciente</h1>
          <p className="prontuario-subtitulo">
            Dados cadastrais e evolução dos registros clínicos.
          </p>
        </div>

        <button 
          type="button" 
          className="btn-nova-consulta"
          onClick={() => onNovaConsulta && onNovaConsulta(paciente)}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Nova Consulta</span>
        </button>
      </div>

      {/* Alerta padronizado do sistema */}
      {aviso && (
        <div style={{ marginBottom: '20px' }}>
          <div className={`alerta-sistema alerta-sistema-${aviso.tipo}`}>
            {aviso.tipo === 'erro' ? (
              <AlertCircle size={18} className="alerta-sistema-icone" />
            ) : (
              <CheckCircle2 size={18} className="alerta-sistema-icone" />
            )}
            <span className="alerta-sistema-texto">{aviso.texto}</span>
            <button 
              type="button" 
              className="alerta-sistema-fechar" 
              onClick={() => setAviso(null)}
              title="Fechar notificação"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Barra Resumo do Paciente */}
      <div className="paciente-resumo-faixa">
        <h2 className="paciente-resumo-nome">{paciente.nomeCompleto}</h2>
        <span className="paciente-resumo-consulta">
          Última consulta: {totalConsultas > 0 ? formatarData(atendimentos[0].dataAtendimento) : 'Nenhuma consulta'}
        </span>
      </div>

      {/* 4. Grid Principal: Coluna Esquerda (Dados) e Coluna Direita (Histórico) */}
      <div className="prontuario-grid">
        
        {/* COLUNA ESQUERDA: Ficha Cadastral */}
        <aside className="prontuario-card-cadastro">
          {/* Avatar e Código de Prontuário */}
          <div className="avatar-prontuario-wrapper">
            <div className="avatar-circulo">
              {obterIniciais(paciente.nomeCompleto)}
            </div>
            <div>
              <span className="prontuario-label-small">Prontuário</span>
              <p className="prontuario-codigo">{codigoProntuario}</p>
            </div>
          </div>

          <div className="cadastro-divisor" />

          {/* Dados do Paciente */}
          <div className="cadastro-campo">
            <span className="cadastro-campo-label">Nome completo</span>
            <p className="cadastro-campo-valor">{paciente.nomeCompleto}</p>
          </div>

          <div className="cadastro-campo">
            <span className="cadastro-campo-label">Telefone</span>
            <p className="cadastro-campo-valor">{paciente.telefone || 'Não informado'}</p>
          </div>

          <div className="cadastro-campo">
            <span className="cadastro-campo-label">Data de nascimento</span>
            <p className="cadastro-campo-valor">
              {formatarData(paciente.dataNascimento)}
              {idade !== null && ` • ${idade} anos`}
            </p>
            {idade !== null && (
              <span className="cadastro-campo-nota">
                Idade calculada com base na data de nascimento.
              </span>
            )}
          </div>

          <div className="cadastro-campo">
            <span className="cadastro-campo-label">Observações cadastrais</span>
            <p className="cadastro-campo-valor observacoes-texto">
              {paciente.observacoes || 'Nenhuma observação informada.'}
            </p>
          </div>

          <div className="cadastro-divisor" />

          {/* Botões de Ação da Ficha: Editar e Excluir */}
          <div className="cadastro-acoes">
            <button 
              type="button" 
              className="btn-editar-ficha"
              onClick={() => onEditarCadastro && onEditarCadastro(paciente)}
            >
              <Edit3 size={16} />
              <span>Editar cadastro</span>
            </button>

            {/* Confirmação de exclusão em dois passos (idêntico ao ModalOpticas) */}
            {confirmandoExclusao ? (
              <div className="exclusao-confirmacao-box">
                <p className="exclusao-confirmacao-texto">
                  Tem certeza que deseja excluir o cadastro de <strong>{paciente.nomeCompleto}</strong>?
                </p>
                <div className="exclusao-confirmacao-botoes">
                  <button 
                    type="button" 
                    className="btn-confirm-delete"
                    onClick={handleExcluirPaciente}
                    disabled={excluindo}
                  >
                    {excluindo ? 'Excluindo...' : 'Sim, excluir'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel-delete"
                    onClick={() => setConfirmandoExclusao(false)}
                    disabled={excluindo}
                  >
                    Não
                  </button>
                </div>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn-excluir-ficha"
                onClick={handleExcluirPaciente}
                title="Excluir este paciente"
              >
                <Trash2 size={16} />
                <span>Excluir paciente</span>
              </button>
            )}
          </div>
        </aside>

        {/* COLUNA DIREITA: Histórico de Consultas com Linha do Tempo */}
        <section className="prontuario-card-historico">
          <div className="historico-header">
            <h3 className="historico-titulo">Histórico de consultas</h3>
            <span className="badge-total-consultas">
              {totalConsultas} {totalConsultas === 1 ? 'consulta' : 'consultas'}
            </span>
          </div>

          {carregandoAtendimentos ? (
            <div className="historico-vazio">
              <p>Carregando histórico...</p>
            </div>
          ) : totalConsultas === 0 ? (
            <div className="historico-vazio">
              <FileText size={48} className="icone-historico-vazio" />
              <p className="historico-vazio-titulo">Nenhuma consulta realizada</p>
              <p className="historico-vazio-subtitulo">
                Este paciente ainda não possui atendimentos registrados.
              </p>
              <button 
                type="button" 
                className="btn-primeira-consulta"
                onClick={() => onNovaConsulta && onNovaConsulta(paciente)}
              >
                <Plus size={16} />
                <span>Iniciar primeiro atendimento</span>
              </button>
            </div>
          ) : (
            <div className="timeline-consultas">
              {atendimentos.map((atendimento, index) => {
                const ehMaisRecente = index === 0;
                const anterior = atendimentos[index + 1] || null;

                return (
                  <div key={atendimento.id} className="timeline-item">
                    {/* Marcador da Linha do Tempo */}
                    <div className="timeline-marcador-col">
                      <div className={`timeline-marcador ${ehMaisRecente ? 'ativo' : ''}`}>
                        {ehMaisRecente ? <Check size={14} /> : <Clock size={13} />}
                      </div>
                      {index < atendimentos.length - 1 && <div className="timeline-linha" />}
                    </div>

                    {/* Conteúdo da Consulta */}
                    <div className="timeline-card-consulta">
                      
                      {/* Topo do Card da Consulta */}
                      <div className="consulta-card-topo">
                        <div>
                          <div className="consulta-data-grupo">
                            <h4 className="consulta-data-texto">
                              {formatarDataExtenso(atendimento.dataAtendimento)}
                            </h4>
                            {ehMaisRecente && (
                              <span className="badge-consulta-atual">Atual</span>
                            )}
                          </div>
                          <p className="consulta-subinfo">
                            {formatarHora(atendimento.dataAtendimento) && `${formatarHora(atendimento.dataAtendimento)} • `}
                            {ehMaisRecente ? 'Consulta de acompanhamento' : 'Consulta anterior'}
                          </p>
                        </div>

                        {/* Ótica de Origem */}
                        <div className="consulta-origem-badge">
                          <Store size={14} />
                          <span>Ótica de origem:</span>
                          <strong className="nome-optica">{atendimento.nomeOptica || 'Particular'}</strong>
                        </div>
                      </div>

                      {/* Queixa Principal */}
                      {atendimento.queixaPrincipal && (
                        <div className="consulta-secao">
                          <span className="consulta-secao-label">Queixa principal e sintomas</span>
                          <p className="consulta-queixa-texto">{atendimento.queixaPrincipal}</p>
                        </div>
                      )}

                      {/* Flag: Sem necessidade de nova correção visual */}
                      {atendimento.semNecessidadeNovaCorrecao ? (
                        <div className="aviso-sem-correcao">
                          <CheckCircle2 size={16} />
                          <span>Paciente avaliado sem necessidade de nova correção visual nesta consulta.</span>
                        </div>
                      ) : (
                        /* Tabela de Comparação Refrativa OD / OE */
                        <div className="consulta-refrativa-box">
                          <table className="tabela-comparacao">
                            <thead>
                              <tr>
                                <th className="th-comp-olho">Olho</th>
                                {anterior && (
                                  <th className="th-comp-col">
                                    Anterior • {formatarData(anterior.dataAtendimento)}
                                    <span className="th-comp-sub">Esférico / Cilíndrico × Eixo • Adição</span>
                                  </th>
                                )}
                                <th className="th-comp-col">
                                  {anterior ? 'Atual' : 'Prescrição'} • {formatarData(atendimento.dataAtendimento)}
                                  <span className="th-comp-sub">Esférico / Cilíndrico × Eixo • Adição</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Olho Direito */}
                              <tr>
                                <td className="td-comp-olho">OD</td>
                                {anterior && (
                                  <td className="td-comp-valores anterior">
                                    <div className="formula-refrativa">
                                      <span>
                                        {formatarGrau(anterior.olhoDireito?.esferico)} / {formatarGrau(anterior.olhoDireito?.cilindrico)} × {formatarGrau(anterior.olhoDireito?.eixo, true)}
                                      </span>
                                      {anterior.olhoDireito?.adicao && (
                                        <span className="adicao-destaque">
                                          Adição {formatarGrau(anterior.olhoDireito?.adicao)}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td className="td-comp-valores atual">
                                  <div className="formula-refrativa">
                                    <strong>
                                      {formatarGrau(atendimento.olhoDireito?.esferico)} / {formatarGrau(atendimento.olhoDireito?.cilindrico)} × {formatarGrau(atendimento.olhoDireito?.eixo, true)}
                                    </strong>
                                    {atendimento.olhoDireito?.adicao && (
                                      <span className="adicao-destaque">
                                        Adição {formatarGrau(atendimento.olhoDireito?.adicao)}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>

                              {/* Olho Esquerdo */}
                              <tr>
                                <td className="td-comp-olho">OE</td>
                                {anterior && (
                                  <td className="td-comp-valores anterior">
                                    <div className="formula-refrativa">
                                      <span>
                                        {formatarGrau(anterior.olhoEsquerdo?.esferico)} / {formatarGrau(anterior.olhoEsquerdo?.cilindrico)} × {formatarGrau(anterior.olhoEsquerdo?.eixo, true)}
                                      </span>
                                      {anterior.olhoEsquerdo?.adicao && (
                                        <span className="adicao-destaque">
                                          Adição {formatarGrau(anterior.olhoEsquerdo?.adicao)}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td className="td-comp-valores atual">
                                  <div className="formula-refrativa">
                                    <strong>
                                      {formatarGrau(atendimento.olhoEsquerdo?.esferico)} / {formatarGrau(atendimento.olhoEsquerdo?.cilindrico)} × {formatarGrau(atendimento.olhoEsquerdo?.eixo, true)}
                                    </strong>
                                    {atendimento.olhoEsquerdo?.adicao && (
                                      <span className="adicao-destaque">
                                        Adição {formatarGrau(atendimento.olhoEsquerdo?.adicao)}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Medições Complementares: DNP, DP, AV */}
                          <div className="consulta-medicoes-extras">
                            {atendimento.olhoDireito?.dnp && (
                              <span>DNP OD: <strong>{atendimento.olhoDireito.dnp} mm</strong></span>
                            )}
                            {atendimento.olhoEsquerdo?.dnp && (
                              <span>DNP OE: <strong>{atendimento.olhoEsquerdo.dnp} mm</strong></span>
                            )}
                            {atendimento.distanciaPupilar && (
                              <span>DP total: <strong>{atendimento.distanciaPupilar} mm</strong></span>
                            )}
                            {atendimento.olhoDireito?.avLonge && (
                              <span>AV: <strong>{atendimento.olhoDireito.avLonge} longe</strong> • <strong>{atendimento.olhoDireito.avPerto || 'J1'} perto</strong></span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Lentes e Tratamentos Indicados */}
                      {((atendimento.lentes && atendimento.lentes.length > 0) || 
                        (atendimento.tratamentos && atendimento.tratamentos.length > 0)) && (
                        <div className="consulta-tags-grupo">
                          {atendimento.lentes && atendimento.lentes.map((lente) => (
                            <span key={lente} className="tag-prescricao tag-lente">
                              <Check size={13} />
                              <span>{lente}</span>
                            </span>
                          ))}
                          {atendimento.tratamentos && atendimento.tratamentos.map((trat) => (
                            <span key={trat} className="tag-prescricao tag-tratamento">
                              <Check size={13} />
                              <span>{trat}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Retorno e Observações Clínicas */}
                      {(atendimento.dataSugeridaRetorno || atendimento.observacoesAtendimento) && (
                        <p className="consulta-retorno-obs">
                          {atendimento.dataSugeridaRetorno && (
                            <strong>Retorno sugerido em {formatarData(atendimento.dataSugeridaRetorno)}. </strong>
                          )}
                          {atendimento.observacoesAtendimento}
                        </p>
                      )}

                      {/* Botões de Ação da Consulta */}
                      <div className="consulta-acoes-rodape">
                        <button 
                          type="button" 
                          className="btn-acao-imprimir-receita"
                          onClick={() => onImprimirReceita && onImprimirReceita(atendimento, paciente)}
                        >
                          <Printer size={16} />
                          <span>Imprimir Receita</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default ProntuarioPacienteView;

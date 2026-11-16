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
  ShieldAlert
} from 'lucide-react';
import { pacienteService, atendimentoService } from '../services/api';
import './ProntuarioPacienteView.css';

function ProntuarioPacienteView({ 
  paciente, 
  onVoltar, 
  onEditarCadastro, 
  onNovaConsulta, 
  onPacienteExcluido 
}) {
  const [atendimentos, setAtendimentos] = useState([]);
  const [carregandoAtendimentos, setCarregandoAtendimentos] = useState(true);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: 'erro' | 'sucesso', texto: '' }

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
        onPacienteExcluido();
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
      const nasc = new Date(dataNasc);
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

      {/* Alerta de erro (ex: tentativa de excluir com consultas) */}
      {aviso && (
        <div className={`prontuario-alerta ${aviso.tipo}`}>
          {aviso.tipo === 'erro' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{aviso.texto}</span>
          <button type="button" className="btn-fechar-alerta" onClick={() => setAviso(null)}>
            ×
          </button>
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

        {/* COLUNA DIREITA: Histórico de Consultas */}
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
            <div className="historico-lista-placeholder">
              <p>Aqui renderizaremos as consultas em linha do tempo quando construirmos o módulo de Atendimento.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default ProntuarioPacienteView;

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { pacienteService, atendimentoService } from '../services/api';
import './AtendimentosView.css';

function AtendimentosView({ onIniciarAtendimento, onCadastrarNovoPaciente }) {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Carrega pacientes do banco para alimentar a busca instantânea
  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      setCarregando(true);
      const lista = await pacienteService.listar();
      setPacientes(lista || []);
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
    } finally {
      setCarregando(false);
    }
  };

  // Filtra os pacientes conforme digita nome ou telefone
  const pacientesFiltrados = React.useMemo(() => {
    if (!busca.trim()) return [];

    const termo = busca.trim().toLowerCase();
    const termoNumeros = termo.replace(/\D/g, '');

    return pacientes.filter((p) => {
      const nome = (p.nomeCompleto || '').toLowerCase();
      const tel = (p.telefone || '').replace(/\D/g, '');
      return nome.includes(termo) || (termoNumeros && tel.includes(termoNumeros));
    }).slice(0, 5); // Exibe os 5 primeiros mais relevantes
  }, [pacientes, busca]);

  // Iniciais para o avatar
  const obterIniciais = (nome) => {
    if (!nome) return 'P';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  return (
    <div className="atendimentos-selecao-container">
      {/* 1. Cabeçalho */}
      <div className="atendimentos-header">
        <div>
          <h1 className="atendimentos-titulo">Atendimentos Clínicos</h1>
          <p className="atendimentos-subtitulo">
            Selecione o paciente para registrar uma nova consulta optométrica ou consultar o histórico.
          </p>
        </div>
      </div>

      {/* 2. Card Principal de Busca para Iniciar Consulta */}
      <div className="card-seletor-paciente">
        <div className="seletor-instrucao">
          <span className="seletor-badge">Nova Consulta</span>
          <h2 className="seletor-titulo">Para quem é o atendimento de hoje?</h2>
          <p className="seletor-descricao">
            Busque o paciente cadastrado por nome ou telefone para abrir a ficha clínica.
          </p>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="seletor-input-wrapper">
          <Search size={20} className="seletor-busca-icone" />
          <input
            type="text"
            className="seletor-input"
            placeholder="Digite o nome ou telefone do paciente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoFocus
          />
        </div>

        {/* Resultados da busca enquanto digita */}
        {busca.trim() && (
          <div className="seletor-resultados-lista">
            {pacientesFiltrados.length === 0 ? (
              <div className="seletor-resultado-vazio">
                <AlertCircle size={20} className="icone-alerta" />
                <p className="resultado-vazio-titulo">
                  Nenhum paciente encontrado com "{busca}". Use a opção abaixo para cadastrar.
                </p>
              </div>
            ) : (
              pacientesFiltrados.map((paciente) => (
                <div key={paciente.id} className="paciente-resultado-item">
                  <div className="paciente-resultado-info">
                    <div className="paciente-resultado-avatar">
                      {obterIniciais(paciente.nomeCompleto)}
                    </div>
                    <div>
                      <h4 className="paciente-resultado-nome">{paciente.nomeCompleto}</h4>
                      <p className="paciente-resultado-detalhe">
                        Prontuário: PAC-{String(paciente.id).padStart(5, '0')} • {paciente.telefone || 'Sem telefone'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-iniciar-consulta"
                    onClick={() => onIniciarAtendimento(paciente)}
                  >
                    <span>Iniciar consulta</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rodapé do Card com Atalho para Novo Cadastro */}
        <div className="seletor-rodape">
          <span className="seletor-rodape-texto">O paciente é novo ou ainda não tem cadastro?</span>
          <button 
            type="button" 
            className="btn-link-novo-paciente"
            onClick={onCadastrarNovoPaciente}
          >
            <UserPlus size={16} />
            <span>Cadastrar novo paciente</span>
          </button>
        </div>
      </div>

      {/* 3. Dica rápida de fluxo clínico */}
      <div className="atendimentos-guia-rapido">
        <div className="guia-item">
          <Users size={20} className="guia-icone" />
          <div>
            <h5>1. Identificação</h5>
            <p>Selecione o paciente e informe a ótica de origem (ou Particular).</p>
          </div>
        </div>

        <div className="guia-item">
          <FileText size={20} className="guia-icone" />
          <div>
            <h5>2. Exame Refrativo</h5>
            <p>Preencha graus de OD e OE (Esférico, Cilíndrico, Eixo, DNP e Adição).</p>
          </div>
        </div>

        <div className="guia-item">
          <Calendar size={20} className="guia-icone" />
          <div>
            <h5>3. Prescrição e Receita</h5>
            <p>Indique lentes, tratamentos recomendados e imprima a receita na hora.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AtendimentosView;

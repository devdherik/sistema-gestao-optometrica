import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Loader2, 
  Inbox, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { pacienteService } from '../services/api';
import './PacientesView.css';

function PacientesView({ onNovoPaciente, onEditarPaciente, onVerProntuario, recarregarGatilho = 0 }) {
  // Dados do backend
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Filtros da barra
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome-asc');

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Carregar lista de pacientes da API
  const carregarDados = async (termoBusca = '') => {
    try {
      setCarregando(true);
      setErro(null);

      const listaPacientes = await pacienteService.listar(termoBusca);
      setPacientes(listaPacientes || []);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar dados do backend.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [recarregarGatilho]);

  // Disparo manual da busca ao clicar na lupa ou pressionar Enter
  const handlePesquisar = (e) => {
    if (e) e.preventDefault();
    setPaginaAtual(1);
    carregarDados(busca.trim());
  };

  // Filtragem e ordenação local combinada
  const pacientesFiltrados = React.useMemo(() => {
    let resultado = [...pacientes];

    // Se o backend filtrou por nome, ainda podemos filtrar por telefone localmente se digitado
    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      resultado = resultado.filter((p) => {
        const nome = (p.nomeCompleto || '').toLowerCase();
        const tel = (p.telefone || '').replace(/\D/g, '');
        const termoNumerico = termo.replace(/\D/g, '');
        return nome.includes(termo) || (termoNumerico && tel.includes(termoNumerico));
      });
    }

    // Ordenação
    resultado.sort((a, b) => {
      if (ordenacao === 'nome-asc') {
        return (a.nomeCompleto || '').localeCompare(b.nomeCompleto || '');
      }
      if (ordenacao === 'nome-desc') {
        return (b.nomeCompleto || '').localeCompare(a.nomeCompleto || '');
      }
      if (ordenacao === 'mais-recentes') {
        return b.id - a.id;
      }
      return b.id - a.id;
    });

    return resultado;
  }, [pacientes, busca, ordenacao]);

  // Cálculos de paginação
  const totalRegistros = pacientesFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / itensPorPagina));
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const pacientesPaginados = pacientesFiltrados.slice(indiceInicio, indiceInicio + itensPorPagina);

  // Formatação de data (DD/MM/AAAA)
  const formatarData = (dataStr) => {
    if (!dataStr) return 'Não realizada';
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

  return (
    <div className="pacientes-container">
      {/* 1. Cabeçalho com Título, Subtítulo e Botão de Ação */}
      <div className="pacientes-header">
        <div>
          <h1 className="pacientes-titulo">Pacientes</h1>
          <p className="pacientes-subtitulo">
            Encontre e gerencie os pacientes cadastrados.
          </p>
        </div>

        <button 
          type="button" 
          className="btn-novo-paciente"
          onClick={onNovoPaciente}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Novo paciente</span>
        </button>
      </div>

      {/* 3. Barra de Busca e Filtros (Enxuta) */}
      <form onSubmit={handlePesquisar} className="pacientes-filtros-bar">
        {/* Campo de Busca com Botão Lupa Integrado */}
        <div className="busca-input-wrapper">
          <input
            type="text"
            className="busca-input"
            placeholder="Buscar paciente por nome ou telefone"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn-busca-lupa"
            title="Pesquisar"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Filtro: Ordenação */}
        <div className="filtro-select-wrapper">
          <select 
            className="filtro-select"
            value={ordenacao}
            onChange={(e) => {
              setOrdenacao(e.target.value);
              setPaginaAtual(1);
            }}
          >
            <option value="nome-asc">Nome (A - Z)</option>
            <option value="nome-desc">Nome (Z - A)</option>
            <option value="mais-recentes">Mais recentes</option>
          </select>
          <ChevronDown size={16} className="select-icone" />
        </div>
      </form>

      {/* 4. Card da Tabela de Pacientes */}
      <div className="pacientes-tabela-card">
        {/* Cabeçalho Interno do Card */}
        <div className="tabela-card-header">
          <div>
            <h2 className="tabela-card-titulo">Todos os pacientes</h2>
            <p className="tabela-card-subtitulo">
              {totalRegistros} {totalRegistros === 1 ? 'paciente cadastrado' : 'pacientes cadastrados'}
            </p>
          </div>
        </div>

        {/* Estados de Carregamento e Erro */}
        {carregando ? (
          <div className="tabela-feedback">
            <Loader2 size={32} className="spinner" />
            <p>Carregando pacientes...</p>
          </div>
        ) : erro ? (
          <div className="tabela-feedback erro">
            <p>{erro}</p>
            <button type="button" className="btn-tentar-novamente" onClick={() => carregarDados()}>
              Tentar novamente
            </button>
          </div>
        ) : totalRegistros === 0 ? (
          <div className="tabela-feedback vazio">
            <Inbox size={40} className="icone-vazio" />
            <p className="vazio-titulo">Nenhum paciente encontrado</p>
            <p className="vazio-subtitulo">
              {busca ? 'Tente pesquisar com outros termos.' : 'Clique em "Novo paciente" para iniciar.'}
            </p>
          </div>
        ) : (
          /* Tabela com os dados */
          <div className="tabela-wrapper">
            <table className="tabela-pacientes">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Contato</th>
                  <th>Última consulta</th>
                  <th className="th-acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientesPaginados.map((paciente) => (
                  <tr key={paciente.id}>
                    {/* Paciente */}
                    <td className="td-paciente-nome">
                      {paciente.nomeCompleto}
                    </td>

                    {/* Contato */}
                    <td className="td-contato">
                      {paciente.telefone || 'Não informado'}
                    </td>

                    {/* Data da última consulta */}
                    <td className="td-data">
                      {formatarData(paciente.ultimaConsulta)}
                    </td>

                    {/* Ações */}
                    <td className="td-acoes">
                      <button 
                        type="button" 
                        className="btn-acao-prontuario"
                        onClick={() => onVerProntuario && onVerProntuario(paciente)}
                      >
                        Ver prontuário
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Rodapé com Paginação */}
        {!carregando && totalRegistros > 0 && (
          <div className="tabela-card-footer">
            <span className="paginacao-info">
              Mostrando {indiceInicio + 1}–{Math.min(indiceInicio + itensPorPagina, totalRegistros)} de {totalRegistros} pacientes
            </span>

            <div className="paginacao-controles">
              <button 
                type="button" 
                className="btn-paginacao"
                onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPagina) => (
                <button
                  key={numPagina}
                  type="button"
                  className={`btn-paginacao-numero ${paginaAtual === numPagina ? 'ativo' : ''}`}
                  onClick={() => setPaginaAtual(numPagina)}
                >
                  {numPagina}
                </button>
              ))}

              <button 
                type="button" 
                className="btn-paginacao"
                onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
              >
                <span>Próxima</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Aviso de Confidencialidade */}
      <div className="pacientes-aviso-seguranca">
        <ShieldCheck size={18} className="icone-escudo" />
        <span>Dados de pacientes são confidenciais. Acesse somente os registros sob seus cuidados.</span>
      </div>
    </div>
  );
}

export default PacientesView;

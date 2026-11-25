import { useState } from 'react';
import Navbar from './components/Navbar';
import ModalOpticas from './components/ModalOpticas';
import ModalNovoPaciente from './components/ModalNovoPaciente';
import ModalReceitaOptometrica from './components/ModalReceitaOptometrica';
import { LayoutGrid, Users, ClipboardList } from 'lucide-react';
import InicioView from './components/InicioView';
import PacientesView from './components/PacientesView';
import ProntuarioPacienteView from './components/ProntuarioPacienteView';
import AtendimentosView from './components/AtendimentosView';
import FichaAtendimentoView from './components/FichaAtendimentoView';

function App() {
  // Estado que guarda qual aba está ativa no momento ('inicio', 'pacientes', 'atendimentos')
  const [abaAtiva, setAbaAtiva] = useState('inicio');
  const [modalOpticasAberto, setModalOpticasAberto] = useState(false);
  const [modalPacienteAberto, setModalPacienteAberto] = useState(false);
  const [pacienteEmEdicao, setPacienteEmEdicao] = useState(null);
  const [pacienteSelecionadoProntuario, setPacienteSelecionadoProntuario] = useState(null);
  const [notificacaoProntuario, setNotificacaoProntuario] = useState(null);
  const [notificacaoPacientesLista, setNotificacaoPacientesLista] = useState(null);
  const [pacienteEmAtendimento, setPacienteEmAtendimento] = useState(null);
  const [recarregarPacientesGatilho, setRecarregarPacientesGatilho] = useState(0);

  // Estado para impressão da receita médica
  const [receitaParaImprimir, setReceitaParaImprimir] = useState(null); // { atendimento, paciente }

  const handleAbrirNovoPaciente = () => {
    setPacienteEmEdicao(null);
    setModalPacienteAberto(true);
  };

  const handleEditarPaciente = (paciente) => {
    setPacienteEmEdicao(paciente);
    setModalPacienteAberto(true);
  };

  const handlePacienteSalvo = (pacienteAtualizado) => {
    // Recarrega lista de pacientes
    setRecarregarPacientesGatilho((antigo) => antigo + 1);

    // Se o prontuário aberto pertence ao paciente salvo, atualiza seus dados
    if (
      pacienteAtualizado &&
      pacienteSelecionadoProntuario &&
      pacienteAtualizado.id === pacienteSelecionadoProntuario.id
    ) {
      setPacienteSelecionadoProntuario((pacienteAtual) => ({
        ...pacienteAtual,
        ...pacienteAtualizado,
      }));
    }
  };

  const handlePacienteExcluido = (paciente) => {
    setPacienteSelecionadoProntuario(null);
    setRecarregarPacientesGatilho((antigo) => antigo + 1);
    setNotificacaoPacientesLista({
      tipo: 'sucesso',
      texto: paciente?.nomeCompleto 
        ? `Paciente "${paciente.nomeCompleto}" excluído com sucesso!`
        : 'Paciente excluído com sucesso!'
    });
  };

  const handleTrocarAba = (novaAba) => {
    // Ao trocar de aba, se sair de pacientes, limpa a seleção de prontuário
    if (novaAba !== 'pacientes') {
      setPacienteSelecionadoProntuario(null);
    }
    // Ao trocar de aba, se sair de atendimentos, limpa paciente em atendimento
    if (novaAba !== 'atendimentos') {
      setPacienteEmAtendimento(null);
    }
    setAbaAtiva(novaAba);
  };

  // Disparado ao clicar em "Nova Consulta" dentro do Prontuário ou na busca de Atendimentos
  const handleIniciarAtendimento = (paciente) => {
    setPacienteEmAtendimento(paciente);
    setAbaAtiva('atendimentos');
  };

  const handleAtendimentoSalvo = (paciente, mensagem) => {
    // Após salvar, leva direto para o Prontuário do paciente com a notificação padronizada
    setPacienteEmAtendimento(null);
    setPacienteSelecionadoProntuario(paciente);
    setAbaAtiva('pacientes');
    setNotificacaoProntuario({
      tipo: 'sucesso',
      texto: mensagem || 'Consulta optométrica registrada com sucesso!'
    });
  };

  return (
    <div>
      <Navbar 
        abaAtiva={abaAtiva} 
        onTrocarAba={handleTrocarAba}
        onAbrirModalOpticas={() => setModalOpticasAberto(true)} 
      />

      {/* Modal global de Óticas */}
      <ModalOpticas 
        aberto={modalOpticasAberto}
        onFechar={() => setModalOpticasAberto(false)}
      />

      {/* Modal global de Pacientes (Criação e Edição) */}
      <ModalNovoPaciente
        aberto={modalPacienteAberto}
        onFechar={() => {
          setModalPacienteAberto(false);
          setPacienteEmEdicao(null);
        }}
        pacienteParaEditar={pacienteEmEdicao}
        onPacienteSalvo={handlePacienteSalvo}
      />

      {/* Modal de Impressão / Pré-visualização da Receita */}
      <ModalReceitaOptometrica 
        aberto={Boolean(receitaParaImprimir)}
        onFechar={() => setReceitaParaImprimir(null)}
        atendimento={receitaParaImprimir?.atendimento}
        paciente={receitaParaImprimir?.paciente}
      />

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {abaAtiva === 'inicio' && (
          <InicioView 
            onNovoAtendimento={() => {
              setPacienteEmAtendimento(null);
              setAbaAtiva('atendimentos');
            }}
            onCadastrarPaciente={handleAbrirNovoPaciente}
            onVerProntuarioPorId={(paciente) => {
              setPacienteSelecionadoProntuario(paciente);
              setAbaAtiva('pacientes');
            }}
          />
        )}

        {/* ABA: PACIENTES */}
        {abaAtiva === 'pacientes' && (
          pacienteSelecionadoProntuario ? (
            <ProntuarioPacienteView 
              paciente={pacienteSelecionadoProntuario}
              onVoltar={() => setPacienteSelecionadoProntuario(null)}
              onEditarCadastro={handleEditarPaciente}
              onNovaConsulta={handleIniciarAtendimento}
              onPacienteExcluido={handlePacienteExcluido}
              notificacaoExterna={notificacaoProntuario}
              onLimparNotificacaoExterna={() => setNotificacaoProntuario(null)}
              onImprimirReceita={(atendimento, paciente) => setReceitaParaImprimir({ atendimento, paciente })}
            />
          ) : (
            <PacientesView 
              onNovoPaciente={handleAbrirNovoPaciente}
              onVerProntuario={(paciente) => setPacienteSelecionadoProntuario(paciente)}
              recarregarGatilho={recarregarPacientesGatilho}
              notificacaoExterna={notificacaoPacientesLista}
              onLimparNotificacaoExterna={() => setNotificacaoPacientesLista(null)}
            />
          )
        )}

        {/* ABA: ATENDIMENTOS */}
        {abaAtiva === 'atendimentos' && (
          pacienteEmAtendimento ? (
            <FichaAtendimentoView 
              paciente={pacienteEmAtendimento}
              onVoltar={() => setPacienteEmAtendimento(null)}
              onTrocarPaciente={() => setPacienteEmAtendimento(null)}
              onAtendimentoSalvo={handleAtendimentoSalvo}
            />
          ) : (
            <AtendimentosView 
              onIniciarAtendimento={handleIniciarAtendimento}
              onCadastrarNovoPaciente={handleAbrirNovoPaciente}
            />
          )
        )}
      </main>
    </div> 
  );
}

export default App;

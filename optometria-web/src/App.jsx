import { useState } from 'react';
import Navbar from './components/Navbar';
import ModalOpticas from './components/ModalOpticas';
import ModalNovoPaciente from './components/ModalNovoPaciente';
import { LayoutGrid, Users, ClipboardList } from 'lucide-react';
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
  const [pacienteEmAtendimento, setPacienteEmAtendimento] = useState(null);
  const [recarregarPacientesGatilho, setRecarregarPacientesGatilho] = useState(0);

  const handleAbrirNovoPaciente = () => {
    setPacienteEmEdicao(null);
    setModalPacienteAberto(true);
  };

  const handleEditarPaciente = (paciente) => {
    setPacienteEmEdicao(paciente);
    setModalPacienteAberto(true);
  };

  const handlePacienteSalvo = () => {
    // Recarrega lista de pacientes
    setRecarregarPacientesGatilho((antigo) => antigo + 1);
    // Se estava visualizando o prontuário daquele paciente, atualiza seus dados
    if (pacienteEmEdicao && pacienteSelecionadoProntuario && pacienteEmEdicao.id === pacienteSelecionadoProntuario.id) {
      setPacienteSelecionadoProntuario(pacienteEmEdicao);
    }
  };

  const handlePacienteExcluido = () => {
    setPacienteSelecionadoProntuario(null);
    setRecarregarPacientesGatilho((antigo) => antigo + 1);
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

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {abaAtiva === 'inicio' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutGrid size={24} />
              <h2>Painel de Início</h2>
            </div>
            <p>Visão geral e atalhos rápidos do consultório.</p>
          </div>
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
            />
          ) : (
            <PacientesView 
              onNovoPaciente={handleAbrirNovoPaciente}
              onVerProntuario={(paciente) => setPacienteSelecionadoProntuario(paciente)}
              recarregarGatilho={recarregarPacientesGatilho}
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

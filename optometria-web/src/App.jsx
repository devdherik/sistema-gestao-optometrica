import { useState } from 'react';
import Navbar from './components/Navbar';
import ModalOpticas from './components/ModalOpticas';
import ModalNovoPaciente from './components/ModalNovoPaciente';
import { LayoutGrid, Users, ClipboardList } from 'lucide-react';
import PacientesView from './components/PacientesView';
import ProntuarioPacienteView from './components/ProntuarioPacienteView';

function App() {
  // Estado que guarda qual aba está ativa no momento ('inicio', 'pacientes', 'atendimentos')
  const [abaAtiva, setAbaAtiva] = useState('inicio');
  const [modalOpticasAberto, setModalOpticasAberto] = useState(false);
  const [modalPacienteAberto, setModalPacienteAberto] = useState(false);
  const [pacienteEmEdicao, setPacienteEmEdicao] = useState(null);
  const [pacienteSelecionadoProntuario, setPacienteSelecionadoProntuario] = useState(null);
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
    setAbaAtiva(novaAba);
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

        {abaAtiva === 'pacientes' && (
          pacienteSelecionadoProntuario ? (
            <ProntuarioPacienteView 
              paciente={pacienteSelecionadoProntuario}
              onVoltar={() => setPacienteSelecionadoProntuario(null)}
              onEditarCadastro={handleEditarPaciente}
              onNovaConsulta={(p) => {
                console.log('Iniciar nova consulta para:', p);
                setAbaAtiva('atendimentos');
              }}
              onPacienteExcluido={handlePacienteExcluido}
            />
          ) : (
            <PacientesView 
              onNovoPaciente={handleAbrirNovoPaciente}
              onVerProntuario={(paciente) => setPacienteSelecionadoProntuario(paciente)}
              recarregarGatilho={recarregarPacientesGatilho}
            />
          )
        )}

        {abaAtiva === 'atendimentos' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={24} />
              <h2>Atendimentos e Consultas</h2>
            </div>
            <p>Histórico clínico, tabela refrativa OD/OE e emissão de receitas.</p>
          </div>
        )}
      </main>
    </div> 
  );
}

export default App;

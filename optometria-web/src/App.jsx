import {useState} from 'react';
import Navbar from './components/Navbar';
import ModalOpticas from './components/ModalOpticas';
import { LayoutGrid, Users, ClipboardList } from 'lucide-react';

function App(){
  // Estado que guarda qual aba está ativa no momento
  const [abaAtiva, setAbaAtiva] = useState('inicio');
  const [modalOpticasAberto, setModalOpticasAberto] = useState(false);

  return (
    <div>
      <Navbar 
        abaAtiva={abaAtiva} 
        onTrocarAba={(novaAba) => setAbaAtiva(novaAba)}
        onAbrirModalOpticas={() => setModalOpticasAberto(true)} 
      />

      {/* Modal global de Óticas */}
      <ModalOpticas 
        aberto={modalOpticasAberto}
        onFechar={() => setModalOpticasAberto(false)}
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={24} />
              <h2>Pacientes</h2>
            </div>
            <p>Aqui vamos construir o CRUD completo de pacientes.</p>
          </div>
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
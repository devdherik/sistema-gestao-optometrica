import {useState} from 'react';
import Navbar from './components/Navbar';
import ModalOpticas from './components/ModalOpticas';

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

    </div> 
  );
}

export default App;
import './Navbar.css';
import react from "react";

import { 
  ScanEye, 
  Store, 
  ChevronDown, 
  LayoutGrid, 
  Users, 
  ClipboardList,
  CalendarDays
} from 'lucide-react';

function Navbar({ abaAtiva = 'inicio', onTrocarAba, onAbrirModalOpticas }) {
  // Gera a data atual no formato brasileiro: "Quinta-feira, 12 de novembro de 2026"
  const dataHoje = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Formata com a primeira letra maiúscula
  const dataFormatada = dataHoje.charAt(0).toUpperCase() + dataHoje.slice(1);

  // Lista de abas da faixa inferior
  const abas = [
    { id: 'inicio', label: 'Início', Icon: LayoutGrid },
    { id: 'pacientes', label: 'Pacientes', Icon: Users },
    { id: 'atendimentos', label: 'Atendimentos', Icon: ClipboardList }
  ];

  return (
    <header className="navbar-container">
      {/* 1. FAIXA SUPERIOR (AZUL ESCURO) */}
      <div className="navbar-top">
        {/* Marca / Logo */}
        <div className="navbar-brand">
          <div className="brand-icon-box">
            <ScanEye size={26} strokeWidth={2} />
          </div>
          <div className="brand-text">
            <span className="brand-name">OptoSystem</span>
            <span className="brand-subtitle">GESTÃO OPTOMÉTRICA</span>
          </div>
        </div>
        {/* Lado Direito: Óticas + Perfil */}
        <div className="navbar-user-section">
          {/* Acesso rápido às Óticas */}
          <button 
            type="button" 
            className="btn-opticas"
            onClick={onAbrirModalOpticas}
          >
            <Store size={18} />
            <span>Óticas Parceiras</span>
          </button>
          {/* Divisória Vertical */}
          <div className="divider-vertical" />
          {/* Perfil do Usuário */}
          <div className="user-profile">
            <div className="avatar">PL</div>
            <div className="user-info">
              <span className="user-name">Prazeres Lima</span>
              <span className="user-role">Optometrista</span>
            </div>
            <ChevronDown size={16} className="chevron-icon" />
          </div>
        </div>
      </div>
      {/* 2. FAIXA INFERIOR (BRANCA COM ABAS E DATA) */}
      <div className="navbar-bottom">
        <nav className="nav-tabs">
          {abas.map(({ id, label, Icon }) => {
            const ativa = abaAtiva === id;
            return (
              <button
                key={id}
                type="button"
                className={`tab-btn ${ativa ? 'tab-btn-active' : ''}`}
                onClick={() => onTrocarAba && onTrocarAba(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
        {/* Data Dinâmica com Badge Padronizado */}
        <div className="navbar-date-badge">
          <CalendarDays size={14} />
          <span>{dataFormatada}</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
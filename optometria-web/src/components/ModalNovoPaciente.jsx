import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { pacienteService } from '../services/api';
import './ModalNovoPaciente.css';

function ModalNovoPaciente({ aberto, onFechar, onPacienteSalvo, pacienteParaEditar = null }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: 'erro' | 'sucesso', texto: '' }

  // Quando o modal abre ou muda o paciente selecionado para edição
  useEffect(() => {
    if (aberto) {
      setAviso(null);
      if (pacienteParaEditar) {
        setNomeCompleto(pacienteParaEditar.nomeCompleto || '');
        setDataNascimento(pacienteParaEditar.dataNascimento || '');
        setTelefone(pacienteParaEditar.telefone || '');
        setObservacoes(pacienteParaEditar.observacoes || '');
      } else {
        limparFormulario();
      }
    }
  }, [aberto, pacienteParaEditar]);

  const limparFormulario = () => {
    setNomeCompleto('');
    setDataNascimento('');
    setTelefone('');
    setObservacoes('');
    setAviso(null);
  };

  // Formatação amigável de telefone enquanto digita: (99) 99999-9999
  const handleTelefoneChange = (e) => {
    let valor = e.target.value.replace(/\D/g, ''); // apenas números
    if (valor.length > 11) valor = valor.slice(0, 11);

    if (valor.length > 6) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else if (valor.length > 0) {
      valor = `(${valor}`;
    }
    setTelefone(valor);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setAviso(null);

    // Validações básicas de tela
    if (!nomeCompleto.trim()) {
      setAviso({ tipo: 'erro', texto: 'O nome completo do paciente é obrigatório.' });
      return;
    }

    if (!dataNascimento) {
      setAviso({ tipo: 'erro', texto: 'A data de nascimento é obrigatória.' });
      return;
    }

    if (!telefone.trim()) {
      setAviso({ tipo: 'erro', texto: 'O telefone / WhatsApp é obrigatório.' });
      return;
    }

    setSalvando(true);

    const dadosPaciente = {
      nomeCompleto: nomeCompleto.trim(),
      dataNascimento: dataNascimento, // Formato YYYY-MM-DD
      telefone: telefone.trim(),
      observacoes: observacoes.trim() || null,
    };

    try {
      let pacienteSalvo;

      if (pacienteParaEditar && pacienteParaEditar.id) {
        pacienteSalvo = await pacienteService.atualizar(
          pacienteParaEditar.id,
          dadosPaciente
        );

        setAviso({
          tipo: 'sucesso',
          texto: 'Paciente atualizado com sucesso!',
        });
      } else {
        pacienteSalvo = await pacienteService.criar(dadosPaciente);

        setAviso({
          tipo: 'sucesso',
          texto: 'Paciente cadastrado com sucesso!',
        });
            
      }

      // Envia ao componente pai o paciente retornado pela API
      if (onPacienteSalvo) {
        onPacienteSalvo(pacienteSalvo);
      }

      setTimeout(() => {
        onFechar();
        limparFormulario();
      }, 700);
    } catch (err) {
      setAviso({
        tipo: 'erro',
        texto: err.message || 'Erro ao salvar paciente. Verifique se o backend está em execução.',
      });
    } finally {
      setSalvando(false);
    }
  };

  if (!aberto) return null;

  return (
    // Não fecha mais ao clicar no overlay de fundo
    <div className="modal-paciente-overlay">
      <div className="modal-paciente-container">
        {/* Cabeçalho do Modal */}
        <div className="modal-paciente-header">
          <div>
            <h2 className="modal-paciente-titulo">
              {pacienteParaEditar ? 'Editar paciente' : 'Novo paciente'}
            </h2>
            <p className="modal-paciente-subtitulo">
              Preencha os dados para {pacienteParaEditar ? 'atualizar' : 'criar'} o cadastro do paciente.
            </p>
          </div>
          <button 
            type="button" 
            className="btn-close-modal" 
            onClick={onFechar}
            title="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Feedback de erro ou sucesso padronizado */}
        {aviso && (
          <div style={{ padding: '16px 32px 0 32px' }}>
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

        {/* Formulário */}
        <form onSubmit={handleSalvar} className="modal-paciente-form">
          <div className="modal-paciente-body">
            
            {/* Seção 1: Dados pessoais */}
            <div className="form-secao-header">
              <span className="form-secao-titulo">Dados pessoais</span>
              <span className="form-secao-obrigatorio">* Campos obrigatórios</span>
            </div>

            <div className="form-grupo">
              <label className="form-label" htmlFor="nomeCompleto">
                Nome completo *
              </label>
              <input
                id="nomeCompleto"
                type="text"
                className="form-input"
                placeholder="Digite o nome completo"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                autoFocus
                disabled={salvando}
              />
            </div>

            <div className="form-grupo">
              <label className="form-label" htmlFor="dataNascimento">
                Data de nascimento *
              </label>
              <input
                id="dataNascimento"
                type="date"
                className="form-input"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                disabled={salvando}
              />
            </div>

            {/* Seção 2: Contato e origem */}
            <div className="form-secao-header form-secao-espacamento">
              <span className="form-secao-titulo">Contato</span>
            </div>

            <div className="form-grupo">
              <label className="form-label" htmlFor="telefone">
                Telefone / WhatsApp *
              </label>
              <input
                id="telefone"
                type="text"
                className="form-input"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={handleTelefoneChange}
                disabled={salvando}
              />
            </div>

            <div className="form-grupo">
              <label className="form-label" htmlFor="observacoes">
                Observações
              </label>
              <textarea
                id="observacoes"
                className="form-textarea"
                rows={4}
                placeholder="Informações adicionais, histórico familiar ou restrições..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                disabled={salvando}
              />
            </div>
          </div>

          {/* Rodapé do Modal */}
          <div className="modal-paciente-footer">
            <span className="modal-paciente-footer-hint">
              Confira os dados antes de salvar.
            </span>
            <div className="modal-paciente-footer-acoes">
              <button 
                type="button" 
                className="btn-modal-cancelar" 
                onClick={onFechar}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-modal-salvar"
                disabled={salvando}
              >
                {salvando 
                  ? 'Salvando...' 
                  : (pacienteParaEditar ? 'Atualizar paciente' : 'Cadastrar paciente')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNovoPaciente;

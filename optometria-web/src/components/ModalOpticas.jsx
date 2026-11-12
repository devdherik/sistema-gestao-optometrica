import React, { useState, useEffect } from 'react';
import { 
  Store, 
  X, 
  Search, 
  Edit3, 
  Plus,
  Phone,
  MapPin
} from 'lucide-react';
import { opticaService } from '../services/api';
import './ModalOpticas.css';

function ModalOpticas({ aberto, onFechar }) {
  // Lista de óticas vindas da API
  const [opticas, setOpticas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState('');

  // Guarda o ID da ótica sendo editada (null = cadastrando nova)
  const [idEditando, setIdEditando] = useState(null);


  // Estado do formulário de nova ótica
  const [form, setForm] = useState({
    nome: '',
    contato: '',
    endereco: ''
  });

  // Carregar óticas da API ao abrir o modal
  useEffect(() => {
    if (aberto) {
      carregarOpticas();
    }
  }, [aberto]);

  async function carregarOpticas() {
    setCarregando(true);
    try {
      const dados = await opticaService.listar();
      setOpticas(dados || []);
    } catch (erro) {
      console.error('Erro ao buscar óticas:', erro);
    } finally {
      setCarregando(false);
    }
  }

  // Manipula as mudanças nos inputs do formulário
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

    function iniciarEdicao(optica) {
        setIdEditando(optica.id);
        setForm({
            nome: optica.nome || '',
            contato: optica.contato || '',
            endereco: optica.endereco || ''
        });
    }

    function cancelarEdicao() {
        setIdEditando(null);
        setForm({ nome: '', contato: '', endereco: '' });
    }

  // Submeter o cadastro para a API .NET
  async function handleSalvar(e) {
    e.preventDefault();
    if (!form.nome) {
      alert('O nome da ótica é obrigatório!');
      return;
    }

    try {
      // Formata os dados para o DTO esperado pelo backend
      const dadosEnvio = {
        nome: form.nome,
        contato: form.contato,
        endereco: form.endereco
      };

        if (idEditando) {
            // Se tem ID, atualiza (PUT)
            await opticaService.atualizar(idEditando, dadosEnvio);
            } else {
            // Se não tem ID, cria nova (POST)
            await opticaService.criar(dadosEnvio);
        }
        cancelarEdicao();
        await carregarOpticas();

      
    } catch (erro) {
      alert(`Erro ao cadastrar ótica: ${erro.message}`);
    }
  }

  // Filtra as óticas na visualização conforme o que o usuário digita na busca
  const opticasFiltradas = opticas.filter(optica => {
    const termo = busca.toLowerCase();
    const nome = (optica.nome || '').toLowerCase();
    const contato = (optica.contato || '').toLowerCase();
    return nome.includes(termo) || contato.includes(termo);
  });

  // Se a prop "aberto" for false, o React não renderiza nada
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      {/* O stopPropagation impede que clicar dentro do modal feche ele */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* CABEÇALHO */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Store size={22} />
            </div>
            <div>
              <h2>Óticas Parceiras</h2>
              <p>Gerencie as origens dos seus atendimentos.</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onFechar}>
            <X size={20} />
          </button>
        </div>

        {/* CORPO EM DUAS COLUNAS */}
        <div className="modal-body">
          
          {/* COLUNA 1: CADASTRO / EDIÇÃO */}
          <div className="modal-col form-col">
            <h3>{idEditando ? 'Editar ótica' : 'Cadastrar nova ótica'}</h3>
            <p className="col-subtitle">
              {idEditando ? 'Atualize os dados de contato e endereço.' : 'Dados para contato e encaminhamento.'}
            </p>

            <form onSubmit={handleSalvar} className="optica-form">
              <div className="form-group">
                <label>Nome da ótica *</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex: Ótica Nova Visão"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contato / Telefone *</label>
                <input
                  type="text"
                  name="contato"
                  value={form.contato}
                  onChange={handleChange}
                  placeholder="(11) 3333-4510 ou (11) 99999-9999"
                  required
                />
              </div>

              <div className="form-group">
                <label>Endereço *</label>
                <input
                  type="text"
                  name="endereco"
                  value={form.endereco}
                  onChange={handleChange}
                  placeholder="Rua dos Cedros, 210 • Centro • São Paulo/SP"
                  required
                />
              </div>

              <span className="required-note">* Campos obrigatórios</span>

              <div className="form-buttons-row">
                <button type="submit" className="btn-submit-optica">
                  {idEditando ? (
                    <span>Salvar alterações</span>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Cadastrar ótica</span>
                    </>
                  )}
                </button>

                {idEditando && (
                  <button 
                    type="button" 
                    className="btn-cancelar-edicao"
                    onClick={cancelarEdicao}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* DIVISÓRIA ENTRE COLUNAS */}
          <div className="modal-col-divider" />

          {/* COLUNA 2: LISTAGEM */}
          <div className="modal-col list-col">
            <div className="list-col-header">
              <h3>Óticas ativas</h3>
              <span className="badge-count">{opticas.length} parceiras</span>
            </div>

            {/* BARRA DE BUSCA */}
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nome ou contato"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {/* LISTAGEM DE CARDS */}
            <div className="cards-scroll-area">
              {carregando ? (
                <p className="loading-text">Carregando parceiras...</p>
              ) : opticasFiltradas.length === 0 ? (
                <p className="empty-text">Nenhuma ótica parceira encontrada.</p>
              ) : (
                opticasFiltradas.map((optica) => {
                  const estaSendoEditada = idEditando === optica.id;

                  return (
                    <div 
                      key={optica.id} 
                      className={`optica-card ${estaSendoEditada ? 'optica-card-editing' : ''}`}
                    >
                      <div className="card-top">
                        <div className="card-name-group">
                          <Store size={18} className="card-store-icon" />
                          <strong>{optica.nome}</strong>
                        </div>
                        {estaSendoEditada ? (
                          <span className="badge-status badge-editing">Em edição</span>
                        ) : (
                          <span className="badge-status">Ativa</span>
                        )}
                      </div>

                      <div className="card-info">
                        {optica.contato && (
                          <div className="card-info-row">
                            <Phone size={13} className="info-icon" />
                            <span>{optica.contato}</span>
                          </div>
                        )}
                        {optica.endereco && (
                          <div className="card-info-row">
                            <MapPin size={13} className="info-icon" />
                            <span className="card-address">{optica.endereco}</span>
                          </div>
                        )}
                      </div>

                      <div className="card-actions">
                        {estaSendoEditada ? (
                          <span className="action-editing-notice">
                            <Edit3 size={14} />
                            <span>Editando neste modal</span>
                          </span>
                        ) : (
                          <>
                            <button 
                              type="button" 
                              className="action-link"
                              onClick={() => iniciarEdicao(optica)}
                            >
                              <Edit3 size={14} />
                              <span>Editar cadastro</span>
                            </button>
                            <button 
                              type="button" 
                              className="action-link action-link-muted"
                              onClick={() => alert('Em breve')}
                            >
                              <span>Desativar parceria</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="modal-footer">
          <span className="footer-note">Novas óticas ficam disponíveis no campo Ótica de Origem.</span>
          <button type="button" className="btn-concluir" onClick={onFechar}>
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalOpticas;
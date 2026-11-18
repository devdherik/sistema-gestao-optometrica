import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Store, 
  User, 
  RotateCcw,
  X
} from 'lucide-react';
import { opticaService, atendimentoService } from '../services/api';
import './FichaAtendimentoView.css';

// Opções de Lentes e Tratamentos mais comuns
const OPCOES_LENTES = [
  'Visão Simples',
  'Multifocal',
  'Bifocal',
  'Alto Índice',
  'Free Form',
  'Ocupacional'
];

const OPCOES_TRATAMENTOS = [
  'Antirreflexo',
  'Filtro Azul (Blue Cut)',
  'Fotocromático (Transitions)',
  'Incolor',
  'Proteção UV'
];

function FichaAtendimentoView({ paciente, onVoltar, onAtendimentoSalvo, onTrocarPaciente }) {
  // Lista de Óticas vindas da API
  const [opticas, setOpticas] = useState([]);
  const [carregandoOpticas, setCarregandoOpticas] = useState(false);

  // Estados do Atendimento (Bloco Esquerdo: Origem e Data)
  const [dataAtendimento, setDataAtendimento] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [opticaOrigemId, setOpticaOrigemId] = useState('');

  // Bloco Direito: Anamnese
  const [queixaPrincipal, setQueixaPrincipal] = useState('');

  // Bloco Direito: Refração OD (Olho Direito)
  const [od, setOd] = useState({
    esferico: '',
    cilindrico: '',
    eixo: '',
    avLonge: '20/20',
    avPerto: 'J1',
    dnp: '',
    adicao: ''
  });

  // Bloco Direito: Refração OE (Olho Esquerdo)
  const [oe, setOe] = useState({
    esferico: '',
    cilindrico: '',
    eixo: '',
    avLonge: '20/20',
    avPerto: 'J1',
    dnp: '',
    adicao: ''
  });

  // Medições gerais
  const [distanciaPupilar, setDistanciaPupilar] = useState('');
  const [semNecessidadeNovaCorrecao, setSemNecessidadeNovaCorrecao] = useState(false);

  // Conduta e Recomendações
  const [lentesSelecionadas, setLentesSelecionadas] = useState([]);
  const [tratamentosSelecionados, setTratamentosSelecionados] = useState([]);
  
  // Data sugerida para retorno: padrão 1 ano após a consulta
  const [dataSugeridaRetorno, setDataSugeridaRetorno] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  const [observacoesAtendimento, setObservacoesAtendimento] = useState('');

  // Status de salvamento e alertas
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    carregarOpticas();
  }, []);

  // Quando mudar a data do atendimento, atualiza a data sugerida de retorno para +1 ano
  const handleDataAtendimentoChange = (novaData) => {
    setDataAtendimento(novaData);
    if (novaData) {
      try {
        const d = new Date(novaData + 'T12:00:00');
        d.setFullYear(d.getFullYear() + 1);
        setDataSugeridaRetorno(d.toISOString().split('T')[0]);
      } catch {
        // mantém a data que estiver
      }
    }
  };

  const carregarOpticas = async () => {
    try {
      setCarregandoOpticas(true);
      const lista = await opticaService.listar();
      setOpticas(lista || []);
    } catch (err) {
      console.error('Erro ao carregar óticas:', err);
    } finally {
      setCarregandoOpticas(false);
    }
  };

  // Toggle para seleção múltipla de Lentes
  const toggleLente = (lente) => {
    setLentesSelecionadas((atuais) => 
      atuais.includes(lente) ? atuais.filter((l) => l !== lente) : [...atuais, lente]
    );
  };

  // Toggle para seleção múltipla de Tratamentos
  const toggleTratamento = (tratamento) => {
    setTratamentosSelecionados((atuais) => 
      atuais.includes(tratamento) ? atuais.filter((t) => t !== tratamento) : [...atuais, tratamento]
    );
  };

  // Preenche DP automaticamente se DNP OD e OE forem informados
  const handleDnpChange = (olho, valor) => {
    if (olho === 'OD') {
      setOd(prev => ({ ...prev, dnp: valor }));
      if (valor && oe.dnp) {
        const total = (parseFloat(valor) || 0) + (parseFloat(oe.dnp) || 0);
        setDistanciaPupilar(total > 0 ? total.toFixed(1) : '');
      }
    } else {
      setOe(prev => ({ ...prev, dnp: valor }));
      if (valor && od.dnp) {
        const total = (parseFloat(od.dnp) || 0) + (parseFloat(valor) || 0);
        setDistanciaPupilar(total > 0 ? total.toFixed(1) : '');
      }
    }
  };

  // Submeter o atendimento para a API .NET
  const handleSalvar = async (e) => {
    e.preventDefault();
    setAviso(null);

    if (!paciente || !paciente.id) {
      setAviso({ tipo: 'erro', texto: 'Nenhum paciente selecionado para o atendimento.' });
      return;
    }

    setSalvando(true);

    const parseDecimal = (val) => {
      if (!val || val === '') return null;
      const num = parseFloat(String(val).replace(',', '.'));
      return isNaN(num) ? null : num;
    };

    const payload = {
      pacienteId: paciente.id,
      opticaOrigemId: opticaOrigemId ? parseInt(opticaOrigemId, 10) : null,
      dataAtendimento: dataAtendimento ? `${dataAtendimento}T10:00:00` : new Date().toISOString(),
      queixaPrincipal: queixaPrincipal.trim() || null,
      distanciaPupilar: parseDecimal(distanciaPupilar),
      semNecessidadeNovaCorrecao: semNecessidadeNovaCorrecao,
      dataSugeridaRetorno: dataSugeridaRetorno || null,
      observacoesAtendimento: observacoesAtendimento.trim() || null,
      lentes: lentesSelecionadas,
      tratamentos: tratamentosSelecionados,
      olhoDireito: {
        esferico: parseDecimal(od.esferico),
        cilindrico: parseDecimal(od.cilindrico),
        eixo: parseDecimal(od.eixo),
        adicao: parseDecimal(od.adicao),
        avLonge: od.avLonge || null,
        avPerto: od.avPerto || null,
        dnp: parseDecimal(od.dnp)
      },
      olhoEsquerdo: {
        esferico: parseDecimal(oe.esferico),
        cilindrico: parseDecimal(oe.cilindrico),
        eixo: parseDecimal(oe.eixo),
        adicao: parseDecimal(oe.adicao),
        avLonge: oe.avLonge || null,
        avPerto: oe.avPerto || null,
        dnp: parseDecimal(oe.dnp)
      }
    };

    try {
      await atendimentoService.criar(payload);
      setAviso({ tipo: 'sucesso', texto: 'Consulta optométrica registrada com sucesso!' });
      
      setTimeout(() => {
        if (onAtendimentoSalvo) {
          onAtendimentoSalvo(paciente, 'Consulta optométrica registrada com sucesso!');
        }
      }, 500);
    } catch (err) {
      setAviso({
        tipo: 'erro',
        texto: err.message || 'Erro ao registrar atendimento. Verifique os campos e tente novamente.'
      });
      setSalvando(false);
    }
  };

  // Cálculo da idade a partir da Data de Nascimento
  const calcularIdade = (dataNasc) => {
    if (!dataNasc) return null;
    try {
      const nasc = new Date(dataNasc + 'T12:00:00');
      const hoje = new Date();
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      return idade >= 0 ? idade : null;
    } catch {
      return null;
    }
  };

  // Formatação de data brasileira (DD/MM/AAAA)
  const formatarData = (dataStr) => {
    if (!dataStr) return 'Não informada';
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

  const obterIniciais = (nome) => {
    if (!nome) return 'P';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const idadePaciente = calcularIdade(paciente.dataNascimento);

  return (
    <div className="ficha-atendimento-container">
      {/* Topo: Botão Voltar */}
      <div className="ficha-topo-navegacao">
        <button type="button" className="btn-voltar-atendimento" onClick={onVoltar}>
          <ArrowLeft size={16} />
          <span>Voltar para atendimentos</span>
        </button>
      </div>

      {/* Alerta padronizado do sistema */}
      {aviso && (
        <div style={{ marginBottom: '20px' }}>
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

      {/* Grid Principal: Coluna Esquerda (Fixo) e Coluna Direita (Exame Amplo) */}
      <form onSubmit={handleSalvar} className="ficha-grid">
        
        {/* COLUNA ESQUERDA: Identificação do Paciente e Origem */}
        <aside className="ficha-coluna-esquerda">
          <div className="card-paciente-identificacao">
            {/* Avatar e Código de Prontuário */}
            <div className="avatar-prontuario-wrapper">
              <div className="avatar-circulo">
                {obterIniciais(paciente.nomeCompleto)}
              </div>
              <div>
                <span className="prontuario-label-small">Prontuário</span>
                <p className="prontuario-codigo">PAC-{String(paciente.id).padStart(5, '0')}</p>
              </div>
            </div>

            <div className="cadastro-divisor" />

            {/* Dados do Paciente padronizados com o Prontuário */}
            <div className="cadastro-campo">
              <span className="cadastro-campo-label">Nome completo</span>
              <p className="cadastro-campo-valor">{paciente.nomeCompleto}</p>
            </div>

            <div className="cadastro-campo">
              <span className="cadastro-campo-label">Telefone</span>
              <p className="cadastro-campo-valor">{paciente.telefone || 'Não informado'}</p>
            </div>

            <div className="cadastro-campo">
              <span className="cadastro-campo-label">Data de nascimento</span>
              <p className="cadastro-campo-valor">
                {formatarData(paciente.dataNascimento)}
                {idadePaciente !== null && ` • ${idadePaciente} anos`}
              </p>
              {idadePaciente !== null && (
                <span className="cadastro-campo-nota">
                  Idade calculada com base na data de nascimento.
                </span>
              )}
            </div>

            <div className="cadastro-campo">
              <span className="cadastro-campo-label">Observações cadastrais</span>
              <p className="cadastro-campo-valor observacoes-texto">
                {paciente.observacoes || 'Nenhuma observação informada.'}
              </p>
            </div>

            <div className="cadastro-divisor" />

            {onTrocarPaciente && (
              <button 
                type="button" 
                className="btn-trocar-paciente"
                onClick={onTrocarPaciente}
              >
                <RotateCcw size={15} />
                <span>Trocar paciente</span>
              </button>
            )}
          </div>

          {/* Card: Origem e Data da Consulta */}
          <div className="card-origem-consulta">
            <h4 className="card-secao-titulo">
              <Store size={16} />
              <span>Origem da Consulta</span>
            </h4>

            <div className="form-campo">
              <label className="campo-label">Data do Atendimento</label>
              <input
                type="date"
                className="campo-input"
                value={dataAtendimento}
                onChange={(e) => handleDataAtendimentoChange(e.target.value)}
                required
              />
            </div>

            <div className="form-campo">
              <label className="campo-label">Ótica de Origem</label>
              <select
                className="campo-select"
                value={opticaOrigemId}
                onChange={(e) => setOpticaOrigemId(e.target.value)}
              >
                <option value="">Particular (Sem parceria)</option>
                {opticas.map((optica) => (
                  <option key={optica.id} value={optica.id}>
                    {optica.nome}
                  </option>
                ))}
              </select>
              <span className="campo-ajuda">
                Vincule caso o paciente tenha sido encaminhado por uma ótica conveniada.
              </span>
            </div>
          </div>
        </aside>

        {/* COLUNA DIREITA: Ficha Clínica e Refração (Rolagem) */}
        <section className="ficha-coluna-direita">
          
          {/* Card 1: Queixa Principal */}
          <div className="card-clinico">
            <h3 className="card-clinico-titulo">1. Anamnese & Queixa Principal</h3>
            <p className="card-clinico-subtitulo">
              Relato do paciente sobre sintomas visuais, histórico e motivo da consulta.
            </p>
            <textarea
              className="textarea-queixa"
              rows={3}
              placeholder="Ex: Dificuldade para leitura de perto e cansaço visual após uso prolongado de telas. Dores de cabeça esporádicas no fim da tarde..."
              value={queixaPrincipal}
              onChange={(e) => setQueixaPrincipal(e.target.value)}
            />
          </div>

          {/* Card 2: Tabela Refrativa OD e OE */}
          <div className="card-clinico">
            <div className="card-clinico-topo-refrativo">
              <div>
                <h3 className="card-clinico-titulo">2. Refração Ocular</h3>
                <p className="card-clinico-subtitulo">
                  Medições ópticas independentes de Olho Direito (OD) e Olho Esquerdo (OE).
                </p>
              </div>
            </div>

            {/* Tabela de Medições */}
            <div className="tabela-refra-wrapper">
              <table className="tabela-refra">
                <thead>
                  <tr>
                    <th className="th-olho">Olho</th>
                    <th>Esférico</th>
                    <th>Cilíndrico</th>
                    <th>Eixo</th>
                    <th>AV Longe</th>
                    <th>AV Perto</th>
                    <th>Adição</th>
                    <th>DNP</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Linha OD */}
                  <tr>
                    <td className="td-olho-badge">
                      <span className="badge-od">OD</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="-1.50"
                        value={od.esferico}
                        onChange={(e) => setOd(prev => ({ ...prev, esferico: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="-0.75"
                        value={od.cilindrico}
                        onChange={(e) => setOd(prev => ({ ...prev, cilindrico: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="90°"
                        value={od.eixo}
                        onChange={(e) => setOd(prev => ({ ...prev, eixo: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="20/20"
                        value={od.avLonge}
                        onChange={(e) => setOd(prev => ({ ...prev, avLonge: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="J1"
                        value={od.avPerto}
                        onChange={(e) => setOd(prev => ({ ...prev, avPerto: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="+1.75"
                        value={od.adicao}
                        onChange={(e) => setOd(prev => ({ ...prev, adicao: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="31.5"
                        value={od.dnp}
                        onChange={(e) => handleDnpChange('OD', e.target.value)}
                      />
                    </td>
                  </tr>

                  {/* Linha OE */}
                  <tr>
                    <td className="td-olho-badge">
                      <span className="badge-oe">OE</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="-1.25"
                        value={oe.esferico}
                        onChange={(e) => setOe(prev => ({ ...prev, esferico: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="-0.50"
                        value={oe.cilindrico}
                        onChange={(e) => setOe(prev => ({ ...prev, cilindrico: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="85°"
                        value={oe.eixo}
                        onChange={(e) => setOe(prev => ({ ...prev, eixo: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="20/20"
                        value={oe.avLonge}
                        onChange={(e) => setOe(prev => ({ ...prev, avLonge: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="J1"
                        value={oe.avPerto}
                        onChange={(e) => setOe(prev => ({ ...prev, avPerto: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="+1.75"
                        value={oe.adicao}
                        onChange={(e) => setOe(prev => ({ ...prev, adicao: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-grau"
                        placeholder="31.0"
                        value={oe.dnp}
                        onChange={(e) => handleDnpChange('OE', e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Medições Complementares (DP Total) e Checkbox Sem Correção logo abaixo */}
            <div className="medicoes-extras-bloco">
              <div className="medicoes-extras-linha">
                <div className="dp-total-wrapper">
                  <span className="dp-label">Distância Pupilar Total (DP em mm):</span>
                  <input
                    type="text"
                    className="input-dp-total"
                    placeholder="62.5"
                    value={distanciaPupilar}
                    onChange={(e) => setDistanciaPupilar(e.target.value)}
                  />
                </div>
                <span className="dp-dica">Calculada automaticamente ao somar DNP (OD + OE) ou ajustável manualmente.</span>
              </div>

              {/* Opção Sem necessidade de correção visual logo abaixo da DP */}
              <div className="sem-correcao-wrapper">
                <label className="checkbox-sem-correcao">
                  <input
                    type="checkbox"
                    checked={semNecessidadeNovaCorrecao}
                    onChange={(e) => setSemNecessidadeNovaCorrecao(e.target.checked)}
                  />
                  <span>Sem necessidade de nova correção visual</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 3: Conduta, Lentes e Tratamentos */}
          <div className="card-clinico">
            <h3 className="card-clinico-titulo">3. Prescrição Óptica & Conduta</h3>
            <p className="card-clinico-subtitulo">
              Selecione as indicações de lentes e tratamentos para a confecção da receita.
            </p>

            {/* Tipos de Lentes (Chips/Pílulas) */}
            <div className="secao-selecao">
              <span className="secao-selecao-label">Tipos de Lentes Recomendadas</span>
              <div className="chips-grid">
                {OPCOES_LENTES.map((lente) => {
                  const ativa = lentesSelecionadas.includes(lente);
                  return (
                    <button
                      key={lente}
                      type="button"
                      className={`chip-btn ${ativa ? 'ativo' : ''}`}
                      onClick={() => toggleLente(lente)}
                    >
                      {lente}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tratamentos de Lentes */}
            <div className="secao-selecao">
              <span className="secao-selecao-label">Tratamentos Sugeridos</span>
              <div className="chips-grid">
                {OPCOES_TRATAMENTOS.map((trat) => {
                  const ativo = tratamentosSelecionados.includes(trat);
                  return (
                    <button
                      key={trat}
                      type="button"
                      className={`chip-btn ${ativo ? 'ativo' : ''}`}
                      onClick={() => toggleTratamento(trat)}
                    >
                      {trat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Retorno e Observações da Consulta */}
            <div className="retorno-obs-grid">
              <div className="form-campo">
                <label className="campo-label">Data Sugerida para Retorno</label>
                <input
                  type="date"
                  className="campo-input"
                  value={dataSugeridaRetorno}
                  onChange={(e) => setDataSugeridaRetorno(e.target.value)}
                />
              </div>

              <div className="form-campo">
                <label className="campo-label">Observações e Orientações da Consulta</label>
                <input
                  type="text"
                  className="campo-input"
                  placeholder="Ex: Orientada sobre adaptação às lentes multifocais."
                  value={observacoesAtendimento}
                  onChange={(e) => setObservacoesAtendimento(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Barra de Ações Final */}
          <div className="ficha-acoes-rodape">
            <button 
              type="button" 
              className="btn-cancelar-atendimento"
              onClick={onVoltar}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button 
              type="submit" 
              className="btn-salvar-atendimento"
              disabled={salvando}
            >
              <Save size={18} />
              <span>{salvando ? 'Salvando Consulta...' : 'Salvar Atendimento'}</span>
            </button>
          </div>

        </section>
      </form>
    </div>
  );
}

export default FichaAtendimentoView;

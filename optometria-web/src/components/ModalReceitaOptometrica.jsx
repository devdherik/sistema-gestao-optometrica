import React from 'react';
import { X, Printer, Eye, Calendar, User, Check } from 'lucide-react';
import './ModalReceitaOptometrica.css';

function ModalReceitaOptometrica({ aberto, onFechar, atendimento, paciente }) {
  if (!aberto || !atendimento || !paciente) return null;

  // Formatação de data padrão BR (DD/MM/AAAA)
  const formatarData = (dataIso) => {
    if (!dataIso) return '-';
    try {
      const partes = dataIso.split('T')[0].split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return dataIso;
    } catch {
      return dataIso;
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
      return idade >= 0 ? `${idade} anos` : null;
    } catch {
      return null;
    }
  };

  // Formatação de dioptrias (+/- com 2 decimais ou número de eixo)
  const formatarGrau = (num, ehEixo = false) => {
    if (num === null || num === undefined || num === '') return '—';
    const n = Number(num);
    if (isNaN(n)) return '—';
    if (ehEixo) return `${n}°`;
    return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
  };

  const handleImprimir = () => {
    window.print();
  };

  const idadeTexto = calcularIdade(paciente.dataNascimento);

  // Extrai olhoDireito e olhoEsquerdo do objeto do atendimento
  const od = atendimento.olhoDireito || {};
  const oe = atendimento.olhoEsquerdo || {};

  return (
    <div className="receita-modal-overlay">
      <div className="receita-modal-container">
        
        {/* Barra superior de ações na tela (não sai na impressão) */}
        <div className="receita-modal-header-acoes noprint">
          <div className="receita-modal-titulo">
            <Eye size={20} className="receita-icone-titulo" />
            <span>Visualização da Receita Optométrica</span>
          </div>
          <div className="receita-modal-botoes">
            <button 
              type="button" 
              className="btn-receita-imprimir"
              onClick={handleImprimir}
            >
              <Printer size={16} />
              <span>Imprimir</span>
            </button>
            <button 
              type="button" 
              className="btn-receita-fechar"
              onClick={onFechar}
              title="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Folha da Receita (área que sai na impressão) */}
        <div className="receita-folha-papel">
          
          {/* Cabeçalho da Clínica */}
          <div className="receita-cabecalho">
            <div className="receita-logo-marca">
              <div className="receita-logo-icone">
                <Eye size={26} />
              </div>
              <div className="receita-logo-texto">
                <h1>CONSULTÓRIO DE OPTOMETRIA</h1>
                <p>Cuidado e Saúde Visual Especializada</p>
              </div>
            </div>
            <div className="receita-tipo-documento">
              <h2>PRESCRIÇÃO ÓPTICA</h2>
              <span className="receita-numero-atendimento">
                Ref. PAC-{paciente.id ? String(paciente.id).padStart(5, '0') : '00000'}
              </span>
            </div>
          </div>

          <div className="receita-divisor" />

          {/* Dados do Paciente */}
          <div className="receita-paciente-bloco">
            <div className="receita-paciente-linha">
              <span className="receita-label">PACIENTE:</span>
              <span className="receita-valor-destaque">{paciente.nomeCompleto}</span>
            </div>
            <div className="receita-paciente-sublinha">
              <div>
                <span className="receita-label">DATA DA CONSULTA:</span>
                <span className="receita-valor">{formatarData(atendimento.dataAtendimento)}</span>
              </div>
              {idadeTexto && (
                <div>
                  <span className="receita-label">IDADE:</span>
                  <span className="receita-valor">{idadeTexto}</span>
                </div>
              )}
              {paciente.telefone && (
                <div>
                  <span className="receita-label">TELEFONE:</span>
                  <span className="receita-valor">{paciente.telefone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabela de Refração - Mesma sequência exata da tela de atendimento */}
          <div className="receita-refracao-bloco">
            <table className="receita-tabela">
              <thead>
                <tr>
                  <th className="th-olho">OLHO</th>
                  <th>ESFÉRICO</th>
                  <th>CILÍNDRICO</th>
                  <th>EIXO</th>
                  <th>AV LONGE</th>
                  <th>AV PERTO</th>
                  <th>ADIÇÃO</th>
                  <th>DNP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="td-olho">OD (Direito)</td>
                  <td className="td-valor">{formatarGrau(od.esferico)}</td>
                  <td className="td-valor">{formatarGrau(od.cilindrico)}</td>
                  <td className="td-valor">{formatarGrau(od.eixo, true)}</td>
                  <td className="td-valor">{od.avLonge || '—'}</td>
                  <td className="td-valor">{od.avPerto || '—'}</td>
                  <td className="td-valor">{od.adicao ? formatarGrau(od.adicao) : '—'}</td>
                  <td className="td-valor">{od.dnp ? `${od.dnp} mm` : '—'}</td>
                </tr>
                <tr>
                  <td className="td-olho">OE (Esquerdo)</td>
                  <td className="td-valor">{formatarGrau(oe.esferico)}</td>
                  <td className="td-valor">{formatarGrau(oe.cilindrico)}</td>
                  <td className="td-valor">{formatarGrau(oe.eixo, true)}</td>
                  <td className="td-valor">{oe.avLonge || '—'}</td>
                  <td className="td-valor">{oe.avPerto || '—'}</td>
                  <td className="td-valor">{oe.adicao ? formatarGrau(oe.adicao) : '—'}</td>
                  <td className="td-valor">{oe.dnp ? `${oe.dnp} mm` : '—'}</td>
                </tr>
              </tbody>
            </table>

            {/* DP Total ou Observação de sem correção */}
            <div className="receita-dp-rodape">
              {atendimento.semNecessidadeNovaCorrecao ? (
                <span className="receita-aviso-sem-correcao">
                  * Paciente em emetropia / sem necessidade de nova correção visual.
                </span>
              ) : (
                atendimento.distanciaPupilar && (
                  <span className="receita-dp-total">
                    <strong>Distância Pupilar Total (DP):</strong> {atendimento.distanciaPupilar} mm
                  </span>
                )
              )}
            </div>
          </div>

          {/* Recomendações: Lentes e Tratamentos */}
          {((atendimento.lentes && atendimento.lentes.length > 0) || 
            (atendimento.tratamentos && atendimento.tratamentos.length > 0)) && (
            <div className="receita-secao-indicacoes">
              <h3 className="receita-subtitulo">INDICAÇÕES TÉCNICAS E TRATAMENTOS</h3>
              <div className="receita-chips-container">
                {atendimento.lentes && atendimento.lentes.map((lente) => (
                  <span key={lente} className="receita-chip">
                    <Check size={12} /> {lente}
                  </span>
                ))}
                {atendimento.tratamentos && atendimento.tratamentos.map((trat) => (
                  <span key={trat} className="receita-chip">
                    <Check size={12} /> {trat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Observações / Recomendações Clínicas */}
          {(atendimento.observacoesAtendimento || atendimento.dataSugeridaRetorno) && (
            <div className="receita-secao-obs">
              <h3 className="receita-subtitulo">OBSERVAÇÕES E RETORNO</h3>
              {atendimento.observacoesAtendimento && (
                <p className="receita-texto-obs">{atendimento.observacoesAtendimento}</p>
              )}
              {atendimento.dataSugeridaRetorno && (
                <p className="receita-texto-retorno">
                  <strong>Data sugerida para retorno:</strong> {formatarData(atendimento.dataSugeridaRetorno)}
                </p>
              )}
            </div>
          )}

          {/* Rodapé com Assinatura */}
          <div className="receita-rodape-assinatura">
            <div className="receita-data-emissao">
              <span>Emitido em: {formatarData(new Date().toISOString())}</span>
            </div>
            <div className="receita-bloco-carimbo">
              <div className="receita-linha-assinatura" />
              <p className="receita-nome-profissional">Optometrista Responsável</p>
              <p className="receita-registro-profissional">CBO 3223-05</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ModalReceitaOptometrica;
import React, { useRef } from 'react';
import { X, Printer, Eye, Check } from 'lucide-react';
import './ModalReceitaOptometrica.css';

function ModalReceitaOptometrica({ aberto, onFechar, atendimento, paciente }) {
  const folhaRef = useRef(null);

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

  // Impressão robusta via iframe isolado:
  // Cria um documento HTML temporário contendo EXCLUSIVAMENTE a folha da receita.
  // Isso elimina qualquer interferência do resto da aplicação (Navbar, Prontuário, overlays)
  // e garante 1 única página física A4 sem páginas em branco!
  const handleImprimir = () => {
    if (!folhaRef.current) return;

    // Remove qualquer iframe de impressão anterior se existir
    const iframeAntigo = document.getElementById('iframe-impressao-receita');
    if (iframeAntigo) {
      iframeAntigo.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'iframe-impressao-receita';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    const conteudoHtml = folhaRef.current.innerHTML;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Receita Optométrica - PAC-${paciente.id ? String(paciente.id).padStart(5, '0') : '00000'}</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
        <style>
          @page {
            size: A4 portrait;
            margin: 1.2cm 1.5cm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background-color: #ffffff;
            color: #1e293b;
            font-size: 13px;
          }
          .receita-folha-papel {
            width: 100%;
          }
          .receita-cabecalho {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .receita-logo-marca {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .receita-logo-icone {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            background-color: #f0fdf4;
            color: #15803d;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #bbf7d0;
          }
          .receita-logo-texto h1 {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
          }
          .receita-logo-texto p {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
          }
          .receita-tipo-documento {
            text-align: right;
          }
          .receita-tipo-documento h2 {
            font-size: 16px;
            font-weight: 800;
            color: #15803d;
            letter-spacing: 0.04em;
          }
          .receita-numero-atendimento {
            font-size: 11px;
            color: #64748b;
            font-family: monospace;
          }
          .receita-divisor {
            height: 2px;
            background: linear-gradient(to right, #15803d, #86efac, #e2e8f0);
            margin: 16px 0;
          }
          .receita-paciente-bloco {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 16px;
          }
          .receita-paciente-linha {
            margin-bottom: 6px;
          }
          .receita-label {
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 0.03em;
            margin-right: 6px;
          }
          .receita-valor-destaque {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
          }
          .receita-paciente-sublinha {
            display: flex;
            gap: 24px;
            font-size: 12px;
          }
          .receita-valor {
            color: #1e293b;
            font-weight: 500;
          }
          .receita-refracao-bloco {
            margin-bottom: 16px;
          }
          .receita-tabela {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          .receita-tabela th {
            background-color: #f1f5f9;
            color: #475569;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 8px 6px;
            border: 1px solid #cbd5e1;
            text-align: center;
          }
          .receita-tabela .th-olho {
            text-align: left;
            width: 100px;
            padding-left: 10px;
          }
          .receita-tabela td {
            padding: 8px 6px;
            border: 1px solid #cbd5e1;
            text-align: center;
          }
          .receita-tabela .td-olho {
            text-align: left;
            font-weight: 700;
            color: #0f172a;
            background-color: #f8fafc;
            padding-left: 10px;
          }
          .receita-tabela .td-valor {
            font-weight: 600;
            color: #0f172a;
          }
          .receita-dp-rodape {
            margin-top: 8px;
            display: flex;
            justify-content: flex-end;
            font-size: 12px;
            color: #334155;
          }
          .receita-aviso-sem-correcao {
            color: #b45309;
            font-style: italic;
          }
          .receita-subtitulo {
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 6px;
          }
          .receita-secao-indicacoes,
          .receita-secao-obs {
            margin-bottom: 14px;
            padding: 10px 14px;
            background-color: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
          .receita-chips-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .receita-chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 500;
            color: #334155;
          }
          .receita-texto-obs {
            font-size: 12px;
            color: #334155;
            line-height: 1.4;
          }
          .receita-texto-retorno {
            font-size: 12px;
            color: #15803d;
            margin-top: 6px;
          }
          .receita-rodape-assinatura {
            margin-top: 36px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .receita-data-emissao {
            font-size: 11px;
            color: #64748b;
          }
          .receita-bloco-carimbo {
            text-align: center;
            min-width: 240px;
          }
          .receita-linha-assinatura {
            border-top: 1px solid #64748b;
            margin-bottom: 6px;
          }
          .receita-nome-profissional {
            font-size: 12px;
            font-weight: 600;
            color: #0f172a;
          }
          .receita-registro-profissional {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
          }
        </style>
      </head>
      <body>
        <div class="receita-folha-papel">
          ${conteudoHtml}
        </div>
      </body>
      </html>
    `);
    doc.close();

    // Aguarda o carregamento e dispara a impressão direto do iframe
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 250);
  };

  const idadeTexto = calcularIdade(paciente.dataNascimento);

  // Extrai olhoDireito e olhoEsquerdo do objeto do atendimento
  const od = atendimento.olhoDireito || {};
  const oe = atendimento.olhoEsquerdo || {};

  return (
    <div className="receita-modal-overlay">
      <div className="receita-modal-container">
        
        {/* Barra superior de ações na tela */}
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

        {/* Folha da Receita (área capturada para impressão) */}
        <div className="receita-folha-papel" ref={folhaRef}>
          
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
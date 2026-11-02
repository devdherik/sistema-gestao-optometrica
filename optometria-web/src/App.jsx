import { useEffect, useRef, useState } from 'react';
import { pacienteService, opticaService, atendimentoService } from './services/api';
import { ClinicalForm, Record } from './Clinical';

export function Icon({ name = 'eye' }) {
  const paths = { eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6', home: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M17 4a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-4', record: 'M8 4H5v17h14V4h-3M8 2h8v5H8zM8 12h8M8 16h5', shop: 'M3 10v11h18V10M2 10l2-7h16l2 7M2 10h20M8 21v-7h8v7', search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6', shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM8 12l3 3 5-6' };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.eye}/></svg>;
}
export const formatDate = value => value ? new Date(value.length === 10 ? `${value}T12:00:00` : value).toLocaleDateString('pt-BR') : 'Não informada';
export const errorMessage = error => error.message === 'Failed to fetch' ? 'Não foi possível conectar ao sistema. Verifique se a API está em execução e tente novamente.' : error.message;
export function Modal({ title, children, onClose, busy = false }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.showModal(); }, []);
  return <dialog ref={ref} aria-label={title} onCancel={e => { e.preventDefault(); if (!busy) onClose(); }}><div className="modal-heading"><h2>{title}</h2><button aria-label="Fechar" disabled={busy} onClick={onClose}>×</button></div>{children}</dialog>;
}
function Registration({ kind, record, onClose, onSaved }) {
  const optical = kind === 'optica';
  const fields = optical ? [['nome','Nome da ótica'],['contato','Contato'],['endereco','Endereço']] : [['nomeCompleto','Nome completo'],['dataNascimento','Data de nascimento','date'],['telefone','Telefone','tel'],['observacoes','Observações cadastrais','textarea']];
  const [values, setValues] = useState(record || {});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save(e) {
    e.preventDefault();
    if (!values[fields[0][0]]?.trim()) { setError('Preencha o nome.'); return; }
    setBusy(true); setError('');
    try {
      const data = Object.fromEntries(fields.map(([key]) => [key, values[key]?.trim() || null]));
      const service = optical ? opticaService : pacienteService;
      const saved = record ? await service.atualizar(record.id, data) : await service.criar(data);
      onSaved(saved);
    } catch (err) { setError(errorMessage(err)); } finally { setBusy(false); }
  }
  return <Modal title={`${record ? 'Editar' : optical ? 'Nova' : 'Novo'} ${optical ? 'ótica parceira' : 'paciente'}`} onClose={onClose} busy={busy}><form onSubmit={save}>
    <p className="muted">{optical ? 'Informações da parceria e contato.' : 'Dados cadastrais para acompanhar cada atendimento.'}</p>
    <fieldset disabled={busy}>{fields.map(([key,label,type], i) => <label key={key}>{label}{i === 0 ? ' *' : ''}{type === 'textarea' ? <textarea rows="3" value={values[key] || ''} onChange={e => setValues({...values,[key]:e.target.value})}/> : <input autoFocus={i === 0} required={i === 0} type={type || 'text'} value={values[key] || ''} onChange={e => setValues({...values,[key]:e.target.value})}/>}</label>)}</fieldset>
    {error && <p role="alert" className="error">{error}</p>}<div className="actions"><button type="button" disabled={busy} onClick={onClose}>Cancelar</button><button className="primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar cadastro'}</button></div>
  </form></Modal>;
}
function Avatar({ name }) { return <span className="avatar">{name.split(' ').filter(Boolean).slice(0,2).map(part => part[0]).join('')}</span>; }
export default function App() {
  const [page,setPage] = useState('inicio');
  const [patients,setPatients] = useState([]);
  const [optics,setOptics] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [query,setQuery] = useState('');
  const [selected,setSelected] = useState(null);
  const [history,setHistory] = useState([]);
  const [historyLoading,setHistoryLoading] = useState(false);
  const [historyError,setHistoryError] = useState('');
  const [historyVersion,setHistoryVersion] = useState(0);
  const [modal,setModal] = useState(null);
  const [receipt,setReceipt] = useState(null);
  const [notice,setNotice] = useState('');
  const [offset,setOffset] = useState(0);
  const searchRef = useRef(null);
  async function load() {
    setLoading(true); setError('');
    try { const [p,o] = await Promise.all([pacienteService.listar(),opticaService.listar()]); setPatients(p); setOptics(o); }
    catch (err) { setError(errorMessage(err)); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!selected) return;
    let active = true;
    setHistoryLoading(true); setHistoryError(''); setHistory([]);
    atendimentoService.obterHistoricoPorPaciente(selected.id).then(data => { if(active) setHistory(data); }).catch(err => { if(active) setHistoryError(errorMessage(err)); }).finally(() => { if(active) setHistoryLoading(false); });
    return () => { active = false; };
  }, [selected?.id,historyVersion]);
  const normalized = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const filtered = patients.filter(p => normalized(`${p.nomeCompleto} ${p.telefone || ''}`).includes(normalized(query.trim())));
  function navigate(next) { setPage(next); setReceipt(null); setNotice(''); setOffset(0); }
  function openPatient(patient) { setSelected(patient); setReceipt(null); setPage('perfil'); }
  function newVisit() { if(selected) navigate('novo'); else { navigate('pacientes'); setNotice('Selecione um paciente para iniciar o atendimento.'); } }
  const heading = { inicio:'Cuidar começa por enxergar.', pacientes:'Pacientes', perfil:'Perfil do paciente', atendimentos:'Atendimentos do paciente', novo:'Atendimento clínico', opticas:'Óticas parceiras', receita:'Visualização do receituário' };
  return <>
    <header className="topbar"><div className="container top-content"><button className="brand" onClick={() => navigate('inicio')} aria-label="Íris — Início"><span className="brand-symbol"><Icon/></span><span>íris<small>GESTÃO OPTOMÉTRICA</small></span></button><div className="top-right"><button onClick={() => navigate('opticas')}><Icon name="shop"/>Óticas Parceiras</button><span className="clinic"><span className="avatar">Í</span><span>Íris<small>Gestão do consultório</small></span></span></div></div></header>
    <div className="nav-bar"><div className="container nav-content"><nav aria-label="Navegação principal">{[['inicio','Início','home'],['pacientes','Pacientes','people'],['atendimentos','Atendimentos','record']].map(([key,label,icon]) => <button key={key} aria-current={(page === key || key === 'pacientes' && page === 'perfil' || key === 'atendimentos' && ['novo','receita'].includes(page)) ? 'page' : undefined} onClick={() => navigate(key)}><Icon name={icon}/>{label}</button>)}</nav><time>{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</time></div></div>
    <main className="container"><p className="breadcrumb">{page === 'inicio' ? 'Visão geral / Início' : `Início / ${heading[page]}`}</p><div className="page-heading"><div><h1>{heading[page]}</h1><p>{page === 'inicio' ? 'Acompanhe seus atendimentos e encontre cada prontuário em um só lugar.' : page === 'perfil' ? 'Dados cadastrais e evolução dos registros clínicos.' : page === 'novo' ? 'Registro do prontuário e da prescrição.' : 'Informações para o cuidado com seus pacientes.'}</p></div>{page === 'perfil' && <button className="primary" onClick={newVisit}>+ Nova Consulta</button>}</div>
    {notice && <p role="status" className="notice">{notice}</p>}{error && <div role="alert" className="error">{error} <button onClick={load}>Tentar novamente</button></div>}
    {page === 'inicio' && <section className="stats">{[['Consultas do paciente',selected && !historyLoading && !historyError ? history.length : '—',selected?.nomeCompleto || 'Selecione um paciente para consultar','record'],['Pacientes cadastrados',loading || error ? '—' : patients.length,'Cadastros no consultório','people'],['Óticas parceiras',loading || error ? '—' : optics.length,'Parcerias cadastradas','shop']].map(([label,value,sub,icon]) => <article className="card stat" key={label}><Icon name={icon}/><small>{label}</small><strong>{value}</strong><small>{sub}</small></article>)}</section>}
    {['inicio','pacientes','atendimentos'].includes(page) && <><div className="searchbar"><label className="search"><Icon name="search"/><input ref={searchRef} aria-label="Buscar paciente por nome ou telefone" placeholder="Buscar paciente por nome ou telefone" value={query} onChange={e => { setQuery(e.target.value); setOffset(0); }}/></label><button className="primary" onClick={page === 'pacientes' ? () => setModal({kind:'paciente'}) : newVisit}>{page === 'pacientes' ? '+ Novo Paciente' : '+ Novo Atendimento'}</button></div>
      {(query || page === 'pacientes' || !selected) && <section className="card"><div className="section-heading"><div><h2>{page === 'pacientes' ? 'Pacientes cadastrados' : 'Encontre seu paciente'}</h2><p>Abra o prontuário para consultar o histórico ou iniciar uma consulta.</p></div>{page !== 'pacientes' && <button onClick={() => setModal({kind:'paciente'})}>+ Novo paciente</button>}</div>{loading ? <div className="empty" role="status">Carregando cadastros…</div> : error ? <div className="empty">Os cadastros não puderam ser carregados.</div> : !filtered.length ? <div className="empty">{query ? 'Nenhum paciente encontrado para essa busca.' : 'Nenhum paciente cadastrado. Comece pelo primeiro cadastro.'}</div> : <><div className="table-wrap"><table><thead><tr><th>Paciente</th><th>Data de nascimento</th><th>Telefone</th><th>Ações</th></tr></thead><tbody>{filtered.slice(offset,offset+5).map(p => <tr key={p.id}><td><div className="person"><Avatar name={p.nomeCompleto}/><div>{p.nomeCompleto}<small>PAC-{String(p.id).padStart(5,'0')}</small></div></div></td><td>{formatDate(p.dataNascimento)}</td><td>{p.telefone || 'Não informado'}</td><td><button className="link" onClick={() => openPatient(p)}><Icon name="record"/>Ver Prontuário</button></td></tr>)}</tbody></table></div><div className="table-footer"><small>Mostrando {offset+1}–{Math.min(offset+5,filtered.length)} de {filtered.length} pacientes</small><div className="actions"><button disabled={!offset} onClick={() => setOffset(offset-5)}>Anterior</button><span className="pill">{Math.floor(offset/5)+1}</span><button disabled={offset+5>=filtered.length} onClick={() => setOffset(offset+5)}>Próxima</button></div></div></>}</section>}
    </>}
    {['inicio','perfil','atendimentos'].includes(page) && selected && <><div className="patient-banner"><span>{selected.nomeCompleto}</span><button className="link" onClick={() => { setSelected(null); navigate('pacientes'); }}>Trocar paciente</button></div><div className={page === 'perfil' ? 'profile-grid' : ''}>{page === 'perfil' && <aside className="card patient-details"><div className="person"><Avatar name={selected.nomeCompleto}/><div><small>Prontuário</small>PAC-{String(selected.id).padStart(5,'0')}</div></div><hr/>{[['Nome completo',selected.nomeCompleto],['Telefone',selected.telefone],['Data de nascimento',formatDate(selected.dataNascimento)],['Observações cadastrais',selected.observacoes]].map(([label,value]) => <p key={label}><small>{label}</small>{value || 'Não informado'}</p>)}<button onClick={() => setModal({kind:'paciente',record:selected})}>Editar cadastro</button></aside>}
      <section className="card"><div className="section-heading"><div><h2>Histórico de consultas</h2><p>Atendimentos registrados para {selected.nomeCompleto}.</p></div></div>{historyLoading ? <div className="empty" role="status">Carregando histórico…</div> : historyError ? <div className="error" role="alert">{historyError}<button onClick={() => setHistoryVersion(v=>v+1)}>Tentar novamente</button></div> : !history.length ? <div className="empty">Nenhum atendimento registrado para este paciente.</div> : <div className="table-wrap"><table><thead><tr><th>Data</th><th>Ótica de origem</th><th>Queixa principal</th><th>Ações</th></tr></thead><tbody>{history.map(a => <tr key={a.id}><td>{formatDate(a.dataAtendimento)}</td><td><span className="pill">{a.nomeOptica || 'Particular'}</span></td><td className="wrap">{a.queixaPrincipal || 'Não informada'}</td><td><button className="link" onClick={() => { setReceipt(a); setPage('receita'); }}><Icon name="record"/>Ver atendimento e receita</button></td></tr>)}</tbody></table></div>}</section></div></>}
    {page === 'opticas' && <section className="card"><div className="section-heading"><div><h2>Óticas parceiras</h2><p>Origem dos encaminhamentos e informações de contato.</p></div><button className="primary" onClick={() => setModal({kind:'optica'})}>+ Nova ótica</button></div>{loading ? <div className="empty">Carregando…</div> : error ? <div className="empty">Não foi possível carregar as óticas.</div> : !optics.length ? <div className="empty">Nenhuma ótica cadastrada.</div> : <div className="table-wrap"><table><thead><tr><th>Ótica</th><th>Contato</th><th>Endereço</th><th>Ações</th></tr></thead><tbody>{optics.map(o => <tr key={o.id}><td>{o.nome}</td><td>{o.contato || '—'}</td><td>{o.endereco || '—'}</td><td><button className="link" onClick={() => setModal({kind:'optica',record:o})}>Editar</button></td></tr>)}</tbody></table></div>}</section>}
    {page === 'novo' && selected && <ClinicalForm patient={selected} optics={optics} onCancel={() => navigate('perfil')} onSaved={() => { setHistoryVersion(v=>v+1); navigate('perfil'); setNotice('Atendimento salvo com sucesso. Você já pode abrir a receita no histórico.'); }}/>}
    {page === 'receita' && receipt && <Record record={receipt} patient={selected} onBack={() => navigate('perfil')}/>}
    <p className="privacy"><Icon name="shield"/> Informações clínicas são confidenciais. Acesse somente os prontuários sob seus cuidados.</p>
    </main><footer className="container footer"><span>Íris · Gestão optométrica</span><span>O cuidado em cada registro.</span></footer>
    {modal && <Registration {...modal} onClose={() => setModal(null)} onSaved={saved => { const setter=modal.kind === 'optica' ? setOptics : setPatients; setter(old => modal.record ? old.map(item=>item.id === saved.id ? saved : item) : [...old,saved]); if(modal.kind === 'paciente' && selected?.id === saved.id) setSelected(saved); setModal(null); setNotice('Cadastro salvo com sucesso.'); }}/>}</>;
}

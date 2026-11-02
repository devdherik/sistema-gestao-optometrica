import { useEffect, useRef, useId } from 'react';
export function Icon({ name = 'eye' }) {
 const paths={eye:'M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3M5 12s3-4 7-4 7 4 7 4-3 4-7 4-7-4-7-4Zm7-1v2',home:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M17 4a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-4',record:'M8 4H5v17h14V4h-3M8 2h8v5H8zM8 12h8M12 9v6',shop:'M3 10v11h18V10M2 10l2-7h16l2 7M2 10h20M8 21v-7h8v7',search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6',shield:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM8 12l3 3 5-6',print:'M6 9V3h12v6M6 17H3v-7h18v7h-3M6 14h12v7H6zM17 12h1',edit:'m4 16-1 5 5-1L21 7l-4-4ZM14 6l4 4',calendar:'M3 5h18v16H3zM7 2v6M17 2v6M3 10h18M7 14h3M14 14h3',download:'M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2',check:'m5 12 4 4L19 6',trash:'M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7'};
 return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.eye}/></svg>;
}
export function Modal({title,subtitle,children,onClose,busy=false,className=''}) {
 const ref=useRef(null); const titleId=useId();
 useEffect(()=>{const previous=document.activeElement;ref.current.showModal();return()=>previous?.focus();},[]);
 return <dialog ref={ref} className={className} aria-labelledby={titleId} onCancel={e=>{e.preventDefault();if(!busy)onClose();}}><header className="modal-heading"><div><h2 id={titleId}>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button aria-label="Fechar" disabled={busy} onClick={onClose}>×</button></header>{children}</dialog>;
}
export function Avatar({name=''}) {return <span className="avatar">{name.split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('')}</span>;}
export const formatDate=v=>v?new Date(v.length===10?`${v}T12:00:00`:v).toLocaleDateString('pt-BR'):'—';
export const longDate=v=>v?new Date(v).toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'}):'Data não informada';
export const time=v=>v?new Date(v).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'—';
export const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export const localNow=()=>`${today()}T${new Date().toTimeString().slice(0,5)}`;
export const age=(birth,at=today())=>{if(!birth)return '—'; const b=new Date(birth+'T12:00:00'),d=new Date(at);let a=d.getFullYear()-b.getFullYear();if(d.getMonth()<b.getMonth()||(d.getMonth()===b.getMonth()&&d.getDate()<b.getDate()))a--;return a>=0?`${a} anos`:'—';};
export const number=(v,digits=2,signed=false)=>v==null||v===''?'—':`${signed&&Number(v)>0?'+':''}${Number(v).toLocaleString('pt-BR',{minimumFractionDigits:digits,maximumFractionDigits:digits})}`;
export const refraction=e=>`${number(e?.esferico,2,true)} / ${number(e?.cilindrico,2,true)} × ${number(e?.eixo,0)}°`;
export const errorMessage=e=>e.message==='Failed to fetch'?'Não foi possível conectar ao sistema. Verifique se a API está em execução e tente novamente.':e.message;
export function Pager({page,total,size=5,onChange,label='atendimentos'}) {return <footer className="table-footer"><small>Mostrando {Math.min(size,Math.max(0,total-(page-1)*size))} de {total} {label}</small><div className="actions"><button disabled={page<=1} onClick={()=>onChange(page-1)}>Anterior</button><span className="page-number">{page}</span><button disabled={page*size>=total} onClick={()=>onChange(page+1)}>Próxima</button></div></footer>;}


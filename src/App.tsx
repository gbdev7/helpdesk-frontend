import { useMemo, useState, type ReactNode } from "react";

type Page = "dashboard" | "tickets" | "ticket" | "new" | "users" | "reports" | "settings";
type Role = "ADMIN" | "TECHNICIAN" | "CUSTOMER";

const tickets = [
  { id: "#1042", title: "VPN não conecta", status: "Em andamento", priority: "Alta", owner: "João Lima", updated: "Há 8 min", sla: "1h 24m", tone: "warning" },
  { id: "#1041", title: "Acesso ao ambiente financeiro", status: "Aberto", priority: "Média", owner: "Marina Costa", updated: "Há 26 min", sla: "3h 12m", tone: "info" },
  { id: "#1038", title: "Erro ao exportar relatório mensal", status: "Resolvido", priority: "Baixa", owner: "Caio Mendes", updated: "Hoje, 09:18", sla: "Cumprido", tone: "success" },
  { id: "#1036", title: "Configuração de novo colaborador", status: "Fechado", priority: "Média", owner: "João Lima", updated: "Ontem, 16:42", sla: "Cumprido", tone: "neutral" },
  { id: "#1034", title: "Instabilidade na rede do escritório", status: "Em andamento", priority: "Crítica", owner: "Marina Costa", updated: "Ontem, 14:08", sla: "32 min", tone: "danger" },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    ticket: <><path d="M3 8.5V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a3.5 3.5 0 0 0 0 7V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a3.5 3.5 0 0 0 0-7Z"/><path d="M13 5v2M13 11v2M13 17v2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.2.37.6.74 1 .9.22.09.46.13.7.13H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <path d="m15 18-6-6 6-6"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    down: <path d="m6 9 6 6 6-6"/>,
    filter: <path d="M4 6h16M7 12h10M10 18h4"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Mark({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return <div className={`brand ${inverse ? "inverse" : ""}`}>
    <span className="mark" aria-hidden="true"><i/><i/><i/></span>
    {!compact && <span>HelpDesk</span>}
  </div>;
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}><span className="badge-dot"/>{children}</span>;
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const submit = () => { setLoading(true); window.setTimeout(() => { setLoading(false); onLogin(); }, 650); };
  return <main className="login-page">
    <section className="login-story">
      <Mark inverse />
      <div className="story-copy">
        <div className="eyebrow-light"><span/> Atendimento que flui</div>
        <h1>Clareza para resolver.<br/>Confiança para avançar.</h1>
        <p>Organize solicitações, aproxime equipes e transforme cada atendimento em uma experiência simples.</p>
      </div>
      <div className="ticket-orbit" aria-hidden="true">
        <div className="orbit-line one"/><div className="orbit-line two"/>
        <div className="orbit-card main"><span className="orbit-icon"><Icon name="message"/></span><div><b>Solicitação recebida</b><small>Equipe de suporte · agora</small></div><span className="orbit-check"><Icon name="check" size={14}/></span></div>
        <div className="orbit-card mini"><span className="pulse"/><div><b>Em atendimento</b><small>SLA dentro do prazo</small></div></div>
      </div>
      <p className="story-foot">Suporte mais humano. Operação mais inteligente.</p>
    </section>
    <section className="login-form-wrap">
      <div className="mobile-brand"><Mark/></div>
      <form className="login-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="form-symbol"><span className="mark"><i/><i/><i/></span></div>
        <h2>Bem-vindo de volta</h2>
        <p>Entre na sua conta para continuar.</p>
        <label>E-mail<div className="field"><input type="email" defaultValue="gabriel@empresa.com" aria-label="E-mail"/></div></label>
        <label>Senha<div className="field"><input type={show ? "text" : "password"} defaultValue="helpdesk123" aria-label="Senha"/><button type="button" className="icon-btn" onClick={() => setShow(!show)} aria-label="Mostrar senha"><Icon name="eye"/></button></div></label>
        <div className="login-row"><label className="check-label"><input type="checkbox" defaultChecked/><span><Icon name="check" size={12}/></span>Lembrar de mim</label><button type="button" className="link">Esqueci minha senha</button></div>
        <button className="btn primary login-btn" disabled={loading}>{loading ? <><span className="spinner"/>Entrando...</> : "Entrar"}</button>
        <p className="secure-note">Acesso seguro e protegido para sua equipe.</p>
      </form>
    </section>
  </main>;
}

function Sidebar({ page, setPage, open, close, collapsed, setCollapsed, logout }: { page: Page; setPage: (p: Page) => void; open: boolean; close: () => void; collapsed: boolean; setCollapsed: (v: boolean) => void; logout: () => void }) {
  const links: { label: string; icon: string; page: Page }[] = [
    { label: "Dashboard", icon: "grid", page: "dashboard" }, { label: "Chamados", icon: "ticket", page: "tickets" },
    { label: "Usuários", icon: "users", page: "users" }, { label: "Relatórios", icon: "chart", page: "reports" }, { label: "Configurações", icon: "settings", page: "settings" },
  ];
  return <>
    {open && <button className="scrim" onClick={close} aria-label="Fechar menu"/>}
    <aside className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
      <div className="side-head"><Mark compact={collapsed}/><button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Recolher menu"><Icon name="chevron" size={15}/></button></div>
      <nav>{links.map((item) => <button key={item.page} className={page === item.page || (item.page === "tickets" && ["ticket","new"].includes(page)) ? "active" : ""} onClick={() => { setPage(item.page); close(); }}><Icon name={item.icon}/><span>{item.label}</span>{item.page === "tickets" && <em>8</em>}</button>)}</nav>
      <div className="side-bottom">
        <button className="profile-mini"><span className="avatar">GS</span><span className="profile-copy"><b>Gabriel Silva</b><small>Administrador</small></span><Icon name="dots"/></button>
        <button className="logout" onClick={logout}><Icon name="logout"/><span>Sair</span></button>
      </div>
    </aside>
  </>;
}

function Header({ title, openMenu }: { title: string; openMenu: () => void }) {
  return <header className="topbar"><button className="mobile-menu" onClick={openMenu} aria-label="Abrir menu"><Icon name="menu"/></button><div><small>Workspace /</small><b>{title}</b></div><div className="top-actions"><label className="top-search"><Icon name="search"/><input placeholder="Buscar..."/><kbd>⌘ K</kbd></label><button className="round-btn" aria-label="Notificações"><Icon name="bell"/><i/></button><span className="avatar">GS</span></div></header>;
}

const statusTone = (s: string) => s === "Resolvido" ? "success" : s === "Em andamento" ? "warning" : s === "Aberto" ? "info" : "neutral";
const priorityTone = (s: string) => s === "Crítica" ? "danger" : s === "Alta" ? "warning" : s === "Baixa" ? "success" : "neutral";

function Metric({ label, value, note, tone, icon }: { label: string; value: string; note: string; tone: string; icon: string }) {
  return <article className="metric"><div className={`metric-icon ${tone}`}><Icon name={icon}/></div><div className="metric-label">{label}<button aria-label="Mais informações">···</button></div><strong>{value}</strong><small>{note}</small></article>;
}

function Dashboard({ go, role, setRole }: { go: (p: Page) => void; role: Role; setRole: (r: Role) => void }) {
  const stats = role === "CUSTOMER"
    ? [["Meus chamados","12","2 novos este mês","info","ticket"],["Abertos","3","Aguardando atendimento","warning","clock"],["Em andamento","2","Com a equipe técnica","primary","message"],["Resolvidos","7","58% do total","success","check"]]
    : role === "TECHNICIAN"
    ? [["Atribuídos a mim","18","4 novos hoje","info","ticket"],["Pendentes","6","Precisam de resposta","warning","clock"],["Em andamento","8","Dentro do esperado","primary","message"],["SLA em risco","2","Requer atenção","danger","bell"]]
    : [["Total de chamados","248","+12% no período","info","ticket"],["Abertos","24","9,7% do total","warning","clock"],["Em andamento","18","7 atribuídos hoje","primary","message"],["Resolvidos","206","83% de resolução","success","check"],["SLA em risco","3","1,2% do total","danger","bell"]];
  return <div className="page">
    <div className="page-heading dashboard-heading"><div><span className="eyebrow">VISÃO GERAL</span><h1>Bom dia, Gabriel</h1><p>Aqui está um resumo dos seus atendimentos.</p></div><div className="heading-actions"><select value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="Visualizar perfil"><option value="ADMIN">Visão de Admin</option><option value="TECHNICIAN">Visão de Técnico</option><option value="CUSTOMER">Visão de Cliente</option></select><button className="btn primary" onClick={() => go("new")}><Icon name="plus"/>Novo chamado</button></div></div>
    <section className={`metrics ${stats.length === 5 ? "five" : ""}`}>{stats.map((s) => <Metric key={s[0]} label={s[0]} value={s[1]} note={s[2]} tone={s[3]} icon={s[4]}/>)}</section>
    <div className="dashboard-grid">
      <section className="panel recent"><div className="panel-title"><div><h2>Chamados recentes</h2><p>Últimas atualizações da sua equipe</p></div><button className="link" onClick={() => go("tickets")}>Ver todos <Icon name="chevron" size={14}/></button></div><TicketTable rows={tickets.slice(0,4)} onOpen={() => go("ticket")} compact/></section>
      <aside className="panel activity"><div className="panel-title"><div><h2>Atividade recente</h2><p>Hoje, 18 de junho</p></div><button className="icon-btn"><Icon name="dots"/></button></div>
        <div className="activity-list">
          <Activity initials="JL" color="blue" text={<><b>João</b> atualizou o status de <strong>#1042</strong></>} time="Há 8 min"/>
          <Activity initials="MC" color="mint" text={<><b>Marina</b> respondeu ao chamado <strong>#1041</strong></>} time="Há 26 min"/>
          <Activity initials="CM" color="amber" text={<><b>Caio</b> resolveu o chamado <strong>#1038</strong></>} time="Há 1h"/>
          <Activity initials="GS" color="violet" text={<><b>Você</b> atribuiu o chamado <strong>#1036</strong></>} time="Há 2h"/>
        </div>
      </aside>
    </div>
    <section className="sla-strip"><div><span className="sla-icon"><Icon name="clock"/></span><div><h3>Desempenho de SLA</h3><p>96,8% dos chamados dentro do prazo neste mês</p></div></div><div className="sla-progress"><span><i style={{width:"96.8%"}}/></span><b>96,8%</b></div><button className="btn ghost">Ver relatório</button></section>
  </div>;
}

function Activity({ initials, color, text, time }: { initials: string; color: string; text: ReactNode; time: string }) {
  return <div className="activity-item"><span className={`avatar ${color}`}>{initials}</span><div><p>{text}</p><small>{time}</small></div></div>;
}

function TicketTable({ rows, onOpen, compact = false }: { rows: typeof tickets; onOpen: () => void; compact?: boolean }) {
  return <div className={`table-wrap ${compact ? "compact" : ""}`}><table><thead><tr><th>Chamado</th><th>Status</th>{!compact && <th>Prioridade</th>}<th>Responsável</th><th>Atualizado</th><th>SLA</th><th/></tr></thead><tbody>{rows.map((t) => <tr key={t.id} onClick={onOpen}><td><small>{t.id}</small><b>{t.title}</b></td><td><Badge tone={statusTone(t.status)}>{t.status}</Badge></td>{!compact && <td><Badge tone={priorityTone(t.priority)}>{t.priority}</Badge></td>}<td><span className="owner-avatar">{t.owner.split(" ").map(w=>w[0]).join("")}</span>{t.owner}</td><td>{t.updated}</td><td><span className={`sla-text ${t.tone}`}><Icon name="clock" size={14}/>{t.sla}</span></td><td><button className="icon-btn"><Icon name="dots"/></button></td></tr>)}</tbody></table></div>;
}

function Tickets({ go }: { go: (p: Page) => void }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => tickets.filter(t => `${t.id} ${t.title}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow">ATENDIMENTO</span><h1>Chamados</h1><p>Acompanhe e gerencie todas as solicitações.</p></div><button className="btn primary" onClick={() => go("new")}><Icon name="plus"/>Novo chamado</button></div>
    <section className="panel tickets-panel">
      <div className="toolbar"><label className="search-field"><Icon name="search"/><input placeholder="Buscar chamados..." value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="filter-actions"><button className="btn outline" onClick={() => setFilterOpen(!filterOpen)}><Icon name="filter"/>Filtros <span className="filter-count">2</span></button><select><option>Mais recentes</option><option>Mais antigos</option></select></div></div>
      {filterOpen && <div className="filters"><label>Status<select><option>Todos os status</option><option>Aberto</option></select></label><label>Prioridade<select><option>Todas</option><option>Alta</option></select></label><label>Responsável<select><option>Toda a equipe</option></select></label><label>Período<select><option>Últimos 30 dias</option></select></label><button className="link">Limpar filtros</button></div>}
      <TicketTable rows={filtered} onOpen={() => go("ticket")}/>
      <div className="pagination"><p>Mostrando <b>1–{filtered.length}</b> de <b>248</b> chamados</p><div><button disabled><Icon name="arrow" size={15}/></button><button className="active">1</button><button>2</button><button>3</button><span>…</span><button>25</button><button><Icon name="chevron" size={15}/></button></div></div>
    </section>
  </div>;
}

function TicketDetail({ go }: { go: (p: Page) => void }) {
  return <div className="page detail-page">
    <button className="back-link" onClick={() => go("tickets")}><Icon name="arrow"/>Voltar para chamados</button>
    <div className="detail-heading"><div><div className="ticket-kicker"><span>#1042</span><Badge tone="warning">Em andamento</Badge></div><h1>VPN não conecta</h1><p>Criado hoje, às 09:42 por Gabriel Silva</p></div><div><button className="btn outline">Mais ações <Icon name="down" size={15}/></button><button className="btn primary"><Icon name="check"/>Resolver chamado</button></div></div>
    <div className="detail-layout">
      <main className="detail-main">
        <section className="panel detail-section"><h2>Descrição</h2><p>Não consigo me conectar à VPN da empresa desde a atualização de ontem. O cliente apresenta a mensagem “Falha ao estabelecer conexão segura”. Já reiniciei o computador e refiz as credenciais, mas o erro continua.</p><div className="attachment"><span><Icon name="ticket"/></span><div><b>captura-erro-vpn.png</b><small>PNG · 428 KB</small></div><button className="link">Baixar</button></div></section>
        <section className="panel detail-section"><div className="panel-title"><div><h2>Atividade</h2><p>Histórico deste chamado</p></div><div className="segmented"><button className="active">Todos</button><button>Comentários</button></div></div>
          <div className="timeline">
            <Timeline icon="message" title="Comentário adicionado" meta="10:15 · João Lima"><p>Estou analisando os logs de autenticação. Pode confirmar se o erro também ocorre fora da rede do escritório?</p></Timeline>
            <Timeline icon="clock" title="Status alterado" meta="10:02 · João Lima"><span>Aberto</span><Icon name="chevron" size={14}/><Badge tone="warning">Em andamento</Badge></Timeline>
            <Timeline icon="users" title="Técnico atribuído" meta="09:48 · Marina Costa"><p>João Lima assumiu este chamado.</p></Timeline>
            <Timeline icon="ticket" title="Chamado criado" meta="09:42 · Gabriel Silva"/>
          </div>
          <div className="comment-box"><span className="avatar">GS</span><div><textarea placeholder="Escreva um comentário..."/><div><small>Somente pessoas deste chamado verão.</small><button className="btn primary">Comentar</button></div></div></div>
        </section>
      </main>
      <aside className="panel detail-aside"><h2>Detalhes</h2><DetailRow label="Status"><Badge tone="warning">Em andamento</Badge></DetailRow><DetailRow label="Prioridade"><Badge tone="warning">Alta</Badge></DetailRow><DetailRow label="SLA"><span className="sla-text warning"><Icon name="clock" size={14}/>1h 24m restantes</span></DetailRow><hr/><DetailRow label="Responsável"><span className="person"><span className="owner-avatar">JL</span>João Lima</span></DetailRow><DetailRow label="Cliente"><span className="person"><span className="owner-avatar purple">GS</span>Gabriel Silva</span></DetailRow><DetailRow label="Categoria">Acesso e segurança</DetailRow><DetailRow label="Canal">Portal</DetailRow><hr/><div className="sla-card"><div><b>Prazo de resolução</b><span>75% decorrido</span></div><div className="bar"><i/></div><small>Hoje, 13:42</small></div></aside>
    </div>
  </div>;
}

function Timeline({ icon, title, meta, children }: { icon: string; title: string; meta: string; children?: ReactNode }) {
  return <div className="timeline-item"><span className="timeline-icon"><Icon name={icon}/></span><div><div className="timeline-head"><b>{title}</b><small>{meta}</small></div>{children && <div className="timeline-content">{children}</div>}</div></div>;
}
function DetailRow({ label, children }: { label: string; children: ReactNode }) { return <div className="detail-row"><span>{label}</span><div>{children}</div></div>; }

function NewTicket({ go }: { go: (p: Page) => void }) {
  const [sent, setSent] = useState(false);
  return <div className="page form-page">
    <button className="back-link" onClick={() => go("tickets")}><Icon name="arrow"/>Voltar para chamados</button>
    <div className="page-heading"><div><span className="eyebrow">NOVA SOLICITAÇÃO</span><h1>Abrir novo chamado</h1><p>Conte o que aconteceu. Nossa equipe cuidará do restante.</p></div></div>
    {sent ? <section className="panel success-state"><span><Icon name="check" size={28}/></span><h2>Chamado enviado com sucesso</h2><p>Recebemos sua solicitação e avisaremos quando houver novidades.</p><button className="btn primary" onClick={() => go("ticket")}>Ver chamado #1043</button></section> :
    <form className="panel ticket-form" onSubmit={e=>{e.preventDefault();setSent(true);}}>
      <div className="form-section"><div className="section-number">1</div><div className="section-fields"><h2>Sobre o chamado</h2><p>Use um título curto e escolha a categoria mais próxima.</p><label>Título<span>*</span><input required placeholder="Ex.: Não consigo acessar minha conta"/></label><div className="form-grid"><label>Categoria<span>*</span><select required defaultValue=""><option value="" disabled>Selecione uma categoria</option><option>Acesso e segurança</option><option>Equipamentos</option></select></label><label>Prioridade<span>*</span><select defaultValue="Média"><option>Baixa</option><option>Média</option><option>Alta</option><option>Crítica</option></select></label></div></div></div>
      <div className="form-divider"/>
      <div className="form-section"><div className="section-number">2</div><div className="section-fields"><h2>O que aconteceu?</h2><p>Inclua detalhes que ajudem nossa equipe a entender o problema.</p><label>Descrição<span>*</span><textarea required placeholder="Descreva o problema, quando começou e o que você já tentou..."/></label><label className="upload"><Icon name="ticket"/><b>Arraste um arquivo ou <span>selecione</span></b><small>PNG, JPG ou PDF · máximo de 10 MB</small><input type="file"/></label></div></div>
      <div className="form-actions"><button type="button" className="btn ghost" onClick={()=>go("tickets")}>Cancelar</button><button className="btn primary">Enviar chamado</button></div>
    </form>}
  </div>;
}

function Users() {
  const users = [["Marina Costa","marina@empresa.com","ADMIN","Ativo","12 mar 2024"],["João Lima","joao@empresa.com","TECHNICIAN","Ativo","04 abr 2024"],["Caio Mendes","caio@empresa.com","TECHNICIAN","Ativo","18 abr 2024"],["Gabriel Silva","gabriel@empresa.com","CUSTOMER","Ativo","02 mai 2024"],["Ana Souza","ana@empresa.com","CUSTOMER","Inativo","16 mai 2024"]];
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">ADMINISTRAÇÃO</span><h1>Usuários</h1><p>Gerencie pessoas, acessos e funções da organização.</p></div><button className="btn primary"><Icon name="plus"/>Convidar usuário</button></div><section className="panel tickets-panel"><div className="toolbar"><label className="search-field"><Icon name="search"/><input placeholder="Buscar por nome ou e-mail..."/></label><div className="filter-actions"><button className="btn outline"><Icon name="filter"/>Função</button><button className="btn outline">Status <Icon name="down" size={14}/></button></div></div><div className="table-wrap"><table><thead><tr><th>Usuário</th><th>Função</th><th>Status</th><th>Data de criação</th><th/></tr></thead><tbody>{users.map((u,i)=><tr key={u[1]}><td><span className={`owner-avatar c${i}`}>{u[0].split(" ").map(w=>w[0]).join("")}</span><span className="user-cell"><b>{u[0]}</b><small>{u[1]}</small></span></td><td><span className="role-badge">{u[2]}</span></td><td><Badge tone={u[3]==="Ativo"?"success":"neutral"}>{u[3]}</Badge></td><td>{u[4]}</td><td><button className="icon-btn"><Icon name="dots"/></button></td></tr>)}</tbody></table></div><div className="pagination"><p>5 usuários na organização</p></div></section></div>;
}

function Settings() {
  const [tab,setTab]=useState("Perfil");
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">PREFERÊNCIAS</span><h1>Configurações</h1><p>Gerencie seu perfil e as preferências da conta.</p></div></div><div className="settings-layout"><nav className="settings-nav">{["Perfil","Conta","Preferências","Notificações"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}</button>)}</nav><section className="panel settings-panel"><div className="settings-title"><h2>{tab}</h2><p>{tab==="Perfil"?"Atualize suas informações pessoais e sua foto.":"Configure como o HelpDesk funciona para você."}</p></div>{tab==="Perfil"?<><div className="photo-row"><span className="avatar large">GS</span><div><button className="btn outline">Alterar foto</button><button className="btn ghost danger-text">Remover</button><small>JPG ou PNG. Máximo de 2 MB.</small></div></div><div className="settings-fields"><div className="form-grid"><label>Nome<input defaultValue="Gabriel"/></label><label>Sobrenome<input defaultValue="Silva"/></label></div><label>E-mail<input defaultValue="gabriel@empresa.com"/></label><label>Cargo<input defaultValue="Administrador de TI"/></label></div></>:<div className="preference-list"><Toggle title="Atualizações de chamados" text="Receba um aviso quando um chamado for atualizado."/><Toggle title="Resumo semanal" text="Um relatório compacto toda segunda-feira."/><Toggle title="Sons da interface" text="Reproduzir sons sutis para novas notificações." off/></div>}<div className="settings-save"><button className="btn primary">Salvar alterações</button></div></section></div></div>;
}
function Toggle({title,text,off=false}:{title:string;text:string;off?:boolean}){const [on,setOn]=useState(!off);return <div className="toggle-row"><div><b>{title}</b><p>{text}</p></div><button className={`switch ${on?"on":""}`} onClick={()=>setOn(!on)} aria-label={title}><i/></button></div>}

function Reports() { return <div className="page"><div className="page-heading"><div><span className="eyebrow">ANÁLISE</span><h1>Relatórios</h1><p>Entenda o desempenho da operação sem perder o foco.</p></div><button className="btn outline">Últimos 30 dias <Icon name="down" size={15}/></button></div><div className="report-grid"><section className="panel report-main"><div className="panel-title"><div><h2>Chamados por período</h2><p>Volume de solicitações recebidas e resolvidas</p></div><div className="legend"><span className="received">Recebidos</span><span className="resolved">Resolvidos</span></div></div><div className="chart"><div className="chart-lines"><i/><i/><i/><i/></div>{[55,70,48,82,65,76,58].map((h,i)=><div className="bar-group" key={i}><div><i style={{height:`${h}%`}}/><i style={{height:`${h-10}%`}}/></div><span>{["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"][i]}</span></div>)}</div></section><section className="panel report-side"><h2>Qualidade do atendimento</h2><div className="score-ring"><div><b>94</b><span>/100</span></div></div><p>Excelente desempenho</p><small>+4 pontos comparado ao período anterior</small></section></div></div> }

function AppShell({ logout }: { logout: () => void }) {
  const [page,setPage]=useState<Page>("dashboard");
  const [role,setRole]=useState<Role>("ADMIN");
  const [drawer,setDrawer]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  const titles:Record<Page,string>={dashboard:"Dashboard",tickets:"Chamados",ticket:"Chamado #1042",new:"Novo chamado",users:"Usuários",reports:"Relatórios",settings:"Configurações"};
  return <div className={`app-shell ${collapsed?"side-collapsed":""}`}><Sidebar page={page} setPage={setPage} open={drawer} close={()=>setDrawer(false)} collapsed={collapsed} setCollapsed={setCollapsed} logout={logout}/><div className="main-area"><Header title={titles[page]} openMenu={()=>setDrawer(true)}/>{page==="dashboard"&&<Dashboard go={setPage} role={role} setRole={setRole}/>} {page==="tickets"&&<Tickets go={setPage}/>} {page==="ticket"&&<TicketDetail go={setPage}/>} {page==="new"&&<NewTicket go={setPage}/>} {page==="users"&&<Users/>} {page==="settings"&&<Settings/>} {page==="reports"&&<Reports/>}</div></div>;
}

export default function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  return loggedIn ? <AppShell logout={()=>setLoggedIn(false)}/> : <Login onLogin={()=>setLoggedIn(true)}/>;
}

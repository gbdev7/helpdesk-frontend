import { useMemo, useState, type ReactNode } from "react";
import { api } from "./services/api";
import { useQuery } from "@tanstack/react-query";

type Page = "dashboard" | "tickets" | "ticket" | "new" | "users" | "reports" | "settings";
type Role = "ADMIN" | "TECHNICIAN" | "CUSTOMER";

// Mapeia o TicketResponseDTO do backend para o formato visual do frontend
const mapTicketToFrontend = (backendTicket: any) => {
  const statusMap: any = { OPEN: "Aberto", IN_PROGRESS: "Em andamento", RESOLVED: "Resolvido", CLOSED: "Fechado" };
  const priorityMap: any = { LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta", CRITICAL: "Crítica" };

  const statusTranslated = statusMap[backendTicket.status] || "Aberto";

  return {
    id: `#${backendTicket.id}`,
    rawId: backendTicket.id,
    title: backendTicket.title,
    description: backendTicket.description || "",
    status: statusTranslated,
    priority: priorityMap[backendTicket.priority] || "Média",
    owner: backendTicket.technicianName || backendTicket.customerName || "Não atribuído",
    updated: new Date(backendTicket.createdAt).toLocaleDateString(),
    sla: "Dentro do prazo",
    tone: statusTranslated === "Resolvido" ? "success" : statusTranslated === "Em andamento" ? "warning" : "info"
  };
};

// Hook que consome o endpoint GET /tickets do Spring Boot
export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await api.get("/tickets");
      const content = response.data.content || response.data;
      return content.map(mapTicketToFrontend);
    },
  });
}

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
  const [email, setEmail] = useState("gabriel@empresa.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("@HelpDesk:token", token);
      onLogin();
    } catch (err: any) {
      setError(err.message || "E-mail ou palavra-passe incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="login-page">
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
          <form className="login-form" onSubmit={submit}>
            <div className="form-symbol"><span className="mark"><i/><i/><i/></span></div>
            <h2>Bem-vindo de volta</h2>
            <p>Entre na sua conta para continuar.</p>

            <label>
              E-mail
              <div className="field">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="E-mail"
                />
              </div>
            </label>

            <label>
              Senha
              <div className="field">
                <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Senha"
                />
                <button type="button" className="icon-btn" onClick={() => setShow(!show)} aria-label="Mostrar senha">
                  <Icon name="eye"/>
                </button>
              </div>
            </label>

            <div className="login-row">
              <label className="check-label"><input type="checkbox" defaultChecked/><span><Icon name="check" size={12}/></span>Lembrar de mim</label>
              <button type="button" className="link">Esqueci minha senha</button>
            </div>

            {error && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>{error}</div>}

            <button type="submit" className="btn primary login-btn" disabled={loading}>
              {loading ? <><span className="spinner"/>Entrando...</> : "Entrar"}
            </button>
            <p className="secure-note">Acesso seguro e protegido para sua equipe.</p>
          </form>
        </section>
      </main>
  );
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

function Dashboard({ go, role, setRole, onSelectTicket }: { go: (p: Page) => void; role: Role; setRole: (r: Role) => void; onSelectTicket: (t: any) => void }) {
  const { data: ticketsData = [], isLoading, isError } = useTickets();

  const total = ticketsData.length;
  const abertos = ticketsData.filter((t: any) => t.status === "Aberto").length;
  const emAndamento = ticketsData.filter((t: any) => t.status === "Em andamento").length;
  const resolvidos = ticketsData.filter((t: any) => t.status === "Resolvido").length;

  const stats = [
    ["Total de chamados", total.toString(), "Registrados na base", "info", "ticket"],
    ["Abertos", abertos.toString(), "Aguardando atendimento", "warning", "clock"],
    ["Em andamento", emAndamento.toString(), "Em atendimento", "primary", "message"],
    ["Resolvidos", resolvidos.toString(), "Concluídos", "success", "check"]
  ];

  return <div className="page">
    <div className="page-heading dashboard-heading"><div><span className="eyebrow">VISÃO GERAL</span><h1>Painel de Atendimento</h1><p>Resumo em tempo real da base de dados.</p></div><div className="heading-actions"><button className="btn primary" onClick={() => go("new")}><Icon name="plus"/>Novo chamado</button></div></div>
    <section className="metrics">{stats.map((s) => <Metric key={s[0]} label={s[0]} value={s[1]} note={s[2]} tone={s[3]} icon={s[4]}/>)}</section>
    <div className="dashboard-grid">
      <section className="panel recent">
        <div className="panel-title"><div><h2>Chamados recentes</h2><p>Últimas solicitações registradas</p></div><button className="link" onClick={() => go("tickets")}>Ver todos <Icon name="chevron" size={14}/></button></div>
        {isLoading ? <p style={{padding: '2rem', textAlign: 'center'}}>Carregando...</p> : isError ? <p style={{padding: '2rem', color: 'red'}}>Erro ao carregar dados.</p> : ticketsData.length === 0 ? <p style={{padding: '2rem', textAlign: 'center'}}>Nenhum chamado encontrado.</p> : <TicketTable rows={ticketsData.slice(0,5)} onOpen={(t) => { onSelectTicket(t); go("ticket"); }} compact/>}
      </section>
      <aside className="panel activity"><div className="panel-title"><div><h2>Status da API</h2><p>Conexão ativa</p></div></div>
        <div className="activity-list">
          <Activity initials="DB" color="mint" text={<>Integração com <b>PostgreSQL</b> operando normalmente.</>} time="Ativo"/>
        </div>
      </aside>
    </div>
  </div>;
}

function Activity({ initials, color, text, time }: { initials: string; color: string; text: ReactNode; time: string }) {
  return <div className="activity-item"><span className={`avatar ${color}`}>{initials}</span><div><p>{text}</p><small>{time}</small></div></div>;
}

function TicketTable({ rows, onOpen, compact = false }: { rows: any[]; onOpen: (t: any) => void; compact?: boolean }) {
  return <div className={`table-wrap ${compact ? "compact" : ""}`}><table><thead><tr><th>Chamado</th><th>Status</th>{!compact && <th>Prioridade</th>}<th>Responsável</th><th>Atualizado</th><th>SLA</th><th/></tr></thead><tbody>{rows.map((t) => <tr key={t.id} onClick={() => onOpen(t)} style={{ cursor: "pointer" }}><td><small>{t.id}</small><b>{t.title}</b></td><td><Badge tone={statusTone(t.status)}>{t.status}</Badge></td>{!compact && <td><Badge tone={priorityTone(t.priority)}>{t.priority}</Badge></td>}<td><span className="owner-avatar">{t.owner.split(" ").map((w:string)=>w[0]).join("")}</span>{t.owner}</td><td>{t.updated}</td><td><span className={`sla-text ${t.tone}`}><Icon name="clock" size={14}/>{t.sla}</span></td><td><button className="icon-btn"><Icon name="dots"/></button></td></tr>)}</tbody></table></div>;
}

function Tickets({ go, onSelectTicket }: { go: (p: Page) => void; onSelectTicket: (t: any) => void }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: ticketsData = [], isLoading, isError } = useTickets();
  const filtered = useMemo(() => ticketsData.filter((t: any) => `${t.id} ${t.title}`.toLowerCase().includes(query.toLowerCase())), [query, ticketsData]);

  return <div className="page">
    <div className="page-heading"><div><span className="eyebrow">ATENDIMENTO</span><h1>Chamados</h1><p>Acompanhe e gerencie todas as solicitações.</p></div><button className="btn primary" onClick={() => go("new")}><Icon name="plus"/>Novo chamado</button></div>
    <section className="panel tickets-panel">
      <div className="toolbar"><label className="search-field"><Icon name="search"/><input placeholder="Buscar chamados..." value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="filter-actions"><button className="btn outline" onClick={() => setFilterOpen(!filterOpen)}><Icon name="filter"/>Filtros <span className="filter-count">2</span></button><select><option>Mais recentes</option><option>Mais antigos</option></select></div></div>
      {filterOpen && <div className="filters"><label>Status<select><option>Todos os status</option><option>Aberto</option></select></label><label>Prioridade<select><option>Todas</option><option>Alta</option></select></label><label>Responsável<select><option>Toda a equipe</option></select></label><label>Período<select><option>Últimos 30 dias</option></select></label><button className="link">Limpar filtros</button></div>}

      {isLoading && <div style={{padding: '3rem', textAlign: 'center'}}>A carregar chamados reais...</div>}
      {isError && <div style={{padding: '3rem', textAlign: 'center', color: 'red'}}>Erro ao comunicar com a API de chamados.</div>}
      {!isLoading && !isError && filtered.length === 0 && <div style={{padding: '3rem', textAlign: 'center'}}>Nenhum chamado encontrado na base de dados.</div>}
      {!isLoading && !isError && filtered.length > 0 && <TicketTable rows={filtered} onOpen={(t) => { onSelectTicket(t); go("ticket"); }}/>}

      <div className="pagination"><p>Total de chamados listados: <b>{filtered.length}</b></p></div>
    </section>
  </div>;
}

function TicketDetail({ ticket, go }: { ticket: any; go: (p: Page) => void }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  if (!ticket) {
    return <div className="page"><button className="back-link" onClick={() => go("tickets")}><Icon name="arrow"/>Voltar para chamados</button><p style={{ padding: '2rem' }}>Selecione um chamado na lista.</p></div>;
  }

  const rawId = ticket.rawId || ticket.id.toString().replace(/\D/g, "");

  const { data: comments = [], refetch } = useQuery({
    queryKey: ["comments", rawId],
    queryFn: async () => {
      const response = await api.get(`/tickets/${rawId}/comments`);
      return response.data;
    },
    enabled: !!rawId
  });

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    setError("");

    try {
      await api.post(`/tickets/${rawId}/comments`, { content: comment });
      setComment("");
      refetch();
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar comentário.");
    } finally {
      setLoading(false);
    }
  };

  // Função para alterar o status do chamado via PATCH /api/v1/tickets/{id}/status
  const handleStatusChange = async (newStatusEnum: string) => {
    setUpdatingStatus(true);
    try {
      await api.patch(`/tickets/${rawId}/status`, { status: newStatusEnum });

      // Atualiza o objeto do ticket localmente para feedback imediato na tela
      const statusMap: Record<string, string> = { OPEN: "Aberto", IN_PROGRESS: "Em andamento", RESOLVED: "Resolvido", CLOSED: "Fechado" };
      ticket.status = statusMap[newStatusEnum] || "Aberto";
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar o status do chamado.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return <div className="page detail-page">
    <button className="back-link" onClick={() => go("tickets")}><Icon name="arrow"/>Voltar para chamados</button>
    <div className="detail-heading">
      <div>
        <div className="ticket-kicker"><span>{ticket.id}</span><Badge tone={statusTone(ticket.status)}>{ticket.status}</Badge></div>
        <h1>{ticket.title}</h1>
        <p>Atualizado em {ticket.updated}</p>
      </div>

      {/* Ações de mudança de status */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {ticket.status !== "Resolvido" && (
            <button
                className="btn primary"
                onClick={() => handleStatusChange("RESOLVED")}
                disabled={updatingStatus}
            >
              <Icon name="check"/>
              {updatingStatus ? "Atualizando..." : "Resolver chamado"}
            </button>
        )}

        {ticket.status === "Aberto" && (
            <button
                className="btn outline"
                onClick={() => handleStatusChange("IN_PROGRESS")}
                disabled={updatingStatus}
            >
              Em andamento
            </button>
        )}
      </div>
    </div>

    <div className="detail-layout">
      <main className="detail-main">
        <section className="panel detail-section">
          <h2>Detalhes da Solicitação</h2>
          <p>{ticket.description || "Nenhuma descrição detalhada fornecida para este chamado."}</p>
        </section>

        <section className="panel detail-section">
          <div className="panel-title"><h2>Comentários</h2></div>
          <div className="timeline" style={{ marginBottom: '1.5rem' }}>
            {comments.length === 0 ? <p style={{ color: '#666', fontSize: '0.9rem' }}>Nenhum comentário até o momento.</p> :
                comments.map((c: any) => (
                    <div key={c.id} className="timeline-item" style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>
                      <b>{c.userName || c.userEmail || "Usuário"}:</b>
                      <p style={{ margin: '0.25rem 0' }}>{c.text || c.content}</p>
                      <small style={{ color: '#888' }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "Agora"}</small>
                    </div>
                ))
            }
          </div>

          <form onSubmit={handleAddComment} className="comment-box">
            <div style={{ width: '100%' }}>
              <textarea
                  placeholder="Escreva um comentário ou atualização..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
              />
              {error && <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? "Enviando..." : "Comentar"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>

      <aside className="panel detail-aside">
        <h2>Informações</h2>
        <DetailRow label="Status">
          <select
              value={
                ticket.status === "Aberto" ? "OPEN" :
                    ticket.status === "Em andamento" ? "IN_PROGRESS" :
                        ticket.status === "Resolvido" ? "RESOLVED" : "CLOSED"
              }
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="OPEN">Aberto</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="RESOLVED">Resolvido</option>
            <option value="CLOSED">Fechado</option>
          </select>
        </DetailRow>
        <DetailRow label="Prioridade"><Badge tone={priorityTone(ticket.priority)}>{ticket.priority}</Badge></DetailRow>
        <DetailRow label="Responsável">{ticket.owner}</DetailRow>
      </aside>
    </div>
  </div>;
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) { return <div className="detail-row"><span>{label}</span><div>{children}</div></div>; }

function NewTicket({ go }: { go: (p: Page) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const priorityMap: Record<string, string> = {
      "Baixa": "LOW",
      "Média": "MEDIUM",
      "Alta": "HIGH",
      "Crítica": "CRITICAL"
    };

    try {
      await api.post("/tickets", {
        title,
        description,
        priority: priorityMap[priority] || "MEDIUM"
      });

      setSent(true);
    } catch (err: any) {
      setError(err.message || "Erro ao criar o chamado.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="page form-page">
    <button className="back-link" onClick={() => go("tickets")}><Icon name="arrow"/>Voltar para chamados</button>
    <div className="page-heading"><div><span className="eyebrow">NOVA SOLICITAÇÃO</span><h1>Abrir novo chamado</h1><p>Conte o que aconteceu. Nossa equipe cuidará do restante.</p></div></div>
    {sent ? <section className="panel success-state"><span><Icon name="check" size={28}/></span><h2>Chamado enviado com sucesso</h2><p>Recebemos sua solicitação e ela já foi registrada na base de dados.</p><button className="btn primary" onClick={() => go("tickets")}>Ver meus chamados</button></section> :
        <form className="panel ticket-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="section-number">1</div>
            <div className="section-fields">
              <h2>Sobre o chamado</h2>
              <p>Use um título curto e escolha a prioridade.</p>

              <label>Título<span>*</span>
                <input
                    required
                    placeholder="Ex.: Não consigo acessar minha conta"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <div className="form-grid">
                <label>Prioridade<span>*</span>
                  <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="form-divider"/>

          <div className="form-section">
            <div className="section-number">2</div>
            <div className="section-fields">
              <h2>O que aconteceu?</h2>
              <p>Inclua detalhes que ajudem nossa equipe a entender o problema.</p>

              <label>Descrição<span>*</span>
                <textarea
                    required
                    placeholder="Descreva o problema, quando começou e o que você já tentou..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
          </div>

          {error && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>{error}</div>}

          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={()=>go("tickets")}>Cancelar</button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? <><span className="spinner"/>Enviando...</> : "Enviar chamado"}
            </button>
          </div>
        </form>}
  </div>;
}

function Users() {
  const users = [["Marina Costa","marina@empresa.com","ADMIN","Ativo","12 mar 2024"],["João Lima","joao@empresa.com","TECHNICIAN","Ativo","04 abr 2024"],["Caio Mendes","caio@empresa.com","TECHNICIAN","Ativo","18 abr 2024"],["Gabriel Silva","gabriel@empresa.com","CUSTOMER","Ativo","02 mai 2024"]];
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">ADMINISTRAÇÃO</span><h1>Usuários</h1><p>Gerencie pessoas, acessos e funções da organização.</p></div><button className="btn primary"><Icon name="plus"/>Convidar usuário</button></div><section className="panel tickets-panel"><div className="table-wrap"><table><thead><tr><th>Usuário</th><th>Função</th><th>Status</th><th>Data</th><th/></tr></thead><tbody>{users.map((u,i)=><tr key={u[1]}><td><span className={`owner-avatar c${i}`}>{u[0].split(" ").map(w=>w[0]).join("")}</span><span className="user-cell"><b>{u[0]}</b><small>{u[1]}</small></span></td><td><span className="role-badge">{u[2]}</span></td><td><Badge tone="success">{u[3]}</Badge></td><td>{u[4]}</td><td><button className="icon-btn"><Icon name="dots"/></button></td></tr>)}</tbody></table></div></section></div>;
}

function Settings() {
  const [tab,setTab]=useState("Perfil");
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">PREFERÊNCIAS</span><h1>Configurações</h1><p>Gerencie seu perfil e as preferências da conta.</p></div></div><div className="settings-layout"><nav className="settings-nav">{["Perfil","Conta","Preferências","Notificações"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}</button>)}</nav><section className="panel settings-panel"><div className="settings-title"><h2>{tab}</h2><p>Configure como o HelpDesk funciona para si.</p></div>{tab==="Perfil"?<div className="settings-fields"><label>Nome<input defaultValue="Gabriel Silva"/></label><label>E-mail<input defaultValue="gabriel@empresa.com"/></label></div>:<div className="preference-list"><Toggle title="Atualizações de chamados" text="Receba um aviso quando um chamado for atualizado."/></div>}<div className="settings-save"><button className="btn primary">Salvar alterações</button></div></section></div></div>;
}
function Toggle({title,text}:{title:string;text:string}){const [on,setOn]=useState(true);return <div className="toggle-row"><div><b>{title}</b><p>{text}</p></div><button className={`switch ${on?"on":""}`} onClick={()=>setOn(!on)} aria-label={title}><i/></button></div>}

function Reports() { return <div className="page"><div className="page-heading"><div><span className="eyebrow">ANÁLISE</span><h1>Relatórios</h1><p>Desempenho da operação.</p></div></div><div className="report-grid"><section className="panel report-main"><div className="panel-title"><h2>Métricas gerais</h2></div><p>Sem dados suficientes no momento.</p></section></div></div>; }

function AppShell({ logout }: { logout: () => void }) {
  const [page,setPage]=useState<Page>("dashboard");
  const [role,setRole]=useState<Role>("ADMIN");
  const [drawer,setDrawer]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const titles:Record<Page,string>={dashboard:"Dashboard",tickets:"Chamados",ticket:"Detalhes",new:"Novo chamado",users:"Usuários",reports:"Relatórios",settings:"Configurações"};

  return <div className={`app-shell ${collapsed?"side-collapsed":""}`}><Sidebar page={page} setPage={setPage} open={drawer} close={()=>setDrawer(false)} collapsed={collapsed} setCollapsed={setCollapsed} logout={logout}/><div className="main-area"><Header title={titles[page]} openMenu={()=>setDrawer(true)}/>
    {page==="dashboard"&&<Dashboard go={setPage} role={role} setRole={setRole} onSelectTicket={setSelectedTicket}/>}
    {page==="tickets"&&<Tickets go={setPage} onSelectTicket={setSelectedTicket}/>}
    {page==="ticket"&&<TicketDetail ticket={selectedTicket} go={setPage}/>}
    {page==="new"&&<NewTicket go={setPage}/>}
    {page==="users"&&<Users/>}
    {page==="settings"&&<Settings/>}
    {page==="reports"&&<Reports/>}
  </div></div>;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!localStorage.getItem("@HelpDesk:token");
  });

  const handleLogout = () => {
    localStorage.removeItem("@HelpDesk:token");
    setLoggedIn(false);
  };

  return loggedIn ? <AppShell logout={handleLogout}/> : <Login onLogin={() => setLoggedIn(true)}/>;
}
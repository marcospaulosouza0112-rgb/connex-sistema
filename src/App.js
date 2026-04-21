import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

const EQUIPE = {
  "marcospaulosouza0112@gmail.com": { nome: "Marcos", cor: "#00C07F", avatar: "👑", admin: true },
  "stefanyadm13@gmail.com":         { nome: "Stefany", cor: "#00D4CC", avatar: "👩" },
  "kaikejunior8@gmail.com":         { nome: "Kaike", cor: "#9B59B6", avatar: "👨" },
  "laianegabi2010@hotmail.com":     { nome: "Laiane", cor: "#F5A623", avatar: "👩" },
  "loboleticia25@gmail.com":        { nome: "Leticia", cor: "#E056DA", avatar: "👩" }
};

const C = {
  bg: "#0C1420", side: "#111C2E", card: "#152032", border: "#1E3050",
  accent: "#1E90FF", gold: "#F5A623", green: "#00C07F", red: "#FF4D6D",
  teal: "#00D4CC", white: "#F0F6FF", muted: "#5A7A9A"
};

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
const REGS = ["MEI","Simples Nacional","Lucro Presumido","Lucro Real","Produtor Rural","Imunes/Isentas"];
const SITS = ["Ativa","Inativa"];

const inputStyle = {
  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7,
  padding: "8px 12px", color: C.white, fontSize: 13, outline: "none",
  width: "100%", boxSizing: "border-box"
};

function Campo({ label, value, onChange, type = "text", opts }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
        {label}
      </label>
      {opts ? (
        <select value={value || ""} onChange={e => onChange(e.target.value)} style={inputStyle}>
          <option value="">-- selecione --</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email || !senha) return setErro("Preencha email e senha.");
    setLoading(true);
    setErro("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), senha);
      onLogin(cred.user);
    } catch (e) {
      setErro("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui,sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, background: `linear-gradient(135deg, ${C.accent}, #005FCC)`, borderRadius: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 900, marginBottom: 12 }}>C</div>
          <div style={{ color: C.white, fontWeight: 900, fontSize: 24 }}>CONNEX</div>
          <div style={{ color: C.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>Gestao de Clientes</div>
        </div>
        <div style={{ background: C.side, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Entrar no sistema</div>
          <Campo label="Email" value={email} onChange={setEmail} type="email" />
          <Campo label="Senha" value={senha} onChange={setSenha} type="password" />
          {erro && (
            <div style={{ background: C.red + "20", color: C.red, borderRadius: 7, padding: "8px 12px", fontSize: 12, marginBottom: 12 }}>
              {erro}
            </div>
          )}
          <button onClick={entrar} disabled={loading} style={{ width: "100%", background: loading ? C.border : C.accent, color: "#fff", border: "none", borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 800, cursor: loading ? "wait" : "pointer" }}>
            {loading ? "Verificando..." : "Entrar"}
          </button>
          <div style={{ marginTop: 16, padding: 10, background: "#ffffff06", borderRadius: 8, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.muted, fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Equipe</div>
            {Object.entries(EQUIPE).map(([em, u]) => (
              <div key={em} onClick={() => setEmail(em)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 4px", cursor: "pointer" }}>
                <span>{u.avatar}</span>
                <span style={{ color: u.cor, fontSize: 11, fontWeight: 700 }}>{u.nome}</span>
                <span style={{ color: C.muted, fontSize: 9 }}>{em}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ clientes }) {
  const ativos = clientes.filter(c => c.sit === "Ativa");
  const regimes = {};
  ativos.forEach(c => { regimes[c.regime] = (regimes[c.regime] || 0) + 1; });

  return (
    <div>
      <h2 style={{ color: C.white, fontSize: 18, margin: "0 0 4px" }}>Dashboard <span style={{ color: C.accent }}>Connex</span></h2>
      <p style={{ color: C.muted, fontSize: 12, margin: "0 0 18px" }}>{ativos.length} clientes ativos - Dados em tempo real</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {[
          { l: "Total Ativos", v: ativos.length, c: C.accent },
          { l: "MEI", v: regimes["MEI"] || 0, c: C.teal },
          { l: "Simples Nac.", v: regimes["Simples Nacional"] || 0, c: C.green },
          { l: "Lucro Presumido", v: regimes["Lucro Presumido"] || 0, c: C.gold },
          { l: "Lucro Real", v: regimes["Lucro Real"] || 0, c: "#9B59B6" }
        ].map(k => (
          <div key={k.l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", flex: "1 1 100px", minWidth: 100 }}>
            <div style={{ color: k.c, fontSize: 22, fontWeight: 800 }}>{k.v}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{k.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Clientes({ clientes, onAdd, onUpdate }) {
  const [busca, setBusca] = useState("");
  const [filtroSit, setFiltroSit] = useState("Ativas");
  const [selecionado, setSelecionado] = useState(null);
  const [mostrarNovo, setMostrarNovo] = useState(false);

  const filtrados = clientes.filter(c => {
    const q = busca.toLowerCase();
    const matchBusca = !q || c.nome?.toLowerCase().includes(q) || (c.cnpj || "").includes(q);
    const matchSit = filtroSit === "Todas" || (filtroSit === "Ativas" ? c.sit === "Ativa" : c.sit === "Inativa");
    return matchBusca && matchSit;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <h2 style={{ color: C.white, fontSize: 16, fontWeight: 800, margin: 0 }}>Carteira de Clientes</h2>
          <p style={{ color: C.muted, fontSize: 11, margin: "2px 0 0" }}>{filtrados.length} empresa{filtrados.length !== 1 ? "s" : ""} - {clientes.filter(c => c.sit === "Ativa").length} ativas</p>
        </div>
        <button onClick={() => setMostrarNovo(true)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Novo</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input placeholder="Buscar empresa, CNPJ..." value={busca} onChange={e => setBusca(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
        <select value={filtroSit} onChange={e => setFiltroSit(e.target.value)} style={{ ...inputStyle, width: "auto", minWidth: 120 }}>
          {["Todas", "Ativas", "Inativas"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
        {filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Nenhuma empresa encontrada</div>
        ) : (
          filtrados.map(c => (
            <div key={c.id} onClick={() => setSelecionado(c)} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}22`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{c.nome}</div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{c.cnpj || "sem CNPJ"} - {c.regime} - {c.mun}/{c.uf}</div>
              </div>
              <span style={{ background: c.sit === "Ativa" ? C.green + "22" : C.red + "22", color: c.sit === "Ativa" ? C.green : C.red, padding: "3px 10px", borderRadius: 5, fontSize: 11, fontWeight: 700 }}>{c.sit}</span>
            </div>
          ))
        )}
      </div>

      {selecionado && <ModalCliente c={selecionado} onClose={() => setSelecionado(null)} onSave={onUpdate} />}
      {mostrarNovo && <ModalNovo onClose={() => setMostrarNovo(false)} onAdd={onAdd} />}
    </div>
  );
}

function ModalCliente({ c, onClose, onSave }) {
  const [form, setForm] = useState({ ...c });
  const [editando, setEditando] = useState(false);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000D0", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.side, borderRadius: 14, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto", border: `1px solid ${C.border}`, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>{c.nome}</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{c.regime} - {c.sit}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>X</button>
        </div>

        {!editando ? (
          <>
            <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
              {[["CNPJ", c.cnpj], ["CPF", c.cpf], ["Regime", c.regime], ["Tipo", c.tipo], ["UF/Cidade", `${c.uf}/${c.mun}`], ["Email", c.email], ["Telefone", c.tel]].map(([k, v]) => v && (
                <div key={k} style={{ display: "flex", gap: 12, padding: "6px 0", borderBottom: `1px solid ${C.border}40` }}>
                  <span style={{ color: C.muted, fontSize: 12, minWidth: 120 }}>{k}</span>
                  <span style={{ color: C.white, fontSize: 12 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setEditando(true)} style={{ background: C.gold, color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Editar</button>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
              <Campo label="Nome" value={form.nome} onChange={v => setForm({ ...form, nome: v })} />
              <Campo label="CNPJ" value={form.cnpj} onChange={v => setForm({ ...form, cnpj: v })} />
              <Campo label="Regime" value={form.regime} onChange={v => setForm({ ...form, regime: v })} opts={REGS} />
              <Campo label="Situacao" value={form.sit} onChange={v => setForm({ ...form, sit: v })} opts={SITS} />
              <Campo label="UF" value={form.uf} onChange={v => setForm({ ...form, uf: v })} opts={UFS} />
              <Campo label="Municipio" value={form.mun} onChange={v => setForm({ ...form, mun: v })} />
              <Campo label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
              <Campo label="Telefone" value={form.tel} onChange={v => setForm({ ...form, tel: v })} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => { onSave(c.id, form); setEditando(false); }} style={{ background: C.green, color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Salvar</button>
              <button onClick={() => { setForm({ ...c }); setEditando(false); }} style={{ background: "transparent", color: C.red, border: `1px solid ${C.red}`, borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ModalNovo({ onClose, onAdd }) {
  const [form, setForm] = useState({
    nome: "", cnpj: "", cpf: "", regime: "Simples Nacional", sit: "Ativa",
    uf: "GO", mun: "", email: "", tel: ""
  });

  function salvar() {
    if (!form.nome) return alert("Preencha o nome");
    onAdd(form);
    onClose();
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000D0", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.side, borderRadius: 14, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto", border: `1px solid ${C.border}`, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>+ Novo Cliente</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>X</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <Campo label="Nome / Razao Social *" value={form.nome} onChange={v => setForm({ ...form, nome: v })} />
          </div>
          <Campo label="CNPJ" value={form.cnpj} onChange={v => setForm({ ...form, cnpj: v })} />
          <Campo label="CPF" value={form.cpf} onChange={v => setForm({ ...form, cpf: v })} />
          <Campo label="Regime" value={form.regime} onChange={v => setForm({ ...form, regime: v })} opts={REGS} />
          <Campo label="Situacao" value={form.sit} onChange={v => setForm({ ...form, sit: v })} opts={SITS} />
          <Campo label="UF" value={form.uf} onChange={v => setForm({ ...form, uf: v })} opts={UFS} />
          <Campo label="Municipio" value={form.mun} onChange={v => setForm({ ...form, mun: v })} />
          <Campo label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" />
          <Campo label="Telefone" value={form.tel} onChange={v => setForm({ ...form, tel: v })} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "transparent", color: C.red, border: `1px solid ${C.red}`, borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
          <button onClick={salvar} style={{ background: C.green, color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cadastrar</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined);
  const [clientes, setClientes] = useState([]);
  const [pagina, setPagina] = useState("dashboard");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u || null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "clientes"), snap => {
      setClientes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCarregando(false);
    });
    return unsub;
  }, [user]);

  async function adicionar(dados) {
    await addDoc(collection(db, "clientes"), { ...dados, criadoEm: serverTimestamp() });
  }

  async function atualizar(id, dados) {
    await updateDoc(doc(db, "clientes", id), dados);
  }

  if (user === undefined) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Iniciando...</div>;
  if (!user) return <Login onLogin={setUser} />;
  if (carregando) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Carregando dados...</div>;

  const info = EQUIPE[user.email] || { nome: user.email, cor: C.accent, avatar: "👤" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "system-ui,sans-serif" }}>
      <div style={{ background: C.side, borderBottom: `1px solid ${C.border}`, padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${C.accent}, #005FCC)`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 13 }}>C</div>
          <div style={{ fontWeight: 800, fontSize: 13 }}>CONNEX</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["dashboard", "Dashboard"], ["clientes", "Clientes"]].map(([p, l]) => (
            <button key={p} onClick={() => setPagina(p)} style={{ background: pagina === p ? C.accent + "22" : "transparent", color: pagina === p ? C.accent : C.muted, border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>{info.avatar}</span>
          <span style={{ color: info.cor, fontSize: 12, fontWeight: 700 }}>{info.nome}</span>
          {info.admin && <span style={{ background: C.gold + "22", color: C.gold, padding: "1px 6px", borderRadius: 3, fontSize: 9, fontWeight: 800 }}>ADMIN</span>}
          <button onClick={() => signOut(auth)} style={{ background: C.red + "22", color: C.red, border: `1px solid ${C.red}44`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Sair</button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: C.green + "14", border: `1px solid ${C.green}44`, borderRadius: 8, padding: "8px 14px", marginBottom: 16, color: C.green, fontSize: 12, fontWeight: 700 }}>
          Sistema online - {clientes.length} clientes carregados
        </div>
        {pagina === "dashboard" && <Dashboard clientes={clientes} />}
        {pagina === "clientes" && <Clientes clientes={clientes} onAdd={adicionar} onUpdate={atualizar} />}
      </div>
    </div>
  );
}

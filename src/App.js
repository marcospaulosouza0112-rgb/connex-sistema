import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const EQUIPE = {
  "marcospaulosouza0112@gmail.com": {nome:"Marcos",cor:"#00C07F"},
  "stefanyadm13@gmail.com": {nome:"Stefany",cor:"#00D4CC"},
  "kaikejunior8@gmail.com": {nome:"Kaike",cor:"#9B59B6"},
  "laianegabi2010@hotmail.com": {nome:"Laiane",cor:"#F5A623"},
  "loboleticia25@gmail.com": {nome:"Letícia",cor:"#E056DA"},
};

export default function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(null);
  const [erro, setErro] = useState("");

  async function login() {
    setErro("");
    try {
      const c = await signInWithEmailAndPassword(auth, email.trim(), senha);
      setUser(c.user);
    } catch(e) { setErro("Email ou senha incorretos."); }
  }

  if (user) {
    const info = EQUIPE[user.email] || {nome: user.email, cor:"#1E90FF"};
    return (
      <div style={{background:"#0C1420",minHeight:"100vh",color:"white",padding:32,fontFamily:"'Inter',sans-serif"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{background:"#111C2E",borderRadius:14,padding:24,border:"1px solid #1E3050",marginBottom:16}}>
            <div style={{color:info.cor,fontWeight:800,fontSize:20,marginBottom:4}}>✅ CONNEX Online!</div>
            <div style={{color:"#5A7A9A",fontSize:14}}>Logado como: <span style={{color:info.cor,fontWeight:700}}>{info.nome}</span> ({user.email})</div>
          </div>
          <div style={{background:"#111C2E",borderRadius:14,padding:24,border:"1px solid #00C07F44",marginBottom:16}}>
            <div style={{color:"#00C07F",fontWeight:700,fontSize:14,marginBottom:8}}>☁️ Firebase conectado!</div>
            <div style={{color:"#5A7A9A",fontSize:13}}>Sistema rodando com dados em nuvem. O sistema completo será carregado em breve.</div>
          </div>
          <button onClick={()=>signOut(auth).then(()=>{setUser(null);setEmail("");setSenha("");})} 
            style={{background:"#FF4D6D14",color:"#FF4D6D",border:"1px solid #FF4D6D33",borderRadius:7,padding:"8px 20px",cursor:"pointer",fontWeight:700}}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{background:"#0C1420",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",padding:16}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:56,height:56,background:"linear-gradient(135deg,#1E90FF,#005FCC)",borderRadius:14,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:10,color:"#fff",fontWeight:900}}>C</div>
          <div style={{color:"white",fontWeight:900,fontSize:22}}>CONNEX</div>
          <div style={{color:"#5A7A9A",fontSize:10,letterSpacing:2,textTransform:"uppercase",marginTop:2}}>Gestão de Clientes</div>
        </div>
        <div style={{background:"#111C2E",borderRadius:14,padding:28,border:"1px solid #1E3050"}}>
          <div style={{color:"white",fontWeight:700,fontSize:15,marginBottom:18}}>Entrar no sistema</div>
          <div style={{marginBottom:12}}>
            <label style={{color:"#5A7A9A",fontSize:10,fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4}}>Email</label>
            <input value={email} onChange={e=>{setEmail(e.target.value);setErro("");}} placeholder="seu@email.com" type="email"
              onKeyDown={e=>e.key==="Enter"&&login()}
              style={{width:"100%",background:"#0C1420",border:"1px solid #1E3050",borderRadius:7,padding:"9px 12px",color:"white",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{color:"#5A7A9A",fontSize:10,fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:4}}>Senha</label>
            <input value={senha} onChange={e=>{setSenha(e.target.value);setErro("");}} placeholder="••••••••" type="password"
              onKeyDown={e=>e.key==="Enter"&&login()}
              style={{width:"100%",background:"#0C1420",border:"1px solid #1E3050",borderRadius:7,padding:"9px 12px",color:"white",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          {erro && <div style={{background:"#FF4D6D18",color:"#FF4D6D",borderRadius:7,padding:"8px 12px",fontSize:12,marginBottom:12}}>{erro}</div>}
          <button onClick={login} style={{width:"100%",background:"#1E90FF",color:"#fff",border:"none",borderRadius:9,padding:"11px",fontSize:14,fontWeight:800,cursor:"pointer"}}>
            Entrar →
          </button>
          <div style={{marginTop:14,padding:"10px 12px",background:"#ffffff06",borderRadius:8,border:"1px solid #1E3050"}}>
            <div style={{color:"#5A7A9A",fontSize:9,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Clique para preencher</div>
            {Object.entries(EQUIPE).map(([em,u])=>(
              <div key={em} onClick={()=>setEmail(em)} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 4px",cursor:"pointer"}}>
                <span style={{color:u.cor,fontSize:11,fontWeight:700}}>{u.nome}</span>
                <span style={{color:"#5A7A9A",fontSize:9}}>{em}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

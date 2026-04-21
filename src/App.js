import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(null);

  async function login() {
    try {
      const c = await signInWithEmailAndPassword(auth, email, senha);
      setUser(c.user);
    } catch(e) { alert("Email ou senha incorretos"); }
  }

  if (user) return (
    <div style={{background:"#0C1420",minHeight:"100vh",color:"white",padding:24,fontFamily:"sans-serif"}}>
      <h2 style={{color:"#00C07F"}}>✅ CONNEX funcionando!</h2>
      <p>Logado como: {user.email}</p>
      <button onClick={()=>signOut(auth).then(()=>setUser(null))} style={{marginTop:16,background:"#FF4D6D",color:"#fff",border:"none",borderRadius:7,padding:"8px 16px",cursor:"pointer"}}>Sair</button>
    </div>
  );

  return (
    <div style={{background:"#0C1420",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif"}}>
      <div style={{background:"#111C2E",padding:28,borderRadius:14,width:360,border:"1px solid #1E3050"}}>
        <div style={{color:"white",fontWeight:800,fontSize:20,marginBottom:20}}>🔷 CONNEX Login</div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",background:"#0C1420",border:"1px solid #1E3050",borderRadius:7,padding:"9px 12px",color:"white",fontSize:13,marginBottom:10,boxSizing:"border-box"}}/>
        <input value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" type="password" style={{width:"100%",background:"#0C1420",border:"1px solid #1E3050",borderRadius:7,padding:"9px 12px",color:"white",fontSize:13,marginBottom:14,boxSizing:"border-box"}}/>
        <button onClick={login} style={{width:"100%",background:"#1E90FF",color:"#fff",border:"none",borderRadius:9,padding:11,fontSize:14,fontWeight:800,cursor:"pointer"}}>Entrar →</button>
      </div>
    </div>
  );
}

// ╔════════════════════════════════════════════════════╗
// ║  CONNEX GESTÃO DE CLIENTES — com Firebase          ║
// ║  Login real + dados em nuvem em tempo real         ║
// ╚════════════════════════════════════════════════════╝

import { useState, useMemo, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  collection, doc, setDoc, getDocs, onSnapshot,
  addDoc, updateDoc, deleteDoc, serverTimestamp
} from "firebase/firestore";

// ─── EQUIPE (nomes por email) ──────────────────────────
const NOMES_EQUIPE = {
  "marcospaulosouza0112@gmail.com": { nome: "Marcos", cor: "#00C07F", avatar: "👑", role: "admin" },
  "stefany@connexcontabil.com.br":  { nome: "Stefany", cor: "#00D4CC", avatar: "👩", role: "usuario" },
  "kaike@connexcontabil.com.br":    { nome: "Kaike",   cor: "#9B59B6", avatar: "👨", role: "usuario" },
  "laiane@connexcontabil.com.br":   { nome: "Laiane",  cor: "#F5A623", avatar: "👩", role: "usuario" },
  "leticia@connexcontabil.com.br":  { nome: "Letícia", cor: "#E056DA", avatar: "👩", role: "usuario" },
};

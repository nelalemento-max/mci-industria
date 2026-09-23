import { initializeApp, deleteApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getFirestore, increment, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'

export const ADMIN_EMAIL = 'mci.serviciosbolivia@gmail.com'

const firebaseConfig = {
  apiKey: 'AIzaSyAU8kEqdzYmCAmDWMcTRB_F6A5fqtbE_Zs',
  authDomain: 'mci-industria.firebaseapp.com',
  projectId: 'mci-industria',
  storageBucket: 'mci-industria.firebasestorage.app',
  messagingSenderId: '251853043424',
  appId: '1:251853043424:web:d15d8759ae8887a9b00285',
  measurementId: 'G-K92JHT5NDS',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export const isAdmin = (user) => user?.email?.toLowerCase() === ADMIN_EMAIL
export const watchSession = (callback) => onAuthStateChanged(auth, callback)
export const login = (email, password) => signInWithEmailAndPassword(auth, email.trim(), password)
export const logout = () => signOut(auth)

export async function trackVisit() {
  const visitKey = 'mci_visit_counted'
  const ref = doc(db, 'metrics', 'visits')
  if (!sessionStorage.getItem(visitKey)) {
    const snapshot = await getDoc(ref)
    if (snapshot.exists()) await updateDoc(ref, {count: increment(1), updatedAt: serverTimestamp()})
    else await setDoc(ref, {count: 1, updatedAt: serverTimestamp()})
    sessionStorage.setItem(visitKey, '1')
  }
  return onSnapshot(ref, (snapshot) => window.dispatchEvent(new CustomEvent('mci-visits', {detail: snapshot.data()?.count || 0})))
}

export const saveRequest = (data) => addDoc(collection(db, 'requests'), {...data, status: 'nueva', createdAt: serverTimestamp()})

export function watchRequests(callback) {
  return onSnapshot(query(collection(db, 'requests'), orderBy('createdAt', 'desc'), limit(100)), (snapshot) => callback(snapshot.docs.map((item) => ({id:item.id, ...item.data()}))))
}

export function watchQuotes(callback, admin = false, email = '') {
  const quotesQuery = admin
    ? query(collection(db, 'quotes'), orderBy('createdAt', 'desc'), limit(100))
    : query(collection(db, 'quotes'), where('clientEmail', '==', email), limit(30))
  return onSnapshot(quotesQuery, (snapshot) => callback(snapshot.docs.map((item) => ({id:item.id, ...item.data()}))))
}

export const saveQuote = (data) => addDoc(collection(db, 'quotes'), {...data, createdAt: serverTimestamp(), createdBy: auth.currentUser?.email || ''})

export async function createClientUser({email, password, name, services}) {
  const secondaryName = `mci-user-${Date.now()}`
  const secondaryApp = initializeApp(firebaseConfig, secondaryName)
  try {
    const secondaryAuth = getAuth(secondaryApp)
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password)
    await setDoc(doc(db, 'users', credential.user.uid), {email:email.trim().toLowerCase(), name, role:'client', active:true, services, createdAt:serverTimestamp()})
    await signOut(secondaryAuth)
    return credential.user.uid
  } finally {
    await deleteApp(secondaryApp)
  }
}

export function watchUsers(callback) {
  return onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100)), (snapshot) => callback(snapshot.docs.map((item) => ({id:item.id, ...item.data()}))))
}

export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? {id:snapshot.id, ...snapshot.data()} : null
}

export function watchMarketData(callback) {
  return onSnapshot(doc(db, 'marketData', 'current'), (snapshot) => callback(snapshot.exists() ? snapshot.data() : null))
}

export const saveMarketData = (data) => setDoc(doc(db, 'marketData', 'current'), {...data, updatedAt:serverTimestamp(), updatedBy:auth.currentUser?.email || ''}, {merge:true})

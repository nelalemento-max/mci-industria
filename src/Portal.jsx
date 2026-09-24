import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BarChart3, Download, ExternalLink, FileText, Fuel, LoaderCircle, LogIn, LogOut, MapPin, Plus, RefreshCw, Save, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react'
import { ADMIN_EMAIL, createClientUser, getUserProfile, isAdmin, login, logout, saveMarketData, saveQuote, watchMarketData, watchQuotes, watchRequests, watchUsers } from './firebase'
import { downloadQuotePdf } from './quotePdf'
import { CRIPTO_PULSO_PUBLIC_URL, getFuelSupply, getMciServices } from './criptoPulso'

const emptyItem = () => ({description:'', qty:1, unitPrice:0, specs:''})
const initialMarket = {bcbBuy:'', bcbSell:'', p2pBuy:'', p2pSell:'', argentinaFuel:'', chileFuel:'', peruFuel:'', brazilFuel:'', paraguayFuel:'', fuelBalancesNote:''}

export default function Portal({user, onBack}) {
  if (!user) return <LoginView onBack={onBack}/>
  return isAdmin(user) ? <AdminPortal user={user} onBack={onBack}/> : <ClientPortal user={user} onBack={onBack}/>
}

function LoginView({onBack}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try { await login(email, password) }
    catch { setError('No fue posible iniciar sesión. Revise el correo y la contraseña.') }
    finally { setLoading(false) }
  }
  return <main className="portal-login"><button className="portal-back" onClick={onBack}><ArrowLeft/> Volver a la página</button><section className="login-card"><img src="/logo-mci.jpeg" alt="MCI"/><span className="eyebrow">ACCESO SEGURO</span><h1>Iniciar sesión</h1><p>Administración de cotizaciones y servicios exclusivos para clientes autorizados.</p><form onSubmit={submit}><label>Correo electrónico<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" autoComplete="email"/></label><label>Contraseña<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"/></label>{error && <div className="form-error">{error}</div>}<button className="button primary full" disabled={loading}><LogIn size={18}/>{loading ? 'Ingresando...' : 'Ingresar'}</button></form><small>Administrador autorizado: {ADMIN_EMAIL}</small></section></main>
}

function PortalHeader({title, user, onBack}) {
  return <header className="portal-header"><button className="portal-back" onClick={onBack}><ArrowLeft/> Página pública</button><div><strong>{title}</strong><small>{user.email}</small></div><button className="button outline small" onClick={logout}><LogOut size={16}/> Salir</button></header>
}

function AdminPortal({user, onBack}) {
  const [tab, setTab] = useState('resumen')
  const [requests, setRequests] = useState([])
  const [quotes, setQuotes] = useState([])
  const [users, setUsers] = useState([])
  useEffect(() => {
    const stops = [watchRequests(setRequests), watchQuotes(setQuotes, true), watchUsers(setUsers)]
    return () => stops.forEach((stop) => stop?.())
  }, [])
  const tabs = [{id:'resumen',label:'Resumen',icon:BarChart3},{id:'solicitudes',label:'Solicitudes',icon:FileText},{id:'cotizador',label:'Cotizador PDF',icon:Download},{id:'usuarios',label:'Usuarios',icon:Users},{id:'datos',label:'Datos y servicios',icon:Fuel}]
  return <div className="portal-shell"><PortalHeader title="Administración MCI" user={user} onBack={onBack}/><div className="portal-layout"><aside className="portal-nav">{tabs.map(({id,label,icon:Icon}) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon/>{label}</button>)}</aside><main className="portal-content">
    {tab === 'resumen' && <Overview requests={requests} quotes={quotes} users={users}/>} 
    {tab === 'solicitudes' && <Requests requests={requests}/>} 
    {tab === 'cotizador' && <QuoteBuilder/>}
    {tab === 'usuarios' && <UserManager users={users}/>} 
    {tab === 'datos' && <MarketEditor/>}
  </main></div></div>
}

function Overview({requests, quotes, users}) {
  return <><div className="portal-title"><span className="eyebrow">PANEL GENERAL</span><h1>Resumen comercial</h1><p>Seguimiento de solicitudes, cotizaciones y clientes con acceso.</p></div><div className="metric-grid"><Metric label="Solicitudes" value={requests.length}/><Metric label="Cotizaciones" value={quotes.length}/><Metric label="Usuarios autorizados" value={users.filter((item) => item.active).length}/></div><div className="portal-panel"><h2>Actividad reciente</h2>{requests.slice(0,5).map((item) => <div className="activity-row" key={item.id}><div><strong>{item.name}</strong><small>{item.detail}</small></div><span>{item.status || 'nueva'}</span></div>)}{!requests.length && <Empty text="Todavía no existen solicitudes registradas."/>}</div></>
}

const Metric = ({label,value}) => <article className="metric"><span>{label}</span><strong>{value}</strong></article>
const Empty = ({text}) => <div className="portal-empty"><FileText/><p>{text}</p></div>

function Requests({requests}) {
  return <><div className="portal-title"><span className="eyebrow">CLIENTES</span><h1>Solicitudes recibidas</h1><p>Consultas enviadas desde el catálogo público de MCI.</p></div><div className="portal-panel table-wrap"><table><thead><tr><th>Cliente</th><th>WhatsApp</th><th>Detalle</th><th>Estado</th></tr></thead><tbody>{requests.map((item) => <tr key={item.id}><td>{item.name}</td><td><a href={`https://wa.me/591${String(item.phone || '').replace(/\D/g,'').replace(/^591/,'')}`} target="_blank" rel="noreferrer">{item.phone}</a></td><td>{item.detail}</td><td><span className="status">{item.status || 'nueva'}</span></td></tr>)}</tbody></table>{!requests.length && <Empty text="Las nuevas solicitudes aparecerán aquí."/>}</div></>
}

function QuoteBuilder() {
  const [form, setForm] = useState({clientName:'', clientPhone:'', clientEmail:'', notes:'', items:[emptyItem()]})
  const [message, setMessage] = useState('')
  const number = useMemo(() => `MCI-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`, [])
  const updateItem = (index, key, value) => setForm((current) => ({...current, items:current.items.map((item, position) => position === index ? {...item,[key]:value} : item)}))
  const removeItem = (index) => setForm((current) => ({...current,items:current.items.filter((_,position) => position !== index)}))
  const total = form.items.reduce((sum,item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0),0)
  const quote = {...form, number, total}
  const save = async () => { setMessage(''); try { await saveQuote(quote); setMessage('Cotización guardada correctamente.') } catch { setMessage('No se pudo guardar. Verifique Firestore.') } }
  return <><div className="portal-title"><span className="eyebrow">DOCUMENTOS</span><h1>Crear cotización</h1><p>Complete precios, cantidades y especificaciones; luego guarde o descargue el PDF.</p></div><div className="portal-panel quote-builder"><div className="form-grid"><label>Cliente<input value={form.clientName} onChange={(e) => setForm({...form,clientName:e.target.value})}/></label><label>WhatsApp<input value={form.clientPhone} onChange={(e) => setForm({...form,clientPhone:e.target.value})}/></label><label>Correo<input type="email" value={form.clientEmail} onChange={(e) => setForm({...form,clientEmail:e.target.value})}/></label><label>Número<input value={number} disabled/></label></div><div className="quote-lines">{form.items.map((item,index) => <div className="quote-line" key={index}><label>Producto o servicio<input value={item.description} onChange={(e) => updateItem(index,'description',e.target.value)}/></label><label>Cantidad<input type="number" min="1" value={item.qty} onChange={(e) => updateItem(index,'qty',e.target.value)}/></label><label>Precio unitario (Bs)<input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(index,'unitPrice',e.target.value)}/></label><label className="specs">Especificaciones<input value={item.specs} onChange={(e) => updateItem(index,'specs',e.target.value)}/></label><button className="line-remove" onClick={() => removeItem(index)} disabled={form.items.length === 1}><Trash2/></button></div>)}</div><button className="button outline" onClick={() => setForm({...form,items:[...form.items,emptyItem()]})}><Plus size={16}/> Agregar línea</button><label className="notes-label">Notas<textarea rows="3" value={form.notes} onChange={(e) => setForm({...form,notes:e.target.value})}/></label><div className="quote-total">Total: Bs {total.toFixed(2)}</div>{message && <div className="form-message">{message}</div>}<div className="quote-buttons"><button className="button outline" onClick={save}><Save size={17}/> Guardar</button><button className="button primary" onClick={() => downloadQuotePdf(quote)}><Download size={17}/> Descargar PDF</button></div></div></>
}

function UserManager({users}) {
  const [form,setForm] = useState({name:'',email:'',password:'',services:{balances:true,dollar:true,p2p:true,fuelPrices:true,quotes:true}})
  const [message,setMessage] = useState('')
  const submit = async (event) => { event.preventDefault(); setMessage('Creando usuario...'); try { await createClientUser(form); setMessage('Usuario creado. Entregue al cliente su correo y contraseña inicial.'); setForm({...form,name:'',email:'',password:''}) } catch (error) { setMessage(error?.message || 'No fue posible crear el usuario.') } }
  const toggle = (key) => setForm({...form,services:{...form.services,[key]:!form.services[key]}})
  return <><div className="portal-title"><span className="eyebrow">ACCESOS</span><h1>Usuarios autorizados</h1><p>El administrador define qué servicios puede consultar cada cliente.</p></div><div className="users-layout"><form className="portal-panel user-form" onSubmit={submit}><h2>Crear usuario</h2><label>Nombre o empresa<input required value={form.name} onChange={(e) => setForm({...form,name:e.target.value})}/></label><label>Correo<input required type="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})}/></label><label>Contraseña inicial<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({...form,password:e.target.value})}/></label><fieldset><legend>Servicios habilitados</legend>{Object.entries({balances:'Saldos de combustible',dollar:'Dólar BCB',p2p:'Cotizaciones P2P',fuelPrices:'Combustibles regionales',quotes:'Cotizaciones MCI'}).map(([key,label]) => <label className="check" key={key}><input type="checkbox" checked={form.services[key]} onChange={() => toggle(key)}/>{label}</label>)}</fieldset><button className="button primary full"><UserPlus size={17}/> Crear usuario</button>{message && <div className="form-message">{message}</div>}</form><div className="portal-panel"><h2>Usuarios registrados</h2>{users.map((item) => <div className="user-row" key={item.id}><div><strong>{item.name}</strong><small>{item.email}</small></div><span>{item.active ? 'Activo' : 'Inactivo'}</span></div>)}{!users.length && <Empty text="Todavía no se crearon usuarios."/>}</div></div></>
}

function MarketEditor() {
  const [data,setData] = useState(initialMarket)
  const [message,setMessage] = useState('')
  useEffect(() => watchMarketData((value) => value && setData({...initialMarket,...value})),[])
  const fields = [['bcbBuy','Dólar BCB compra'],['bcbSell','Dólar BCB venta'],['p2pBuy','P2P compra (Bs/USDT)'],['p2pSell','P2P venta (Bs/USDT)'],['argentinaFuel','Combustible Argentina'],['chileFuel','Combustible Chile'],['peruFuel','Combustible Perú'],['brazilFuel','Combustible Brasil'],['paraguayFuel','Combustible Paraguay']]
  const submit = async (event) => {event.preventDefault(); try {await saveMarketData(data); setMessage('Datos actualizados para los clientes.')} catch {setMessage('No se pudieron guardar los datos.')}}
  return <><div className="portal-title"><span className="eyebrow">SERVICIOS COMPLEMENTARIOS</span><h1>Datos para clientes</h1><p>Versión inicial administrada por MCI. Los conectores automáticos se habilitarán posteriormente.</p></div><form className="portal-panel market-form" onSubmit={submit}><div className="form-grid">{fields.map(([key,label]) => <label key={key}>{label}<input value={data[key] || ''} onChange={(e) => setData({...data,[key]:e.target.value})} placeholder="Valor y moneda"/></label>)}</div><label>Resumen de saldos de combustible<textarea rows="4" value={data.fuelBalancesNote || ''} onChange={(e) => setData({...data,fuelBalancesNote:e.target.value})} placeholder="Información proveniente de Cripto Pulso..."/></label><button className="button primary"><Save size={17}/> Publicar información</button>{message && <div className="form-message">{message}</div>}</form></>
}

function ClientPortal({user,onBack}) {
  const [profile,setProfile] = useState(null)
  const [market,setMarket] = useState(null)
  const [quotes,setQuotes] = useState([])
  const [live,setLive] = useState(null)
  const [liveError,setLiveError] = useState('')
  const [liveLoading,setLiveLoading] = useState(true)
  const [fuel,setFuel] = useState(null)
  const [fuelError,setFuelError] = useState('')
  const [fuelLoading,setFuelLoading] = useState(false)
  const [department,setDepartment] = useState('1')
  const [product,setProduct] = useState('gasoline')
  useEffect(() => { getUserProfile(user.uid).then(setProfile); const stopData = watchMarketData(setMarket); const stopQuotes = watchQuotes(setQuotes,false,user.email); return () => {stopData?.();stopQuotes?.()} },[user])
  const allowed = profile?.services || {}
  const loadLive = async () => { setLiveLoading(true); setLiveError(''); try {setLive(await getMciServices())} catch(error) {setLiveError(error.message)} finally {setLiveLoading(false)} }
  const loadFuel = async () => { setFuelLoading(true); setFuelError(''); try {setFuel(await getFuelSupply({department,product}))} catch(error) {setFuelError(error.message)} finally {setFuelLoading(false)} }
  useEffect(() => { loadLive() },[])
  useEffect(() => { if (allowed.balances) loadFuel() },[allowed.balances,department,product])
  const updatedAt = live?.generatedAt ? new Date(live.generatedAt).toLocaleString('es-BO') : ''
  return <div className="portal-shell"><PortalHeader title="Servicios MCI" user={user} onBack={onBack}/><main className="client-content"><div className="portal-title"><span className="eyebrow">ÁREA DE CLIENTES</span><h1>Bienvenido, {profile?.name || user.email}</h1><p>Información y servicios habilitados por MCI para su cuenta.</p></div><div className="client-services">
    {allowed.dollar && <ServiceCard title="Dólar de referencia" value={liveLoading ? 'Actualizando…' : `Compra Bs ${live?.dollar?.official?.buy ?? market?.bcbBuy ?? '—'} | Venta Bs ${live?.dollar?.official?.sell ?? market?.bcbSell ?? '—'}`} note={live?.notices?.official || 'Referencia informativa; verifique su vigencia.'}/>} 
    {allowed.p2p && <ServiceCard title="Mercado P2P USDT/BOB" value={liveLoading ? 'Actualizando…' : `Compra Bs ${live?.dollar?.p2p?.buy ?? market?.p2pBuy ?? '—'} | Venta Bs ${live?.dollar?.p2p?.sell ?? market?.p2pSell ?? '—'}`} note={live?.notices?.p2p || 'Referencia P2P; no constituye oferta de cambio.'}/>} 
    {allowed.fuelPrices && <RegionalFuel data={live?.regionalFuel} fallback={market}/>} 
  </div>{liveError && <div className="data-warning">No se pudo actualizar Cripto Pulso. Se muestran los datos de respaldo disponibles.</div>}{updatedAt && <div className="data-source"><span>Datos: Cripto Pulso · actualizado {updatedAt}</span><button onClick={loadLive} disabled={liveLoading}><RefreshCw size={15}/> Actualizar</button></div>}
  {allowed.balances && <FuelBalances data={fuel} loading={fuelLoading} error={fuelError} department={department} product={product} onDepartment={setDepartment} onProduct={setProduct} onRefresh={loadFuel}/>} 
  {allowed.quotes && <div className="portal-panel client-quotes"><h2>Mis cotizaciones</h2>{quotes.map((quote) => <div className="activity-row" key={quote.id}><div><strong>{quote.number}</strong><small>{quote.items?.map((item) => item.description).join(', ')}</small></div><button className="button outline small" onClick={() => downloadQuotePdf(quote)}><Download size={15}/> PDF</button></div>)}{!quotes.length && <Empty text="Sus cotizaciones aparecerán aquí."/>}</div>}</main></div>
}

const ServiceCard = ({title,value,note}) => <article className="client-service"><ShieldCheck/><small>SERVICIO HABILITADO</small><h2>{title}</h2><strong>{value}</strong><p>{note}</p></article>

function RegionalFuel({data,fallback}) {
  if (!data?.length) return <ServiceCard title="Combustibles en países cercanos" value={`Argentina ${fallback?.argentinaFuel || '—'} · Chile ${fallback?.chileFuel || '—'} · Perú ${fallback?.peruFuel || '—'} · Brasil ${fallback?.brazilFuel || '—'} · Paraguay ${fallback?.paraguayFuel || '—'}`} note="Datos de respaldo; valores referenciales."/>
  return <article className="client-service regional-service"><ShieldCheck/><small>SERVICIO HABILITADO</small><h2>Combustibles en países cercanos</h2><div className="regional-mini">{data.map((item) => <div key={item.country}><b>{item.country}</b><span>Gasolina ${item.gasoline.toFixed(2)}/L</span><span>Diésel ${item.diesel.toFixed(2)}/L</span></div>)}</div><p>Referencias Cripto Pulso en USD por litro; pueden variar por ciudad e impuestos.</p></article>
}

const departments = ['','Chuquisaca','La Paz','Cochabamba','Oruro','Potosí','Tarija','Santa Cruz','Beni','Pando']
const productLabels = {gasoline:'Gasolina especial',diesel:'Diésel oil',premium:'Gasolina premium',uls:'Diésel ULS'}
const liters = (value) => `${Number(value || 0).toLocaleString('es-BO')} L`

function FuelBalances({data,loading,error,department,product,onDepartment,onProduct,onRefresh}) {
  const stations = data?.stations || []
  const total = stations.reduce((sum,item) => sum + Number(item.liters || 0),0)
  const selling = stations.filter((item) => item.hasSales).length
  const dispatches = stations.filter((item) => item.dispatchInProgress).length
  const empty = stations.filter((item) => Number(item.liters) === 0).length
  const available = stations.length - empty
  const totalCapacity = stations.reduce((sum,item) => sum + Number(item.estimatedCapacityLiters || 25000),0)
  const balancePercent = totalCapacity ? Math.min(100,Math.round(total / totalCapacity * 100)) : 0
  const availablePercent = stations.length ? Math.round(available / stations.length * 100) : 0
  const sellingPercent = stations.length ? Math.round(selling / stations.length * 100) : 0
  const shown = [...stations].sort((a,b) => Number(b.liters)-Number(a.liters)).slice(0,20)
  return <section className="portal-panel fuel-client"><div className="fuel-client-head"><div><span className="eyebrow">SALDOS DE COMBUSTIBLE</span><h2>{departments[Number(department)]} · {productLabels[product]}</h2><p>Información pública organizada por Cripto Pulso a partir de ANH Abastecimiento.</p></div><button className="button outline small" onClick={onRefresh} disabled={loading}>{loading ? <LoaderCircle className="spin"/> : <RefreshCw/>} Actualizar</button></div><div className="fuel-client-filters"><label>Departamento<select value={department} onChange={(e) => onDepartment(e.target.value)}>{departments.slice(1).map((name,index) => <option key={name} value={index+1}>{name}</option>)}</select></label><label>Producto<select value={product} onChange={(e) => onProduct(e.target.value)}>{Object.entries(productLabels).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label><a href={CRIPTO_PULSO_PUBLIC_URL} target="_blank" rel="noreferrer">Ver análisis completo <ExternalLink size={14}/></a></div>{error && <div className="data-warning">{error}</div>}{loading && !data ? <div className="fuel-loading"><LoaderCircle className="spin"/> Consultando estaciones…</div> : <><FuelGaugeDashboard balance={balancePercent} available={availablePercent} selling={sellingPercent} total={total} stations={stations.length} empty={empty} dispatches={dispatches}/><div className="fuel-kpis"><Metric label="Litros reportados" value={liters(total)}/><Metric label="Estaciones" value={stations.length}/><Metric label="Vendiendo" value={selling}/><Metric label="Vacías" value={empty}/><Metric label="Despachos" value={dispatches}/></div><div className="fuel-station-list">{shown.map((station) => <article key={station.id}><StationTank station={station}/><div className="station-client-info"><h3>{station.name}</h3><p>{station.address || station.zone || 'Dirección no informada'}</p><span>{station.hasSales ? '● Venta activa' : '○ Sin venta activa'}{station.dispatchInProgress ? ' · Despacho en curso' : ''}</span><small>Capacidad {liters(station.estimatedCapacityLiters || 25000)} · {Math.round(Number(station.fillPercent || 0))}% estimado</small></div><strong>{liters(station.liters)}</strong><a href={station.latitude != null && station.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${station.name}, ${departments[Number(department)]}, Bolivia`)}`} target="_blank" rel="noreferrer" aria-label={`Ubicación de ${station.name}`}><MapPin/></a></article>)}</div>{stations.length > shown.length && <p className="fuel-more">Se muestran las 20 estaciones con mayor saldo. Cripto Pulso contiene {stations.length} registros para este filtro.</p>}<small className="fuel-method">Litros, venta, despacho, ubicación y hora provienen de ANH. Porcentaje, capacidad y autonomía son cálculos estimados de Cripto Pulso.</small></>}</section>
}

function StationTank({station}) {
  const percent = Math.max(0,Math.min(100,Number(station.fillPercent || 0)))
  const state = percent === 0 ? 'empty' : percent < 20 ? 'critical' : percent < 55 ? 'medium' : 'good'
  return <div className={`station-tank ${state}`} role="img" aria-label={`Tanque de ${station.name}: ${Math.round(percent)} por ciento, ${liters(station.liters)}`}><div className="tank-cap"/><div className="tank-shell"><div className="tank-liquid" style={{height:`${percent}%`}}><i/><i/></div><b>{Math.round(percent)}%</b></div><small>{state === 'empty' ? 'VACÍO' : state === 'critical' ? 'CRÍTICO' : state === 'medium' ? 'ACEPTABLE' : 'DISPONIBLE'}</small></div>
}

function Gauge({label,value,detail}) {
  const safe = Math.max(0,Math.min(100,Number(value || 0)))
  const color = safe >= 65 ? '#00a197' : safe >= 30 ? '#f28b2d' : '#d94b4b'
  const rotation = safe * 2.7 - 135
  return <article className="fuel-gauge"><div className="gauge-face" role="img" aria-label={`${label}: ${safe}%`} style={{'--gauge-value':`${safe * 2.7}deg`,'--gauge-color':color}}><i style={{transform:`rotate(${rotation}deg)`}}/></div><strong style={{color}}>{safe}%</strong><h3>{label}</h3><p>{detail}</p></article>
}

function FuelGaugeDashboard({balance,available,selling,total,stations,empty,dispatches}) {
  const withBalance = Number(stations) - Number(empty)
  return <div className="gauge-dashboard"><div className="gauge-heading"><div><small>LECTURA EJECUTIVA</small><h3>Estado actual del abastecimiento</h3></div><span>Calculado con {stations} estaciones</span></div><div className="gauge-grid"><Gauge label="Nivel general" value={balance} detail={`${liters(total)} frente a capacidad estimada`}/><Gauge label="Estaciones con saldo" value={available} detail={`${withBalance} de ${stations} estaciones con combustible`}/><Gauge label="Venta activa" value={selling} detail="Porcentaje de estaciones reportando venta"/></div>
<div className="supplyStatus"><span className="available" style={{flex:Math.max(1,withBalance)}}>Con saldo {withBalance}</span><span className="empty" style={{flex:Math.max(1,empty)}}>Vacías {empty}</span><span className="dispatch" style={{flex:Math.max(1,dispatches)}}>Despachos {dispatches}</span></div></div>
}

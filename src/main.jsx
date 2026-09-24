import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, Wrench, Building2, Cpu, ShoppingBag, Menu, X, ChevronRight, MessageCircle, ShieldCheck, MapPin, Phone, Plus, Minus, Trash2, Send, Gauge, Fuel, CirclePlay, Video, ExternalLink, Download, LockKeyhole, Smartphone, UserRound } from 'lucide-react'
import './styles.css'
import { saveRequest, trackVisit, watchSession } from './firebase'

const Portal = lazy(() => import('./Portal'))

const WHATSAPP = '59167778452'

const products = [
  { id: 1, name: 'Contenedor de derrame para dispensador', category: 'Control de derrames', image: '/products/image1.jpeg', tags: 'contenedor dispenser derrame seguridad' },
  { id: 2, name: 'Contenedor para tanques', category: 'Control de derrames', image: '/products/image2.jpeg', tags: 'contenedor tanque sump seguridad' },
  { id: 3, name: 'Contenedor de derrames para descarga', category: 'Descarga', image: '/products/image3.jpeg', tags: 'contenedor derrame descarga combustible' },
  { id: 4, name: 'Contenedor para monitoreo con tapa de aluminio', category: 'Monitoreo', image: '/products/image4.jpeg', tags: 'contenedor monitoreo tapa aluminio tanque' },
  { id: 5, name: 'Conjunto tapa tanque para descarga', category: 'Descarga', image: '/products/image5.png', tags: 'tapa tanque descarga acople' },
  { id: 6, name: 'Válvula de presión y vacío 2 pulgadas', category: 'Válvulas', image: '/products/image6.png', tags: 'válvula respiro presión vacío steam keep 2' },
  { id: 7, name: 'Válvula de seguridad antichoque 1½ pulgadas', category: 'Seguridad', image: '/products/image7.jpg', tags: 'válvula seguridad antichoque impacto' },
  { id: 8, name: 'Brida de sellado 1½ pulgadas', category: 'Sellado', image: '/products/image8.jpg', tags: 'brida sellado 1 1/2' },
  { id: 9, name: 'Brida de sellado 1 pulgada', category: 'Sellado', image: '/products/image9.jpg', tags: 'brida sellado 1' },
  { id: 10, name: 'Manguera metálica flexible 1½ pulgadas', category: 'Mangueras', image: '/products/image10.png', tags: 'manguera metálica flexible 1 1/2' },
  { id: 11, name: 'Unidad de sellado 1 pulgada', category: 'Sellado', image: '/products/image11.png', tags: 'unidad sellado 1' },
  { id: 12, name: 'Unidad de sellado ¾ pulgada', category: 'Sellado', image: '/products/image12.png', tags: 'unidad sellado 3/4' },
  { id: 13, name: 'Codo giratorio de ¾ y 1 pulgada', category: 'Despacho', image: '/products/codo-giratorio.jpg', tags: 'codo giratorio swivel 3/4 1 pulgada despacho combustible' },
  { id: 14, name: 'Pistola automática para combustible de ¾ y 1 pulgada', category: 'Despacho', image: '/products/pistola-automatica.jpg', tags: 'pistola automática boquilla nozzle 3/4 1 pulgada despacho combustible' },
  { id: 15, name: 'Manguera para combustible de ¾ y 1 pulgada x 5 metros', category: 'Mangueras', image: '/products/manguera-combustible-5m.jpg', tags: 'manguera combustible 3/4 1 pulgada 5 metros punta giratoria colores gasolina diesel' },
  { id: 16, name: 'Visor de paso de combustible de ¾ y 1 pulgada', category: 'Monitoreo', image: '/products/visor-paso-combustible.jpg', tags: 'visor mirilla sight glass paso combustible 3/4 1 pulgada monitoreo' },
]

const services = [
  { icon: Wrench, title: 'Mantenimiento especializado', text: 'Diagnóstico, reparación y mantenimiento preventivo y correctivo de equipos petroleros.' },
  { icon: Building2, title: 'Construcción y adecuación', text: 'Proyectos integrales, ampliaciones y adecuaciones para estaciones de servicio.' },
  { icon: Cpu, title: 'Sistemas de control', text: 'Soluciones web, móviles y offline para controlar operaciones, inventarios y mantenimiento.' },
]

const serviceProjects = [
  { image: '/services/trabajo-01.jpg', title: 'Construcción de estaciones de servicio', text: 'Estructuras, cubiertas, islas y obras complementarias.' },
  { image: '/services/trabajo-02.jpg', title: 'Obras civiles e instalaciones', text: 'Ejecución y adecuación de áreas operativas para estaciones.' },
  { image: '/services/trabajo-03.jpg', title: 'Instalación y adecuación de tanques', text: 'Áreas de almacenamiento, protección y seguridad operacional.' },
  { image: '/services/trabajo-04.jpg', title: 'Montaje de estructuras metálicas', text: 'Cubiertas y estructuras para nuevas estaciones de servicio.' },
  { image: '/services/trabajo-05.jpg', title: 'Instalación de equipos de despacho', text: 'Montaje y puesta a punto de dispensers e islas de carga.' },
  { image: '/services/trabajo-06.jpg', title: 'Mantenimiento de bombas y tuberías', text: 'Intervención técnica de equipos, conexiones y sistemas de impulsión.' },
  { image: '/services/trabajo-07.jpg', title: 'Tanques de almacenamiento de combustible', text: 'Instalación, adecuación y protección de sistemas de almacenamiento.' },
  { image: '/services/trabajo-08.jpg', title: 'Tableros eléctricos y automatización', text: 'Armado, instalación y mantenimiento de tableros de control.' },
  { image: '/services/trabajo-09.jpg', title: 'Sistemas eléctricos de operación', text: 'Control y protección eléctrica para equipos industriales.' },
  { image: '/services/trabajo-10.jpg', title: 'Sistemas auxiliares de combustible', text: 'Instalación de bombas, filtros, medidores y líneas de transferencia.' },
]

const controlSystems = [
  {
    title: 'Mi Combustible',
    subtitle: 'Crédito digital y fidelización',
    text: 'El cliente carga saldo, consume combustible y consulta desde su celular sus movimientos, beneficios y promociones.',
    image: '/systems/mi-combustible.jpeg',
    features: ['Saldo e historial en celular', 'Familias, empresas y flotas', 'Promociones y compras anticipadas'],
  },
  {
    title: 'Control inteligente de personal',
    subtitle: 'Turnos, actividad y productividad',
    text: 'Registra jornadas, responsables y actividad para conocer el rendimiento real de cada turno y mejorar la atención.',
    image: '/systems/control-personal.jpeg',
    features: ['Ingreso y salida biométrica', 'Actividad y tiempos por turno', 'Indicadores de productividad'],
  },
  {
    title: 'Mantenimiento inteligente de activos',
    subtitle: 'Equipos siempre disponibles',
    text: 'Crea el expediente digital de dispensers, bombas, tanques y otros activos, con alertas e historial técnico.',
    image: '/systems/mantenimiento-activos.jpeg',
    features: ['Preventivo y correctivo', 'Repuestos, fotografías y costos', 'Alertas y próximos mantenimientos'],
  },
  {
    title: 'Control operativo de combustible',
    subtitle: 'Del ingreso del producto hasta la venta',
    text: 'Centraliza cisternas, tanques, existencias, dispensers y ventas para detectar diferencias y planificar el abastecimiento.',
    icon: Fuel,
    features: ['Recepciones y movimientos', 'Existencias y conciliaciones', 'Históricos y alertas'],
  },
  {
    title: 'Administración y gerencia inteligente',
    subtitle: 'Indicadores para decidir mejor',
    text: 'Convierte la operación en un tablero disponible desde celular o computadora, con accesos según cada responsabilidad.',
    icon: Gauge,
    features: ['Dashboard y comparativos', 'Reportes para contabilidad', 'Exportación a Excel y PDF'],
  },
]

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [quote, setQuote] = useState([])
  const [menu, setMenu] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [portalOpen, setPortalOpen] = useState(window.location.hash.startsWith('#/portal'))
  const [visits, setVisits] = useState(0)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => watchSession(setUser), [])
  useEffect(() => {
    const route = () => setPortalOpen(window.location.hash.startsWith('#/portal'))
    window.addEventListener('hashchange', route)
    return () => window.removeEventListener('hashchange', route)
  }, [])
  useEffect(() => {
    const visitor = (event) => setVisits(event.detail)
    window.addEventListener('mci-visits', visitor)
    let stop
    trackVisit().then((unsubscribe) => {stop = unsubscribe}).catch(() => {})
    return () => {window.removeEventListener('mci-visits', visitor); stop?.()}
  }, [])
  useEffect(() => {
    const ready = (event) => {event.preventDefault(); setInstallPrompt(event)}
    window.addEventListener('beforeinstallprompt', ready)
    return () => window.removeEventListener('beforeinstallprompt', ready)
  }, [])

  const categories = ['Todos', ...new Set(products.map((p) => p.category))]
  const filtered = useMemo(() => products.filter((p) => {
    const needle = query.trim().toLowerCase()
    const matchesText = !needle || `${p.name} ${p.category} ${p.tags}`.toLowerCase().includes(needle)
    return matchesText && (category === 'Todos' || p.category === category)
  }), [query, category])

  const add = (product) => {
    setQuote((items) => items.some((i) => i.id === product.id) ? items.map((i) => i.id === product.id ? {...i, qty: i.qty + 1} : i) : [...items, {...product, qty: 1}])
    setQuoteOpen(true)
  }

  const openPortal = () => {window.location.hash = '#/portal'; setPortalOpen(true)}
  const closePortal = () => {window.location.hash = '#inicio'; setPortalOpen(false)}
  const installApp = async () => {
    if (installPrompt) { await installPrompt.prompt(); setInstallPrompt(null); return }
    const isiPhone = /iphone|ipad|ipod/i.test(navigator.userAgent)
    window.alert(isiPhone ? 'En Safari, pulse Compartir y luego “Agregar a pantalla de inicio”.' : 'Abra el menú del navegador y seleccione “Instalar aplicación” o “Agregar a pantalla de inicio”.')
  }

  if (portalOpen) return <Suspense fallback={<div className="portal-loading">Cargando servicios MCI...</div>}><Portal user={user} onBack={closePortal}/></Suspense>

  return <>
    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="MCI inicio"><img className="brand-logo" src="/logo-mci.jpeg" alt="MCI Mantenimiento Corporativo Industrial"/><span><strong>Mantenimiento Corporativo Industrial</strong><small>Venta de surtidores y equipos</small></span></a>
      <nav className={menu ? 'nav open' : 'nav'}>
        <a href="#productos" onClick={() => setMenu(false)}>Productos</a>
        <a href="#servicios" onClick={() => setMenu(false)}>Servicios</a>
        <a href="#sistemas" onClick={() => setMenu(false)}>Sistemas</a>
        <a href="#videos" onClick={() => setMenu(false)}>Videos</a>
        <a href="#contacto" onClick={() => setMenu(false)}>Contacto</a>
      </nav>
      <button className="quote-pill" onClick={() => setQuoteOpen(true)}><ShoppingBag size={18}/> Mi cotización <b>{quote.reduce((a, i) => a + i.qty, 0)}</b></button>
      <button className="access-pill" onClick={openPortal}><LockKeyhole size={17}/>{user ? 'Mi cuenta' : 'Iniciar sesión'}</button>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Abrir menú">{menu ? <X/> : <Menu/>}</button>
    </header>

    <button className="mobile-account-button" onClick={openPortal} aria-label={user ? 'Abrir mi cuenta' : 'Iniciar sesión'}>
      <UserRound size={19}/>
      <span>{user ? 'Mi cuenta' : 'Iniciar sesión'}</span>
    </button>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow"><ShieldCheck size={16}/> Atención especializada en Bolivia</span>
          <h1>Todo lo que su estación necesita, en un solo lugar.</h1>
          <p>Repuestos, mantenimiento, equipamiento, construcción y sistemas de control para estaciones de servicio.</p>
          <div className="hero-actions">
            <a className="button primary" href="#productos">Explorar productos <ChevronRight size={18}/></a>
            <button className="button secondary" onClick={() => setRequestOpen(true)}>No encuentro mi repuesto</button>
          </div>
          <div className="hero-trust"><span><Fuel/> Repuestos especializados</span><span><Gauge/> Soporte técnico</span><span><MapPin/> Santa Cruz, Bolivia</span></div>
        </div>
        <div className="search-panel">
          <span>BUSCADOR TÉCNICO</span>
          <h2>¿Qué equipo o repuesto requiere?</h2>
          <label className="search-box"><Search/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej. válvula, manguera, brida, descarga..."/></label>
          <a href="#productos" className="search-link">Ver {filtered.length} resultados <ChevronRight size={16}/></a>
          <p>Si no aparece en nuestro catálogo, envíenos el detalle. <button onClick={() => setRequestOpen(true)}>MCI se lo consigue.</button></p>
        </div>
      </section>

      <section className="services" id="servicios">
        {services.map(({icon: Icon, title, text}) => <article key={title}><div className="service-icon"><Icon/></div><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </section>

      <WorkCarousel projects={serviceProjects}/>

      <section className="catalog" id="productos">
        <div className="section-head"><div><span className="eyebrow">CATÁLOGO TÉCNICO</span><h2>Productos para estaciones de servicio</h2><p>Seleccione uno o varios productos y solicite una cotización sin compromiso.</p></div><button className="button outline" onClick={() => setRequestOpen(true)}>Solicitar otro repuesto</button></div>
        <div className="filter-row">
          <label className="catalog-search"><Search size={19}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar producto, medida o categoría"/></label>
          <div className="chips">{categories.map((c) => <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
        </div>
        {filtered.length ? <div className="product-grid">{filtered.map((p) => <article className="product-card" key={p.id}>
          <div className="product-image"><img src={p.image} alt={p.name}/><span>Imagen ilustrativa</span></div>
          <div className="product-body"><small>{p.category}</small><h3>{p.name}</h3><p>Consulte medidas, compatibilidad, disponibilidad e instalación con nuestro equipo técnico.</p><div className="product-actions"><button className="button primary small" onClick={() => add(p)}><Plus size={16}/> Agregar</button><a className="icon-button" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola MCI, deseo información sobre: ${p.name}`)}`} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp"><MessageCircle/></a></div></div>
        </article>)}</div> : <div className="empty"><Search/><h3>No encontramos ese repuesto en el catálogo</h3><p>Envíenos su nombre, WhatsApp y el detalle del equipo. Nosotros lo buscamos.</p><button className="button primary" onClick={() => setRequestOpen(true)}>Solicitar búsqueda</button></div>}
      </section>

      <section className="systems" id="sistemas">
        <div className="systems-intro"><div><span className="eyebrow light">TECNOLOGÍA MCI</span><h2>Sistemas de control para una operación más ordenada</h2><p>Cinco soluciones que pueden implementarse por etapas para controlar combustible, personal, activos, administración y fidelización de clientes.</p></div><div className="systems-intro-actions"><a className="button white" href="/catalogos/soluciones-mci.pdf" target="_blank" rel="noreferrer">Ver catálogo completo</a><a className="button systems-demo" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola MCI, deseo una demostración de sus sistemas de control.')}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Solicitar demostración</a></div></div>
        <div className="systems-grid">{controlSystems.map(({title, subtitle, text, image, icon: Icon, features}) => <article className={`system-card ${image ? 'with-image' : 'compact'}`} key={title}>
          {image ? <a className="system-poster" href={image} target="_blank" rel="noreferrer" aria-label={`Ampliar información de ${title}`}><img src={image} alt={`Presentación del sistema ${title}`}/><span>Ver imagen completa</span></a> : <div className="system-card-icon"><Icon/></div>}
          <div className="system-card-body"><small>{subtitle}</small><h3>{title}</h3><p>{text}</p><ul>{features.map((feature) => <li key={feature}><ShieldCheck size={15}/>{feature}</li>)}</ul><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola MCI, deseo información y una demostración del sistema: ${title}.`)}`} target="_blank" rel="noreferrer">Consultar este sistema <ChevronRight size={16}/></a></div>
        </article>)}</div>
        <div className="systems-catalog-cta"><div><strong>5 soluciones. Una estación más rentable.</strong><span>Digitalice por etapas, controle mejor, reduzca costos y fidelice clientes.</span></div><a className="button white" href="/catalogos/soluciones-mci.pdf" download>Descargar catálogo PDF</a></div>
      </section>

      <section className="media-location" id="videos">
        <div className="media-block"><div className="section-head media-head"><div><span className="eyebrow">CONTENIDO MCI</span><h2>Videos, demostraciones y trabajos</h2><p>Publicaremos demostraciones de repuestos, mantenimientos y proyectos realizados por MCI. Los videos de nuestros canales de TikTok y YouTube se mostrarán aquí.</p></div></div><div className="video-channels"><article><div className="video-icon tiktok"><Video/></div><div><small>TIKTOK MCI</small><h3>Videos cortos y transmisiones</h3><p>Reels de productos, consejos técnicos y trabajos en estaciones de servicio.</p><span className="coming">Próximamente: canal oficial</span></div></article><article><div className="video-icon youtube"><CirclePlay/></div><div><small>YOUTUBE MCI</small><h3>Demostraciones completas</h3><p>Funcionamiento de equipos, mantenimiento y presentación de nuestros sistemas.</p><span className="coming">Próximamente: canal oficial</span></div></article></div></div>
        <div className="location-block"><span className="eyebrow">VISÍTENOS</span><h2>MCI en Santa Cruz</h2><p><MapPin size={17}/> Av. Centenario, calle 3 N.º 3020, Santa Cruz de la Sierra</p><div className="map-frame"><iframe title="Ubicación de MCI en Google Maps" src="https://www.google.com/maps?q=Av.%20Centenario%20calle%203%20N%C2%BA%203020%20Santa%20Cruz%20de%20la%20Sierra%20Bolivia&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div><a className="button outline map-button" href="https://www.google.com/maps/search/?api=1&query=Av.%20Centenario%20calle%203%20N%C2%BA%203020%20Santa%20Cruz%20de%20la%20Sierra%20Bolivia" target="_blank" rel="noreferrer">Abrir en Google Maps <ExternalLink size={17}/></a></div>
      </section>

      <section className="digital-services" id="aplicaciones"><div className="digital-copy"><span className="eyebrow light">APLICACIONES Y SERVICIOS</span><h2>MCI también lo acompaña digitalmente</h2><p>Instale nuestra aplicación web, solicite cotizaciones y acceda a información especializada desde su celular o computadora.</p><div className="install-actions"><a className="button white" href="https://github.com/nelalemento-max/mci-industria/releases/download/android-latest/MCI-Industria.apk"><Download size={18}/> Descargar APK Android</a><button className="button systems-demo" onClick={installApp}><Smartphone size={18}/> Instalar app web</button></div><small>En iPhone abra esta página con Safari, pulse Compartir y seleccione “Agregar a pantalla de inicio”. El APK Android se actualiza desde el repositorio oficial de MCI.</small></div><div className="digital-access"><div className="visitor-counter"><strong>{visits.toLocaleString('es-BO')}</strong><span>visitas acumuladas</span></div><div className="extras-list"><span><ShieldCheck/> Saldos de combustible</span><span><ShieldCheck/> Dólar BCB y referencias P2P</span><span><ShieldCheck/> Precios regionales de combustibles</span><span><ShieldCheck/> Cotizaciones MCI en PDF</span></div><button className="button primary full" onClick={openPortal}><UserRound size={18}/>{user ? 'Abrir mi cuenta' : 'Iniciar sesión'}</button></div></section>
    </main>

    <footer id="contacto"><div className="brand footer-brand"><img className="brand-logo footer-logo" src="/logo-mci.jpeg" alt="MCI Mantenimiento Corporativo Industrial"/><span><strong>Mantenimiento Corporativo Industrial</strong><small>Santa Cruz, Bolivia</small></span></div><div><strong>Contacto comercial</strong><a href="tel:+59167778452"><Phone size={16}/> 67778452</a><a href="https://wa.me/59173171675" target="_blank" rel="noreferrer"><MessageCircle size={16}/> 73171675</a></div><div><strong>Ubicación</strong><span>Av. Centenario, calle 3 N.º 3020</span><span>Santa Cruz de la Sierra</span></div></footer>

    <a className="floating-wa" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="WhatsApp MCI"><MessageCircle/></a>
    {quoteOpen && <QuoteDrawer items={quote} setItems={setQuote} onClose={() => setQuoteOpen(false)} onRequest={() => {setQuoteOpen(false); setRequestOpen(true)}}/>}
    {requestOpen && <RequestModal items={quote} onClose={() => setRequestOpen(false)} />}
  </>
}

function QuoteDrawer({items, setItems, onClose, onRequest}) {
  const change = (id, delta) => setItems(items.map((i) => i.id === id ? {...i, qty: Math.max(1, i.qty + delta)} : i))
  return <div className="overlay"><aside className="drawer"><div className="drawer-head"><div><small>SOLICITUD</small><h2>Mi cotización</h2></div><button className="close" onClick={onClose}><X/></button></div>{items.length ? <><div className="quote-list">{items.map((i) => <div className="quote-item" key={i.id}><img src={i.image} alt=""/><div><strong>{i.name}</strong><small>{i.category}</small><span className="qty"><button onClick={() => change(i.id,-1)}><Minus/></button>{i.qty}<button onClick={() => change(i.id,1)}><Plus/></button></span></div><button className="remove" onClick={() => setItems(items.filter((x) => x.id !== i.id))}><Trash2/></button></div>)}</div><button className="button primary full" onClick={onRequest}>Continuar solicitud <ChevronRight/></button></> : <div className="drawer-empty"><ShoppingBag/><h3>Aún no agregó productos</h3><p>Explore el catálogo o solicite un repuesto especial.</p><button className="button primary" onClick={onRequest}>Solicitar otro repuesto</button></div>}</aside></div>
}

function WorkCarousel({projects}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef(null)
  useEffect(() => {
    if (paused) return undefined
    const timer = window.setInterval(() => setActive((current) => (current + 1) % projects.length), 4500)
    return () => window.clearInterval(timer)
  }, [paused, projects.length])
  const previous = () => setActive((current) => (current - 1 + projects.length) % projects.length)
  const next = () => setActive((current) => (current + 1) % projects.length)
  const finishSwipe = (event) => {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 45) distance > 0 ? previous() : next()
    touchStart.current = null
  }
  return <section className="work-gallery" aria-label="Galería de trabajos realizados por MCI"><div className="work-gallery-head"><div><span className="eyebrow">EXPERIENCIA EN CAMPO</span><h2>Servicios, mantenimiento y construcción</h2><p>Conozca algunos de nuestros trabajos en estaciones de servicio, instalaciones de combustible y sistemas industriales.</p></div><a className="button outline" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola MCI, deseo información sobre sus servicios de mantenimiento y construcción.')}`} target="_blank" rel="noreferrer">Solicitar visita técnica</a></div><div className="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(event) => {touchStart.current = event.touches[0].clientX; setPaused(true)}} onTouchEnd={(event) => {finishSwipe(event); setPaused(false)}}><div className="carousel-track" style={{transform:`translateX(-${active * 100}%)`}}>{projects.map((project, index) => <article className="work-slide" key={project.image} aria-hidden={active !== index}><img src={project.image} alt={project.title}/><div className="work-caption"><span>PROYECTO {String(index + 1).padStart(2, '0')}</span><h3>{project.title}</h3><p>{project.text}</p></div></article>)}</div><button className="carousel-arrow previous" onClick={previous} aria-label="Ver trabajo anterior"><ChevronRight/></button><button className="carousel-arrow next" onClick={next} aria-label="Ver trabajo siguiente"><ChevronRight/></button><div className="carousel-dots">{projects.map((project, index) => <button key={project.image} className={active === index ? 'active' : ''} onClick={() => setActive(index)} aria-label={`Ver proyecto ${index + 1}`}></button>)}</div></div></section>
}

function RequestModal({items, onClose}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [detail, setDetail] = useState(items.map((i) => `${i.qty} x ${i.name}`).join('\n'))
  const submit = async (e) => {
    e.preventDefault()
    try { await saveRequest({name, phone, detail, items:items.map((item) => ({id:item.id,name:item.name,qty:item.qty}))}) } catch {}
    const text = `SOLICITUD DE COTIZACIÓN MCI\nNombre: ${name}\nWhatsApp: ${phone}\n\nDetalle:\n${detail}`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }
  return <div className="overlay modal-overlay"><section className="modal"><button className="close" onClick={onClose}><X/></button><span className="eyebrow">MCI SE LO CONSIGUE</span><h2>Cuéntenos qué repuesto necesita</h2><p>Solo necesitamos sus datos de contacto y el detalle del equipo. Nuestro personal continuará la atención por WhatsApp.</p><form onSubmit={submit}><label>Nombre completo<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Carlos Mendoza"/></label><label>Número de WhatsApp<input required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. 70000000"/></label><label>Detalle del repuesto<textarea required rows="5" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Nombre, marca, modelo, medida, cantidad o cualquier dato que tenga..."/></label><button className="button primary full" type="submit"><Send size={18}/> Enviar solicitud por WhatsApp</button></form><small className="privacy">Sus datos serán utilizados únicamente para atender esta solicitud.</small></section></div>
}

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
createRoot(document.getElementById('root')).render(<App />)

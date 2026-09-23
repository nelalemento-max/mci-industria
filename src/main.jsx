import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, Wrench, Building2, Cpu, ShoppingBag, Menu, X, ChevronRight, MessageCircle, ShieldCheck, MapPin, Phone, Plus, Minus, Trash2, Send, Gauge, Fuel } from 'lucide-react'
import './styles.css'

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
]

const services = [
  { icon: Wrench, title: 'Mantenimiento especializado', text: 'Diagnóstico, reparación y mantenimiento preventivo y correctivo de equipos petroleros.' },
  { icon: Building2, title: 'Construcción y adecuación', text: 'Proyectos integrales, ampliaciones y adecuaciones para estaciones de servicio.' },
  { icon: Cpu, title: 'Sistemas de control', text: 'Soluciones web, móviles y offline para controlar operaciones, inventarios y mantenimiento.' },
]

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [quote, setQuote] = useState([])
  const [menu, setMenu] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)

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

  return <>
    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="MCI inicio"><img className="brand-logo" src="/logo-mci.jpeg" alt="MCI Mantenimiento Corporativo Industrial"/><span><strong>Mantenimiento Corporativo Industrial</strong><small>Venta de surtidores y equipos</small></span></a>
      <nav className={menu ? 'nav open' : 'nav'}>
        <a href="#productos" onClick={() => setMenu(false)}>Productos</a>
        <a href="#servicios" onClick={() => setMenu(false)}>Servicios</a>
        <a href="#sistemas" onClick={() => setMenu(false)}>Sistemas</a>
        <a href="#contacto" onClick={() => setMenu(false)}>Contacto</a>
      </nav>
      <button className="quote-pill" onClick={() => setQuoteOpen(true)}><ShoppingBag size={18}/> Mi cotización <b>{quote.reduce((a, i) => a + i.qty, 0)}</b></button>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Abrir menú">{menu ? <X/> : <Menu/>}</button>
    </header>

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

      <section className="systems" id="sistemas"><div><span className="eyebrow light">TECNOLOGÍA MCI</span><h2>Sistemas de control para una operación más ordenada</h2><p>Desarrollamos soluciones para inventarios, mantenimiento, ventas, reportes y seguimiento operativo, adaptadas a cada empresa.</p><a className="button white" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola MCI, deseo una demostración de sus sistemas de control.')}`} target="_blank" rel="noreferrer">Solicitar demostración</a></div><div className="system-screen"><div className="screen-top"><i></i><i></i><i></i></div><div className="screen-content"><div className="mini-sidebar"></div><div className="mini-main"><span></span><div className="mini-stats"><b></b><b></b><b></b></div><div className="mini-chart"></div></div></div></div></section>
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

function RequestModal({items, onClose}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [detail, setDetail] = useState(items.map((i) => `${i.qty} x ${i.name}`).join('\n'))
  const submit = (e) => {
    e.preventDefault()
    const text = `SOLICITUD DE COTIZACIÓN MCI\nNombre: ${name}\nWhatsApp: ${phone}\n\nDetalle:\n${detail}`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }
  return <div className="overlay modal-overlay"><section className="modal"><button className="close" onClick={onClose}><X/></button><span className="eyebrow">MCI SE LO CONSIGUE</span><h2>Cuéntenos qué repuesto necesita</h2><p>Solo necesitamos sus datos de contacto y el detalle del equipo. Nuestro personal continuará la atención por WhatsApp.</p><form onSubmit={submit}><label>Nombre completo<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Carlos Mendoza"/></label><label>Número de WhatsApp<input required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej. 70000000"/></label><label>Detalle del repuesto<textarea required rows="5" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Nombre, marca, modelo, medida, cantidad o cualquier dato que tenga..."/></label><button className="button primary full" type="submit"><Send size={18}/> Enviar solicitud por WhatsApp</button></form><small className="privacy">Sus datos serán utilizados únicamente para atender esta solicitud.</small></section></div>
}

createRoot(document.getElementById('root')).render(<App />)

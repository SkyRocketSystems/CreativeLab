/* ============================================================
   CreativeLab — Carritos independientes por ámbito
   Sin frameworks · vanilla JS · localStorage
   Cargado desde Layout.astro: disponible en todas las páginas.

   Dos carritos independientes:
   - window.Carrito.productos → "Crea el tuyo" (configurador).
     localStorage: creativelab:carrito
   - window.Carrito.caja → "La caja" (suscripciones; máximo un plan
     por duración Semestral/Anual: elegir otro plan de la misma
     duración reemplaza al anterior).
     localStorage: creativelab:caja

   API por instancia: agregar, obtener, cambiarCantidad, quitar,
   vaciar, total, cantidadTotal, abrir, cerrar.
   Evento: document ← 'carrito:actualizado' (detail.ambito, detail.items)
   ============================================================ */

const CLAVES = {
  productos: 'creativelab:carrito',
  caja: 'creativelab:caja',
};
const EVENTO_ACTUALIZADO = 'carrito:actualizado';

/* ---------- Utilidades ---------- */
const formatoCOP = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;

function escapar(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function luminancia(hex) {
  const c = String(hex || '').replace('#', '');
  if (c.length < 6) return 0.5;
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/* ---------- Migración: el prototipo usaba una sola clave compartida ---------- */
function migrarCarritoCompartido() {
  try {
    const crudo = localStorage.getItem(CLAVES.productos);
    if (!crudo) return;
    const datos = JSON.parse(crudo);
    if (!Array.isArray(datos)) return;
    const suscripciones = datos.filter((it) => it && it.tipo === 'suscripcion');
    if (!suscripciones.length) return;

    const productos = datos.filter((it) => it && it.tipo !== 'suscripcion');

    let caja = [];
    try {
      const previos = JSON.parse(localStorage.getItem(CLAVES.caja) || '[]');
      caja = Array.isArray(previos) ? previos.filter((it) => it && it.id) : [];
    } catch {
      caja = [];
    }

    /* Un plan por duración: la suscripción migrada reemplaza a la existente.
       Los items viejos no traían duracion: se deduce del id (…|Plan|Semestral). */
    const porDuracion = new Map();
    [...caja, ...suscripciones].forEach((it) => {
      const duracion = it.duracion || (String(it.id).split('|')[2] === 'Anual' ? 'Anual' : 'Semestral');
      porDuracion.set(duracion, { ...it, duracion });
    });

    localStorage.setItem(CLAVES.caja, JSON.stringify(Array.from(porDuracion.values())));
    localStorage.setItem(CLAVES.productos, JSON.stringify(productos));
  } catch {
    /* storage corrupto: cada carrito arranca vacío */
  }
}

/* ---------- Fábrica de carritos (un estado y una clave por ámbito) ---------- */
function crearCarrito({ ambito, clave, unicoPor = null }) {
  let items = [];

  function leer() {
    try {
      const crudo = localStorage.getItem(clave);
      if (!crudo) return;
      const datos = JSON.parse(crudo);
      if (Array.isArray(datos)) {
        items = datos.filter((it) => it && it.id && Number(it.precio) > 0);
      }
    } catch {
      items = []; /* storage corrupto → carrito vacío */
    }
  }

  function guardar() {
    try {
      localStorage.setItem(clave, JSON.stringify(items));
    } catch {
      /* navegación privada: el carrito vive solo en memoria */
    }
  }

  function notificar() {
    document.dispatchEvent(new CustomEvent(EVENTO_ACTUALIZADO, { detail: { ambito, items } }));
  }

  const instancia = {
    ambito,

    obtener: () => structuredClone(items),

    cantidadTotal: () => items.reduce((suma, it) => suma + it.cantidad, 0),

    total: () => items.reduce((suma, it) => suma + it.precio * it.cantidad, 0),

    agregar(item) {
      const limpio = {
        id: String(item.id),
        tipo: item.tipo === 'suscripcion' ? 'suscripcion' : 'producto',
        nombre: String(item.nombre ?? 'Producto'),
        descripcion: String(item.descripcion ?? ''),
        precio: Math.max(0, Math.round(Number(item.precio) || 0)),
        cantidad: Math.max(1, Math.round(Number(item.cantidad) || 1)),
        color: item.color ?? null,
        producto: item.producto ?? null,
        duracion: item.duracion ?? null,
      };
      /* Regla de unicidad (caja: un plan por duración): los items
         existentes con la misma clave se reemplazan en vez de acumularse. */
      if (unicoPor) {
        const claveNueva = unicoPor(limpio);
        items = items.filter((it) => unicoPor(it) !== claveNueva);
      }
      const existente = items.find((it) => it.id === limpio.id);
      if (existente) existente.cantidad += limpio.cantidad;
      else items.push(limpio);
      guardar();
      notificar();
      return instancia.obtener();
    },

    cambiarCantidad(id, delta) {
      const item = items.find((it) => it.id === id);
      if (!item) return;
      item.cantidad += delta;
      if (item.cantidad <= 0) items = items.filter((it) => it.id !== id);
      guardar();
      notificar();
    },

    quitar(id) {
      items = items.filter((it) => it.id !== id);
      guardar();
      notificar();
    },

    vaciar() {
      items = [];
      guardar();
      notificar();
    },
  };

  return { instancia, cargar: leer };
}

const carritoProductos = crearCarrito({ ambito: 'productos', clave: CLAVES.productos });
const carritoCaja = crearCarrito({
  ambito: 'caja',
  clave: CLAVES.caja,
  unicoPor: (it) => it.duracion || `id:${it.id}`,
});

const Carrito = {
  productos: carritoProductos.instancia,
  caja: carritoCaja.instancia,
};

window.Carrito = Carrito;

/* ---------- Drawer del carrito ---------- */
const ICONOS = {
  producto:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1.2 12H7.2L6 8Z"></path><path d="M9 8V6a3 3 0 0 1 6 0v2"></path></svg>',
  suscripcion:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7"></path><path d="M12 7s-2.6 0-3.6-1.5A1.9 1.9 0 0 1 11 3c.8.5 1 2 1 4z"></path><path d="M12 7s2.6 0 3.6-1.5A1.9 1.9 0 0 0 13 3c-.8.5-1 2-1 4z"></path></svg>',
};

/* Un drawer por ámbito: abrir()/cerrar() viven en cada instancia */
function conectarDrawer(instancia) {
  let ultimoFoco = null;

  function abrir() {
    const drawer = document.getElementById(`carrito-drawer-${instancia.ambito}`);
    if (!drawer) return;
    /* si el otro drawer quedó abierto, se cierra primero */
    Object.values(Carrito).forEach((otra) => {
      if (otra !== instancia) otra.cerrar();
    });
    ultimoFoco = document.activeElement;
    drawer.classList.add('es-abierto');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('.carrito-cerrar')?.focus();
  }

  function cerrar() {
    const drawer = document.getElementById(`carrito-drawer-${instancia.ambito}`);
    if (!drawer || !drawer.classList.contains('es-abierto')) return;
    drawer.classList.remove('es-abierto');
    const menuAbierto = document.getElementById('menu-movil')?.classList.contains('es-abierto');
    const modalAbierto = document.getElementById('modal-vista')?.classList.contains('es-abierto');
    if (!menuAbierto && !modalAbierto) document.body.style.overflow = '';
    ultimoFoco?.focus?.();
  }

  instancia.abrir = abrir;
  instancia.cerrar = cerrar;
}

Object.values(Carrito).forEach(conectarDrawer);

/* ---------- Badges por ámbito (header index, barra móvil, header caja) ---------- */
const ETIQUETA_BOTON = {
  productos: (n) => `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`,
  caja: (n) => `Caja, ${n} ${n === 1 ? 'plan' : 'planes'}`,
};

function sincronizarBadges(instancia) {
  const { ambito } = instancia;
  const n = instancia.cantidadTotal();
  document.querySelectorAll(`.badge-carrito[data-ambito="${ambito}"]`).forEach((badge) => {
    badge.textContent = String(n);
    badge.hidden = n === 0;
  });
  /* data-abrir-carrito sin valor sigue abriendo el carrito de productos */
  const selectorBotones =
    ambito === 'productos'
      ? '[data-abrir-carrito="productos"], [data-abrir-carrito=""]'
      : `[data-abrir-carrito="${ambito}"]`;
  document.querySelectorAll(selectorBotones).forEach((boton) => {
    boton.setAttribute('aria-label', ETIQUETA_BOTON[ambito](n));
  });
}

/* ---------- Render del drawer ---------- */
function visualItem(it) {
  const fondo = it.tipo === 'suscripcion' ? '#B8D3AE' : it.color || '#E6DEC9';
  const tinta = luminancia(fondo) > 0.45 ? 'rgba(30,26,24,.85)' : 'rgba(250,248,243,.92)';
  const icono = ICONOS[it.tipo] ?? ICONOS.producto;
  return `<span class="carrito-visual" style="--visual-fondo:${fondo};--visual-tinta:${tinta}">${icono}</span>`;
}

function renderCarrito(instancia) {
  sincronizarBadges(instancia);

  const lista = document.getElementById(`carrito-items-${instancia.ambito}`);
  if (!lista) return;

  const vacio = document.getElementById(`carrito-vacio-${instancia.ambito}`);
  const contenido = document.getElementById(`carrito-contenido-${instancia.ambito}`);
  const pie = document.getElementById(`carrito-pie-${instancia.ambito}`);
  const hay = instancia.cantidadTotal() > 0;
  if (vacio) vacio.hidden = hay;
  if (contenido) contenido.hidden = !hay;
  if (pie) pie.hidden = !hay;

  lista.innerHTML = instancia.obtener()
    .map(
      (it) => `
      <li class="carrito-item" data-id="${escapar(it.id)}">
        ${visualItem(it)}
        <div class="carrito-item-info">
          <p class="carrito-item-nombre">${escapar(it.nombre)}</p>
          ${it.descripcion ? `<p class="carrito-item-desc">${escapar(it.descripcion)}</p>` : ''}
          <div class="carrito-item-controles">
            <div class="carrito-cantidad" role="group" aria-label="Cantidad de ${escapar(it.nombre)}">
              <button type="button" data-carrito-cant="-1" aria-label="Quitar uno">−</button>
              <span aria-hidden="true">${it.cantidad}</span>
              <button type="button" data-carrito-cant="1" aria-label="Agregar uno">+</button>
            </div>
            <button type="button" class="carrito-quitar" data-carrito-quitar>Quitar</button>
          </div>
        </div>
        <p class="carrito-item-precio">${formatoCOP(it.precio * it.cantidad)}</p>
      </li>`
    )
    .join('');

  const total = instancia.total();
  const subtotalEl = document.getElementById(`carrito-subtotal-${instancia.ambito}`);
  const totalEl = document.getElementById(`carrito-total-${instancia.ambito}`);
  const pagarEl = document.getElementById(`carrito-pagar-${instancia.ambito}`);
  if (subtotalEl) subtotalEl.textContent = `${formatoCOP(total)} COP`;
  if (totalEl) totalEl.textContent = `${formatoCOP(total)} COP`;
  if (pagarEl) pagarEl.textContent = `Pagar ${formatoCOP(total)} COP`;
}

/* ---------- Eventos globales (delegación: funciona en cualquier página) ---------- */
document.addEventListener('click', (e) => {
  const botonAbrir = e.target.closest('[data-abrir-carrito]');
  if (botonAbrir) {
    e.preventDefault();
    Carrito[botonAbrir.dataset.abrirCarrito || 'productos']?.abrir();
    return;
  }
  const botonCerrar = e.target.closest('[data-cerrar-carrito]');
  if (botonCerrar) {
    /* el drawer que contiene el botón define su ámbito */
    const ambito = botonCerrar.closest('.carrito-drawer')?.dataset.carritoAmbito || 'productos';
    Carrito[ambito]?.cerrar();
    return;
  }
  const cantidad = e.target.closest('[data-carrito-cant]');
  if (cantidad) {
    const ambito = cantidad.closest('.carrito-drawer')?.dataset.carritoAmbito;
    const id = cantidad.closest('.carrito-item')?.dataset.id;
    if (id && ambito) Carrito[ambito].cambiarCantidad(id, Number(cantidad.dataset.carritoCant));
    return;
  }
  const quitar = e.target.closest('[data-carrito-quitar]');
  if (quitar) {
    const ambito = quitar.closest('.carrito-drawer')?.dataset.carritoAmbito;
    const id = quitar.closest('.carrito-item')?.dataset.id;
    if (id && ambito) Carrito[ambito].quitar(id);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    Carrito.productos.cerrar();
    Carrito.caja.cerrar();
  }
});

document.addEventListener(EVENTO_ACTUALIZADO, (e) => {
  const instancia = Carrito[e.detail?.ambito];
  if (instancia) renderCarrito(instancia);
});

/* ---------- Init (los módulos se ejecutan con el DOM ya parseado) ---------- */
migrarCarritoCompartido();
carritoProductos.cargar();
carritoCaja.cargar();
Object.values(Carrito).forEach(renderCarrito);


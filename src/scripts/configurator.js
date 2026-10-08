/* ============================================================
   CreativeLab — Lógica del configurador "Crea el tuyo"
   Una sola página · sin frameworks · vanilla JS
   ============================================================ */

/* Número de WhatsApp del negocio, en formato internacional SIN "+".
   Ejemplo: '573001234567'. Si se deja vacío, el botón funciona en
   modo demo: copia el mensaje al portapapeles y muestra un toast. */
const WHATSAPP_NUMBER = '';

const CLAVE_LOCAL = 'creativelab:diseno';

const PALETA = {
  natural: '#E6DEC9',
  taupe: '#AD8470',
  terracota: '#C86B45',
  salvia: '#B8D3AE',
  carbon: '#1E1A18',
  crema: '#FAF8F3',
};

/* Fotos reales del tote bag (en public/Totebags). Solo estos colores del
   tote tienen fotografía; organizador y decorativo usan el mockup SVG. */
const FOTOS_TOTE = { natural: 'beige', salvia: 'green' };
const RUTAS_FOTOS = {
  beige: '/Totebags/tote-beige.png',
  green: '/Totebags/tote-green.png',
  personalizado: '/Totebags/tote-personalizado.png',
};

const NOMBRES = {
  productos: { tote: 'Tote bag', organizador: 'Organizador', decorativo: 'Decorativo' },
  colores: {
    natural: 'Natural',
    taupe: 'Taupe',
    terracota: 'Terracota',
    salvia: 'Verde salvia',
    carbon: 'Carbón',
    crema: 'Crema',
  },
  materiales: {
    lona: 'Lona de algodón reciclado',
    lienzo: 'Lienzo natural',
    impermeable: 'Tela impermeable',
    premium: 'Material recuperado premium',
  },
  fuentes: { moderna: 'Moderna', manuscrita: 'Manuscrita', clasica: 'Clásica' },
  extras: {
    bolsillo: 'Bolsillo interior',
    etiqueta: 'Etiqueta personalizada',
    empaque: 'Empaque para regalo',
    tarjeta: 'Tarjeta con mensaje',
  },
};

const PRECIOS = {
  base: { tote: 40000, organizador: 50000, decorativo: 60000 },
  texto: 10000,
  material: { lona: 0, lienzo: 0, impermeable: 8000, premium: 10000 },
  extras: { bolsillo: 8000, etiqueta: 5000, empaque: 7000, tarjeta: 3000 },
};

const ESTADO_INICIAL = {
  producto: 'tote',
  color: 'natural',
  material: 'lona',
  tarjeta: { para: '', de: '', mensaje: '' },
  fuente: 'moderna',
  extras: { bolsillo: false, etiqueta: false, empaque: false, tarjeta: false },
};

let estado = structuredClone(ESTADO_INICIAL);

/* Campos de la tarjeta de regalo y su longitud máxima */
const CAMPOS_TARJETA = { para: 30, de: 30, mensaje: 140 };

const tarjetaTieneTexto = () =>
  Boolean(
    estado.tarjeta.para.trim() || estado.tarjeta.de.trim() || estado.tarjeta.mensaje.trim()
  );

/* Resumen corto de la dedicatoria: "Para X de Y" o "Con mensaje personalizado" */
const resumenTarjeta = () => {
  if (!tarjetaTieneTexto()) return 'Sin dedicatoria';
  const partes = [
    estado.tarjeta.para.trim() && `Para ${estado.tarjeta.para.trim()}`,
    estado.tarjeta.de.trim() && `de ${estado.tarjeta.de.trim()}`,
  ].filter(Boolean);
  return partes.length ? partes.join(' ') : 'Con mensaje personalizado';
};

const PRESETS = {
  toteNatural: structuredClone(ESTADO_INICIAL),
  organizadorTerracota: {
    producto: 'organizador',
    color: 'terracota',
    material: 'lienzo',
    tarjeta: { para: 'Laura', de: 'Equipo de ventas', mensaje: 'Orden y calma para tu día a día' },
    fuente: 'moderna',
    extras: { bolsillo: true, etiqueta: false, empaque: false, tarjeta: true },
  },
  decorativoSalvia: {
    producto: 'decorativo',
    color: 'salvia',
    material: 'premium',
    tarjeta: { para: 'Mamá', de: 'Sofi', mensaje: 'Hogar dulce hogar' },
    fuente: 'manuscrita',
    extras: { bolsillo: false, etiqueta: true, empaque: false, tarjeta: true },
  },
};

/* ---------- Utilidades ---------- */
const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

const formatoCOP = (n) => `$${n.toLocaleString('es-CO')}`;

function luminancia(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

let toastTimer;
function mostrarToast(mensaje) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add('es-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('es-visible'), 3400);
}

function calcularTotales() {
  const base = PRECIOS.base[estado.producto] ?? 0;
  const texto = tarjetaTieneTexto() ? PRECIOS.texto : 0;
  const material = PRECIOS.material[estado.material] ?? 0;
  const extrasActivos = Object.entries(estado.extras)
    .filter(([, activo]) => activo)
    .map(([clave]) => clave);
  const extrasTotal = extrasActivos.reduce((suma, clave) => suma + PRECIOS.extras[clave], 0);
  return { base, texto, material, extrasActivos, extrasTotal, total: base + texto + material + extrasTotal };
}

/* ---------- Render: mockups ---------- */
function renderizarMockups() {
  const colorHex = PALETA[estado.color] ?? PALETA.natural;
  $$('.mockup.stateful').forEach((mockup) => {
    mockup.dataset.product = estado.producto;
    mockup.dataset.material = estado.material;
    mockup.dataset.pocket = estado.extras.bolsillo ? 'on' : 'off';
    mockup.dataset.label = estado.extras.etiqueta ? 'on' : 'off';
    /* Foto reactiva del tote: en el mockup final (Resumen) se muestra la
       versión personalizada; en el resto, la del color elegido. */
    const foto =
      estado.producto === 'tote'
        ? mockup.dataset.modo === 'final'
          ? 'personalizado'
          : FOTOS_TOTE[estado.color] ?? null
        : null;
    if (foto) mockup.dataset.foto = foto;
    else mockup.removeAttribute('data-foto');
    mockup.style.setProperty('--fabric', colorHex);
    mockup.style.setProperty(
      '--stitch',
      luminancia(colorHex) > 0.45 ? 'rgba(30,26,24,.38)' : 'rgba(250,248,243,.45)'
    );
  });
  const modalTitulo = $('#modal-titulo');
  if (modalTitulo) {
    modalTitulo.textContent = `${NOMBRES.productos[estado.producto]} · ${NOMBRES.colores[estado.color]}`;
  }
}

/* ---------- Render: tarjeta de regalo ---------- */
function renderizarTarjeta() {
  $$('.tarjeta-regalo.stateful').forEach((tarjeta) => {
    tarjeta.dataset.fuente = estado.fuente;
    const para = $('.tr-para .tr-valor', tarjeta);
    if (para) para.textContent = estado.tarjeta.para.trim();
    const de = $('.tr-de .tr-valor', tarjeta);
    if (de) de.textContent = estado.tarjeta.de.trim();
    const mensaje = $('.tr-mensaje', tarjeta);
    if (mensaje) mensaje.textContent = estado.tarjeta.mensaje.trim();
  });
  const bloqueResumen = $('#resumen-tarjeta');
  if (bloqueResumen) bloqueResumen.hidden = !tarjetaTieneTexto();
}

/* ---------- Render: precio y desglose ---------- */
function renderizarPrecio() {
  const t = calcularTotales();

  ['#precio-hero', '#precio-resumen'].forEach((sel) => {
    const el = $(sel);
    if (el) el.textContent = `${formatoCOP(t.total)} COP`;
  });
  const barraPrecio = $('#barra-precio');
  if (barraPrecio) barraPrecio.textContent = `${formatoCOP(t.total)} COP`;

  const dBase = $('#d-base-val');
  if (dBase) dBase.textContent = formatoCOP(t.base);
  const dBaseNombre = $('#d-base-nombre');
  if (dBaseNombre) dBaseNombre.textContent = NOMBRES.productos[estado.producto];

  const filaTexto = $('#fila-texto');
  if (filaTexto) filaTexto.hidden = t.texto === 0;

  const filaMaterial = $('#fila-material');
  if (filaMaterial) {
    filaMaterial.hidden = t.material === 0;
    $('#d-material-nombre').textContent = NOMBRES.materiales[estado.material];
    $('#d-material-val').textContent = `+${formatoCOP(t.material)}`;
  }

  Object.keys(estado.extras).forEach((clave) => {
    const fila = $(`[data-fila-extra="${clave}"]`);
    if (fila) fila.hidden = !estado.extras[clave];
  });
}

/* ---------- Render: progreso ---------- */
function renderizarProgreso() {
  const lista = [
    Boolean(estado.producto),
    Boolean(estado.color),
    Boolean(estado.material),
    tarjetaTieneTexto(),
    Object.values(estado.extras).some(Boolean),
  ];
  const listos = lista.filter(Boolean).length;

  const contador = $('#progreso-contador');
  if (contador) contador.textContent = `${listos} de 5`;
  const barra = $('#barra-progreso');
  if (barra) barra.style.width = `${(listos / 5) * 100}%`;
  const barraRol = $('#barra-progreso-fondo');
  if (barraRol) {
    barraRol.setAttribute('aria-valuenow', String(listos));
    barraRol.setAttribute(
      'aria-label',
      `${listos} de 5 detalles listos: producto, color, material, tarjeta y extras`
    );
  }
}

/* ---------- Render: resumen ampliado ---------- */
function renderizarResumen() {
  const extrasTexto =
    Object.entries(estado.extras)
      .filter(([, activo]) => activo)
      .map(([clave]) => NOMBRES.extras[clave])
      .join(', ') || 'Ninguno';

  const valores = {
    '#val-producto': NOMBRES.productos[estado.producto],
    '#val-color': NOMBRES.colores[estado.color],
    '#val-material': NOMBRES.materiales[estado.material],
    '#val-texto': resumenTarjeta(),
    '#val-fuente': NOMBRES.fuentes[estado.fuente],
    '#val-extras': extrasTexto,
  };
  Object.entries(valores).forEach(([sel, valor]) => {
    const el = $(sel);
    if (el) el.textContent = valor;
  });
}

/* ---------- Render: controles del configurador ---------- */
function marcarSeleccion(selector, atributo, valorActual) {
  $$(selector).forEach((btn) => {
    const activo = btn.dataset[atributo] === valorActual;
    btn.classList.toggle('is-selected', activo);
    btn.setAttribute('aria-pressed', String(activo));
    const etiquetaSel = btn.querySelector('[data-sel]');
    if (etiquetaSel) etiquetaSel.textContent = activo ? 'Seleccionado' : '';
  });
}

function renderizarControles() {
  marcarSeleccion('[data-elegir-producto]', 'elegirProducto', estado.producto);
  marcarSeleccion('[data-elegir-color]', 'elegirColor', estado.color);

  /* El tote bag solo se ofrece en los colores con fotografía real */
  $$('[data-elegir-color]').forEach((btn) => {
    btn.hidden = estado.producto === 'tote' && !(btn.dataset.elegirColor in FOTOS_TOTE);
  });
  const notaColor = $('#nota-color');
  if (notaColor) notaColor.hidden = estado.producto !== 'tote';
  marcarSeleccion('[data-elegir-material]', 'elegirMaterial', estado.material);
  marcarSeleccion('[data-elegir-fuente]', 'elegirFuente', estado.fuente);

  $$('[data-extra]').forEach((input) => {
    input.checked = Boolean(estado.extras[input.dataset.extra]);
  });

  Object.entries(CAMPOS_TARJETA).forEach(([campo, max]) => {
    const entrada = $(`#entrada-${campo}`);
    if (entrada && entrada.value !== estado.tarjeta[campo]) entrada.value = estado.tarjeta[campo];
    const contador = $(`#contador-${campo}`);
    if (contador) contador.textContent = `${estado.tarjeta[campo].length}/${max}`;
  });

  const nota = $('#nota-frase');
  if (nota) {
    nota.textContent = tarjetaTieneTexto()
      ? `Suma ${formatoCOP(PRECIOS.texto)} COP a tu total`
      : 'Este detalle es opcional';
  }
}

/* El tote bag solo está disponible en los colores con fotografía:
   si el estado guardado (o un cambio de producto) trae otro color,
   vuelve a natural. */
function normalizarEstado() {
  if (estado.producto === 'tote' && !(estado.color in FOTOS_TOTE)) {
    estado.color = 'natural';
  }
}

function render() {
  normalizarEstado();
  renderizarMockups();
  renderizarTarjeta();
  renderizarPrecio();
  renderizarProgreso();
  renderizarResumen();
  renderizarControles();
}

/* ---------- Tabs del configurador ---------- */
function activarTab(nombre) {
  $$('.panel-tabs .tab').forEach((tab) => {
    const activa = tab.dataset.tab === nombre;
    tab.classList.toggle('is-activa', activa);
    tab.setAttribute('aria-selected', String(activa));
    tab.tabIndex = activa ? 0 : -1;
  });
  $$('.panel-cuerpo .tab-panel').forEach((panel) => {
    panel.hidden = panel.id !== `panel-${nombre}`;
  });
}

function inicializarTabs() {
  const tabs = $$('.panel-tabs .tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activarTab(tab.dataset.tab));
  });
  $('.panel-tabs')?.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const indice = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const direccion = e.key === 'ArrowRight' ? 1 : -1;
    const siguiente = tabs[(indice + direccion + tabs.length) % tabs.length];
    siguiente.focus();
    activarTab(siguiente.dataset.tab);
  });
}

/* ---------- WhatsApp ---------- */
function construirMensaje() {
  const t = calcularTotales();
  const extras = t.extrasActivos.length
    ? t.extrasActivos.map((clave) => NOMBRES.extras[clave]).join(', ')
    : 'Ninguno';
  return [
    'Hola, quiero solicitar un producto personalizado de CreativeLab.',
    `Producto: ${NOMBRES.productos[estado.producto]}.`,
    `Color: ${NOMBRES.colores[estado.color]}.`,
    `Material: ${NOMBRES.materiales[estado.material]}.`,
    `Tarjeta de regalo: ${resumenTarjeta()}${
      estado.tarjeta.mensaje.trim() ? ` — "${estado.tarjeta.mensaje.trim()}"` : ''
    }.`,
    `Tipografía: ${NOMBRES.fuentes[estado.fuente]}.`,
    `Extras: ${extras}.`,
    `Total estimado: ${formatoCOP(t.total)} COP.`,
    'Quiero confirmar disponibilidad, tiempo de entrega y opciones de envío.',
  ].join('\n');
}

/* ---------- Carrito ---------- */
/* Convierte el estado del configurador en un item del carrito de productos
   (independiente del de la caja). El id determinista agrupa en una sola
   línea los diseños idénticos. */
function construirItemCarrito() {
  const t = calcularTotales();
  const extras = t.extrasActivos.slice().sort();
  const detalles = [
    NOMBRES.colores[estado.color],
    NOMBRES.materiales[estado.material],
    tarjetaTieneTexto() ? resumenTarjeta() : null,
    extras.length ? extras.map((clave) => NOMBRES.extras[clave]).join(', ') : null,
  ].filter(Boolean);
  const id = [
    'producto',
    estado.producto,
    estado.color,
    estado.material,
    estado.fuente,
    estado.tarjeta.para.trim(),
    estado.tarjeta.de.trim(),
    estado.tarjeta.mensaje.trim(),
    extras.join('+'),
  ].join('|');
  return {
    id,
    tipo: 'producto',
    nombre: NOMBRES.productos[estado.producto],
    descripcion: detalles.join(' · '),
    precio: t.total,
    cantidad: 1,
    color: PALETA[estado.color],
    producto: estado.producto,
  };
}

function inicializarAcciones() {
  $$('[data-accion="whatsapp"]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const mensaje = construirMensaje();
      if (WHATSAPP_NUMBER) {
        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`,
          '_blank',
          'noopener'
        );
      } else {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(mensaje).catch(() => {});
        }
        mostrarToast(
          'Modo demo: define WHATSAPP_NUMBER en src/scripts/configurator.js. El mensaje se copió a tu portapapeles.'
        );
      }
    });
  });

  $$('[data-accion="agregar-carrito"]').forEach((boton) => {
    boton.addEventListener('click', () => {
      if (!window.Carrito?.productos) return;
      window.Carrito.productos.agregar(construirItemCarrito());
      mostrarToast('Tu diseño fue agregado al carrito');
    });
  });

  $$('[data-accion="guardar"]').forEach((boton) => {
    boton.addEventListener('click', () => {
      try {
        localStorage.setItem(CLAVE_LOCAL, JSON.stringify(estado));
        mostrarToast('Tu diseño quedó guardado en este dispositivo');
      } catch {
        mostrarToast('No pudimos guardar tu diseño en este navegador');
      }
    });
  });

  /* Exportar el diseño completo a PDF (diálogo de impresión del navegador) */
  $$('[data-accion="imprimir"]').forEach((boton) => {
    boton.addEventListener('click', () => window.print());
  });
}

/* ---------- Eventos del configurador ---------- */
function inicializarConfigurador() {
  $$('[data-elegir-producto]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estado.producto = btn.dataset.elegirProducto;
      render();
    });
  });
  $$('[data-elegir-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estado.color = btn.dataset.elegirColor;
      render();
    });
  });
  $$('[data-elegir-material]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estado.material = btn.dataset.elegirMaterial;
      render();
    });
  });
  $$('[data-elegir-fuente]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estado.fuente = btn.dataset.elegirFuente;
      render();
    });
  });

  Object.entries(CAMPOS_TARJETA).forEach(([campo, max]) => {
    const entrada = $(`#entrada-${campo}`);
    entrada?.addEventListener('input', () => {
      estado.tarjeta[campo] = entrada.value.slice(0, max);
      render();
    });
  });

  $$('[data-extra]').forEach((input) => {
    input.addEventListener('change', () => {
      estado.extras[input.dataset.extra] = input.checked;
      render();
    });
  });

  /* Diseños recientes */
  $$('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = PRESETS[btn.dataset.preset];
      if (!preset) return;
      estado = structuredClone(preset);
      render();
      mostrarToast(`Diseño cargado: ${btn.dataset.nombre ?? 'ejemplo'}`);
      if (window.innerWidth < 1080) {
        $('#panel-configurador')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* Botones "Personalizar" del catálogo */
  $$('[data-personalizar]').forEach((btn) => {
    btn.addEventListener('click', () => {
      estado.producto = btn.dataset.personalizar;
      render();
      $('#crear').scrollIntoView({ behavior: 'smooth' });
      mostrarToast(`${NOMBRES.productos[estado.producto]} listo para personalizar`);
    });
  });
}

/* ---------- Modal de vista ampliada ---------- */
let ultimoFoco = null;

function abrirModal() {
  const modal = $('#modal-vista');
  if (!modal) return;
  ultimoFoco = document.activeElement;
  modal.hidden = false;
  modal.classList.remove('es-cerrando');
  modal.classList.add('es-abierto');
  document.body.style.overflow = 'hidden';
  $('#modal-cerrar')?.focus();
}

function cerrarModal() {
  const modal = $('#modal-vista');
  if (!modal || modal.hidden || !modal.classList.contains('es-abierto')) return;
  const panel = $('.modal-caja', modal);
  let cierreTerminado = false;
  const terminarCierre = () => {
    if (cierreTerminado) return;
    cierreTerminado = true;
    panel?.removeEventListener('transitionend', terminarCierre);
    modal.classList.remove('es-cerrando');
    modal.hidden = true;
    document.body.style.overflow = '';
    ultimoFoco?.focus?.();
  };
  modal.classList.remove('es-abierto');
  modal.classList.add('es-cerrando');
  document.body.style.overflow = '';
  // Simetría: la salida debe verse completa antes de ocultar el diálogo
  // (esperamos la transición, con tope de seguridad por si no dispara).
  panel?.addEventListener('transitionend', terminarCierre);
  setTimeout(terminarCierre, 450);
}

function inicializarModal() {
  $('#btn-ampliar')?.addEventListener('click', abrirModal);
  $('#modal-cerrar')?.addEventListener('click', cerrarModal);
  $('.modal-fondo')?.addEventListener('click', cerrarModal);
}

/* ---------- Header: scroll y menú móvil ---------- */
function inicializarHeader() {
  const cabecera = $('#cabecera');
  const alScroll = () => cabecera?.classList.toggle('escrolada', window.scrollY > 8);
  alScroll();
  window.addEventListener('scroll', alScroll, { passive: true });

  const btnMenu = $('#btn-menu');
  const menu = $('#menu-movil');
  const abrirMenu = () => {
    menu?.classList.add('es-abierto');
    btnMenu?.setAttribute('aria-expanded', 'true');
    btnMenu?.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  };
  const cerrarMenu = () => {
    menu?.classList.remove('es-abierto');
    btnMenu?.setAttribute('aria-expanded', 'false');
    btnMenu?.setAttribute('aria-label', 'Abrir menú');
    if (!$('#modal-vista')?.classList.contains('es-abierto')) {
      document.body.style.overflow = '';
    }
  };
  btnMenu?.addEventListener('click', () => {
    if (menu?.classList.contains('es-abierto')) cerrarMenu();
    else abrirMenu();
  });
  $$('[data-cerrar-menu]').forEach((el) => el.addEventListener('click', cerrarMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarModal();
      cerrarMenu();
    }
  });

  $('#btn-buscar')?.addEventListener('click', () =>
    mostrarToast('La búsqueda estará disponible muy pronto')
  );
  /* El botón del carrito lo maneja src/scripts/carrito.js (drawer compartido) */

  /* Scrollspy: marca el enlace de la sección visible */
  const enlaces = $$('.nav-link');
  const idsNav = new Set(enlaces.map((l) => l.dataset.nav));
  const secciones = $$('[id]').filter((el) => idsNav.has(el.id));
  if ('IntersectionObserver' in window && secciones.length) {
    const spy = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          enlaces.forEach((enlace) => {
            const activa = enlace.dataset.nav === entrada.target.id;
            enlace.classList.toggle('is-activa', activa);
            if (activa) enlace.setAttribute('aria-current', 'true');
            else enlace.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    secciones.forEach((seccion) => spy.observe(seccion));
  }
}

/* ---------- Barra sticky móvil ---------- */
function inicializarBarraSticky() {
  const barra = $('#barra-movil');
  if (!barra || !('IntersectionObserver' in window)) return;
  let panelVisible = false;
  let resumenVisible = false;
  const actualizar = () => barra.classList.toggle('es-visible', panelVisible && !resumenVisible);
  new IntersectionObserver(
    ([entrada]) => {
      panelVisible = entrada.isIntersecting;
      actualizar();
    },
    { threshold: 0.1 }
  ).observe($('#panel-configurador'));
  new IntersectionObserver(
    ([entrada]) => {
      resumenVisible = entrada.isIntersecting;
      actualizar();
    },
    { threshold: 0.15 }
  ).observe($('#resumen'));
}

/* ---------- Formulario corporativo ---------- */
function inicializarFormularioEmpresas() {
  const formulario = $('#formulario-empresas');
  if (!formulario) return;

  $$('input, select, textarea', formulario).forEach((campo) => {
    campo.addEventListener('input', () => campo.closest('.campo')?.classList.remove('es-error'));
  });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    let valido = true;
    let primerInvalido = null;
    ['emp-nombre', 'emp-empresa', 'emp-contacto'].forEach((id) => {
      const campo = $(`#${id}`);
      if (!campo) return;
      const vacio = !campo.value.trim();
      campo.closest('.campo')?.classList.toggle('es-error', vacio);
      if (vacio) {
        valido = false;
        primerInvalido = primerInvalido ?? campo;
      }
    });
    if (!valido) {
      mostrarToast('Revisa los campos marcados para poder enviar tu solicitud');
      primerInvalido?.focus();
      return;
    }
    formulario.hidden = true;
    const confirmacion = $('#confirmacion-empresas');
    if (confirmacion) {
      confirmacion.hidden = false;
      confirmacion.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ---------- Ferias y enlaces informativos ---------- */
function inicializarExtras() {
  $('#btn-avisarme')?.addEventListener('click', (e) => {
    const boton = e.currentTarget;
    boton.disabled = true;
    boton.textContent = '¡Listo, te avisaremos!';
    mostrarToast('Te avisaremos cuando confirmemos la próxima feria o mercadito');
  });
  $('#enlace-instagram')?.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarToast('Nuestro Instagram estará disponible muy pronto');
  });
}

/* ---------- Init ---------- */
function restaurarDisenoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_LOCAL);
    if (!guardado) return;
    const datos = JSON.parse(guardado);
    estado = {
      ...structuredClone(ESTADO_INICIAL),
      ...datos,
      tarjeta: { ...ESTADO_INICIAL.tarjeta, ...(datos.tarjeta ?? {}) },
      extras: { ...ESTADO_INICIAL.extras, ...(datos.extras ?? {}) },
    };
  } catch {
    /* si el storage está corrupto, se usa el estado inicial */
  }
}

/* Precarga las fotos del tote para que el crossfade sea instantáneo */
Object.values(RUTAS_FOTOS).forEach((src) => {
  const img = new Image();
  img.src = src;
});

restaurarDisenoGuardado();
inicializarTabs();
inicializarConfigurador();
inicializarAcciones();
inicializarModal();
inicializarHeader();
inicializarBarraSticky();
inicializarFormularioEmpresas();
inicializarExtras();
activarTab('color');
render();





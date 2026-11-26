document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollSpy();
  initIoStepper();
  initEoqCalculator();
  initLightboxGallery();
});

/* ==================== MENÚ MÓVIL ==================== */
function initMobileNav() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav-principal");
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==================== NAVEGACIÓN ACTIVA AL HACER SCROLL ==================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("main > section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const target = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("is-active", target === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==================== STEPPER INTERACTIVO: 7 PASOS DE LA IO ==================== */
function initIoStepper() {
  const buttons = document.querySelectorAll(".step-btn");
  const panel = document.getElementById("step-panel");
  if (!buttons.length || !panel) return;

  const stepsData = {
    "1": {
      title: "Paso 1. Definición del problema",
      body: "Entender qué se quiere resolver: ¿cuál es el objetivo?, ¿qué decisiones hay que tomar?, ¿qué restricciones existen?, ¿quién decide?",
      extra: "<strong>Ejemplo informático:</strong> Asignar servidores en la nube. <em>Objetivo:</em> minimizar costos de hosting. <em>Decisión:</em> qué tipo de instancia usar para cada servicio. <em>Restricciones:</em> presupuesto, rendimiento mínimo y disponibilidad."
    },
    "2": {
      title: "Paso 2. Formulación del modelo matemático",
      body: "Traducir el problema a tres componentes fundamentales:",
      list: [
        "<strong>Variables de decisión:</strong> las incógnitas. Pueden ser <em>binarias</em> (0 o 1, ej. asignar un programador a un proyecto) o <em>continuas</em> (cantidad a pedir, stock a mantener).",
        "<strong>Función objetivo:</strong> lo que se desea maximizar o minimizar (ej. <code>Minimizar Costo_Total = Costo_Pedidos + Costo_Almacenamiento</code>).",
        "<strong>Restricciones:</strong> límites que no se pueden violar (ej. cada programador hace 1 proyecto: <code>x₁ + x₂ + x₃ = 1</code>; inventario ≤ capacidad máxima; costo total ≤ presupuesto)."
      ]
    },
    "3": {
      title: "Paso 3. Obtención de datos",
      body: "Relevamiento de costos, tiempos, capacidades, demandas, recursos disponibles y parámetros técnicos.",
      extra: "<strong>Principio clave:</strong> Sin buenos datos, el mejor modelo matemático es inútil."
    },
    "4": {
      title: "Paso 4. Resolución del modelo",
      body: "Se aplican técnicas matemáticas según la naturaleza del problema:",
      list: [
        "<strong>Programación lineal:</strong> función objetivo y restricciones lineales (Simplex y punto interior). Ej.: asignación de recursos.",
        "<strong>Programación entera:</strong> variables enteras. Ej.: asignación de personas o ubicación de servidores.",
        "<strong>Programación no lineal:</strong> objetivo o restricciones no lineales. Ej.: optimización de redes neuronales.",
        "<strong>Teoría de colas:</strong> líneas de espera. Ej.: planificación de procesos en CPU.",
        "<strong>Simulación:</strong> modelos complejos sin solución analítica. Ej.: simulación de redes de computadoras."
      ]
    },
    "5": {
      title: "Paso 5. Validación del modelo",
      body: "Verificar que el modelo representa fielmente la realidad mediante datos históricos, pruebas de sensibilidad (¿qué ocurre si cambian los parámetros?) y opinión de expertos."
    },
    "6": {
      title: "Paso 6. Implementación",
      body: "Poner la solución en práctica mediante un algoritmo automático, un sistema de recomendación, un programa de planificación o un dashboard de control."
    },
    "7": {
      title: "Paso 7. Seguimiento y mantenimiento",
      body: "Controlar periódicamente si el modelo sigue siendo válido frente al contexto real, si necesita datos actualizados y si continúa entregando buenos resultados."
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stepKey = btn.dataset.step;
      const data = stepsData[stepKey];
      if (!data) return;

      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });

      let html = `<h4>${data.title}</h4><p>${data.body}</p>`;
      if (data.list) {
        html += `<ul class="check-list">${data.list.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      }
      if (data.extra) {
        html += `<p class="callout">${data.extra}</p>`;
      }
      panel.innerHTML = html;
    });
  });
}

/* ==================== CALCULADORA EOQ EN VIVO (UNIDAD 3) ==================== */
function initEoqCalculator() {
  const form = document.getElementById("eoq-form");
  if (!form) return;

  const inputs = {
    d: document.getElementById("eoq-d"),
    s: document.getElementById("eoq-s"),
    h: document.getElementById("eoq-h"),
    l: document.getElementById("eoq-l"),
    days: document.getElementById("eoq-days"),
    c: document.getElementById("eoq-c")
  };

  const outputs = {
    q: document.getElementById("res-q"),
    n: document.getElementById("res-n"),
    rop: document.getElementById("res-rop"),
    tc: document.getElementById("res-tc")
  };

  const fmt = (val, decimals = 2) =>
    val.toLocaleString("es-AR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

  const update = () => {
    const D = parseFloat(inputs.d.value);
    const S = parseFloat(inputs.s.value);
    const H = parseFloat(inputs.h.value);
    const L = parseFloat(inputs.l.value);
    const days = parseFloat(inputs.days.value);
    const C = parseFloat(inputs.c.value) || 0;

    if (!(D > 0 && S > 0 && H > 0 && days > 0 && L >= 0)) {
      outputs.q.textContent = "—";
      outputs.n.textContent = "—";
      outputs.rop.textContent = "—";
      outputs.tc.textContent = "—";
      return;
    }

    const Q = Math.sqrt((2 * D * S) / H);
    const N = D / Q;
    const dailyDemand = D / days;
    const ROP = dailyDemand * L;
    const TC = (D / Q) * S + (Q / 2) * H + D * C;

    outputs.q.textContent = `${fmt(Q)} u.`;
    outputs.n.textContent = fmt(N);
    outputs.rop.textContent = `${fmt(ROP)} u.`;
    outputs.tc.textContent = `$${fmt(TC)}`;
  };

  Object.values(inputs).forEach((input) => {
    input?.addEventListener("input", update);
  });

  update();
}

/* ==================== VISOR LIGHTBOX PARA CAPTURAS DE EXCEL ==================== */
function initLightboxGallery() {
  const dialog = document.getElementById("lightbox");
  if (!dialog) return;

  const imgEl = document.getElementById("lightbox-img");
  const titleEl = document.getElementById("lightbox-titulo");
  const captionEl = document.getElementById("lightbox-caption");
  const unitEl = document.getElementById("lightbox-unit");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  const galleries = {
    "2": collectItems('.gallery-grid[data-gallery="unidad-2"] .gallery-card'),
    "3": collectItems('.gallery-grid[data-gallery="unidad-3"] .gallery-card')
  };

  let activeUnit = "2";
  let activeIndex = 0;

  function collectItems(selector) {
    return Array.from(document.querySelectorAll(selector)).map((card) => {
      const img = card.querySelector("img");
      const title = card.querySelector("figcaption strong")?.textContent ?? "";
      const detail = card.querySelector("figcaption span")?.textContent ?? "";
      return {
        src: img?.getAttribute("src") ?? "",
        alt: img?.getAttribute("alt") ?? title,
        title,
        detail
      };
    });
  }

  function render() {
    const items = galleries[activeUnit] || [];
    const item = items[activeIndex];
    if (!item) return;

    unitEl.textContent = `Unidad ${activeUnit} · Trabajo Práctico`;
    titleEl.textContent = item.title;
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.detail;
  }

  function open(unit, index) {
    activeUnit = unit;
    activeIndex = index;
    render();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function step(delta) {
    const items = galleries[activeUnit] || [];
    if (!items.length) return;
    activeIndex = (activeIndex + delta + items.length) % items.length;
    render();
  }

  document.querySelectorAll(".gallery-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const unit = btn.dataset.unit;
      const index = Number(btn.dataset.index || 0);
      open(unit, index);
    });
  });

  closeBtn?.addEventListener("click", () => dialog.close());
  prevBtn?.addEventListener("click", () => step(-1));
  nextBtn?.addEventListener("click", () => step(1));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  });
}

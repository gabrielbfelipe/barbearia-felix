// Preloader, scroll reveal (com stagger), faixa marquee, parallax do Hero e
// cursor customizado.
// Regra do projeto: o movimento transmite qualidade, não chama atenção para
// si mesmo — por isso tudo aqui respeita prefers-reduced-motion.

const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  configurarPreloader();
  configurarScrollReveal();
  configurarMarquee();
  configurarParallaxHero();
  configurarCursor();
});

// --- Preloader ---------------------------------------------------------
// Exibido só na primeira visita da sessão (sessionStorage) e nunca com
// movimento reduzido. O timeout de segurança garante que uma conexão lenta
// nunca prenda o visitante na tela de carregamento.
function configurarPreloader() {
  const preloader = document.querySelector("[data-preloader]");
  if (!preloader) return;

  const jaVisitou = sessionStorage.getItem("felix_visitou");

  if (jaVisitou || reduzMovimento) {
    preloader.remove();
    document.body.classList.add("is-carregado");
    return;
  }

  sessionStorage.setItem("felix_visitou", "1");

  const remover = () => {
    if (!document.body.contains(preloader)) return;
    preloader.classList.add("preloader--sair");
    document.body.classList.add("is-carregado");
    setTimeout(() => preloader.remove(), 700);
  };

  const tempoMinimo = new Promise((resolve) => setTimeout(resolve, 900));
  const carregou = new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve, { once: true });
    }
  });
  const timeoutSeguranca = new Promise((resolve) => setTimeout(resolve, 2000));

  Promise.race([Promise.all([tempoMinimo, carregou]), timeoutSeguranca]).then(remover);
}

// --- Scroll reveal + stagger --------------------------------------------
// Um único observer cuida de todo [data-reveal]. Itens dentro de um mesmo
// [data-stagger] recebem --i automaticamente (0, 1, 2...) e o atraso de
// cada um é feito em CSS puro via transition-delay.
function configurarScrollReveal() {
  document.querySelectorAll("[data-stagger]").forEach((grupo) => {
    Array.from(grupo.children).forEach((filho, indice) => {
      filho.style.setProperty("--i", indice);
      filho.setAttribute("data-reveal", "");
    });
  });

  const alvos = document.querySelectorAll("[data-reveal]");
  if (!alvos.length) return;

  if (!("IntersectionObserver" in window)) {
    alvos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  alvos.forEach((el) => observer.observe(el));
}

// --- Marquee -------------------------------------------------------------
// O conteúdo é duplicado uma vez para o loop ficar contínuo; a animação em
// si é só CSS (translateX(-50%) sobre os dois blocos concatenados).
function configurarMarquee() {
  document.querySelectorAll("[data-marquee]").forEach((faixa) => {
    faixa.innerHTML = faixa.innerHTML + faixa.innerHTML;
  });
}

// --- Parallax do Hero ------------------------------------------------------
// Aplicado no container da mídia. Só translada, só em desktop, nunca com
// movimento reduzido.
function configurarParallaxHero() {
  const camada = document.querySelector("[data-parallax]");
  if (!camada || reduzMovimento) return;

  let ticking = false;

  const atualizar = () => {
    ticking = false;
    if (window.innerWidth < 1024) {
      camada.style.transform = "";
      return;
    }
    const deslocamento = window.scrollY * 0.18;
    camada.style.transform = "translate3d(0, " + deslocamento + "px, 0)";
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(atualizar);
        ticking = true;
      }
    },
    { passive: true }
  );

  atualizar();
}

// --- Cursor customizado ----------------------------------------------------
// Só entra em desktop com mouse fino e sem movimento reduzido. Elementos com
// [data-cursor] definem o rótulo mostrado (VIEW, BOOK, VER).
function configurarCursor() {
  const finoComHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finoComHover || reduzMovimento) return;

  const cursor = document.createElement("div");
  cursor.className = "cursor-custom";
  cursor.setAttribute("aria-hidden", "true");

  // A bolha é um filho separado: o JS escreve transform no pai (posição) e
  // o CSS anima transform na bolha (escala), sem uma sobrescrever a outra.
  const bolha = document.createElement("span");
  bolha.className = "cursor-custom__bolha";
  cursor.appendChild(bolha);

  document.body.appendChild(cursor);
  document.body.classList.add("tem-cursor-custom");

  let alvoX = 0;
  let alvoY = 0;
  let atualX = 0;
  let atualY = 0;

  document.addEventListener(
    "mousemove",
    (e) => {
      alvoX = e.clientX;
      alvoY = e.clientY;

      const alvo = e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
      if (alvo) {
        bolha.textContent = alvo.getAttribute("data-cursor");
        cursor.classList.add("is-ativo");
      } else {
        cursor.classList.remove("is-ativo");
      }
    },
    { passive: true }
  );

  // Interpolação suave para o cursor não grudar no ponteiro do sistema.
  const animar = () => {
    atualX += (alvoX - atualX) * 0.18;
    atualY += (alvoY - atualY) * 0.18;
    cursor.style.transform = "translate3d(" + atualX + "px, " + atualY + "px, 0)";
    requestAnimationFrame(animar);
  };
  animar();

  document.addEventListener("mouseleave", () => cursor.classList.remove("is-ativo"));
}

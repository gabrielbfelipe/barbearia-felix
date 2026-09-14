// Comportamento principal: injeção dos dados do config.js/services.js/
// reviews.js, header com scroll, menu mobile, tabs de serviços, carrossel
// de avaliações, acordeão do FAQ e facade do Google Maps.

document.addEventListener("DOMContentLoaded", () => {
  injetarDadosDoNegocio();
  injetarImagens();
  injetarServicos();
  injetarEquipe();
  injetarVibes();
  injetarGaleria();
  injetarAvaliacoes();
  injetarInstagram();
  configurarHeaderComScroll();
  configurarMenuMobile();
  configurarCarrossel();
  configurarFaq();
  configurarFacadeMapa();
  configurarBarraFixa();

  document.querySelectorAll("[data-ano-atual]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});

// --- Injeção de dados a partir de config.js -----------------------------
// Telefone, endereço e links aparecem em vários pontos da página; aqui eles
// têm uma única origem e são espalhados via atributos data-*.
function injetarDadosDoNegocio() {
  const linkWhatsapp =
    "https://wa.me/" +
    BARBEARIA.telefoneE164.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(BARBEARIA.mensagemWhatsapp);

  const aplicarHref = (seletor, url) =>
    document.querySelectorAll(seletor).forEach((el) => (el.href = url));
  const aplicarTexto = (seletor, texto) =>
    document.querySelectorAll(seletor).forEach((el) => (el.textContent = texto));

  aplicarHref("[data-whatsapp-link]", linkWhatsapp);
  aplicarHref("[data-tel-link]", "tel:" + BARBEARIA.telefoneE164);
  aplicarHref("[data-booksy-link]", BARBEARIA.booksyUrl);
  aplicarHref("[data-instagram-link]", BARBEARIA.instagramUrl);
  aplicarHref("[data-facebook-link]", BARBEARIA.facebookUrl);
  aplicarHref("[data-direcoes-link]", GOOGLE_MAPS_DIRECOES_URL);

  aplicarTexto("[data-telefone-texto]", BARBEARIA.telefoneExibicao);
  aplicarTexto("[data-instagram-handle]", BARBEARIA.instagramHandle);
  aplicarTexto("[data-nome-negocio]", BARBEARIA.nome);
  aplicarTexto("[data-slogan]", BARBEARIA.slogan);
  aplicarTexto("[data-nota]", BARBEARIA.avaliacao.nota);
  aplicarTexto("[data-total-avaliacoes]", String(BARBEARIA.avaliacao.total));
  aplicarTexto("[data-dev-nome]", BARBEARIA.desenvolvedor.nome);

  aplicarTexto(
    "[data-endereco-rua]",
    BARBEARIA.endereco.rua + ", " + BARBEARIA.endereco.numero
  );
  aplicarTexto(
    "[data-endereco-bairro]",
    BARBEARIA.endereco.bairro +
      " — " +
      BARBEARIA.endereco.cidade +
      "/" +
      BARBEARIA.endereco.estado
  );
  aplicarTexto("[data-endereco-cep]", "CEP " + BARBEARIA.endereco.cep);

  const listaHorario = document.querySelector("[data-horario-lista]");
  if (listaHorario) {
    listaHorario.innerHTML = BARBEARIA.horario
      .map(
        (linha) =>
          '<li class="horario__linha"><span>' +
          linha.dias +
          '</span><span class="horario__faixa">' +
          linha.faixa +
          "</span></li>"
      )
      .join("");
  }
}

// --- Imagens vindas do config.js ----------------------------------------
// Trocar por fotos reais depois é editar IMAGENS, sem tocar no HTML.
// A imagem do Hero não entra aqui de propósito: ela é o LCP e está escrita
// direto no index.html com preload, para o navegador começar a baixá-la sem
// esperar o JS rodar.
function injetarImagens() {
  const setImg = (seletor, dados, largura) => {
    const el = document.querySelector(seletor);
    if (!el || !dados) return;
    el.src = unsplash(dados.id, largura);
    el.alt = dados.alt;
  };

  setImg("[data-img-cta]", IMAGENS.ctaFinal, 1600);
  setImg("[data-img-sobre-principal]", IMAGENS.sobre.principal, 900);
  setImg("[data-img-sobre-topo]", IMAGENS.sobre.secundariaTopo, 600);
  setImg("[data-img-sobre-baixo]", IMAGENS.sobre.secundariaBaixo, 600);
  setImg("[data-img-mapa-facade]", IMAGENS.mapaFachada, 900);
}

// --- Serviços -------------------------------------------------------------
// Uma tab por categoria; os cards saem direto de SERVICOS (services.js).
function injetarServicos() {
  const listaTabs = document.querySelector("[data-tabs-lista]");
  const areaPaineis = document.querySelector("[data-tabs-paineis]");
  if (!listaTabs || !areaPaineis) return;

  listaTabs.innerHTML = CATEGORIAS_SERVICOS.map(
    (cat, i) =>
      '<button class="tabs__btn" role="tab" id="tab-' +
      cat.id +
      '" aria-controls="painel-' +
      cat.id +
      '" aria-selected="' +
      (i === 0) +
      '" tabindex="' +
      (i === 0 ? "0" : "-1") +
      '">' +
      cat.nome +
      "</button>"
  ).join("");

  areaPaineis.innerHTML = CATEGORIAS_SERVICOS.map((cat, i) => {
    const itens = SERVICOS.filter((s) => s.categoria === cat.id);
    return (
      '<div class="tabs__painel' +
      (i === 0 ? " is-ativo" : "") +
      '" role="tabpanel" id="painel-' +
      cat.id +
      '" aria-labelledby="tab-' +
      cat.id +
      '"' +
      (i === 0 ? "" : " hidden") +
      '><div class="lista-servicos">' +
      itens.map((s) => cardServico(s)).join("") +
      "</div></div>"
    );
  }).join("");

  configurarTabs(listaTabs);
}

function cardServico(servico) {
  const seta =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>';

  return (
    '<article class="servico">' +
    '<div class="servico__info">' +
    '<h3 class="servico__nome">' +
    servico.nome +
    "</h3>" +
    '<p class="servico__duracao">' +
    formatarDuracao(servico.duracaoMin) +
    " · " +
    servico.descricao +
    "</p>" +
    "</div>" +
    '<div class="servico__acao">' +
    '<span class="servico__preco">' +
    formatarPreco(servico.preco) +
    "</span>" +
    '<a class="servico__btn" href="' +
    BARBEARIA.booksyUrl +
    '" target="_blank" rel="noopener" data-cursor="BOOK" aria-label="Agendar ' +
    servico.nome +
    ' no Booksy">' +
    seta +
    "</a>" +
    "</div>" +
    "</article>"
  );
}

// Tabs acessíveis: setas navegam, Home/End vão às pontas.
function configurarTabs(listaTabs) {
  const botoes = Array.from(listaTabs.querySelectorAll('[role="tab"]'));

  const ativar = (indice) => {
    botoes.forEach((btn, i) => {
      const ativo = i === indice;
      btn.setAttribute("aria-selected", String(ativo));
      btn.tabIndex = ativo ? 0 : -1;
      const painel = document.getElementById(btn.getAttribute("aria-controls"));
      if (painel) {
        painel.classList.toggle("is-ativo", ativo);
        painel.hidden = !ativo;
      }
    });
    botoes[indice].focus();
  };

  botoes.forEach((btn, i) => {
    btn.addEventListener("click", () => ativar(i));
    btn.addEventListener("keydown", (e) => {
      let destino = null;
      if (e.key === "ArrowRight") destino = (i + 1) % botoes.length;
      if (e.key === "ArrowLeft") destino = (i - 1 + botoes.length) % botoes.length;
      if (e.key === "Home") destino = 0;
      if (e.key === "End") destino = botoes.length - 1;
      if (destino !== null) {
        e.preventDefault();
        ativar(destino);
      }
    });
  });
}

// --- Equipe ---------------------------------------------------------------
function injetarEquipe() {
  const grade = document.querySelector("[data-equipe-grade]");
  if (!grade) return;

  grade.innerHTML = IMAGENS.equipe
    .map(
      (pessoa) =>
        '<article class="card-barbeiro" data-reveal>' +
        '<div class="card-barbeiro__foto-wrap">' +
        '<img src="' +
        unsplash(pessoa.id, 700) +
        '" alt="' +
        pessoa.alt +
        '" width="700" height="875" loading="lazy" decoding="async" />' +
        "</div>" +
        '<div class="card-barbeiro__info">' +
        '<h3 class="card-barbeiro__nome">' +
        pessoa.nome +
        "</h3>" +
        '<p class="card-barbeiro__funcao">' +
        pessoa.funcao +
        "</p>" +
        '<a class="card-barbeiro__link" href="' +
        BARBEARIA.booksyUrl +
        '" target="_blank" rel="noopener">Agendar no Booksy</a>' +
        "</div>" +
        "</article>"
    )
    .join("");
}

// --- "Qual é a sua vibe?" -------------------------------------------------
// Lista de estilos à esquerda troca a imagem do visor à direita.
function injetarVibes() {
  const lista = document.querySelector("[data-vibe-lista]");
  const visor = document.querySelector("[data-vibe-visor]");
  if (!lista || !visor) return;

  lista.innerHTML = IMAGENS.vibes
    .map(
      (vibe, i) =>
        '<button class="vibe__item' +
        (i === 0 ? " is-ativo" : "") +
        '" type="button" data-vibe-indice="' +
        i +
        '" aria-pressed="' +
        (i === 0) +
        '"><span class="vibe__item-nome">' +
        vibe.nome +
        '</span><span class="vibe__item-num">' +
        String(i + 1).padStart(2, "0") +
        "</span></button>"
    )
    .join("");

  visor.innerHTML = IMAGENS.vibes
    .map(
      (vibe, i) =>
        '<img src="' +
        unsplash(vibe.id, 800) +
        '" alt="' +
        vibe.alt +
        '" width="800" height="1000" class="' +
        (i === 0 ? "is-ativa" : "") +
        '" loading="lazy" decoding="async" />'
    )
    .join("");

  const botoes = Array.from(lista.querySelectorAll("[data-vibe-indice]"));
  const imagens = Array.from(visor.querySelectorAll("img"));

  const trocar = (indice) => {
    botoes.forEach((b, i) => {
      b.classList.toggle("is-ativo", i === indice);
      b.setAttribute("aria-pressed", String(i === indice));
    });
    imagens.forEach((img, i) => img.classList.toggle("is-ativa", i === indice));
  };

  botoes.forEach((btn, i) => {
    btn.addEventListener("click", () => trocar(i));
    btn.addEventListener("mouseenter", () => trocar(i));
    btn.addEventListener("focus", () => trocar(i));
  });
}

// --- Galeria --------------------------------------------------------------
function injetarGaleria() {
  const grid = document.querySelector("[data-galeria-grid]");
  if (!grid) return;

  grid.innerHTML = IMAGENS.galeria
    .map((foto, i) => {
      const modificador = foto.tamanho ? " galeria__item--" + foto.tamanho : "";
      const largura = foto.tamanho === "grande" ? 1000 : 600;
      return (
        '<figure class="galeria__item' +
        modificador +
        '" data-reveal style="--i: ' +
        (i % 4) +
        '" data-cursor="VIEW">' +
        '<img src="' +
        unsplash(foto.id, largura) +
        '" alt="' +
        foto.alt +
        '" width="' +
        largura +
        '" height="' +
        Math.round(largura * 1.25) +
        '" loading="lazy" decoding="async" />' +
        "</figure>"
      );
    })
    .join("");
}

// --- Avaliações -----------------------------------------------------------
function injetarAvaliacoes() {
  const trilho = document.querySelector("[data-carrossel-trilho]");
  if (!trilho) return;

  const estrela =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/>' +
    "</svg>";

  trilho.innerHTML = AVALIACOES.map(
    (av) =>
      '<blockquote class="depoimento">' +
      '<div class="depoimento__estrelas" role="img" aria-label="5 de 5 estrelas">' +
      estrela.repeat(5) +
      "</div>" +
      '<p class="depoimento__texto">' +
      av.texto +
      "</p>" +
      '<footer class="depoimento__autor">' +
      '<span class="depoimento__nome">' +
      av.autor +
      "</span>" +
      '<span class="depoimento__meta">' +
      av.servico +
      " · com " +
      av.profissional +
      "</span>" +
      "</footer>" +
      "</blockquote>"
  ).join("");
}

// --- Instagram ------------------------------------------------------------
function injetarInstagram() {
  const grid = document.querySelector("[data-instagram-grid]");
  if (!grid) return;

  const icone =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<path d="M7 17L17 7M17 7H8M17 7v9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  grid.innerHTML = IMAGENS.instagram
    .map(
      (post, i) =>
        '<a class="instagram__item" href="' +
        BARBEARIA.instagramUrl +
        '" target="_blank" rel="noopener" data-reveal style="--i: ' +
        i +
        '" data-cursor="VER">' +
        '<img src="' +
        unsplash(post.id, 500) +
        '" alt="' +
        post.alt +
        '" width="500" height="500" loading="lazy" decoding="async" />' +
        icone +
        "</a>"
    )
    .join("");
}

// --- Header com scroll ----------------------------------------------------
function configurarHeaderComScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const atualizar = () => header.classList.toggle("header--rolado", window.scrollY > 40);
  atualizar();
  window.addEventListener("scroll", atualizar, { passive: true });
}

// --- Menu mobile ----------------------------------------------------------
function configurarMenuMobile() {
  const botao = document.querySelector("[data-menu-btn]");
  const menu = document.querySelector("[data-menu-mobile]");
  if (!botao || !menu) return;

  const fechar = () => {
    menu.classList.remove("is-aberto");
    botao.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-aberto");
  };

  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("is-aberto");
    botao.setAttribute("aria-expanded", String(aberto));
    document.body.classList.toggle("menu-aberto", aberto);
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", fechar));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-aberto")) fechar();
  });
}

// --- Carrossel de avaliações ---------------------------------------------
function configurarCarrossel() {
  const trilho = document.querySelector("[data-carrossel-trilho]");
  const anterior = document.querySelector("[data-carrossel-anterior]");
  const proximo = document.querySelector("[data-carrossel-proximo]");
  if (!trilho || !anterior || !proximo) return;

  const passo = () => {
    const primeiro = trilho.querySelector(".depoimento");
    return primeiro ? primeiro.offsetWidth + 20 : 340;
  };

  anterior.addEventListener("click", () =>
    trilho.scrollBy({ left: -passo(), behavior: "smooth" })
  );
  proximo.addEventListener("click", () =>
    trilho.scrollBy({ left: passo(), behavior: "smooth" })
  );
}

// --- FAQ ------------------------------------------------------------------
// Acordeão com max-height calculado no clique — mantém a transição suave
// sem precisar fixar altura no CSS.
function configurarFaq() {
  document.querySelectorAll("[data-faq-pergunta]").forEach((botao) => {
    const resposta = document.getElementById(botao.getAttribute("aria-controls"));
    if (!resposta) return;

    botao.addEventListener("click", () => {
      const aberto = botao.getAttribute("aria-expanded") === "true";
      botao.setAttribute("aria-expanded", String(!aberto));
      resposta.style.maxHeight = aberto ? "0px" : resposta.scrollHeight + "px";
    });
  });
}

// --- Barra fixa de agendamento (mobile) -----------------------------------
// Fica escondida enquanto o Hero ou o CTA final estiverem na tela: os dois já
// mostram os mesmos botões, então a barra só repetiria o convite e ainda
// cobriria parte deles.
function configurarBarraFixa() {
  const barra = document.querySelector("[data-barra-fixa]");
  if (!barra) return;

  const concorrentes = [
    document.querySelector("[data-hero-cta]"),
    document.querySelector("[data-cta-final]"),
  ].filter(Boolean);

  if (!concorrentes.length || !("IntersectionObserver" in window)) {
    barra.classList.add("is-visivel");
    return;
  }

  const visiveis = new Set();

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) visiveis.add(entrada.target);
        else visiveis.delete(entrada.target);
      });
      barra.classList.toggle("is-visivel", visiveis.size === 0);
    },
    { threshold: 0.25 }
  );

  concorrentes.forEach((el) => observer.observe(el));
}

// --- Facade do Google Maps ------------------------------------------------
// O iframe só é criado no clique — nenhuma requisição ao Google antes disso.
function configurarFacadeMapa() {
  const facade = document.querySelector("[data-mapa-facade]");
  if (!facade) return;

  const botao = facade.querySelector("[data-mapa-btn]");
  if (!botao) return;

  botao.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = GOOGLE_MAPS_EMBED_URL;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.title = "Mapa da localização da " + BARBEARIA.nome;
    iframe.allowFullscreen = true;
    facade.innerHTML = "";
    facade.appendChild(iframe);
  });
}

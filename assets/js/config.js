// Configuração central do site — único lugar a editar quando um dado do
// negócio mudar (telefone, endereço, horário, imagens, links).
//
// PENDÊNCIAS a confirmar com o proprietário antes de publicar (ver README.md):
// coordenadas geográficas exatas, logo oficial em alta resolução, fotos
// reais da barbearia e da equipe, confirmação dos depoimentos usados.

const BARBEARIA = {
  nome: "The Felix Barbearia",
  slogan: "Seu cabelo. Sua barba. Seu estilo.",

  telefoneE164: "+5516997134439",
  telefoneExibicao: "(16) 99713-4439",

  endereco: {
    rua: "Rua Gonçalves Dias",
    numero: "367",
    bairro: "Centro",
    cidade: "Araraquara",
    estado: "SP",
    cep: "14801-290",
  },

  // Confirmado por print enviado pelo proprietário em 14/09/2026.
  horario: [
    { dias: "Segunda-feira", faixa: "14:00 – 19:30" },
    { dias: "Terça a sexta-feira", faixa: "09:00 – 20:00" },
    { dias: "Sábado", faixa: "09:00 – 18:00" },
    { dias: "Domingo", faixa: "Fechado" },
  ],

  mensagemWhatsapp:
    "Olá! Encontrei a The Felix Barbearia pela internet e gostaria de saber mais sobre os horários disponíveis.",

  booksyUrl: "https://booksy.com/pt-br/177714_the-felix-barbearia_barbearias_874135_araraquara",
  instagramUrl: "https://www.instagram.com/thefelixbarbearia/",
  instagramHandle: "@thefelixbarbearia",
  facebookUrl: "https://www.facebook.com/people/The-Felix-Barber/100083276293827/",

  avaliacao: {
    nota: "5.0",
    total: 150,
  },

  siteUrl: "https://the-felix-barbearia.vercel.app",

  desenvolvedor: {
    nome: "Gabriel Belentani Felipe",
    url: "",
  },
};

// Link keyless do Google Maps (?q=...&output=embed) — sem chave de API,
// sem projeto no Google Cloud e sem custo. Usado apenas depois do clique
// no botão da facade (ver configurarFacadeMapa em main.js).
const ENDERECO_MAPS_QUERY = "Rua+Gon%C3%A7alves+Dias,+367+-+Centro,+Araraquara+-+SP";

const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${ENDERECO_MAPS_QUERY}&output=embed`;

const GOOGLE_MAPS_DIRECOES_URL = `https://www.google.com/maps/dir/?api=1&destination=${ENDERECO_MAPS_QUERY}`;

// Imagens provisórias via Unsplash — trocar por fotos reais da barbearia
// substituindo apenas as URLs abaixo (ou os IDs, mantendo o helper).
// `fm=webp` + `q=70` mantêm o peso baixo.
const UNSPLASH_BASE = "https://images.unsplash.com/";

function unsplash(id, largura) {
  return `${UNSPLASH_BASE}${id}?auto=format&fit=crop&fm=webp&q=70&w=${largura}`;
}

const IMAGENS = {
  // ATENÇÃO: a foto do Hero também está escrita no index.html (src + preload),
  // porque é o elemento de LCP. Ao trocar aqui, trocar lá também.
  hero: {
    id: "photo-1503951914875-452162b0f3f1",
    alt: "Barbeiro finalizando a barba de um cliente com navalha em ambiente escuro",
  },
  ctaFinal: {
    id: "photo-1622286342621-4bd786c2447c",
    alt: "Corte sendo finalizado com máquina no ambiente da barbearia",
  },
  sobre: {
    principal: {
      id: "photo-1599351431202-1e0f0137899a",
      alt: "Barbeiro alinhando a barba de um cliente com navalha",
    },
    secundariaTopo: {
      id: "photo-1596728325488-58c87691e9af",
      alt: "Detalhe da navalha marcando o contorno do corte",
    },
    secundariaBaixo: {
      id: "photo-1621605815971-fbc98d665033",
      alt: "Máquinas, tesoura e pente sobre a bancada da barbearia",
    },
  },
  equipe: [
    {
      nome: "Lucas Felix",
      funcao: "Barbeiro",
      id: "photo-1567894340315-735d7c361db0",
      alt: "Barbeiro trabalhando no cabelo de um cliente",
    },
    {
      nome: "Otavio Augusto",
      funcao: "Barbeiro",
      id: "photo-1598887142487-3c854d51eabb",
      alt: "Barbeiro fazendo a barba de um cliente na cadeira",
    },
    {
      nome: "Carlos Eduardo",
      funcao: "Barbeiro",
      id: "photo-1593702275687-f8b402bf1fb5",
      alt: "Barbeiro executando um degradê com máquina",
    },
  ],
  vibes: [
    { nome: "Clássico", id: "photo-1622296089863-eb7fc530daa8", alt: "Corte clássico com acabamento alinhado" },
    { nome: "Degradê", id: "photo-1593702275687-f8b402bf1fb5", alt: "Degradê sendo executado com máquina" },
    { nome: "Moderno", id: "photo-1622286342621-4bd786c2447c", alt: "Corte moderno com textura no topo" },
    { nome: "Low Fade", id: "photo-1596728325488-58c87691e9af", alt: "Low fade com contorno feito na navalha" },
    { nome: "Mid Fade", id: "photo-1517832606299-7ae9b720a186", alt: "Mid fade com barba aparada na tesoura" },
    { nome: "Barba Desenhada", id: "photo-1503951914875-452162b0f3f1", alt: "Barba desenhada com navalha" },
  ],
  galeria: [
    { id: "photo-1622286342621-4bd786c2447c", alt: "Corte finalizado com máquina", tamanho: "grande" },
    { id: "photo-1599351431202-1e0f0137899a", alt: "Barba sendo alinhada com navalha" },
    { id: "photo-1503951914875-452162b0f3f1", alt: "Acabamento da barba em detalhe" },
    { id: "photo-1622296089863-eb7fc530daa8", alt: "Corte visto de perfil com acabamento nítido", tamanho: "vertical" },
    { id: "photo-1596728325488-58c87691e9af", alt: "Contorno do corte sendo marcado na navalha" },
    { id: "photo-1621605815971-fbc98d665033", alt: "Ferramentas da barbearia sobre a bancada" },
    { id: "photo-1585747860715-2ba37e788b70", alt: "Ambiente da barbearia com tijolo, espelhos e cadeiras" },
    { id: "photo-1587909209111-5097ee578ec3", alt: "Pente e produtos de finalização sobre a madeira" },
  ],
  instagram: [
    { id: "photo-1593702275687-f8b402bf1fb5", alt: "Post do Instagram: degradê em execução" },
    { id: "photo-1517832606299-7ae9b720a186", alt: "Post do Instagram: barba aparada na tesoura" },
    { id: "photo-1598887142487-3c854d51eabb", alt: "Post do Instagram: barba feita na cadeira" },
    { id: "photo-1512690459411-b9245aed614b", alt: "Post do Instagram: cadeira de barbeiro em detalhe" },
  ],
  mapaFachada: {
    id: "photo-1585747860715-2ba37e788b70",
    alt: "Ambiente da barbearia no Centro de Araraquara",
  },
};

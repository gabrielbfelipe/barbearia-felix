// Catálogo de serviços — fonte única para os cards renderizados e para o
// hasOfferCatalog do JSON-LD (ver injetarServicos em main.js).
// Preços e durações conferidos no Booksy em 14/09/2026 — são dados
// comerciais que mudam; confirmar com o proprietário antes de publicar.

const CATEGORIAS_SERVICOS = [
  { id: "cabelo", nome: "Cabelo" },
  { id: "barba", nome: "Barba" },
  { id: "combos", nome: "Combos" },
  { id: "estetica", nome: "Estética" },
];

const SERVICOS = [
  // Cabelo
  { categoria: "cabelo", nome: "Cabelo", preco: 45, duracaoMin: 40, descricao: "Corte completo, do risco ao acabamento." },
  { categoria: "cabelo", nome: "Acabamento Pezinho", preco: 20, duracaoMin: 10, descricao: "Retoque de contorno entre um corte e outro." },
  { categoria: "cabelo", nome: "Lateral / Side Cut", preco: 30, duracaoMin: 30, descricao: "Acabamento lateral com máquina e navalha." },
  { categoria: "cabelo", nome: "Pigmentação de Cabelo", preco: 30, duracaoMin: 30, descricao: "Disfarce de falhas e uniformização da cor." },

  // Barba
  { categoria: "barba", nome: "Barba", preco: 45, duracaoMin: 35, descricao: "Desenho completo com toalha quente e navalha." },
  { categoria: "barba", nome: "Barba Express", preco: 25, duracaoMin: 25, descricao: "Alinhamento rápido para manter o desenho." },
  { categoria: "barba", nome: "Pigmentação de Barba", preco: 20, duracaoMin: 15, descricao: "Uniformiza falhas e reforça o contorno." },
  { categoria: "barba", nome: "Barba + Acabamento Pezinho", preco: 55, duracaoMin: 40, descricao: "Barba completa com retoque de contorno." },

  // Combos
  { categoria: "combos", nome: "Cabelo + Barba", preco: 80, duracaoMin: 70, descricao: "O combo mais pedido da casa." },
  { categoria: "combos", nome: "Cabelo + Sobrancelha", preco: 60, duracaoMin: 45, descricao: "Corte completo com sobrancelha alinhada." },
  { categoria: "combos", nome: "Cabelo + Barba + Sobrancelha", preco: 92, duracaoMin: 65, descricao: "A experiência The Felix completa." },

  // Estética
  { categoria: "estetica", nome: "Sobrancelha", preco: 15, duracaoMin: 10, descricao: "Design e alinhamento com navalha." },
  { categoria: "estetica", nome: "Hidratação", preco: 20, duracaoMin: 15, descricao: "Tratamento para fios e couro cabeludo." },
  { categoria: "estetica", nome: "Depilação Nasal", preco: 18, duracaoMin: 20, descricao: "Acabamento rápido e discreto." },
];

function formatarPreco(valor) {
  return `R$ ${valor.toString().replace(".", ",")}`;
}

function formatarDuracao(min) {
  if (min < 60) return `${min} min`;
  const horas = Math.floor(min / 60);
  const resto = min % 60;
  return resto ? `${horas}h${String(resto).padStart(2, "0")}` : `${horas}h`;
}

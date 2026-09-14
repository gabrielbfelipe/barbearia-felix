// Junta os CSS modulares em um único arquivo (assets/css/felix.css).
//
// Por quê: o site tem 24 arquivos CSS, e todos bloqueiam a renderização.
// No Lighthouse mobile isso custava ~1,8s. Em uma página só, um arquivo
// único é sempre mais rápido — e continua dando para editar os módulos
// normalmente, porque a fonte da verdade são eles, não o arquivo gerado.
//
// Rode `node build.js` depois de mexer em qualquer CSS. Na Vercel isso é
// automático (buildCommand no vercel.json).

const fs = require("fs");
const path = require("path");

const RAIZ = __dirname;
const SAIDA = path.join(RAIZ, "assets", "css", "felix.css");

// A ordem importa para a cascata — é a mesma que estava no <head>.
const ORDEM = [
  "base/reset.css",
  "base/variables.css",
  "base/layout.css",
  "base/motion.css",
  "components/preloader.css",
  "components/header.css",
  "components/buttons.css",
  "components/cards.css",
  "components/marquee.css",
  "components/tabs.css",
  "components/reviews.css",
  "components/floating.css",
  "components/cursor.css",
  "sections/hero.css",
  "sections/sobre.css",
  "sections/vibe.css",
  "sections/equipe.css",
  "sections/booksy.css",
  "sections/galeria.css",
  "sections/instagram.css",
  "sections/faq.css",
  "sections/localizacao.css",
  "sections/cta.css",
  "sections/footer.css",
];

// Minificação conservadora: tira comentários e espaço sobrando, sem mexer
// em nada que possa alterar o resultado (valores, strings, media queries).
function minificar(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

const partes = [];
let bytesOrigem = 0;

for (const relativo of ORDEM) {
  const arquivo = path.join(RAIZ, "assets", "css", relativo);
  if (!fs.existsSync(arquivo)) {
    console.error("CSS não encontrado:", relativo);
    process.exit(1);
  }
  const conteudo = fs.readFileSync(arquivo, "utf8");
  bytesOrigem += Buffer.byteLength(conteudo);
  partes.push(minificar(conteudo));
}

const cabecalho = "/* Gerado por build.js — não edite. Edite os módulos em assets/css/. */\n";
const resultado = cabecalho + partes.join("");

fs.writeFileSync(SAIDA, resultado, "utf8");

const kb = (n) => (n / 1024).toFixed(1) + " KB";
console.log(
  `felix.css gerado: ${ORDEM.length} módulos, ${kb(bytesOrigem)} -> ${kb(Buffer.byteLength(resultado))}`
);

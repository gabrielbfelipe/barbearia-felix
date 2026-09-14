// Gera os derivados da logo oficial.
// O PNG original vem com fundo preto chapado. Como o site usa um preto frio
// (#08090b), colar a logo direto deixaria um quadrado visível — por isso
// aqui o fundo é removido por luminância, com rampa de alpha nas bordas
// para não serrilhar.
const { Jimp } = require("jimp");
const path = require("path");

const SRC = path.join(__dirname, "assets/images/logo/originais/logo-the-felix.png");
const LOGO_DIR = path.join(__dirname, "assets/images/logo");
const OG_DIR = path.join(__dirname, "assets/images/og");

const LIMITE_BAIXO = 14; // abaixo disso é fundo puro
const LIMITE_ALTO = 46; // acima disso é arte cheia

async function logoTransparente() {
  const img = await Jimp.read(SRC);
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    let alpha;
    if (lum <= LIMITE_BAIXO) alpha = 0;
    else if (lum >= LIMITE_ALTO) alpha = 255;
    else alpha = Math.round(((lum - LIMITE_BAIXO) / (LIMITE_ALTO - LIMITE_BAIXO)) * 255);

    this.bitmap.data[idx + 3] = alpha;
  });
  return img;
}

(async () => {
  // --- Logo com fundo transparente, usada no site inteiro ---------------
  const base = await logoTransparente();
  await base.clone().write(path.join(LOGO_DIR, `logo-the-felix.png`));
  console.log("logo-the-felix.png (transparente 512)");

  const media = base.clone();
  media.resize({ w: 320, h: 320 });
  await media.write(path.join(LOGO_DIR, `logo-the-felix-320.png`));
  console.log("logo-the-felix-320.png");

  const pequena = base.clone();
  pequena.resize({ w: 96, h: 96 });
  await pequena.write(path.join(LOGO_DIR, `logo-the-felix-96.png`));
  console.log("logo-the-felix-96.png");

  // --- Ícones: mantêm o fundo preto original (favicon/PWA precisam de
  //     fundo sólido para não sumir em tema claro) -----------------------
  for (const tamanho of [32, 180, 192, 512]) {
    const icone = await Jimp.read(SRC);
    icone.resize({ w: tamanho, h: tamanho });
    await icone.write(path.join(LOGO_DIR, `icone-${tamanho}.png`));
    console.log("icone-" + tamanho + ".png");
  }

  // --- Open Graph 1200x630 ----------------------------------------------
  // Fundo preto puro para casar com o preto do próprio PNG, sem emenda.
  const og = new Jimp({ width: 1200, height: 630, color: 0x000000ff });
  const logoOg = base.clone();
  logoOg.resize({ w: 520, h: 520 });
  og.composite(logoOg, (1200 - 520) / 2, (630 - 520) / 2);
  await og.write(path.join(OG_DIR, `og-the-felix.jpg`), { quality: 88 });
  console.log("og-the-felix.jpg");
})().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});

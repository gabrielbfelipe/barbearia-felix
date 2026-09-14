# The Felix Barbearia — Landing Page

Landing page de conversão para a [The Felix Barbearia](https://booksy.com/pt-br/177714_the-felix-barbearia_barbearias_874135_araraquara), em Araraquara/SP.

O site **apresenta e convence**; o **Booksy executa o agendamento**. Não há sistema de agendamento próprio — essa separação é proposital e mantém o projeto simples de manter.

HTML, CSS e JavaScript puros. Sem framework, sem dependência em runtime.

---

## Índice

- [Como rodar](#como-rodar)
- [Onde editar cada coisa](#onde-editar-cada-coisa)
- [Pendências antes de publicar](#pendências-antes-de-publicar)
- [Estrutura](#estrutura)
- [Decisões técnicas](#decisões-técnicas)
- [SEO](#seo)
- [Resultados medidos](#resultados-medidos)
- [Publicação na Vercel](#publicação-na-vercel)

---

## Como rodar

```bash
# qualquer servidor estático serve
npx serve .
# abre em http://localhost:3000
```

**Depois de mexer em qualquer arquivo CSS, rode:**

```bash
node build.js
```

O `build.js` junta os 24 módulos de `assets/css/` em um único `assets/css/felix.css`, que é o arquivo realmente carregado pela página. Editar um módulo sem rodar o build **não muda nada no site**. Na Vercel o build roda sozinho a cada deploy (`buildCommand` no `vercel.json`).

---

## Onde editar cada coisa

Quase nada precisa ser editado no HTML. Os dados do negócio ficam centralizados:

| Quero mudar | Arquivo | Onde |
|---|---|---|
| Telefone, endereço, horário, links de redes | `assets/js/config.js` | objeto `BARBEARIA` |
| Preço, duração ou nome de um serviço | `assets/js/services.js` | array `SERVICOS` |
| Depoimentos de clientes | `assets/js/reviews.js` | array `AVALIACOES` |
| Fotos (galeria, equipe, estilos, Instagram) | `assets/js/config.js` | objeto `IMAGENS` |
| Nota e nº de avaliações | `assets/js/config.js` | `BARBEARIA.avaliacao` |
| Textos das seções | `index.html` | direto no HTML |

Mudar o preço do Cabelo de R$ 45 para R$ 50 é **uma linha** em `services.js`: o card na página e o `hasOfferCatalog` do JSON-LD acompanham juntos.

> **Duas exceções que exigem editar dois lugares:**
> 1. **Foto do Hero** — está no `index.html` (com `preload`) *e* em `IMAGENS.hero`. Ela é o elemento de LCP; se viesse só do JS, o navegador só começaria a baixá-la depois de executar o script.
> 2. **Horário e endereço** — aparecem em `config.js` (o que o visitante lê) *e* no JSON-LD dentro do `index.html` (o que o Google lê). Os dois precisam bater.

---

## Pendências antes de publicar

Nada aqui foi inventado. O que não pôde ser confirmado ficou marcado como `TODO` no código e listado abaixo.

### 1. Fotos reais — a mais importante

**Todas as imagens hoje são provisórias (Unsplash).** São fotos de barbearias genéricas, não da The Felix.

Isso inclui as três fotos da equipe: **as imagens de "Lucas Felix", "Otavio Augusto" e "Carlos Eduardo" são de pessoas desconhecidas**, usadas só para mostrar o layout funcionando. Precisam ser trocadas antes de qualquer link ser divulgado — mostrar um estranho com o nome do barbeiro é pior do que não ter foto.

Para trocar: edite `IMAGENS` em `assets/js/config.js`. Com fotos locais, substitua a chamada `unsplash(...)` pelo caminho do arquivo.

### 2. Coordenadas geográficas

O campo `geo` (latitude/longitude) **não** está no JSON-LD porque as coordenadas exatas não foram confirmadas. Para adicionar: abra o endereço no Google Maps, clique com o botão direito sobre o ponto, copie as coordenadas e acrescente ao bloco `HairSalon` no `index.html`:

```json
"geo": { "@type": "GeoCoordinates", "latitude": -21.79, "longitude": -48.17 }
```

### 3. Confirmar com o proprietário

- **Preços e durações** — conferidos no Booksy em 14/09/2026. São dados comerciais e mudam.
- **Horário de funcionamento** — confirmado por print do proprietário. Está em `config.js` e no JSON-LD.
- **Depoimentos** — transcritos literalmente do Booksy, com os primeiros nomes dos clientes. Se ele preferir não exibir nomes, troque `autor` por `"Cliente confirmado"` em `reviews.js`.
- **Respostas do FAQ** — formas de pagamento, estacionamento e atendimento infantil ainda não estão respondidos. Se acrescentar perguntas, **o texto no HTML e no `FAQPage` do JSON-LD precisa ser idêntico** — o Google descarta o marcador quando a resposta não aparece na página.

### 4. Logo

A logo oficial (`assets/images/logo/originais/logo-the-felix.png`) veio em PNG 512×512 com fundo preto chapado. Como o site usa um preto levemente azulado, o fundo foi removido por luminância e gerou-se `logo-the-felix.png` (transparente) mais os ícones. Se um dia aparecer a logo vetorial (SVG/AI), vale substituir — fica nítida em qualquer tamanho.

Para regerar os derivados: `node build-assets.js` (requer `npm i jimp`).

---

## Estrutura

```
barbearia_felix/
├── index.html              # página inteira + JSON-LD
├── build.js                # junta os CSS em felix.css
├── build-assets.js         # gera ícones e OG a partir da logo
├── vercel.json             # cache, headers de segurança, buildCommand
├── robots.txt · sitemap.xml · site.webmanifest
└── assets/
    ├── css/
    │   ├── felix.css       # GERADO — não edite
    │   ├── base/           # reset, tokens, tipografia, motion
    │   ├── components/     # header, botões, cards, tabs, carrossel, cursor…
    │   └── sections/       # uma folha por seção da página
    ├── js/
    │   ├── config.js       # dados do negócio
    │   ├── services.js     # catálogo de serviços
    │   ├── reviews.js      # depoimentos
    │   ├── main.js         # injeção de dados e interações
    │   └── animations.js   # preloader, reveal, parallax, cursor
    └── images/
        ├── logo/           # logo tratada + ícones em vários tamanhos
        └── og/             # imagem 1200×630 para compartilhamento
```

### Ordem das seções

Hero → faixa de identidade → Não é só um corte → Qual é a sua vibe → Serviços → Equipe → Booksy 24/7 → Galeria → Avaliações → Instagram → FAQ → Localização → CTA final → Rodapé.

A sequência segue impacto → identificação → desejo → decisão → confiança → prova → facilidade → conversão.

---

## Decisões técnicas

**O CSS é modular mas servido junto.** Vinte e quatro `<link>` bloqueavam a renderização e custavam cerca de 1,8 s no Lighthouse mobile. Os módulos continuam sendo a fonte da verdade; o `build.js` gera o arquivo único.

**As fontes não bloqueiam a renderização.** A folha do Google Fonts sozinha segurava a primeira pintura por ~1 s. Ela entra via `preload` + troca para `stylesheet` no `onload`, com `<noscript>` de reserva. Com `font-display: swap`, o texto aparece na fonte do sistema e troca quando a Archivo/Inter chega.

**O mapa só carrega no clique.** A seção de localização mostra uma imagem com um botão; o `<iframe>` do Google só é criado quando o visitante clica. Nenhuma requisição ao Google acontece no carregamento.

**A barra fixa de agendamento some quando é redundante.** Enquanto o Hero ou o CTA final estão na tela — os dois já trazem os mesmos botões — a barra fica escondida para não repetir o convite nem cobrir os botões.

**`aggregateRating` está fora do JSON-LD de propósito.** Marcar a própria nota na própria página é *self-serving review* pela política do Google: não gera estrela no resultado e é a categoria de marcação que mais recebe ação manual. A nota 5,0 aparece em destaque visual na página; as estrelas reais continuam no Booksy e no Google Business Profile, que é onde o Google as aceita.

**O tipo do schema é `HairSalon`, não `BarberShop`.** `BarberShop` não existe no schema.org — usá-lo invalidaria o bloco inteiro.

**Todo movimento respeita `prefers-reduced-motion`.** Com a preferência ativa: o preloader não aparece, não há parallax, não há cursor customizado e todos os elementos entram já visíveis.

---

## SEO

Implementado:

- `<title>` de 58 caracteres e meta description de ~150, com preço e prova social para ganhar clique.
- Canonical absoluto, `robots.txt` com sitemap, `sitemap.xml`.
- Open Graph + Twitter Card com imagem própria 1200×630 (não hotlink).
- HTML semântico: um `<h1>`, hierarquia de headings sem pular níveis, `skip-link`, `alt` descritivo em todas as imagens, `width`/`height` explícitos.
- JSON-LD em `@graph`: `WebSite` → `WebPage` → `HairSalon` → `Service[]` · `Person[]` · `FAQPage`, com `openingHoursSpecification` real (três blocos, porque a segunda abre só à tarde), `priceRange`, `sameAs` e `ReserveAction` apontando para o Booksy.

### O que ainda falta — e vale mais que o site

A landing page sozinha não ganha o mapa do Google. O item de maior retorno para buscas do tipo "barbearia perto de mim" é o **Google Business Profile reivindicado e completo**, com **NAP idêntico** (mesma grafia exata de nome, endereço e telefone) entre site, GBP, Booksy e Facebook.

Vale checar também que a The Felix aparece hoje classificada como **"Manicures e Pedicures"** em pelo menos um diretório de terceiros ([Solutudo](https://www.solutudo.com.br/empresas/sp/araraquara/manicures-e-pedicures/the-felix-barbearia-ltda-1215414)). Categoria errada confunde a classificação da entidade e vale corrigir.

---

## Resultados medidos

Lighthouse, servidor local, aba anônima:

| | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| **Desktop** | 99 | 100 | 100 | 100 |
| **Mobile** | 97 | 100 | 100 | 100 |

Métricas mobile: FCP 0,8 s · LCP 2,4 s · CLS 0,006 · TBT 90 ms.

Verificado também: sem scroll horizontal em 320/360/768/1024/1440 px, navegação completa por teclado (tabs de serviço respondem a setas/Home/End), menu mobile fecha com `Esc`, o iframe do mapa não existe antes do clique, e nenhum erro de JavaScript no console.

---

## Publicação na Vercel

O repositório já está pronto: a Vercel detecta o `vercel.json`, roda `node build.js` e serve a raiz.

Se o domínio mudar, troque a URL nestes pontos:

- `index.html` — canonical, `og:url`, `og:image`, `twitter:image` e todos os `@id`/`url` do JSON-LD
- `sitemap.xml` — `<loc>`
- `robots.txt` — `Sitemap:`
- `assets/js/config.js` — `BARBEARIA.siteUrl`

URL atual configurada: `https://the-felix-barbearia.vercel.app`

---

Desenvolvido por Gabriel Belentani Felipe.

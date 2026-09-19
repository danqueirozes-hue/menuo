# MENUO — Guia de marca (resumo de referência)

Resumo do "Guia Visual Completo Menuo" (versão azul-marinho, set/2026),
usado como referência para o site. O PDF original deve ser colocado
nesta mesma pasta (`brand/Guia_Visual_Completo_Menuo_Azul_Marinho.pdf`).

## Cores

| Nome | Hex | Uso |
|---|---|---|
| Azul-marinho | `#0B2D5B` | Textos, estrutura, fundos escuros (25%) |
| Amarelo Menuo | `#FFB020` | Ação/CTA, destaques — usar com moderação (10%) |
| Bege | `#F7F3EC` | Fundo principal (60%) |
| Verde | `#6B8F6B` | Apoio/gastronomia — uso pontual (5%) |

## Tipografia

- **Títulos**: Manrope Bold / SemiBold
- **Textos**: Manrope Regular / Medium
- **Slogan**: Montserrat Regular / Medium
- **Logo**: não é mais texto+fonte — ver seção "Logo" abaixo.

## Logo

O wordmark **não é renderizado com uma fonte** (nenhuma fonte do
Google Fonts reproduzia o desenho exato do arquivo enviado pelo
usuário). Em vez disso, o site usa a **imagem original como arte-final**,
recortada e com fundo removido.

Conceito do símbolo: o "o" de "Menuo" é uma bolha de fala (comunicação/
cardápio) com três linhas internas em âmbar, representando as opções
do menu.

### Arquivo de origem

`brand/logo/logo-principal` — PNG enviado pelo usuário (630×290,
fundo bege sólido `#F6F2EA`, sem transparência). Não editar; é o
arquivo-fonte de tudo abaixo.

`brand/logo/logo-principal-transparent.png` — mesma imagem com o
fundo removido (chroma key sobre o bege, com suavização nas bordas
anti-aliased). Serve de master para novos recortes.

### Assets usados pelo site (`public/brand/`)

| Arquivo | Conteúdo | Uso |
|---|---|---|
| `menuo-wordmark.png` | "Menu" + bolha, navy, fundo transparente | `Logo` (`variant="primary"`) |
| `menuo-wordmark-negative.png` | mesmo recorte, navy → branco | `Logo` (`variant="negative"`) |
| `menuo-lockup.png` | wordmark + slogan "One menu. Every language.", navy | disponível para uso futuro (ex.: material de imprensa) |
| `menuo-lockup-negative.png` | idem, em branco | idem |

A versão "negative" foi gerada recolorindo os pixels navy (`#0B2D5B`)
do próprio arquivo original para branco, preservando as linhas âmbar —
não é uma logo redesenhada, é a mesma arte com uma troca de cor.

## Implementação no site

O componente `src/components/ui/Logo.tsx` renderiza a imagem certa
(`primary` ou `negative`) via `next/image`, com `width`/`height`
fixos (604×155) e a altura controlada por classe Tailwind em cada
lugar onde é usado (navbar, dashboard, auth, cardápio público etc.).

As cores estão centralizadas em `src/app/globals.css` (tokens
`--navy`, `--amber`, `--paper`, `--green`) e as fontes de texto
(Manrope/Montserrat) em `src/app/layout.tsx` via `next/font/google`.

O favicon (`src/app/icon.svg`, espelhado em `brand/logo/icon.svg`)
continua sendo um símbolo desenhado à parte — mais simples, pensado
para ficar legível em 16–32px — e não precisa bater 100% com o
wordmark.

## Regras de uso (do guia original)

- Manter área de proteção ao redor do logo (margem ≥ altura do símbolo "o").
- Amarelo é cor de ação — não usar como preenchimento indiscriminado.
- Priorizar contraste e legibilidade sobre fotos.
- Fotografia gastronômica real, luz quente — evitar imagens genéricas.
- Adaptar a comunicação ao idioma do usuário; não misturar idiomas sem necessidade.

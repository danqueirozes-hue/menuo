import type { LandingDict } from "../landing-content";
import { PRICING_SHARED } from "./pricing-shared";

export const pt: LandingDict = {
  nav: { demo: "Demo", how: "Como funciona", pricing: "Preços", faq: "FAQ", login: "Entrar" },
  cta: "Experimente grátis 14 dias",
  hero: {
    eyebrow: "Para restaurantes que recebem o mundo",
    titlePlain: "Um menu.",
    titleHighlight: "Todos os idiomas.",
    subtitle:
      "Carregue uma foto ou o PDF do seu menu: em poucos minutos torna-se um menu digital em 20 idiomas, com os alergénios em conformidade. Os clientes estrangeiros leem um QR code e veem tudo no seu idioma, sem descarregar nenhuma app.",
    cta2: "Experimente a demo",
    trust: ["14 dias grátis", "Sem app para os clientes", "Cancele quando quiser"],
    imageAlt: "Cliente à mesa a ler o QR code do menu com o telemóvel",
  },
  demo: {
    title: "Veja o seu menu com os olhos de um turista",
    text: "Leia o QR code ou toque no botão: abre-se o menu de uma trattoria de exemplo, tal como os seus clientes o veriam.",
    bullets: ["Mude de idioma com um toque", "Filtre pratos sem glúten, sem marisco ou veganos"],
    namesBullet: "Veja como os nomes dos pratos ficam no idioma original",
    button: "Abrir o menu de exemplo",
    scan: "Aponte a câmara do telemóvel",
  },
  benefits: {
    title: "Um menu que os clientes entendem é um menu em que gastam mais",
    items: [
      {
        title: "Consumo médio mais alto",
        description: "Quem percebe o que está a pedir arrisca mais: entradas, pratos da casa, vinho.",
      },
      {
        title: "Alergénios sempre em conformidade",
        description:
          "Os 14 alergénios exigidos pelo Regulamento (UE) 1169/2011 são assinalados e traduzidos em todos os idiomas. O cliente filtra sozinho os pratos adequados para si.",
      },
      {
        title: "A equipa trabalha melhor",
        description:
          "Acabou explicar cada prato num inglês improvisado. Os pedidos são mais rápidos e as mesas rodam mais cedo.",
      },
      {
        title: "Menos erros, melhores avaliações",
        description: "Quem sabe o que pediu não tem surpresas, e conta isso no Google e no TripAdvisor.",
      },
    ],
  },
  how: {
    title: "Do menu em papel ao menu em 20 idiomas, em três passos",
    steps: [
      { title: "Carregue uma foto ou um PDF", description: "A inteligência artificial reconhece secções, pratos e preços." },
      {
        title: "Reveja e publique",
        description:
          "Corrija o que quiser, adicione fotos e descarregue o QR code pronto a imprimir para mesas, montra ou talões.",
      },
      { title: "O cliente escolhe o idioma", description: "Lê o QR, escolhe um dos 20 idiomas e consulta o menu." },
    ],
    note: "Preços e pratos do dia atualizam-se com uma só alteração, em todos os idiomas.",
  },
  names: {
    title: "O nome dos seus pratos continua a ser seu",
    text: "O bacalhau à Brás continua a ser bacalhau à Brás. O MENUO mantém o nome original e traduz a descrição, para que o cliente estrangeiro perceba o que pede sem perder a autenticidade. Cada tradução pode ser editada.",
    original: "Bacalhau à Brás",
    translations: [
      { lang: "EN", text: "Shredded salt cod with matchstick potatoes, egg and black olives" },
      { lang: "DE", text: "Zerzupfter Stockfisch mit Kartoffelstroh, Ei und schwarzen Oliven" },
      { lang: "FR", text: "Morue effilochée aux pommes paille, œuf et olives noires" },
    ],
  },
  languagesSection: { title: "20 idiomas, um só menu", note: "E mais a caminho." },
  social: { title: "Já usado por restaurantes como o seu" },
  pricing: {
    ...PRICING_SHARED.pt,
    title: "Escolha o plano certo para o seu restaurante",
    subtitle:
      "Todos os planos incluem 20 idiomas, QR code, exportação em PDF, os 14 alergénios da UE e a importação por foto ou PDF.",
    planDesc: {
      essential: "Por ex. o menu principal",
      business: "Por ex. almoço, jantar e carta de vinhos",
      hospitality: "Por ex. restaurante, bar, pequeno-almoço e room service",
      "multi-location": "Para grupos com vários espaços",
    },
    anchor: "Menos de 35 cêntimos por dia",
    fiscal: "Preços sem IVA · Fatura em nome da sua empresa (NIF)",
    noCommitment: "Sem fidelização: cancele quando quiser",
  },
  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        q: "Preciso de cartão de crédito para o teste?",
        a: "Sim, pedimos o cartão na ativação, mas durante 14 dias não cobramos nada. Se cancelar antes do fim do teste, não paga nada.",
      },
      {
        q: "Recebo fatura?",
        a: "Sim. Indique o NIF da sua empresa ao subscrever e recebe todos os meses (ou todos os anos) a fatura em nome da empresa.",
      },
      {
        q: "As traduções estão corretas? Posso editá-las?",
        a: "As traduções são geradas automaticamente e pode corrigir cada texto, em cada idioma. O nome original dos pratos mantém-se.",
      },
      {
        q: "Os meus clientes têm de descarregar uma app?",
        a: "Não. Leem o QR code com a câmara e o menu abre no navegador.",
      },
      {
        q: "Como funcionam os alergénios?",
        a: "Indica os 14 alergénios da UE em cada prato e o MENUO mostra-os traduzidos em todos os idiomas. O cliente pode filtrar os pratos adequados para si. A responsabilidade pela informação continua a ser do restaurante.",
      },
      {
        q: "Se mudar um preço, tenho de reimprimir o QR?",
        a: "Não. O QR code é sempre o mesmo e as alterações ficam online em todos os idiomas.",
      },
      { q: "O que conta como «menu»?", a: "Cada carta separada: por exemplo almoço, jantar, carta de vinhos ou sobremesas." },
      {
        q: "Posso cancelar quando quiser?",
        a: "Sim, sem fidelização. Cancele na sua conta a qualquer momento e o plano fica ativo até ao fim do período pago.",
      },
    ],
  },
  final: {
    title: "Dê a cada cliente o seu menu completo, no idioma dele",
    human: "Prefere falar com uma pessoa? Respondemos no WhatsApp.",
    humanEmail: "Prefere falar com uma pessoa? Escreva-nos:",
    whatsapp: "Escreva-nos no WhatsApp",
  },
  footer: { tagline: "Um menu. Todos os idiomas.", cookies: "Cookies" },
};

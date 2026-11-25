import type { SiteLocale } from "./landing-content";

export type SignupDict = {
  title: string;
  subtitle: string;
  name: string;
  namePlaceholder: string;
  restaurant: string;
  restaurantPlaceholder: string;
  menuLanguage: string;
  selectLanguage: string;
  languageHint: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  creating: string;
  submit: string;
  next: string;
  haveAccount: string;
  login: string;
  genericError: string;
  emailTaken: string;
};

/** Signup page copy — opens in the language of the landing page it came from. */
export const SIGNUP_CONTENT: Record<SiteLocale, SignupDict> = {
  en: {
    title: "Create your menu",
    subtitle: "Set up your restaurant and start building your menu in minutes.",
    name: "Your name",
    namePlaceholder: "Jane Doe",
    restaurant: "Restaurant name",
    restaurantPlaceholder: "La Belle Table",
    menuLanguage: "What language will you write your menu in?",
    selectLanguage: "Select a language",
    languageHint:
      "This is the language you'll type dish names and ingredients in. It gets translated into the other 19 automatically — you can change it later in Restaurant settings.",
    email: "Email",
    emailPlaceholder: "you@restaurant.com",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    creating: "Creating your menu…",
    submit: "Create account",
    next: "Next: choose your plan — 14 days free, nothing charged today, cancel anytime.",
    haveAccount: "Already have an account?",
    login: "Log in",
    genericError: "Something went wrong.",
    emailTaken: "This email is already registered.",
  },
  it: {
    title: "Crea il tuo menu",
    subtitle: "Configura il tuo ristorante e inizia a creare il menu in pochi minuti.",
    name: "Il tuo nome",
    namePlaceholder: "Mario Rossi",
    restaurant: "Nome del ristorante",
    restaurantPlaceholder: "Trattoria da Mario",
    menuLanguage: "In che lingua scriverai il tuo menu?",
    selectLanguage: "Scegli una lingua",
    languageHint:
      "È la lingua in cui scriverai nomi e ingredienti dei piatti. Viene tradotta automaticamente nelle altre 19 — puoi cambiarla in seguito nelle impostazioni del locale.",
    email: "Email",
    emailPlaceholder: "tu@ristorante.it",
    password: "Password",
    passwordPlaceholder: "Almeno 8 caratteri",
    creating: "Creazione del menu…",
    submit: "Crea l'account",
    next: "Poi: scegli il piano — 14 giorni gratis, nessun addebito oggi, disdici quando vuoi.",
    haveAccount: "Hai già un account?",
    login: "Accedi",
    genericError: "Qualcosa è andato storto.",
    emailTaken: "Questa email è già registrata.",
  },
  pt: {
    title: "Crie o seu menu",
    subtitle: "Configure o seu restaurante e comece a criar o menu em poucos minutos.",
    name: "O seu nome",
    namePlaceholder: "Ana Silva",
    restaurant: "Nome do restaurante",
    restaurantPlaceholder: "Taberna do Largo",
    menuLanguage: "Em que idioma vai escrever o seu menu?",
    selectLanguage: "Escolha um idioma",
    languageHint:
      "É o idioma em que vai escrever os nomes e ingredientes dos pratos. É traduzido automaticamente para os outros 19 — pode alterá-lo mais tarde nas definições do restaurante.",
    email: "E-mail",
    emailPlaceholder: "voce@restaurante.pt",
    password: "Palavra-passe",
    passwordPlaceholder: "Pelo menos 8 caracteres",
    creating: "A criar o seu menu…",
    submit: "Criar conta",
    next: "A seguir: escolha o plano — 14 dias grátis, nada cobrado hoje, cancele quando quiser.",
    haveAccount: "Já tem conta?",
    login: "Entrar",
    genericError: "Ocorreu um erro.",
    emailTaken: "Este e-mail já está registado.",
  },
  es: {
    title: "Crea tu carta",
    subtitle: "Configura tu restaurante y empieza a crear tu carta en pocos minutos.",
    name: "Tu nombre",
    namePlaceholder: "Lucía García",
    restaurant: "Nombre del restaurante",
    restaurantPlaceholder: "Casa Lucía",
    menuLanguage: "¿En qué idioma escribirás tu carta?",
    selectLanguage: "Elige un idioma",
    languageHint:
      "Es el idioma en el que escribirás los nombres e ingredientes de los platos. Se traduce automáticamente a los otros 19; puedes cambiarlo después en los ajustes del restaurante.",
    email: "Email",
    emailPlaceholder: "tu@restaurante.es",
    password: "Contraseña",
    passwordPlaceholder: "Al menos 8 caracteres",
    creating: "Creando tu carta…",
    submit: "Crear cuenta",
    next: "Después: elige tu plan — 14 días gratis, sin cargo hoy, cancela cuando quieras.",
    haveAccount: "¿Ya tienes cuenta?",
    login: "Iniciar sesión",
    genericError: "Algo ha salido mal.",
    emailTaken: "Este email ya está registrado.",
  },
  fr: {
    title: "Créez votre menu",
    subtitle: "Configurez votre restaurant et commencez votre menu en quelques minutes.",
    name: "Votre nom",
    namePlaceholder: "Claire Martin",
    restaurant: "Nom du restaurant",
    restaurantPlaceholder: "La Belle Table",
    menuLanguage: "Dans quelle langue allez-vous écrire votre menu ?",
    selectLanguage: "Choisissez une langue",
    languageHint:
      "C'est la langue dans laquelle vous écrirez les noms et ingrédients des plats. Elle est traduite automatiquement dans les 19 autres — modifiable ensuite dans les paramètres du restaurant.",
    email: "E-mail",
    emailPlaceholder: "vous@restaurant.fr",
    password: "Mot de passe",
    passwordPlaceholder: "Au moins 8 caractères",
    creating: "Création de votre menu…",
    submit: "Créer le compte",
    next: "Ensuite : choisissez votre formule — 14 jours gratuits, rien n'est prélevé aujourd'hui, résiliable à tout moment.",
    haveAccount: "Vous avez déjà un compte ?",
    login: "Connexion",
    genericError: "Une erreur est survenue.",
    emailTaken: "Cet e-mail est déjà enregistré.",
  },
  de: {
    title: "Erstellen Sie Ihre Speisekarte",
    subtitle: "Richten Sie Ihr Restaurant ein und erstellen Sie Ihre Karte in wenigen Minuten.",
    name: "Ihr Name",
    namePlaceholder: "Anna Schmidt",
    restaurant: "Name des Restaurants",
    restaurantPlaceholder: "Gasthaus zur Linde",
    menuLanguage: "In welcher Sprache schreiben Sie Ihre Karte?",
    selectLanguage: "Sprache wählen",
    languageHint:
      "In dieser Sprache tragen Sie Namen und Zutaten der Gerichte ein. Sie wird automatisch in die anderen 19 übersetzt – änderbar später in den Restaurant-Einstellungen.",
    email: "E-Mail",
    emailPlaceholder: "sie@restaurant.de",
    password: "Passwort",
    passwordPlaceholder: "Mindestens 8 Zeichen",
    creating: "Ihre Karte wird erstellt…",
    submit: "Konto erstellen",
    next: "Danach: Tarif wählen – 14 Tage kostenlos, heute keine Abbuchung, jederzeit kündbar.",
    haveAccount: "Sie haben schon ein Konto?",
    login: "Anmelden",
    genericError: "Etwas ist schiefgelaufen.",
    emailTaken: "Diese E-Mail ist bereits registriert.",
  },
};

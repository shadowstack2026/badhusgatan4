// ============================================================================
//  CONTENT.JS – här ändrar du texten och uppgifterna på hemsidan
// ============================================================================
//  Du behöver inte kunna programmera. Några enkla regler:
//
//   * Ändra bara texten MELLAN citattecknen ("...") eller '...'.
//   * Radera aldrig kommatecken (,) i slutet av rader eller måsvingar { }.
//   * Rader som börjar med // är kommentarer – de syns inte på sidan.
//   * Rader märkta "// TILLFÄLLIGT" är exempel som ska bytas mot riktigt innehåll.
//   * Spara filen så uppdateras sidan automatiskt.
//
//  STATUS kan bara vara något av dessa tre ord (skriv exakt så):
//     "lediga"   -> Lediga platser   (grön prick)
//     "fa"       -> Få platser kvar  (orange prick)
//     "fullt"    -> Fullt just nu    (grå prick)
// ============================================================================

// ---------------------------------------------------------------------------
//  1. STATUS – namn och färger (ändras sällan)
// ---------------------------------------------------------------------------
export const STATUS = {
  lediga: { label: 'Lediga platser', color: '#22C55E' },
  fa: { label: 'Få platser kvar', color: '#F59E0B' },
  fullt: { label: 'Fullt just nu', color: '#94A3B8' },
}

// Den övergripande etiketten som visas högst upp på startsidan (i hero).
export const generalStatus = 'fa' // TILLFÄLLIGT – välj "lediga", "fa" eller "fullt"

// ---------------------------------------------------------------------------
//  2. KONTAKTUPPGIFTER OCH ADRESS
// ---------------------------------------------------------------------------
export const site = {
  name: 'Badhusgatan 4', // arbetsnamn
  address: 'Badhusgatan 4 · Helsingborg',
  email: 'hej@badhuset.example', // TILLFÄLLIGT
  phone: '000-000 00 00', // TILLFÄLLIGT
}

// ---------------------------------------------------------------------------
//  3. STARTSIDANS RUBRIK OCH TEXTER
// ---------------------------------------------------------------------------
export const hero = {
  title: 'Lika gött som hemma. Fast med fler kollegor.',
  text: 'Välkommen till Badhusgatan 4. Här skapar vi en digital hubb för startups, mindre IT-bolag och konsulter som vill ha en egen arbetsplats och ett schysst häng.',
  // Knapparna under texten
  primaryCta: 'Kom förbi på en kaffe',
  secondaryCta: 'Hitta din plats',
}

// ---------------------------------------------------------------------------
//  4. PLATSEN – vad som finns här
// ---------------------------------------------------------------------------
export const about = {
  title: 'Egen plats. Gemensamma möjligheter.',
  paragraphs: [
    'Att driva eget behöver inte betyda att sitta själv. Här arbetar du med ditt företag, omgiven av andra som förstår vardagen och gärna delar med sig av sina erfarenheter.',
    'Ett samtal vid skrivbordet kan ge ett nytt perspektiv. En stund tillsammans kan bli början på ett samarbete.',
  ],
  // TILLFÄLLIGT – bilderna är Unsplash-bilder. Byt "image" mot egna bilder.
  features: [
    {
      title: 'Eget skrivbord',
      text: 'En fast plats att landa vid varje arbetsdag. Internet ingår.',
      image:
        'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=70',
    },
    {
      title: 'Någon att bolla med',
      text: 'En idé, ett uppdrag eller ett beslut – ett gott råd finns alltid nära.',
      image:
        'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=70',
    },
    {
      title: 'Ett schysst häng',
      text: 'Vi hälsar på varandra, hjälper till när vi kan och har roligt längs vägen.',
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=70',
    },
    {
      title: 'Arbetsro',
      text: 'Fokus när du behöver det, sällskap när du vill ha det.',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=70',
    },
  ],
  // Rubrik och text som visas ovanför de fyra korten
  featuresTitle: 'Ett kontor att längta till.',
  featuresText:
    'Vi vill skapa en plats där det känns gött att kliva in genom dörren. Här hör arbetsro, gemenskap och företagande ihop.',
}

// ---------------------------------------------------------------------------
//  5. ARBETSPLATSER – tre kort. Ändra "status" för att byta etikett + knapp.
//     Har ett kort status "fullt" visas knappen "Ställ dig i kö" automatiskt,
//     och förfrågningssidan visar en väntelisteruta.
//     Inga priser på sidan – texten under korten säger "Hör av dig för pris".
// ---------------------------------------------------------------------------
export const workspacesIntro = {
  title: 'Ett eget skrivbord. Ett sammanhang att trivas i.',
  text: 'Letar du efter en fast arbetsplats i Helsingborg? På Badhusgatan 4 får du en egen plats att landa vid och människor från andra digitala företag omkring dig.',
  note: 'Internet och förbrukningsartiklar till toaletten ingår i hyran. Kontakta oss för aktuellt pris, villkor och information om lediga platser.',
}

export const workspaces = [
  {
    id: 'oppet-bord', // används i länkar – ändra inte
    // Sidan /oppet-bord – fyll i när texten och bilderna är klara (lämna tomt tills dess)
    details: [], // beskrivning: en text per stycke, t.ex. ['Första stycket.', 'Andra stycket.']
    photos: [], // bilder: lägg in sökvägar eller länkar, t.ex. ['/bilder/oppet-bord-1.jpg']
    title: 'Öppet bord',
    text: 'Sätt dig där det finns plats. Flexibelt för dig som kommer några dagar i veckan.', // TILLFÄLLIGT – finns inte i textunderlaget
    status: 'lediga', // <-- ÄNDRA HÄR: "lediga", "fa" eller "fullt"
    // TILLFÄLLIGT bild
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=70',
  },
  {
    id: 'fast-plats',
    // Sidan /fast-plats – fyll i när texten och bilderna är klara (lämna tomt tills dess)
    details: [], // beskrivning: en text per stycke, t.ex. ['Första stycket.', 'Andra stycket.']
    photos: [], // bilder: lägg in sökvägar eller länkar, t.ex. ['/bilder/oppet-bord-1.jpg']
    title: 'Fast plats',
    text: 'Ditt eget skrivbord att komma till varje arbetsdag. Här bygger du din verksamhet och är samtidigt en del av gemenskapen.',
    status: 'fa', // <-- ÄNDRA HÄR
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=70',
  },
  {
    id: 'eget-rum',
    // Sidan /eget-rum – fyll i när texten och bilderna är klara (lämna tomt tills dess)
    details: [], // beskrivning: en text per stycke, t.ex. ['Första stycket.', 'Andra stycket.']
    photos: [], // bilder: lägg in sökvägar eller länkar, t.ex. ['/bilder/oppet-bord-1.jpg']
    title: 'Eget rum',
    text: 'Ett litet rum med dörr för dig eller teamet som vill ha mer ro.', // TILLFÄLLIGT – finns inte i textunderlaget
    status: 'fullt', // <-- ÄNDRA HÄR
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=70',
  },
]

// ---------------------------------------------------------------------------
//  6. COMMUNITY – företagen som sitter här (logotyp-karusellen)
//     Lägg till ett företag: kopiera ett block { ... }, klistra in under och
//     ändra uppgifterna. Ta bort ett företag: radera hela blocket.
//       name = företagets namn
//       logo = sökväg till en VIT logga (SVG eller PNG) i mappen public/logos/
//       url  = länk till företagets hemsida (öppnas i ny flik)
// ---------------------------------------------------------------------------
export const communityIntro = {
  title: 'Företagen är olika. Vardagen delar vi.',
  text: 'På Badhusgatan 4 samlas människor med olika erfarenheter och kunskaper inom det digitala. Snart presenterar vi människorna och företagen som gör platsen till vad den är. Vill du bli en del av gänget?',
}

// TILLFÄLLIGT – alla företag och logotyper nedan är exempel
export const companies = [
  { name: 'Nordlys Studio', logo: '/logos/nordlys-studio.svg', url: 'https://example.com' }, // TILLFÄLLIGT
  { name: 'Kvarnen Data', logo: '/logos/kvarnen-data.svg', url: 'https://example.com' }, // TILLFÄLLIGT
  { name: 'Fjord & Frisk', logo: '/logos/fjord-frisk.svg', url: 'https://example.com' }, // TILLFÄLLIGT
  { name: 'Lilla Konsulten', logo: '/logos/lilla-konsulten.svg', url: 'https://example.com' }, // TILLFÄLLIGT
  { name: 'Pixelverket', logo: '/logos/pixelverket.svg', url: 'https://example.com' }, // TILLFÄLLIGT
  { name: 'Brygga Digital', logo: '/logos/brygga-digital.svg', url: 'https://example.com' }, // TILLFÄLLIGT
]

// ---------------------------------------------------------------------------
//  7. KUNDRÖSTER
//     Lägg till ett citat genom att kopiera ett block. "image" kan vara tom ('')
//     – då visas initialer i en rund cirkel.
// ---------------------------------------------------------------------------
export const testimonialsIntro = {
  title: 'Så säger de som sitter här.',
  // TILLFÄLLIGT bild på människor (visas till vänster på dator)
  image:
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=70',
}

// TILLFÄLLIGT – alla namn och citat är exempel
export const testimonials = [
  {
    quote: 'Jag kom för ett skrivbord och gick därifrån med två nya uppdrag. Det går inte att planera, bara sitta nära rätt människor.',
    name: 'Maja Lindgren',
    role: 'UX-designer',
    company: 'Nordlys Studio',
    image: '',
    example: true,
  },
  {
    quote: 'Lugnt när jag vill koda, livligt vid lunch. Precis den balansen jag saknade hemma vid köksbordet.',
    name: 'Johan Berg',
    role: 'Utvecklare',
    company: 'Kvarnen Data',
    image: '',
    example: true,
  },
  {
    quote: 'Det bästa är att alla är små nog att ha tid. Man får snabba svar och ärliga åsikter.',
    name: 'Sara Ek',
    role: 'Marknadsförare',
    company: 'Fjord & Frisk',
    image: '',
    example: true,
  },
]

// ---------------------------------------------------------------------------
//  8. EN DAG HOS OSS – tidslinjen
//     time = tid som visas, title = rubrik, text = en kort mening
// ---------------------------------------------------------------------------
export const day = {
  title: 'Fokus. Folk. Fika.',
  intro: 'Arbetsro när du behöver den. Sällskap när du vill ha det.',
  // TILLFÄLLIGT bild från lokalen
  image:
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=70',
  // TILLFÄLLIGT – exempel på en dag, byt mot hur dagen faktiskt ser ut
  items: [
    { time: '09:00', title: 'God morgon', text: 'Man hälsar, tar en kaffe och landar vid sitt skrivbord.' },
    { time: '10–12', title: 'Fokustid', text: 'Hörlurar på och full koncentration på det egna.' },
    { time: '12:00', title: 'Lunch', text: 'Ofta blir det en stund tillsammans och några nya perspektiv.' },
    { time: '15:00', title: 'Bolla en idé', text: 'Ett samtal vid skrivbordet kan ge en ny väg framåt.' },
  ],
}

// ---------------------------------------------------------------------------
//  9. NÄSTA STEG
// ---------------------------------------------------------------------------
export const nextStep = {
  title: 'Vi börjar med en kaffe.',
  text: 'Det bästa sättet att lära känna en plats är att komma dit. Kom förbi, kika på lokalen och berätta lite om dig och ditt företag.',
  primaryCta: 'Boka ett besök',
  secondaryCta: 'Kontakta Frank',
}

// ---------------------------------------------------------------------------
//  10. MENYN – sektionerna i navigeringen (ändra bara om sektioner läggs till)
// ---------------------------------------------------------------------------
//     "to" = sidan, "hash" = sektionen på sidan (id).
export const navLinks = [
  { label: 'Arbetsplatser', to: '/', hash: 'arbetsplatser' },
  { label: 'Community', to: '/', hash: 'community' },
  { label: 'Event', to: '/event' },
  { label: 'Om oss', to: '/om-oss' },
  { label: 'Kontakt', to: '/', hash: 'kontakt' },
]

// ---------------------------------------------------------------------------
//  11. FÖRFRÅGNINGSSIDAN – valen i formuläret
//     "platsId" kopplar valet till en arbetsplats ovan, så att statusen följer
//     med (t.ex. "Fullt just nu" -> väntelista). Valen utan platsId har ingen status.
// ---------------------------------------------------------------------------
export const requestTypes = [
  { id: 'prova-dag', title: 'Kom förbi på en kaffe', text: 'Titta in, ta en kopp och prata om vad du söker.', platsId: null },
  { id: 'oppet-bord', title: 'Öppet bord', text: 'Flexibel plats i det gemensamma.', platsId: 'oppet-bord' },
  { id: 'fast-plats', title: 'Fast plats', text: 'Ett eget skrivbord.', platsId: 'fast-plats' },
  { id: 'eget-rum', title: 'Eget rum', text: 'Rum med dörr.', platsId: 'eget-rum' },
  { id: 'besok', title: 'Boka ett besök', text: 'Kika på lokalen och få en rundvisning.', platsId: null },
]

export const requestTexts = {
  title: 'Vi börjar med en kaffe.',
  intro: 'Det bästa sättet att lära känna en plats är att komma dit. Kom förbi, kika på lokalen och berätta lite om dig och ditt företag. Vi visar dig runt och pratar om vad du söker i en arbetsplats.',
  fastTitle: 'Nyfiken på en fast plats?',
  fastText: 'Kontakta Frank för att höra mer om lokalen, lediga platser och hur det fungerar att sitta här. Du hittar oss på Badhusgatan 4 i Helsingborg.',
  legend: 'Vad är du nyfiken på?',
  messageLabel: 'Berätta gärna lite om dig och vad du söker.',
  waitlistNotice:
    'Det är fullt just nu – ställ dig på väntelistan så hör vi av oss när en plats blir ledig.',
  disclaimer:
    'En förfrågan eller plats på väntelistan är inte en bekräftad bokning. Vi hör av oss för att bekräfta.',
  thanksTitle: 'Tack! Vi hör av oss inom två arbetsdagar.',
  consent: 'Jag godkänner att mina uppgifter används för att svara på min förfrågan.',
  notBooking: 'Observera att detta inte är en bekräftad bokning.',
  sendError: 'Något gick fel när förfrågan skulle skickas. Dina uppgifter finns kvar – försök igen om en stund.',
}

// ---------------------------------------------------------------------------
//  12. OM OSS – sidan /om-oss
// ---------------------------------------------------------------------------
export const aboutUs = {
  hero: {
    title: 'Nära till människor. Nära till möjligheter.',
    text: 'Idén bakom Badhusgatan 4 är enkel: att samla människor inom det digitala och skapa en vardag där vi kan hjälpa varandra framåt. Startups och mindre bolag behöver ofta någon att bolla med – en idé, en utmaning i ett uppdrag eller ett beslut som blir lättare efter ett samtal. Här ska samarbete och ett gott råd alltid finnas inom en armlängds avstånd.',
  },
  why: {
    title: 'Alla har något att bidra med.',
    paragraphs: [
      'Du kanske precis har startat ditt företag eller har många års erfarenhet. Oavsett vilket har du kunskaper, tankar och perspektiv som kan vara värdefulla för någon annan.',
      'Vi tror på en gemenskap där det känns naturligt att fråga, dela med sig och koppla ihop människor.',
    ],
  },
  values: [
    { title: 'Bolla med någon', text: 'En idé eller ett beslut blir lättare med någon att prata med.' },
    { title: 'Dela med dig', text: 'Nybörjare eller veteran – alla har något som är värdefullt för någon annan.' },
    { title: 'Ta hänsyn', text: 'En avslappnad stämning där alla bidrar till trivseln och får vara sig själva.' },
  ],
  team: {
    title: 'Schyssta människor gör platsen.',
    text: 'För oss handlar ett bra kontor lika mycket om människorna som om lokalen. Ett schysst häng där vi också får saker gjorda.',
    people: [
      // TILLFÄLLIGT – namn, roller och bilder är exempel. Byt mot era riktiga.
      {
        name: 'Anna Svensson',
        role: 'Grundare & värd',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=70',
      },
      {
        name: 'Erik Nilsson',
        role: 'Community & verksamhet',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=70',
      },
    ],
  },
}

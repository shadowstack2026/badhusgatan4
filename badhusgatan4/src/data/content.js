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
  name: 'badhuset', // arbetsnamn
  address: 'Badhusgatan 4 · Helsingborg',
  email: 'hej@badhuset.example', // TILLFÄLLIGT
  phone: '000-000 00 00', // TILLFÄLLIGT
}

// ---------------------------------------------------------------------------
//  3. STARTSIDANS RUBRIK OCH TEXTER
// ---------------------------------------------------------------------------
export const hero = {
  title: 'Här landar digitala människor', // TILLFÄLLIGT
  text: 'En digital hubb för små bolag, skarpa hjärnor och nya samarbeten.', // TILLFÄLLIGT
}

// ---------------------------------------------------------------------------
//  4. PLATSEN – vad som finns här
// ---------------------------------------------------------------------------
export const about = {
  title: 'Mer verkstad än coworking.', // TILLFÄLLIGT
  paragraphs: [
    // TILLFÄLLIGT
    'Vi är inte ett stort coworkingföretag. Badhusgatan 4 är en mindre, nördig plats där man mellanlandar mellan uppdrag, idéer och kundmöten – och där någon alltid har tid att kika på det du håller på med.',
    'Här sitter utvecklare, designers, marknadsförare och konsulter sida vid sida. Det ska vara prisvärt, lugnt att jobba och lätt att hitta nästa samarbete över en kopp kaffe.',
  ],
  // TILLFÄLLIGT – alla fyra bilder är tillfälliga Unsplash-bilder. Byt "image" mot egna bilder.
  features: [
    {
      title: 'Snabbt wifi & skärmar',
      text: 'Stabil fiber och extra skärmar att låna när det blir tungt.',
      image:
        'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=70',
    },
    {
      title: 'Kaffe & fika',
      text: 'Bryggkaffe, te och något sött. Alltid påslaget.',
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=70',
    },
    {
      title: 'Mötesrum',
      text: 'Ett rum för kundmöten och workshops när du behöver stänga dörren.',
      image:
        'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=70',
    },
    {
      title: 'Månadsfrukost',
      text: 'En gång i månaden äter vi frukost ihop och byter nyheter.',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=70',
    },
  ],
}

// ---------------------------------------------------------------------------
//  5. ARBETSPLATSER – tre kort. Ändra "status" för att byta etikett + knapp.
//     Har ett kort status "fullt" visas knappen "Ställ dig i kö" automatiskt,
//     och förfrågningssidan visar en väntelisteruta.
//     Inga priser på sidan – texten under korten säger "Hör av dig för pris".
// ---------------------------------------------------------------------------
export const workspacesIntro = {
  title: 'Hitta platsen som passar ditt sätt att jobba.',
  note: 'Hör av dig för pris och visning.',
}

export const workspaces = [
  {
    id: 'oppet-bord', // används i länkar – ändra inte
    number: '01',
    title: 'Öppet bord',
    text: 'Sätt dig där det finns plats. Flexibelt för dig som kommer några dagar i veckan.', // TILLFÄLLIGT
    status: 'lediga', // <-- ÄNDRA HÄR: "lediga", "fa" eller "fullt"
    // TILLFÄLLIGT bild
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=70',
  },
  {
    id: 'fast-plats',
    number: '02',
    title: 'Fast plats',
    text: 'Ditt eget skrivbord som alltid väntar. Lämna kvar skärm och kaffemugg.', // TILLFÄLLIGT
    status: 'fa', // <-- ÄNDRA HÄR
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=70',
  },
  {
    id: 'eget-rum',
    number: '03',
    title: 'Eget rum',
    text: 'Ett litet rum med dörr för dig eller teamet som vill ha mer ro.', // TILLFÄLLIGT
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
  title: 'Vilka som sitter här.',
  text: 'Små bolag och ensamföretagare som jobbar digitalt.',
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
  intro: 'Lugn nog för att jobba. Levande nog för att vilja komma tillbaka.', // TILLFÄLLIGT
  // TILLFÄLLIGT bild från lokalen
  image:
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=70',
  // TILLFÄLLIGT
  items: [
    { time: '09:00', title: 'Kaffe & lugn start', text: 'Dörren öppnar. Kaffet är redan bryggt och ingen har bråttom.' },
    { time: '10–12', title: 'Fokustid', text: 'Hörlurar på, mejlen får vänta. Tyst arbetsro i hela lokalen.' },
    { time: '12:00', title: 'Lunch tillsammans', text: 'Vi äter ihop, ibland ute, ibland vid långbordet.' },
    { time: '15:00', title: 'Fika', text: 'Veckan summeras med något gott och prat om det som hänt.' },
    { time: 'Första fredagen', title: 'Månadsfrukost', text: 'En gång i månaden äter vi frukost ihop och delar nyheter.' },
  ],
}

// ---------------------------------------------------------------------------
//  9. NÄSTA STEG
// ---------------------------------------------------------------------------
export const nextStep = {
  title: 'Testa skrivbordet innan du bestämmer dig.',
  text: 'Kom förbi ett gratis dagspass, ta en kopp kaffe och känn efter om det här är din plats.', // TILLFÄLLIGT
}

// ---------------------------------------------------------------------------
//  10. MENYN – sektionerna i navigeringen (ändra bara om sektioner läggs till)
// ---------------------------------------------------------------------------
export const navLinks = [
  { label: 'Platsen', id: 'platsen' },
  { label: 'Arbetsplatser', id: 'arbetsplatser' },
  { label: 'Community', id: 'community' },
  { label: 'Kundröster', id: 'kundroster' },
  { label: 'En dag hos oss', id: 'en-dag' },
  { label: 'Kontakt', id: 'kontakt' },
]

// ---------------------------------------------------------------------------
//  11. FÖRFRÅGNINGSSIDAN – valen i formuläret
//     "platsId" kopplar valet till en arbetsplats ovan, så att statusen följer
//     med (t.ex. "Fullt just nu" -> väntelista). Valen utan platsId har ingen status.
// ---------------------------------------------------------------------------
export const requestTypes = [
  { id: 'prova-dag', title: 'Prova en dag gratis', text: 'Ett dagspass utan förpliktelser.', platsId: null },
  { id: 'oppet-bord', title: 'Öppet bord', text: 'Flexibel plats i det gemensamma.', platsId: 'oppet-bord' },
  { id: 'fast-plats', title: 'Fast plats', text: 'Ett eget skrivbord.', platsId: 'fast-plats' },
  { id: 'eget-rum', title: 'Eget rum', text: 'Rum med dörr.', platsId: 'eget-rum' },
  { id: 'besok', title: 'Boka ett besök', text: 'Kom och titta på lokalen.', platsId: null },
]

export const requestTexts = {
  title: 'Kom igång hos oss',
  intro: 'Berätta lite om dig och vad du letar efter. Vi svarar inom två arbetsdagar.',
  waitlistNotice:
    'Det är fullt just nu – ställ dig på väntelistan så hör vi av oss när en plats blir ledig.',
  disclaimer:
    'En förfrågan eller plats på väntelistan är inte en bekräftad bokning. Vi hör av oss för att bekräfta.',
  thanksTitle: 'Tack! Vi hör av oss inom två arbetsdagar.',
}

// ============================================================================
//  EVENTS.JS – här lägger du till och ändrar event
// ============================================================================
//  Du behöver inte kunna programmera. Några enkla regler:
//
//   * Ändra bara texten MELLAN citattecknen ('...').
//   * Radera aldrig kommatecken (,) i slutet av rader eller måsvingar { }.
//   * Rader som börjar med // är kommentarer – de syns inte på sidan.
//   * Rader märkta "// TILLFÄLLIGT" är exempel som ska bytas mot riktigt innehåll.
//
//  Så lägger du till ett event: kopiera ett helt block { ... }, klistra in det
//  under det sista blocket och ändra uppgifterna.
//
//  Fälten:
//    slug        = adressen till eventet, bara små bokstäver och bindestreck, unik
//    title       = rubrik
//    category    = Frukost, Kunskap, Bygga, Socialt eller Öppet hus
//    date        = ÅÅÅÅ-MM-DD
//    startTime   = starttid, t.ex. '18:00' (lämna '' om tid saknas)
//    endTime     = sluttid
//    location    = plats
//    image       = bildlänk (byt mot egen bild i mappen public/events/)
//    summary     = en mening som visas på korten
//    description = 2–3 stycken, varje stycke inom citattecken
//    agenda      = program: { time: '18:00', text: 'Vad som händer' }
//    forWhom     = en mening om vem eventet passar
//    price       = t.ex. 'Gratis'
//    host        = { name: 'Namn', role: 'Roll' }
//    spotsTotal  = antal platser totalt
//    spotsLeft   = platser kvar. 0 = fullt, då visas väntelistan.
//                  Färre än 5 visas som "Få platser kvar".
//
//  Kommande och tidigare event sorteras automatiskt efter dagens datum.
//  Du behöver aldrig flytta ett event för hand.
// ============================================================================

const place = 'Badhusgatan 4, Helsingborg'

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=70` // TILLFÄLLIGT

export const events = [
  // TILLFÄLLIGT – alla event nedan är exempel
  {
    slug: 'manadsfrukost-november',
    title: 'Månadsfrukost',
    category: 'Frukost',
    date: '2026-11-06',
    startTime: '08:00',
    endTime: '09:30',
    location: place,
    image: img('photo-1504674900247-0877df9cc836'),
    summary: 'Frukost, kaffe och en runda där alla berättar vad de jobbar med just nu.',
    description: [
      'Första fredagen i månaden äter vi frukost tillsammans. Kaffet är bryggt, bordet är dukat och ingen har bråttom.',
      'Vi tar en runda runt bordet där alla berättar vad de jobbar med just nu, vad de behöver hjälp med och vad de kan bidra med.',
    ],
    agenda: [
      { time: '08:00', text: 'Dörren öppnar, kaffe och frukost' },
      { time: '08:30', text: 'Rundan: vad jobbar du med just nu?' },
      { time: '09:15', text: 'Fritt prat och nya kontakter' },
    ],
    forWhom: 'Medlemmar och nyfikna som vill träffa folk över en bra frukost.',
    price: 'Gratis',
    host: { name: 'Anna Svensson', role: 'Grundare & värd' },
    spotsTotal: 25,
    spotsLeft: 14,
  },
  {
    slug: 'kodkvall-bygg-en-kvall',
    title: 'Kodkväll: bygg något på en kväll',
    category: 'Bygga',
    date: '2026-11-12',
    startTime: '18:00',
    endTime: '21:00',
    location: place,
    image: img('photo-1522071820081-009f0129c71c'),
    summary: 'Ta med en idé, bilda små team och visa vad ni hunnit bygga kl 20:30.',
    description: [
      'Ta med en idé, stor eller liten. Vi bildar små team och bygger något som går att visa upp innan kvällen är slut.',
      'Du behöver inte vara utvecklare. Designers, marknadsförare och idésmeder är lika välkomna. Pizza ingår.',
    ],
    agenda: [
      { time: '18:00', text: 'Pizza och idéer på bordet' },
      { time: '18:30', text: 'Team bildas och bygget startar' },
      { time: '20:30', text: 'Visning: vad hann vi bygga?' },
    ],
    forWhom: 'Alla som vill bygga något tillsammans med andra, oavsett erfarenhet.',
    price: 'Gratis',
    host: { name: 'Erik Nilsson', role: 'Community & verksamhet' },
    spotsTotal: 20,
    spotsLeft: 3,
  },
  {
    slug: 'lunch-and-learn-ai-i-vardagen',
    title: 'Lunch & Learn: AI i vardagen för små bolag',
    category: 'Kunskap',
    date: '2026-11-18',
    startTime: '12:00',
    endTime: '13:00',
    location: place,
    image: img('photo-1531482615713-2afd69097998'),
    summary: 'En medlem visar konkreta verktyg och flöden, följt av frågor. Ta med lunch.',
    description: [
      'En av våra medlemmar visar hur AI används i det dagliga arbetet i ett litet bolag: vilka verktyg, vilka flöden och vad som faktiskt sparar tid.',
      'Efter genomgången finns det gott om tid för frågor. Ta med din egen lunch.',
    ],
    agenda: [
      { time: '12:00', text: 'Lunch och intro' },
      { time: '12:15', text: 'Genomgång av verktyg och flöden' },
      { time: '12:45', text: 'Frågor och diskussion' },
    ],
    forWhom: 'Ägare och medarbetare i små bolag som vill komma igång på riktigt.',
    price: 'Gratis',
    host: { name: 'Maja Lindgren', role: 'UX-designer, Nordlys Studio' },
    spotsTotal: 30,
    spotsLeft: 18,
  },
  {
    slug: 'oppet-hus-november',
    title: 'Öppet hus',
    category: 'Öppet hus',
    date: '2026-11-26',
    startTime: '16:00',
    endTime: '19:00',
    location: place,
    image: img('photo-1497366216548-37526070297c'),
    summary: 'Kom och se lokalen, träffa medlemmarna och prova ett skrivbord. Lättare mingel.',
    description: [
      'Dörren står öppen. Kom förbi, se lokalen och prata med de som sitter här.',
      'Du får gärna sätta dig vid ett skrivbord och känna efter. Vi bjuder på lättare mingel.',
    ],
    agenda: [
      { time: '16:00', text: 'Dörren öppnar' },
      { time: '17:00', text: 'Rundvandring i lokalen' },
      { time: '17:30', text: 'Mingel och fika' },
    ],
    forWhom: 'Dig som funderar på att jobba här eller bara är nyfiken.',
    price: 'Gratis',
    host: { name: 'Anna Svensson', role: 'Grundare & värd' },
    spotsTotal: 60,
    spotsLeft: 40,
  },
  {
    slug: 'designkritik-ta-med-ditt-projekt',
    title: 'Designkritik: ta med ditt projekt',
    category: 'Kunskap',
    date: '2026-12-01',
    startTime: '15:00',
    endTime: '16:30',
    location: place,
    image: img('photo-1558655146-9f40138edfeb'),
    summary: 'Visa en skiss, sajt eller app och få ärlig och vänlig feedback. Max 12 platser.',
    description: [
      'Ta med något du jobbar på: en skiss, en sajt eller en app. Vi går igenom det tillsammans och ger ärlig, vänlig feedback.',
      'Det är en liten grupp med max 12 platser, så alla får tid.',
    ],
    agenda: [
      { time: '15:00', text: 'Kort intro och spelregler' },
      { time: '15:15', text: 'Projekten går varvet runt' },
      { time: '16:15', text: 'Summering' },
    ],
    forWhom: 'Alla som vill ha ögon på sitt projekt, från första skiss till färdig produkt.',
    price: 'Gratis',
    host: { name: 'Maja Lindgren', role: 'UX-designer, Nordlys Studio' },
    spotsTotal: 12,
    spotsLeft: 0, // 0 = fullt, väntelistan visas
  },
  {
    slug: 'julfika-och-demo',
    title: 'Julfika & demo',
    category: 'Socialt',
    date: '2026-12-11',
    startTime: '15:00',
    endTime: '17:00',
    location: place,
    image: img('photo-1512389142860-9c449e58a543'),
    summary: 'Medlemmarna visar något de byggt under året, sedan glögg och pepparkakor.',
    description: [
      'Året ska summeras. Medlemmarna visar kort något de byggt eller lärt sig under året.',
      'Sedan tar vi glögg och pepparkakor och pratar om vad som väntar nästa år.',
    ],
    agenda: [
      { time: '15:00', text: 'Demos från medlemmarna' },
      { time: '16:00', text: 'Glögg och pepparkakor' },
    ],
    forWhom: 'Medlemmar och vänner av huset.',
    price: 'Gratis',
    host: { name: 'Erik Nilsson', role: 'Community & verksamhet' },
    spotsTotal: 40,
    spotsLeft: 26,
  },
  {
    slug: 'inflyttningsfest',
    title: 'Inflyttningsfest',
    category: 'Socialt',
    date: '2026-10-16',
    startTime: '',
    endTime: '',
    location: place,
    image: img('photo-1511795409834-ef04bbd61622'),
    summary: 'Vi firade att dörrarna öppnade.',
    description: ['Vi firade att dörrarna öppnade.'],
    agenda: [],
    forWhom: '',
    price: 'Gratis',
    host: { name: 'Anna Svensson', role: 'Grundare & värd' },
    spotsTotal: 0,
    spotsLeft: 0,
  },
]

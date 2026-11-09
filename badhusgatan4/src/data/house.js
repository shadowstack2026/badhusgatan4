// ============================================================================
//  HOUSE.JS – delarna i "Det här har vi" (scroll-sektionen om huset)
// ============================================================================
//  Ändra text:   "name" (rubrik) och "text" (beskrivning).
//  Byt bild:     ändra "src" (sökväg i public/, t.ex. '/bilder/samtalsrummet.jpg', eller en länk)
//                och skriv en kort "alt" som beskriver vad bilden visar.
//  "position" styr beskärningen (object-position), t.ex. 'center 40%'.
//  Lägg till eller ta bort delar genom att kopiera eller radera ett block. Siffrorna
//  och räknaren (04 / 06) räknas ut automatiskt.
//
//  TILLFÄLLIGT: alla bilder utom samtalsrummet är Unsplash-bilder. Byt mot egna foton.
// ============================================================================
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=75`

export const houseParts = [
  {
    id: 'eget-skrivbord',
    name: 'Eget skrivbord',
    text: 'Ett skrivbord som är ditt. Du kommer in, sätter dig och är igång, och allt står kvar som du lämnade det.',
    src: unsplash('1593062096033-9a26b09da705'),
    alt: 'Ett skrivbord med laptop och en lampa med varmt ljus',
    position: 'center 45%',
  },
  {
    id: 'internet',
    name: 'Internet',
    text: 'Nätet bara fungerar. Det ingår i hyran, så du kan lägga tiden på det du bygger.',
    src: unsplash('1558494949-ef010cbdcc31'),
    alt: 'Serverskåp med färgade nätverkskablar',
    position: 'center',
  },
  {
    id: 'gemensamma-ytan',
    name: 'Gemensamma ytan',
    text: 'Här sitter vi tillsammans, var och en med sitt. Ibland är det tyst, ibland blir det samtal, och båda delarna är precis som det ska vara.',
    src: unsplash('1522071820081-009f0129c71c'),
    alt: 'Människor som arbetar med laptops runt ett gemensamt bord',
    position: 'center 40%',
  },
  {
    id: 'samtalsrummet',
    name: 'Samtalsrummet',
    text: 'Två fåtöljer och ett litet bord. Dit går man när ett samtal behöver lite lugn.',
    src: '/bilder/bolla-med.jpg', // riktigt foto
    alt: 'Två svarta fåtöljer och ett litet glasbord med en kaffekopp under en affisch',
    position: 'center 55%',
  },
  {
    id: 'kaffe-och-te',
    name: 'Kaffe och te',
    text: 'Någon har alltid satt på kaffe. Pausen blir ofta dagens bästa samtal.',
    src: unsplash('1495474472287-4d71bcdd2085'),
    alt: 'Tre koppar kaffe som skålar över ett bord',
    position: 'center 40%',
  },
  {
    id: 'det-praktiska',
    name: 'Det praktiska',
    text: 'Toalettartiklar och förbrukningsmaterial ingår i hyran. Ett bekymmer mindre.',
    src: unsplash('1552321554-5fefe8c9ef14'),
    alt: 'Ett ljust badrum med handfat och växter',
    position: '25% 60%',
  },
]

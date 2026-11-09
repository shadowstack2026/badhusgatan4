// ============================================================================
//  ECOSYSTEM.JS – "Bolag i ekosystemet"
// ============================================================================
//  Lägg till ett bolag: kopiera ett block i "companies" och ändra uppgifterna.
//    namn        = bolagets namn
//    beskrivning = 1-2 meningar om bolaget (visas i scroll-sektionen)
//    bild        = stor bild till scroll-sektionen (sökväg i public/bilder/ eller en länk)
//    logo        = VIT logga (SVG eller PNG) i public/logos/ (loggorna som rullar)
//    url         = bolagets hemsida (öppnas i ny flik)
//  Ta bort ett bolag: radera hela blocket.
//  Samma lista används i loggremsan längst ner i hero, i de rullande loggorna och i scroll-sektionen.
//
//  TILLFÄLLIGT: allt nedan är platshållare. Byt texter, bilder, loggor och länkar.
// ============================================================================
export const ecosystemIntro = {
  title: 'Bolag i ekosystemet',
  text: 'Ekosystemet är de bolag som sitter i huset och de som arbetar nära oss. Startups, IT-bolag och konsulter som delar kontakter, uppdrag och erfarenheter. Klicka på en logotyp för att besöka bolaget.',
}

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=75`
const PLATSHALLARE = 'Ett av bolagen i ekosystemet. Beskrivningen läggs till här.'

export const companies = [
  {
    namn: 'Project of Sweden',
    beskrivning: PLATSHALLARE,
    bild: unsplash('1522071820081-009f0129c71c'),
    logo: '/logos/project-of-sweden.svg',
    url: 'https://example.com',
  },
  {
    namn: 'Nordlys Studio',
    beskrivning: PLATSHALLARE,
    bild: unsplash('1517048676732-d65bc937f952'),
    logo: '/logos/nordlys-studio.svg',
    url: 'https://example.com',
  },
  {
    namn: 'Kvarnen Data',
    beskrivning: PLATSHALLARE,
    bild: unsplash('1555066931-4365d14bab8c'),
    logo: '/logos/kvarnen-data.svg',
    url: 'https://example.com',
  },
  {
    namn: 'Fjord & Frisk',
    beskrivning: PLATSHALLARE,
    bild: unsplash('1556761175-5973dc0f32e7'),
    logo: '/logos/fjord-frisk.svg',
    url: 'https://example.com',
  },
  {
    namn: 'Lilla Konsulten',
    beskrivning: PLATSHALLARE,
    bild: unsplash('1517694712202-14dd9538aa97'),
    logo: '/logos/lilla-konsulten.svg',
    url: 'https://example.com',
  },
  {
    namn: 'Pixelverket',
    beskrivning: PLATSHALLARE,
    bild: unsplash('1593062096033-9a26b09da705'),
    logo: '/logos/pixelverket.svg',
    url: 'https://example.com',
  },
  {
    namn: 'Brygga Digital',
    beskrivning: PLATSHALLARE,
    bild: unsplash('1497366216548-37526070297c'),
    logo: '/logos/brygga-digital.svg',
    url: 'https://example.com',
  },
]

import gruppbild from '../assets/badhusgatan4.jpg'

// ============================================================================
//  SECTIONS.JS – texterna och bilderna på startsidan under hero
// ============================================================================
//  "intro"     = ikonsektionen (rubrik, text och korten "Det här finns i huset")
//  "ecosystem" = bild vänster, text höger, om bolagen i huset
//  "why"       = text vänster, bild höger, "Varför finns det här?"
//  Byt bild: ändra "image" (sökväg i public/bilder/ eller en länk) och skriv en "alt".
//  TILLFÄLLIGT: bilderna är Unsplash-platshållare.
// ============================================================================
export const intro = {
  title: 'Ett hus där folk som bygger saker faktiskt hälsar på varandra.',
  text: 'Badhusgatan 4 är ett hus i Helsingborg för bolag som bygger digitalt. Här delar vi vardagen, kontakterna och erfarenheterna, så att ingen behöver sitta ensam med en idé, en kund eller ett beslut.',
}

export const ecosystemSplit = {
  title: 'Bolagen i huset är ett ekosystem',
  text: 'Under samma tak sitter startups, IT-bolag och konsulter. De arbetar med olika saker, men de möts över kaffe, hjälper varandra med uppdrag och tar ofta nästa steg tillsammans. Det är ekosystemet: bolag som växer med varandra.',
  button: { label: 'Se bolagen', to: { pathname: '/', hash: '#bolag' } },
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=75', // TILLFÄLLIGT
  alt: 'Människor som arbetar tillsammans med laptops vid ett bord',
}

export const whySplit = {
  title: 'Varför finns Badhusgatan 4?',
  text: 'För att det är lättare att bygga när man inte gör det ensam. Badhusgatan 4 är en plats där bolagen kan hitta arbetsro, bolla idéer och hjälpa varandra framåt. Ekosystemet finns för att alla har något att bidra med.',
  button: { label: 'Kom förbi', to: { pathname: '/', hash: '#kontakt' } },
  image: gruppbild, // src/assets/badhusgatan4.jpg
  alt: 'Gruppbild på människorna i huset framför entrén till Badhusgatan 4',
}

// De tre rutorna ovanför eventen. icon = namn på en ikon från lucide-react (se UpcomingEvents.jsx).
export const eventFormats = [
  {
    title: 'Community',
    text: 'Träffar för alla i huset. Lär känna bolagen och människorna runt dig.',
    icon: 'Users',
  },
  {
    title: 'Frukost & fika',
    text: 'En stund över en kopp utan agenda. Bara tid att prata med varandra.',
    icon: 'Coffee',
  },
  {
    title: 'Workshops',
    text: 'Korta pass där någon delar med sig av något hen kan och alla lär sig något nytt.',
    icon: 'Lightbulb',
  },
]

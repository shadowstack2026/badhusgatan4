// ============================================================================
//  HEROIMAGES.JS – bilderna i bildpartiet under "// community"
// ============================================================================
//  Byt en bild: ändra "src" (sökväg i public/, t.ex. '/bilder/trappan.jpg', eller en länk).
//  Skriv alltid en kort "alt" som beskriver vad bilden visar.
//  Ordning: 1 = den höga bilden, 2 och 3 = de två små.
//  "width" och "height" är bildens riktiga mått (hindrar att sidan hoppar när bilden laddas).
//
//  Riktiga foton från lokalen (Trappan, Open space, fåtöljrummet) är bäst. Lägg dem i
//  public/bilder/ och peka hit.
// ============================================================================
export const heroImages = [
  {
    label: 'Man bollar',
    src: '/bilder/bolla-med.jpg', // riktigt foto: fåtöljrummet
    alt: 'Två svarta fåtöljer och ett litet glasbord med en kaffekopp i ett av husets samtalsrum',
    width: 1200,
    height: 896,
  },
  {
    label: 'Man bygger ihop',
    src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=70', // TILLFÄLLIGT
    alt: 'Laptop med programkod på skärmen i mörk miljö',
    width: 800,
    height: 533,
  },
  {
    label: 'Man hälsar',
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=70', // TILLFÄLLIGT
    alt: 'Laptop med kod bredvid en gul kaffekopp och en växt på ett skrivbord',
    width: 800,
    height: 533,
  },
]

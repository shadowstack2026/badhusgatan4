// ============================================================================
//  ECOSYSTEM.JS – "Bolag i ekosystemet" (hyresgästerna på Badhusgatan 4)
// ============================================================================
//  Ordningen är samma som på skylten i hissen, plan 4.
//
//  Fält per bolag:
//    namn        = bolagets namn
//    tagline     = kort rad under namnet (valfri)
//    beskrivning = kort beskrivning (visas i scroll-sektionen)
//    nyckeltal   = [{ varde, text }] (valfri, visas som små siffror)
//    ekosystem   = [{ titel, text }] förmågor/tjänster (valfri, visas i listan "Det här gör de")
//    branscher   = [text] (valfri)
//    bild        = stor bild i public/bilder/ (saknas den visas bolagsnamnet som text)
//    logo        = VIT transparent logotyp i public/logos/ (saknas den visas bolagsnamnet som text)
//    url         = bolagets hemsida (valfri, öppnas i ny flik)
//    kommer      = true om bolaget är med men uppgifterna ännu inte är inlämnade
//  Ta bort ett bolag: radera hela blocket.
//  Samma lista används i loggremsan i hero, i de rullande loggorna och i scroll-sektionen.
// ============================================================================
export const ecosystemIntro = {
  title: 'Bolag i ekosystemet',
  text: 'Ekosystemet är de bolag som sitter i huset och de som arbetar nära oss. Startups, IT-bolag och konsulter som delar kontakter, uppdrag och erfarenheter. Klicka på en logotyp för att besöka bolaget.',
}

export const companies = [
  {
    slug: '2mnordic',
    namn: '2M Nordic IT Consulting AB',
    tagline: 'We solve complex and critical technology challenges',
    beskrivning:
      'Enterprise technology capability provider. 2MNordic hjälper företag att få tillbaka överblick, struktur och fart genom att göra teknisk komplexitet till operativ förmåga. Svenskt IT-konsultbolag med kontor i Helsingborg, Malmö och Göteborg.',
    nyckeltal: [
      { varde: '25 år', text: 'i Sverige' },
      { varde: '95 %', text: 'kundlojalitet (client retention)' },
      { varde: '670+', text: 'levererade projekt' },
      { varde: '30+', text: 'utvecklare' },
    ],
    ekosystem: [
      { titel: 'Strategic technology guidance', text: 'Bedömning, roadmap och beslutsstöd för organisationer vars system och initiativ vuxit förbi den interna förmågan att styra dem.' },
      { titel: 'AI and data operationalization', text: 'Översätter AI- och datastrategier till mätbara affärsresultat.' },
      { titel: 'System integration and platform coherence', text: 'Kopplar ihop fragmenterade teknikmiljöer så att system, plattformar och data fungerar som en helhet.' },
      { titel: 'Data architecture and governance', text: 'Arkitektur och styrning som gör datamiljöer från belastning till fördel.' },
      { titel: 'Security and operational resilience', text: 'Säkerhetsarkitektur, riskbedömning och kontinuitetsplanering för kritiska system.' },
      { titel: 'Technology stabilization and recovery', text: 'Får fart på initiativ som stannat av eller blivit ohanterliga, med snabb analys och direkt genomförandestöd.' },
      { titel: 'Cloud & infrastructure', text: 'Skalbara molnmiljöer i Azure, AWS och Google Cloud, från migrering och hybridarkitektur till DevOps-pipelines och infrastructure-as-code.' },
      { titel: 'Custom automation & delivery', text: 'Skräddarsydd automation som tar bort manuella flaskhalsar och snabbar upp leverans.' },
      { titel: 'AI Experience Validation', text: 'Granskning av AI-genererade appar, agenter och digitala upplevelser, så att de också fungerar för riktiga användare.' },
    ],
    branscher: ['E-handel', 'Tillverkning', 'Fordon', 'Energi & Smart Grid', 'Infrastruktur', 'Utbildning', 'Offentlig sektör'],
    bild: '/bilder/2mnordic-bild.jpg',
    bildAlt: 'Silhuett av ett huvud med stadssiluett och kod i dubbelexponering',
    logo: '/logos/2mnordic-logo.png',
  },
  {
    slug: 'bluenorth',
    namn: 'Blue North',
    tagline: 'Vi automatiserar ert autopilot-arbete',
    beskrivning:
      'Blue North bygger interna verktyg och automationer som tar bort manuellt rutinarbete, så att företag kan lägga tiden på rätt saker. Två grundare från Helsingborgsområdet som älskar problemlösning och har byggt lösningar för företag med väldigt olika arbetssätt och verktyg.',
    nyckeltal: [
      { varde: '220+ timmar', text: 'i månaden: vad en 10-personers firma i snitt lägger på manuellt rutinarbete' },
      { varde: '4 veckor', text: 'från start till lansering' },
    ],
    ekosystem: [
      { titel: 'Utforskning', text: 'Kartlägger ert nuvarande arbetssätt och hittar de "autopilot-uppgifter" som stjäl mest tid.' },
      { titel: 'Demo', text: 'Tar fram plan och demo, ritar upp flödet visuellt och ser till att allt integreras sömlöst med de system ni redan använder.' },
      { titel: 'Lansering', text: 'Bygger lösningen inom fyra veckor baserat på era behov, utbildar teamet och går live.' },
    ],
    bild: '/bilder/bluenorth-bild.jpg',
    bildAlt: 'Blue Norths två grundare sittande i en soffa',
    logo: '/logos/bluenorth-logo.png',
  },
  {
    slug: 'humansyntax',
    namn: 'Human Syntax AB',
    tagline: 'Byggt av människor. För det mesta.',
    beskrivning:
      'Human Syntax är en liten digital studio i Helsingborg som hjälper företag att göra idéer, system och arbetssätt användbara i praktiken. Digitala produkter, automation och användbara saker, i gränslandet mellan teknik, kommunikation, tillväxt och compliance. Mindre fluff, mer fungerande lösningar.',
    ekosystem: [
      { titel: 'Digitala produkter', text: 'Bygga en produkt från idé till något som används.' },
      { titel: 'Kundresor', text: 'Förbättra en kundresa i praktiken.' },
      { titel: 'Automation', text: 'Automatisera arbetsflöden.' },
      { titel: 'Digital utveckling', text: 'Driva utveckling av webb och system.' },
      { titel: 'E-handel, marknad och teknik', text: 'Få dem att hänga ihop.' },
      { titel: 'Growth och compliance', text: 'Tillväxt och regelefterlevnad som en del av arbetet, ofta i uppdrag som inte ryms i en vanlig titel.' },
    ],
    branscher: ['produkt', 'webb', 'automation'],
    bild: '/bilder/humansyntax-bild.jpg',
    bildAlt: 'Kodfönster med Human Syntax studioconfig',
    logo: '/logos/humansyntax-logo.png',
    url: 'https://www.humansyn.tax/',
    epost: 'hello@humansyntax.se',
  },
  {
    slug: 'konnekt',
    namn: 'Konnekt of Sweden',
    tagline: 'People. Digital. Talent. Vi förenar människor, teknik och rätt kompetens.',
    beskrivning:
      'Strategi, digital utveckling och rekrytering för företag som vill växa hållbart. Konnekt of Sweden kopplar ihop organisation, teknik och kompetens så att utvecklingen fungerar som en helhet.',
    ekosystem: [
      { titel: 'People & Culture', text: 'Starkare ledarskap, tydligare samarbete och en kultur som fungerar i vardagen. Ledarskap och teamutveckling, workshops och facilitering, kultur och internkommunikation.' },
      { titel: 'Digital Growth', text: 'Digitala lösningar som är begripliga, användbara och byggda för att hålla. Digital strategi och positionering, webb och applikationsutveckling, system, automation och IT-säkerhet.' },
      { titel: 'Talent Acquisition', text: 'Rätt kompetens för dagens behov och morgondagens möjligheter. Search och rekrytering, bemanning och specialistkompetens, employer branding.' },
    ],
    bild: '/bilder/konnekt-bild.jpg',
    bildAlt: 'Abstrakt illustration i blått och orange',
    logo: '/logos/konnekt-logo.png',
    url: 'https://konnektofsweden.se/',
  },
  {
    slug: 'sensowave',
    namn: 'Sensowave Solutions AB',
    beskrivning: 'Mer information om bolaget kommer.',
    kommer: true,
  },
]

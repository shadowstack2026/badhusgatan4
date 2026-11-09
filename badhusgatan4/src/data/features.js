// ============================================================================
//  FEATURES.JS – korten i ikonsektionen ("Det här finns i huset")
// ============================================================================
//  label = texten på kortet
//  icon  = namn på en ikon från lucide-react (se src/components/Huset.jsx för vilka som är inlagda)
//  to    = vart kortet leder (sida eller sektion)
// ============================================================================
export const features = [
  { label: 'Eget skrivbord', icon: 'Monitor', to: { pathname: '/', hash: '#kontakt' } },
  { label: 'Snabbt internet', icon: 'Wifi', to: { pathname: '/', hash: '#kontakt' } },
  { label: 'Gemensamma ytor', icon: 'Users', to: { pathname: '/', hash: '#kontakt' } },
  { label: 'Samtalsrum', icon: 'MessagesSquare', to: { pathname: '/', hash: '#kontakt' } },
  { label: 'Kaffe och te', icon: 'Coffee', to: { pathname: '/', hash: '#kontakt' } },
  { label: 'Event', icon: 'CalendarDays', to: '/event' },
]

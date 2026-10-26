import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [platser, setPlatser] = useState([])

  useEffect(() => {
    supabase.from('platser').select('*').then(({ data, error }) => {
      if (error) console.log(error)
      else setPlatser(data)
    })
  }, [])

  return (
    <div>
      <h1>Test av Supabase</h1>
      {platser.map((p) => (
        <p key={p.id}>{p.typ} – {p.status}</p>
      ))}
    </div>
  )
}

export default App
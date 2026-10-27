import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="request">
      <div className="container request__inner request__thanks">
        <h1 className="h2">Sidan finns inte</h1>
        <p className="lead">Länken du följde leder ingenstans. Gå tillbaka till startsidan.</p>
        <Link to="/" className="btn btn--primary">
          Till startsidan <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  )
}

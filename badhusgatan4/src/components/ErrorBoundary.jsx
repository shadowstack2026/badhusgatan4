import { Component } from 'react'

// Fångar krascher i appen så att besökaren aldrig ser en vit skärm.
// Använder en vanlig <a> (inte router-länk) eftersom routern kan vara det som kraschat.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('Appen kraschade', error, info)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="request">
        <div className="container request__inner request__thanks">
          <h1 className="h2">Något gick fel</h1>
          <p className="lead">Sidan kunde inte visas. Gå tillbaka till startsidan och försök igen.</p>
          <a href="/" className="btn btn--primary">
            Till startsidan <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </main>
    )
  }
}

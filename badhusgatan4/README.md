# Badhuset – Badhusgatan 4

Vite + React + JavaScript. Routing med `react-router-dom`, formulär via EmailJS.

```bash
npm install
npm run dev      # utveckling
npm run build    # bygger till dist/
```

Sidor: `/` startsidan, `/om-oss`, `/kom-igang` (förfrågan; `?typ=dagspass` eller `?typ=vantelista` förväljer ett val).
Texter och kontaktuppgifter ändras i `src/data/content.js`.

## Publicera

`public/_redirects` (Netlify) och `vercel.json` (Vercel) skickar alla adresser till `index.html`, så att direktlänkar som `/om-oss` fungerar.

## Formuläret (EmailJS)

Formuläret skickar två mejl: ett till ägaren och en bekräftelse till besökaren.

1. Skapa ett konto på [emailjs.com](https://www.emailjs.com) och koppla en e-posttjänst under **Email Services**. Kopiera **Service ID**.
2. Skapa två mallar under **Email Templates**:
   - **Ägarmallen** – *To Email*: `shadowstack2026@gmail.com` (sätts i mallen, inte i koden). *Reply To*: `{{from_email}}`.
   - **Bekräftelsemallen** – *To Email*: `{{from_email}}` (besökarens adress).

   Båda mallarna kan använda variablerna `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{company}}`, `{{request_type}}`, `{{start_date}}`, `{{message}}` och `{{submitted_at}}`.
3. Kopiera din **Public Key** under **Account → General**.
4. Kopiera `.env.example` till `.env` och fyll i:

   ```
   VITE_EMAILJS_SERVICE_ID=       # Service ID
   VITE_EMAILJS_TEMPLATE_OWNER=   # Template ID för ägarmallen
   VITE_EMAILJS_TEMPLATE_CONFIRM= # Template ID för bekräftelsemallen
   VITE_EMAILJS_PUBLIC_KEY=       # Public Key
   ```

5. Starta om `npm run dev` (Vite läser `.env` bara vid start). `.env` ligger i `.gitignore` och ska inte checkas in.
   Vid publicering: lägg in samma fyra variabler i Netlify/Vercel under *Environment variables* och bygg om.

Varje lyckad förfrågan sparas dessutom i webbläsarens `localStorage` (nyckel `badhub-forfragningar`, fältet `typ` visar vad personen ville ha).

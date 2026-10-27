# Badhuset – Badhusgatan 4

Vite + React + JavaScript. Routing med `react-router-dom`, formulär via EmailJS.

```bash
npm install
npm run dev      # utveckling
npm run build    # bygger till dist/
```

Sidor: `/` startsidan, `/om-oss`, `/kom-igang` (förfrågan; `?typ=dagspass` eller `?typ=vantelista` förväljer ett val).
Texter och kontaktuppgifter ändras i `src/data/content.js`.

## Event och adminpanel

Event och anmälningar ligger i Supabase och hanteras i adminpanelen på `/admin` (ingen länk i menyn).

**Första gången:**
1. Supabase → SQL Editor → klistra in hela `supabase/schema.sql` och kör.
2. Supabase → Authentication → Users → Add user (e-post + lösenord, kryssa i *Auto Confirm User*). E-posten ska finnas i raden `insert into admins` längst ner i SQL-filen.
3. Fyll i `VITE_SUPABASE_URL` och `VITE_SUPABASE_PUBLISHABLE_KEY` i `.env.local` (och i hostens miljövariabler vid publicering).
4. Logga in på `/admin`. Är listan tom: tryck *Lägg in exempelevent*.

**Så använder du panelen:**
1. **Event:** *+ Nytt event*, *Redigera*, *Dölj/Publicera* eller *Radera*. Du kan ladda upp bild, skriva beskrivning, lägga till program och ange antal platser (0 = obegränsat).
2. **Anmälningar:** se vilka som anmält sig, bekräfta, avboka eller ge en plats från väntelistan. Listan kan laddas ner som Excel-fil.
3. Är ett event fullt hamnar nya anmälningar automatiskt på väntelistan. Kommande och tidigare event delas upp efter dagens datum.

Eventanmälningar skickar inget mejl, de sparas bara i databasen. Går databasen inte att nå visar sajten exemplen i `src/data/events.js`.

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

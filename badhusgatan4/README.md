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

**Bekräftelsemejl till deltagare:** *Bekräfta och mejla* och *Ge plats och mejla* i panelen skickar ett mejl till deltagaren via den allmänna bekräftelsemallen (se EmailJS nedan). Statusen ändras bara om mejlet faktiskt skickades. Kör om `supabase/schema.sql` en gång så att kolumnen `confirmed_at` finns (det är säkert att köra igen).

Själva anmälan skickar inget mejl, den sparas bara i databasen. Går databasen inte att nå visar sajten exemplen i `src/data/events.js`.

## Publicera

`public/_redirects` (Netlify) och `vercel.json` (Vercel) skickar alla adresser till `index.html`, så att direktlänkar som `/om-oss` fungerar.

## Mejl (EmailJS)

EmailJS gratisplan tillåter två mallar, och sajten använder exakt två:

- **Ägarmallen** (`VITE_EMAILJS_TEMPLATE_OWNER`): förfrågningar från `/kom-igang` till oss. *To Email*: `shadowstack2026@gmail.com` (sätts i mallen, inte i koden). *Reply To*: `{{from_email}}`. Variabler: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{company}}`, `{{request_type}}`, `{{start_date}}`, `{{message}}`, `{{submitted_at}}`.
- **Allmänna bekräftelsemallen** (`VITE_EMAILJS_TEMPLATE_CONFIRM`): alla mejl till besökare. *To Email*: `{{to_email}}`, *Subject*: `{{subject}}`. Variabler: `{{to_name}}`, `{{heading}}`, `{{intro}}`, `{{details}}`, `{{note}}`.

Mallen används på tre ställen via `sendVisitorMail` i `src/lib/mail.js`: tack-mejl efter formuläret på `/kom-igang`, *Bekräfta och mejla* och *Ge plats och mejla* i adminpanelen. Texterna ligger i samma fil.

Gör så här:
1. Skapa ett konto på [emailjs.com](https://www.emailjs.com) och koppla en e-posttjänst under **Email Services**. Kopiera **Service ID** och din **Public Key** (Account → General).
2. Kopiera `.env.example` till `.env` och fyll i:

   ```
   VITE_EMAILJS_SERVICE_ID=       # Service ID
   VITE_EMAILJS_TEMPLATE_OWNER=   # Template ID för ägarmallen
   VITE_EMAILJS_TEMPLATE_CONFIRM= # Template ID för den allmänna bekräftelsemallen
   VITE_EMAILJS_PUBLIC_KEY=       # Public Key
   ```

3. Starta om `npm run dev` (Vite läser `.env` bara vid start). `.env` ligger i `.gitignore` och ska inte checkas in.
   Vid publicering: lägg in samma fyra variabler (plus de två från Supabase) i Netlify/Vercel under *Environment variables* och bygg om.

Varje lyckad förfrågan sparas dessutom i webbläsarens `localStorage` (nyckel `badhub-forfragningar`, fältet `typ` visar vad personen ville ha).

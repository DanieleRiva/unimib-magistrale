---
title: W3.A1 — La mia soluzione (sendMessage)
description: Perché la mia analisi Category Partition della Telegram sendMessage è strutturata così — difesa orale.
sidebar:
  order: 2
---

> **Soluzione e difesa — Assignment W3.A1.**
> Argomento → vedi [Category Partition](/qualita-software/category-partition/). Traccia → screenshot `Assignment_W3_A1.png`.
> Qui sta il *perché* di ogni scelta: è quello che devo saper dire a voce.

## 0. La traccia in breve

Applicare il **Category Partition** alla funzionalità `sendMessage` delle Telegram Bot API: identificare **parametri ed environment, categorie, choice e vincoli**. Stesso formato dell'homework **W2.H1** (Vision API di OpenAI). Voto: **10/10**.

## 1. La mia tabella (Parameter → Category → Choices)

### Environment

| Parameter | Category | Choices |
|---|---|---|
| HTTP Method | Type | `POST` · Altro metodo (es. GET) `[error]` |
| Endpoint URL | Path | URL valido `…/bot{bot_token}/sendMessage` · URL invalido `[error]` |

### Header

| Parameter | Category | Choices |
|---|---|---|
| Content-Type | Expected Format | `"application/json"` · Altro / Omesso `[error]` |
| bot_token | Token | Valido (formato+lunghezza+token corretto) · Formato invalido `[error]` · Lunghezza invalida `[error]` · Token sbagliato `[error]` · Omesso `[error]` |

### Body

| Parameter | Category | Choices |
|---|---|---|
| chat_id | Target Identifier | Intero positivo (privata) `[property ForumSupport]` · Intero negativo (group/supergroup) · `@channelusername` · ID canale intero positivo · Formato invalido/vuoto `[error]` · Omesso `[error]` |
| text | Length | `1` `[single]` · `1<n<4096` · `4096` `[single]` · `0`/vuoto `[error]` · `>4096` `[error]` · Omesso `[error]` |
| parse_mode | Formatting Option | `"MarkdownV2"` `[property ParseModeOn]` · `"HTML"` `[property ParseModeOn]` · `"Markdown"` `[property ParseModeOn]` · Stringa invalida `[error]` · Omesso/none `[property ParseModeOff]` |
| entities | Compatibility + Array Length | Array presente `[if ParseModeOn]` `[error]` · `0` `[if ParseModeOff]` · `1` `[if ParseModeOff]` · `1<n<100` `[if ParseModeOff]` · `100` `[if ParseModeOff]` `[single]` · `>100` `[if ParseModeOff]` `[error]` · non sovrapposte `[if ParseModeOff]` · sovrapposte `[error]` · somma lunghezze `>4096` `[error]` |
| entities[].type | Type | tipo valido (es. `bold`) `[if ParseModeOff]` · `url`/`text_link` → `[property TYPE_URL]` · Invalido `[error]` · Mancante `[error]` |
| entities[].offset | Position | `≥0` `[if ParseModeOff]` · `<0` `[error]` |
| entities[].length | Char count | `≥1` `[if ParseModeOff]` · `<1` `[error]` |
| (url dell'entità) | URL validity | URL valido `[if TYPE_URL]` · URL invalido `[error]` |
| message_thread_id | Numerical Identifier | Intero positivo valido `[if ForumSupport]` · Valore invalido `[error]` · Omesso |
| reply_to_message_id | Value | Intero valido · Omesso |
| disable_notification | Value | `true` · `false` · Omesso |
| disable_web_page_preview | Value | `true` · `false` · Omesso |
| protect_content | Value | `true` · `false` · Omesso |

## 2. Perché è strutturata così (le 3 scelte che valgono il 10)

1. **Sezione Environment separata dai parametri.**
   *Cosa dire:* metodo HTTP ed endpoint influenzano il comportamento ma non sono input controllabili del payload; tenerli fuori dalla lista dei parametri rispetta il **confine del sistema**. Metterli tra i parametri è un errore concettuale.

2. **Categorie con nomi che descrivono la proprietà sotto test.**
   *Cosa dire:* "Length" per `text`, "Formatting Option" per `parse_mode`, "Target Identifier" per `chat_id` — non etichette vuote tipo "Value". La categoria deve dire *cosa* sto testando, non ripetere il nome del campo.

3. **Dipendenze condizionali + un vincolo globale.**
   *Cosa dire:*
   - `parse_mode ↔ entities`: se `parse_mode` è attivo le `entities` non vanno passate → modellato con `[property ParseModeOn/Off]` + `[if ParseModeOff]`.
   - `[property TYPE_URL]`: se un'entità è `url`/`text_link` scatta il test sulla validità del link.
   - **Vincolo globale**: la somma delle lunghezze delle entità ≤ 4096. È una condizione *trasversale* alle choice, non locale a un campo.

## 3. La critica all'output GAI (parte richiesta dalla traccia)

Ho confrontato la mia analisi con quella di **Gemini** (prompt = traccia copiata). I difetti dell'AI:

- **Categorizzazione superficiale**: categorie generiche ("Value", "Position", "Path") invece della proprietà reale sotto test.
- **Nessuna sezione Environment**: ha messo metodo HTTP ed endpoint tra i parametri.
- **`entities[].type` semplificato**: ha perso le dipendenze condizionali (es. il caso `url`/`text_link` che richiede di testare la validità del link).
- **Vincolo globale mancato**: non ha colto la somma delle lunghezze ≤ 4096.

*Conclusione difendibile:* la GAI mappa la **struttura** del JSON, ma non applica la **metodologia** (categorie come proprietà, environment, dipendenze, boundary). Si comporta da parser, non da tester.

## 4. Domande di difesa probabili (sulla MIA soluzione)

1. Perché `text = 4096` e `entities = 100` sono `[single]` e non `[error]`? (Sono boundary *validi*: un test basta.)
2. Spiega la relazione `parse_mode ↔ entities`: perché "array presente mentre `parse_mode` attivo" è `[error]`.
3. Perché hai separato l'Environment? Cosa cambia nel testing se non lo fai?
4. Il vincolo "somma lunghezze ≤ 4096": perché non è una semplice choice di un singolo campo?
5. *What if*: nuovo parametro opzionale `message_effect_id` (stringa valida solo nelle chat private). Categoria? Choice? Quali vincoli? (Suggerimento: serve un `[if ...]` legato alla proprietà "chat privata".)
6. Quanti test case genererebbe (ordine di grandezza) la tua tabella, e cosa li tiene sotto controllo?
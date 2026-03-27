// Auto-generated — do not edit by hand
export const pilotNodes = [
  {
    "id": "pool-guest",
    "type": "pool",
    "position": {
      "x": -280,
      "y": 280
    },
    "data": {
      "label": "Gäst / Bokare",
      "color": "#ff8e7d",
      "heightPx": 240,
      "widthPx": 6600
    },
    "selectable": false,
    "draggable": false,
    "zIndex": -2,
    "measured": {
      "width": 6600,
      "height": 240
    }
  },
  {
    "id": "pool-mobile",
    "type": "pool",
    "position": {
      "x": -280,
      "y": 580
    },
    "data": {
      "label": "Mobilvy",
      "color": "#6366f1",
      "heightPx": 260,
      "widthPx": 6600
    },
    "selectable": false,
    "draggable": false,
    "zIndex": -2,
    "measured": {
      "width": 6600,
      "height": 260
    }
  },
  {
    "id": "pool-staff",
    "type": "pool",
    "position": {
      "x": -280,
      "y": 880
    },
    "data": {
      "label": "Staff / Drift",
      "color": "#f59e0b",
      "heightPx": 260,
      "widthPx": 6600
    },
    "selectable": false,
    "draggable": false,
    "zIndex": -2,
    "measured": {
      "width": 6600,
      "height": 260
    }
  },
  {
    "id": "pool-backend",
    "type": "pool",
    "position": {
      "x": -280,
      "y": 1360
    },
    "data": {
      "label": "Backend",
      "color": "#22d3ee",
      "heightPx": 620,
      "widthPx": 6600
    },
    "selectable": false,
    "draggable": false,
    "zIndex": -2,
    "measured": {
      "width": 6600,
      "height": 620
    }
  },
  {
    "id": "lane-guest",
    "type": "lane",
    "position": {
      "x": -100,
      "y": 300
    },
    "data": {
      "label": "Gäst / bokare",
      "index": 0,
      "height": "200px",
      "width": "6200px",
      "heightPx": 200
    },
    "selectable": true,
    "draggable": false,
    "zIndex": -1,
    "measured": {
      "width": 6200,
      "height": 200
    },
    "selected": false
  },
  {
    "id": "lane-cloud",
    "type": "lane",
    "position": {
      "x": -100,
      "y": 1380
    },
    "data": {
      "label": "JumpYard Cloud",
      "index": 4,
      "height": "360px",
      "width": "6200px",
      "heightPx": 360
    },
    "selectable": true,
    "draggable": false,
    "zIndex": -1,
    "measured": {
      "width": 6200,
      "height": 360
    },
    "selected": false
  },
  {
    "id": "lane-roller",
    "type": "lane",
    "position": {
      "x": -100,
      "y": 1740
    },
    "data": {
      "label": "Roller",
      "index": 5,
      "height": "200px",
      "width": "6200px",
      "heightPx": 200
    },
    "selectable": true,
    "draggable": false,
    "zIndex": -1,
    "measured": {
      "width": 6200,
      "height": 200
    },
    "selected": false
  },
  {
    "id": "lane-staff",
    "type": "lane",
    "position": {
      "x": -100,
      "y": 900
    },
    "data": {
      "label": "Staff / fysisk drift",
      "index": 3,
      "height": "200px",
      "width": "6200px",
      "heightPx": 200
    },
    "selectable": true,
    "draggable": false,
    "zIndex": -1,
    "measured": {
      "width": 6200,
      "height": 200
    },
    "selected": false
  },
  {
    "id": "p_start",
    "type": "event",
    "position": {
      "x": 78.10724567520921,
      "y": 370.21016578094066
    },
    "data": {
      "label": "Besök bokas",
      "type": "start",
      "tags": [
        "main"
      ],
      "lane": "Gäst / bokare"
    },
    "measured": {
      "width": 48,
      "height": 48
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_checkout",
    "type": "task",
    "position": {
      "x": 112.7983940279997,
      "y": 1821.4443397144069
    },
    "data": {
      "label": "Roller checkout",
      "lane": "Roller",
      "tags": [
        "main"
      ],
      "note": "Bokning sker som vanligt i Roller.",
      "details": "Bokning skapas via JumpYards hemsida som idag. Pilotflödet tar vid efter att bokning finns i Roller. Rate limit: 600 req/60s (bekräftat av Roller).",
      "why": "Det minskar scope och låter piloten fokusera på check-in, inte ny checkout.",
      "systems": [
        "Roller checkout"
      ],
      "sources": [
        "Chat transfer: Fas 1"
      ]
    },
    "measured": {
      "width": 150,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_fetch",
    "type": "task",
    "position": {
      "x": 434.68103547098184,
      "y": 1436.8924173114747
    },
    "data": {
      "label": "Hämta dagens bokningar",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Ingen webhook krävs för att trigga detta.",
      "details": "JumpYard Cloud kör ett schemalagt jobb som hämtar dagens bokningar och identifierar vilka gäster som ska få länk före sin session.\n\nMåste också ha någon typ av webhook som uppdaterar om ändringar sker samma dag.",
      "why": "Ger kontroll utan att bygga beroende till realtidswebhooks.",
      "systems": [
        "JumpYard Cloud"
      ],
      "risks": [
        "Schemaläggning, felhantering och timing mot sessionstart behöver definieras."
      ],
      "sources": [
        "Chat transfer: Fas 1",
        "Designprincip: inga webhooks"
      ]
    },
    "measured": {
      "width": 203,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_sms",
    "type": "task",
    "position": {
      "x": 704.5214735243686,
      "y": 1426.8735264365284
    },
    "data": {
      "label": "Skicka SMS med check-in-länk 30 min innan",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Naturlig trigger inför besöket.",
      "details": "Gästen får en länk strax före besöket istället för att allt ska ske när de står i entrén.",
      "why": "Flyttar tid från kö till före ankomst.",
      "systems": [
        "JumpYard Cloud",
        "SMS gateway"
      ],
      "sources": [
        "Chat transfer: Fas 1",
        "Gustav 32:41-33:06"
      ]
    },
    "measured": {
      "width": 318,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_open",
    "type": "task",
    "position": {
      "x": 585.9008231398033,
      "y": 354.3794881173509
    },
    "data": {
      "label": "Öppna länken hemma, i bilen eller i entrén",
      "lane": "Gäst / bokare",
      "tags": [
        "main"
      ],
      "note": "Samma webbapp oavsett var gästen är.",
      "details": "Gästen kan genomföra check-in innan de ens kliver ur bilen. Gustav ser detta som logiskt och nära hur andra branscher gör.",
      "why": "Det är kärnskiftet från kiosk till mobil.",
      "systems": [
        "Mobil webbläsare"
      ],
      "sources": [
        "Gustav 16:40-18:24",
        "Gustav 28:51-30:16"
      ]
    },
    "measured": {
      "width": 313,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_auth",
    "type": "task",
    "position": {
      "x": 989.4851805579809,
      "y": 1435.6477713549002
    },
    "data": {
      "label": "Autentisera mot Roller",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Cloud pratar med Roller i bakgrunden.",
      "details": "API-credentials krävs för alla Roller-anrop. Sandbox/testmiljö tillgänglig (NDA kan krävas). Rate limit: 600 req/60s. Status: CRITICAL ✓",
      "why": "Nödvändig systemsäkring före bokningsuppslag.",
      "systems": [
        "OAuth2 mot Roller"
      ],
      "sources": [
        "Chat transfer: Fas 2"
      ]
    },
    "measured": {
      "width": 194,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_detail",
    "type": "task",
    "position": {
      "x": 893.5672881239332,
      "y": 1808.9559517794733
    },
    "data": {
      "label": "GET BookingDetail",
      "lane": "Roller",
      "tags": [
        "main"
      ],
      "note": "Hämtar bokning, produkter, tickets och status.",
      "details": "GET /booking/{ref} → Returnerar: gästnamn, email, produktlista, biljettantal, betalningsstatus, sessionstid. CRITICAL ✓",
      "why": "Gör att all efterföljande logik bygger på aktuell bokning.",
      "systems": [
        "Roller REST API"
      ],
      "sources": [
        "Chat transfer: Fas 2",
        "Roller verifiering"
      ]
    },
    "measured": {
      "width": 157,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_show",
    "type": "task",
    "position": {
      "x": 1228.639657512653,
      "y": 1427.724433074344
    },
    "data": {
      "label": "Hämta bokning och biljettinnehåll",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Tid, antal tickets och produkter syns för gästen.",
      "details": "Anropar GET /booking/{ref} — returnerar biljettinnehåll, produkter och status för inlösningsflödet. CRITICAL ✓"
    },
    "measured": {
      "width": 272,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_quiz",
    "type": "task",
    "position": {
      "x": 1250.5172622499506,
      "y": 363.8404010578483
    },
    "data": {
      "label": "Genomför safety quiz",
      "lane": "Gäst / bokare",
      "tags": [
        "main"
      ],
      "note": "Flyttas från bullrig entré till mobil.",
      "details": "Gästen går igenom reglerna i mobilen istället för att staff måste dra allt i desk. Gustav pekar ut reglerna som en stor tidsdel i dagens flöde.",
      "why": "Detta är troligen den största rena tidsvinsten.",
      "systems": [
        "Mobil webbapp"
      ],
      "sources": [
        "Chat transfer: Fas 2",
        "Gustav 21:39-22:13",
        "Gustav 29:43-30:16"
      ]
    },
    "measured": {
      "width": 182,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_addons",
    "type": "task",
    "position": {
      "x": 2168.4726978988797,
      "y": 308.5603974906553
    },
    "data": {
      "label": "Bekräftar/lägger till fler tillägg",
      "lane": "Gäst / bokare",
      "tags": [
        "main"
      ],
      "note": "Strumpor, band eller upplevelsepaket."
    },
    "measured": {
      "width": 265,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_products",
    "type": "task",
    "position": {
      "x": 1380.1476020706898,
      "y": 1806.6404332408993
    },
    "data": {
      "label": "GET Products + POST Booking Costs",
      "lane": "Roller",
      "tags": [
        "main"
      ],
      "note": "Pris och köpbara tillägg hämtas utan ny bokning.",
      "details": "GET /products → alla köpbara produkter med pris (CRITICAL ✓). POST /booking/costs → kostnadsberäkning utan att skapa bokning (HIGH ✓).",
      "why": "Behövs för ett trovärdigt upsellsteg innan ankomst.",
      "systems": [
        "Roller API"
      ],
      "sources": [
        "Chat transfer: Fas 2",
        "Roller verifiering"
      ]
    },
    "measured": {
      "width": 273,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_pay",
    "type": "task",
    "position": {
      "x": 2748.8591403187324,
      "y": 423.2690463157487
    },
    "data": {
      "label": "Betala tillägg",
      "lane": "Gäst / bokare",
      "tags": [
        "main"
      ],
      "note": "Tänkt via Swish eller Adyen."
    },
    "measured": {
      "width": 150,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_edit",
    "type": "task",
    "position": {
      "x": 1900.8368735774761,
      "y": 1797.5947934199883
    },
    "data": {
      "label": "PUT Edit Booking + POST Add Transaction Record",
      "lane": "Roller",
      "tags": [
        "main"
      ],
      "note": "Lägger till produkter på befintlig bokning.",
      "details": "PUT /booking/{ref} → lägger till produkter i SAMMA bokning (ej ny). POST /booking/payment → registrerar Adyen-transaktion, fungerar för initial + tillägg. CRITICAL ✓",
      "why": "Ger en sammanhållen bokningsbild i Roller i stället för sidobokningar.",
      "systems": [
        "Roller API"
      ],
      "risks": [
        "Fälten för transaktion och edge cases med partial payments behöver verifieras."
      ],
      "sources": [
        "Chat transfer: Fas 2",
        "Roller verifiering"
      ]
    },
    "measured": {
      "width": 357,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_qr",
    "type": "task",
    "position": {
      "x": 2852.0834953263156,
      "y": 1525.3887821489639
    },
    "data": {
      "label": "Generera QR och pickup-kod",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Bevis på slutförd pre-check-in.",
      "details": "När allt är klart får gästen ett tydligt kvitto i mobilen som kan visas upp direkt i parken.",
      "why": "Minskar behovet av desk-dialog vid ankomst.",
      "systems": [
        "JumpYard Cloud"
      ],
      "sources": [
        "Chat transfer: Fas 2",
        "Gustav 19:32-19:53"
      ]
    },
    "measured": {
      "width": 225,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_arrive",
    "type": "task",
    "position": {
      "x": 3222.986348796249,
      "y": 313.1138558304194
    },
    "data": {
      "label": "Anländ till park",
      "lane": "Gäst / bokare",
      "tags": [
        "main",
        "fallback"
      ],
      "note": "Nu ska flödet vara klart eller nästan klart."
    },
    "measured": {
      "width": 150,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_gate_ready",
    "type": "gateway",
    "position": {
      "x": 3442.82138416004,
      "y": 393.1680554096846
    },
    "data": {
      "label": "Pre-check-in klar?",
      "tags": [
        "main",
        "fallback"
      ],
      "lane": "Gäst / bokare"
    },
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_fallback_qr",
    "type": "task",
    "position": {
      "x": 3610.158208501825,
      "y": 314.921301242961
    },
    "data": {
      "label": "Scanna entré-QR och gör webbflöde på plats",
      "lane": "Gäst / bokare",
      "tags": [
        "fallback"
      ],
      "note": "För missad pre-check-in eller walk-in.",
      "details": "Stor QR-skylt vid entrén leder till samma webbapp. Tanken är att detta ska ta 2–3 minuter på plats.",
      "why": "Ger ett billigt och tydligt fallbacksteg utan att bygga egen kioskprodukt.",
      "systems": [
        "QR-skylt",
        "Mobil webbapp"
      ],
      "sources": [
        "Chat transfer: Fas 4"
      ]
    },
    "measured": {
      "width": 338,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_fallback_tablet",
    "type": "task",
    "position": {
      "x": 4252.499581908861,
      "y": 510.52092309580394
    },
    "data": {
      "label": "Hänvisa till tablet eller hjälp via staff",
      "lane": "Staff",
      "tags": [
        "fallback"
      ],
      "note": "För tomt batteri eller mobilproblem.",
      "details": "En enkel Android-tablet på väggfäste kör samma webbapp. Staff hjälper bara när undantag uppstår.",
      "why": "Behåller ett säkerhetsnät utan tung hårdvara.",
      "systems": [
        "Tablet",
        "Samma webbapp"
      ],
      "sources": [
        "Chat transfer: Fas 4"
      ]
    },
    "measured": {
      "width": 299,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_validate",
    "type": "task",
    "position": {
      "x": 3821.858445912168,
      "y": 1567.9116582277727
    },
    "data": {
      "label": "Validera QR eller pickup-kod",
      "lane": "JumpYard Cloud",
      "tags": [
        "main",
        "fallback"
      ],
      "note": "Molnlagret kontrollerar att gästen är redo.",
      "details": "Startar inlösningsflödet. Leder till POST /tickets/redeem per biljett-ID. Waivers: EJ AKTUELLT hos JumpYard."
    },
    "measured": {
      "width": 228,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_redeem",
    "type": "task",
    "position": {
      "x": 4570.084053141222,
      "y": 1807.9846218785744
    },
    "data": {
      "label": "POST Redeem Tickets per ticket",
      "lane": "Roller",
      "tags": [
        "main",
        "fallback",
        "risk"
      ],
      "note": "Ett anrop per ticket, inte per bokning.",
      "details": "POST /tickets/redeem — ETT anrop per biljett-ID. Status uppdateras direkt i Roller-dashboard och POS. Waivers: EJ AKTUELLT hos JumpYard. CRITICAL ✓",
      "why": "Detta är den centrala systemmarkeringen för att gästen faktiskt checkat in.",
      "systems": [
        "Roller API"
      ],
      "risks": [
        "Beslut återstår om bekräftelse ska lita på HTTP 200 eller webhook."
      ],
      "sources": [
        "Chat transfer: Fas 3",
        "Roller verifiering",
        "Gustav 13:47-14:36"
      ],
      "isPrimary": true
    },
    "measured": {
      "width": 241,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_confirm",
    "type": "task",
    "position": {
      "x": 4930,
      "y": 1370
    },
    "data": {
      "label": "Visa klar-bekräftelse till gäst",
      "lane": "JumpYard Cloud",
      "tags": [
        "main",
        "fallback"
      ],
      "note": "Kan bygga på HTTP 200 eller webhook.",
      "details": "Bekräftelse via webhook som triggas vid ticket check-in (ingen direkt GET-endpoint för check-in-status). HIGH ✓ Arkitekturbeslut: HTTP 200 vs webhook ticket.redeemed.",
      "why": "Minskar osäkerhet i entrén och ger bra UX.",
      "systems": [
        "JumpYard Cloud"
      ],
      "risks": [
        "Arkitekturbeslut kvarstår: HTTP 200 eller webhook ticket.redeemed."
      ],
      "sources": [
        "Chat transfer: Fas 3"
      ]
    },
    "measured": {
      "width": 243,
      "height": 63
    }
  },
  {
    "id": "p_exception",
    "type": "task",
    "position": {
      "x": 4930,
      "y": 550
    },
    "data": {
      "label": "Hantera undantag",
      "lane": "Staff",
      "tags": [
        "fallback",
        "risk"
      ],
      "note": "Fel bokning, byte på plats, familjefrågor, betalningstrassel.",
      "details": "Designprincipen är zero-ops i normalfallet, men staff ska fortfarande kunna kliva in när något går fel eller behöver ändras.",
      "why": "Operativ robusthet är viktigare än ren teknisk elegans.",
      "systems": [
        "Desk",
        "Staff judgement"
      ],
      "risks": [
        "Vad staff faktiskt behöver kunna overridea måste definieras i pilot scope."
      ],
      "sources": [
        "Chat transfer: Fas 3 och 4",
        "Gustav 22:23-23:50"
      ],
      "isPrimary": true
    },
    "measured": {
      "width": 161,
      "height": 63
    }
  },
  {
    "id": "p_pickup",
    "type": "task",
    "position": {
      "x": 3985.158020398165,
      "y": 376.071190987262
    },
    "data": {
      "label": "Hämta strumpor, band och ev. skåpkod",
      "lane": "Gäst / bokare",
      "tags": [
        "main",
        "fallback",
        "risk"
      ],
      "note": "Kan vara dispenser, staff eller bandstation beroende på produkt.",
      "details": "Normalambitionen är self-service för lågvärdesartiklar och att interaktivt band hämtas längre in i parken. Samtidigt är detta enligt Gustav den fysiskt svåraste delen.",
      "why": "Detta är den verkliga operationsfrågan i piloten.",
      "systems": [
        "Strumpdispenser",
        "Bandstation",
        "Skåpkod i app"
      ],
      "risks": [
        "Fysisk identifikation och bandlogik behöver valideras i Nacka innan något spikas."
      ],
      "sources": [
        "Chat transfer: Fas 3",
        "Gustav 31:03-31:53"
      ],
      "isPrimary": true
    },
    "measured": {
      "width": 297,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_enter",
    "type": "event",
    "position": {
      "x": 4453.405512902078,
      "y": 394.3081326352251
    },
    "data": {
      "label": "Inne i park",
      "type": "end",
      "tags": [
        "main",
        "fallback"
      ],
      "lane": "Gäst / bokare"
    },
    "measured": {
      "width": 48,
      "height": 48
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774362955070",
    "type": "task",
    "position": {
      "x": 238.66484473562423,
      "y": 345.76762428798077
    },
    "data": {
      "label": "Får en bokningsbekräftelse på mailen",
      "lane": "Gäst / bokare",
      "details": "Bokaren får en bekräftelse på mailen. Ska fylla i mer när jag vet mer efter att jag testat att genomföra bokningen. "
    },
    "zIndex": 0,
    "measured": {
      "width": 288,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "event-1774363065428",
    "type": "event",
    "position": {
      "x": 268.6562261761077,
      "y": 1580.024188538596
    },
    "data": {
      "label": "Start",
      "type": "start",
      "tags": [
        "main"
      ],
      "lane": "JumpYard Cloud"
    },
    "measured": {
      "width": 48,
      "height": 48
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "lane-1774363146332",
    "type": "lane",
    "position": {
      "x": -100,
      "y": 600
    },
    "data": {
      "label": "Telefon/Webapp",
      "index": 1,
      "height": "200px",
      "width": "6200px",
      "heightPx": 200
    },
    "selectable": true,
    "draggable": false,
    "zIndex": -1,
    "measured": {
      "width": 6200,
      "height": 200
    },
    "selected": false
  },
  {
    "id": "task-1774363230807",
    "type": "task",
    "position": {
      "x": 895.3223701574356,
      "y": 659.563868473078
    },
    "data": {
      "label": "VY: Visa bokningssammanställning",
      "lane": "Telefon/Webapp",
      "details": "Vyn visar sammanställning av bokningen. \n\n-  Bokningstyp (30, 60, 90 min), kalas osv\n- Antal personer\n- Antal strumpor\n- Antal hänglås\n- Antal skyride\n- NY: antal smart band"
    },
    "zIndex": 0,
    "measured": {
      "width": 271,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774363625121",
    "type": "task",
    "position": {
      "x": 889.7566187275049,
      "y": 354.8634768905458
    },
    "data": {
      "label": "Bekräftar bokning och påbörjar check in flöde",
      "lane": "Gäst / bokare"
    },
    "zIndex": 0,
    "measured": {
      "width": 354,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "event-1774363811343",
    "type": "event",
    "position": {
      "x": 540.3701218246081,
      "y": 374.8345489937483
    },
    "data": {
      "label": "Start",
      "type": "start",
      "tags": [
        "main"
      ]
    },
    "measured": {
      "width": 48,
      "height": 48
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774363862680",
    "type": "task",
    "position": {
      "x": 1159.9226850817515,
      "y": 659.3778559847804
    },
    "data": {
      "label": "VY: se video och gör quiz/bekräfta regler",
      "lane": "Telefon/Webapp"
    },
    "zIndex": 0,
    "measured": {
      "width": 314,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774363936314",
    "type": "task",
    "position": {
      "x": 1450.9826110952274,
      "y": 667.4966933376581
    },
    "data": {
      "label": "Vy: connected experience",
      "lane": "Telefon/Webapp",
      "details": "Besökaren kan snabbt förstå vad connected experience är och lägga till det som produkt"
    },
    "zIndex": 0,
    "measured": {
      "width": 208,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gateway-1774364277458",
    "type": "gateway",
    "position": {
      "x": 1772.5797596147681,
      "y": 666.7288223161438
    },
    "data": {
      "label": "Väljer connected exp.",
      "lane": "Telefon/Webapp"
    },
    "zIndex": 0,
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774364407309",
    "type": "task",
    "position": {
      "x": 2039.6086193385645,
      "y": 608.9067217767182
    },
    "data": {
      "label": "VY: Registrera användare",
      "lane": "Telefon/Webapp"
    },
    "zIndex": 0,
    "measured": {
      "width": 206,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774364456446",
    "type": "task",
    "position": {
      "x": 1886.3374671794843,
      "y": 412.21967092870096
    },
    "data": {
      "label": "Fyller i namn och väljer profil för connected exp",
      "lane": "Gäst / bokare"
    },
    "zIndex": 0,
    "measured": {
      "width": 368,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gateway-1774364463993",
    "type": "gateway",
    "position": {
      "x": 1579.398225561956,
      "y": 361.93154588801457
    },
    "data": {
      "label": "Väljer connected exp",
      "lane": "Gäst / bokare"
    },
    "zIndex": 0,
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774364557434",
    "type": "task",
    "position": {
      "x": 2303.4343499112338,
      "y": 724.5264421700257
    },
    "data": {
      "label": "Vy: Se/lägg till tillägg ",
      "lane": "Telefon/Webapp"
    },
    "zIndex": 0,
    "measured": {
      "width": 188,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774364802923",
    "type": "task",
    "position": {
      "x": 2868.3105714866783,
      "y": 717.4086189693272
    },
    "data": {
      "label": "VY: betalning",
      "lane": "Telefon/Webapp"
    },
    "zIndex": 0,
    "measured": {
      "width": 150,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gateway-1774364906161",
    "type": "gateway",
    "position": {
      "x": 2616.158107884004,
      "y": 669.1995680611512
    },
    "data": {
      "label": "Lagt till produkter?",
      "lane": "Telefon/Webapp"
    },
    "zIndex": 0,
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gateway-1774366597002",
    "type": "gateway",
    "position": {
      "x": 2551.500414710923,
      "y": 369.16484273239536
    },
    "data": {
      "label": "Belopp att betala",
      "lane": "Gäst / bokare"
    },
    "zIndex": 0,
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774366692118",
    "type": "task",
    "position": {
      "x": 2857.175939703995,
      "y": 311.0970788137184
    },
    "data": {
      "label": "Få bekräftelse screen",
      "lane": "Gäst / bokare"
    },
    "zIndex": 0,
    "measured": {
      "width": 185,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774366805300",
    "type": "task",
    "position": {
      "x": 3063.7405268155735,
      "y": 700.9610875152553
    },
    "data": {
      "label": "vy: bekräftese med qr/kod och kvitto på vad som ska lämans ut",
      "lane": "Telefon/Webapp"
    },
    "zIndex": 0,
    "measured": {
      "width": 458,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "event-1774538339428",
    "type": "event",
    "position": {
      "x": 3373.1852284562738,
      "y": 689.6333189204474
    },
    "data": {
      "label": "Slut",
      "type": "end",
      "tags": [
        "main"
      ],
      "lane": "Telefon/Webapp"
    },
    "measured": {
      "width": 48,
      "height": 48
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "pool-1774538448928",
    "type": "pool",
    "position": {
      "x": -280,
      "y": -20
    },
    "data": {
      "label": "Kioskvy",
      "color": "#888888",
      "heightPx": 240,
      "widthPx": 6600
    },
    "selectable": false,
    "draggable": false,
    "zIndex": -2,
    "measured": {
      "width": 6600,
      "height": 240
    }
  },
  {
    "id": "task-1774540254006",
    "type": "task",
    "position": {
      "x": 1662.5491280197741,
      "y": 1489.9638712638557
    },
    "data": {
      "label": "Lägg till produkt connected experience",
      "lane": "JumpYard Cloud",
      "details": "Lägger kunden till connected experience registreras det"
    },
    "zIndex": 0,
    "measured": {
      "width": 220,
      "height": 80
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gateway-1774540476761",
    "type": "gateway",
    "position": {
      "x": 1542.0514703109866,
      "y": 1429.7140625432223
    },
    "data": {
      "label": "Connect exp tillagt",
      "lane": "JumpYard Cloud"
    },
    "zIndex": 0,
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774540749875",
    "type": "task",
    "position": {
      "x": 1963.631408409245,
      "y": 1490.3852829022485
    },
    "data": {
      "label": "Skapa profiler för connect exp",
      "lane": "Gäst"
    },
    "zIndex": 0,
    "measured": {
      "width": 220,
      "height": 80
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "task-1774540886375",
    "type": "task",
    "position": {
      "x": 2444.307581313223,
      "y": 1533.4485469036351
    },
    "data": {
      "label": "Lägg till tillägg",
      "lane": "JumpYard Cloud",
      "details": "Lägg till produkter"
    },
    "zIndex": 0,
    "measured": {
      "width": 146,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gateway-1774540908267",
    "type": "gateway",
    "position": {
      "x": 2286.6002628434385,
      "y": 1435.9672923276871
    },
    "data": {
      "label": "Nya tillägg?",
      "lane": "Gäst"
    },
    "zIndex": 0,
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "database-1774541294048",
    "type": "database",
    "position": {
      "x": 1104.4611287060372,
      "y": 1633.8005556409262
    },
    "data": {
      "label": "Dagens bokningar",
      "lane": "JumpYard Cloud"
    },
    "zIndex": 0,
    "measured": {
      "width": 158,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "database-1774541384996",
    "type": "database",
    "position": {
      "x": 1540.3775212960381,
      "y": 1582.9314247563614
    },
    "data": {
      "label": "Products",
      "lane": "JumpYard Cloud"
    },
    "zIndex": 0,
    "measured": {
      "width": 150,
      "height": 63
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "database-1774541490838",
    "type": "database",
    "position": {
      "x": 2091.894336447015,
      "y": 1587.7936863838734
    },
    "data": {
      "label": "Connected Experience Users",
      "lane": "JumpYard Cloud"
    },
    "zIndex": 0,
    "measured": {
      "width": 228,
      "height": 63
    },
    "selected": false,
    "dragging": false
  }
] as any[];

export const pilotEdges = [
  {
    "id": "e-fallback-qr-validate",
    "source": "p_fallback_qr",
    "target": "p_validate",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    }
  },
  {
    "id": "e-fallback-qr-tablet",
    "source": "p_fallback_qr",
    "target": "p_fallback_tablet",
    "label": "mobilproblem",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    }
  },
  {
    "id": "e-tablet-validate",
    "source": "p_fallback_tablet",
    "target": "p_validate",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    },
    "selected": false
  },
  {
    "id": "e-confirm-pickup",
    "source": "p_confirm",
    "target": "p_pickup",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    }
  },
  {
    "id": "e-exception-pickup",
    "source": "p_exception",
    "target": "p_pickup",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    }
  },
  {
    "type": "smoothstep",
    "data": {
      "edgeStyle": "data"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "p_auth",
    "target": "p_detail",
    "sourceHandle": "bottom",
    "targetHandle": "left",
    "id": "xy-edge__p_authbottom-p_detailleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_gate_ready",
    "target": "p_fallback_qr",
    "label": "nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "id": "xy-edge__p_gate_readytop-p_fallback_qr",
    "sourceHandle": "top",
    "targetHandle": null,
    "selected": false
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_arrive",
    "target": "p_gate_ready",
    "sourceHandle": "bottom",
    "targetHandle": "left",
    "id": "xy-edge__p_arrivebottom-p_gate_readyleft"
  },
  {
    "type": "smoothstep",
    "data": {
      "edgeStyle": "data"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "p_validate",
    "target": "p_redeem",
    "sourceHandle": "bottom",
    "targetHandle": "bottom",
    "id": "xy-edge__p_validatebottom-p_redeembottom"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    },
    "source": "p_redeem",
    "target": "p_exception",
    "label": "fel / ändring",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "id": "xy-edge__p_redeemtop-p_exception",
    "sourceHandle": "top",
    "targetHandle": null
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_redeem",
    "target": "p_confirm",
    "id": "xy-edge__p_redeemtop-p_confirm",
    "sourceHandle": "top",
    "targetHandle": null
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_pickup",
    "target": "p_enter",
    "id": "xy-edge__p_pickupright-p_enter",
    "sourceHandle": "right",
    "targetHandle": null
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "data": {
      "edgeStyle": "data"
    },
    "source": "p_start",
    "target": "p_checkout",
    "selected": false,
    "sourceHandle": "left",
    "targetHandle": null,
    "id": "xy-edge__p_startleft-p_checkout"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_start",
    "sourceHandle": "right",
    "target": "task-1774362955070",
    "targetHandle": "left",
    "id": "xy-edge__p_startright-task-1774362955070left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_fetch",
    "target": "p_sms",
    "id": "xy-edge__p_fetchright-p_sms",
    "sourceHandle": "right",
    "targetHandle": null,
    "selected": false,
    "data": {
      "edgeStyle": "solid"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "event-1774363065428",
    "sourceHandle": "right",
    "target": "p_fetch",
    "targetHandle": "left",
    "id": "xy-edge__event-1774363065428right-p_fetchleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "p_sms",
    "target": "p_open",
    "sourceHandle": "top",
    "targetHandle": "bottom",
    "id": "xy-edge__p_smstop-p_openbottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774362955070",
    "sourceHandle": "right",
    "target": "p_open",
    "targetHandle": "left",
    "id": "xy-edge__task-1774362955070right-p_openleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_sms",
    "sourceHandle": "right",
    "target": "p_auth",
    "targetHandle": "left",
    "id": "xy-edge__p_smsright-p_authleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "p_show",
    "sourceHandle": "top",
    "target": "task-1774363230807",
    "targetHandle": "bottom",
    "id": "xy-edge__p_showtop-task-1774363230807bottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_auth",
    "sourceHandle": "right",
    "target": "p_show",
    "targetHandle": "left",
    "id": "xy-edge__p_authright-p_showleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774363625121",
    "sourceHandle": "right",
    "target": "p_quiz",
    "targetHandle": "left",
    "id": "xy-edge__task-1774363625121right-p_quizleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_open",
    "sourceHandle": "right",
    "target": "task-1774363625121",
    "targetHandle": "left",
    "id": "xy-edge__p_openright-task-1774363625121left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774363230807",
    "sourceHandle": "top",
    "target": "task-1774363625121",
    "targetHandle": "bottom",
    "id": "xy-edge__task-1774363230807top-task-1774363625121bottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "event-1774363811343",
    "sourceHandle": "right",
    "target": "task-1774363230807",
    "targetHandle": "left",
    "id": "xy-edge__event-1774363811343right-task-1774363230807left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774363230807",
    "sourceHandle": "right",
    "target": "task-1774363862680",
    "targetHandle": "left",
    "id": "xy-edge__task-1774363230807right-task-1774363862680left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774363862680",
    "sourceHandle": "top",
    "target": "p_quiz",
    "targetHandle": "bottom",
    "id": "xy-edge__task-1774363862680top-p_quizbottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774363862680",
    "sourceHandle": "right",
    "target": "task-1774363936314",
    "targetHandle": "left",
    "id": "xy-edge__task-1774363862680right-task-1774363936314left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774363936314",
    "sourceHandle": "right",
    "target": "gateway-1774364277458",
    "targetHandle": "left",
    "id": "xy-edge__task-1774363936314right-gateway-1774364277458left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_quiz",
    "sourceHandle": "right",
    "target": "gateway-1774364463993",
    "targetHandle": "left",
    "id": "xy-edge__p_quizright-gateway-1774364463993left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774364456446",
    "sourceHandle": "bottom",
    "target": "task-1774364407309",
    "targetHandle": "top",
    "id": "xy-edge__task-1774364456446bottom-task-1774364407309top",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774364407309",
    "sourceHandle": "right",
    "target": "task-1774364557434",
    "targetHandle": "top",
    "id": "xy-edge__task-1774364407309right-task-1774364557434top"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774364557434",
    "sourceHandle": "right",
    "target": "p_addons",
    "targetHandle": "bottom",
    "id": "xy-edge__task-1774364557434right-p_addonsbottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774364802923",
    "sourceHandle": "top",
    "target": "p_pay",
    "targetHandle": "bottom",
    "id": "xy-edge__task-1774364802923top-p_paybottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774364557434",
    "sourceHandle": "right",
    "target": "gateway-1774364906161",
    "targetHandle": "left",
    "id": "xy-edge__task-1774364557434right-gateway-1774364906161left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_addons",
    "sourceHandle": "right",
    "target": "gateway-1774366597002",
    "targetHandle": "left",
    "id": "xy-edge__p_addonsright-gateway-1774366597002left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_pay",
    "sourceHandle": "right",
    "target": "task-1774366692118",
    "targetHandle": "bottom",
    "id": "xy-edge__p_payright-task-1774366692118bottom"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774364802923",
    "sourceHandle": "right",
    "target": "task-1774366805300",
    "targetHandle": "left",
    "id": "xy-edge__task-1774364802923right-task-1774366805300left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "p_qr",
    "sourceHandle": "top",
    "target": "task-1774366805300",
    "targetHandle": "bottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    },
    "id": "xy-edge__p_qrtop-task-1774366805300bottom"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774366692118",
    "sourceHandle": "right",
    "target": "p_arrive",
    "targetHandle": "left",
    "id": "xy-edge__task-1774366692118right-p_arriveleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "p_checkout",
    "sourceHandle": "top",
    "target": "task-1774362955070",
    "targetHandle": "bottom",
    "id": "xy-edge__p_checkouttop-task-1774362955070bottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774364463993",
    "sourceHandle": "bottom",
    "target": "task-1774364456446",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774364463993bottom-task-1774364456446left",
    "selected": false,
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774363936314",
    "sourceHandle": "top",
    "target": "gateway-1774364463993",
    "targetHandle": "bottom",
    "id": "xy-edge__task-1774363936314top-gateway-1774364463993bottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774364277458",
    "sourceHandle": "top",
    "target": "task-1774364407309",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774364277458top-task-1774364407309left",
    "selected": false,
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774364277458",
    "sourceHandle": "bottom",
    "target": "task-1774364557434",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774364277458bottom-task-1774364557434left",
    "selected": false,
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774364463993",
    "sourceHandle": "top",
    "target": "p_addons",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774364463993top-p_addonsleft",
    "selected": false,
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774364456446",
    "sourceHandle": "right",
    "target": "p_addons",
    "targetHandle": "bottom",
    "id": "xy-edge__task-1774364456446right-p_addonsbottom"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774364906161",
    "sourceHandle": "bottom",
    "target": "task-1774364802923",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774364906161bottom-task-1774364802923left",
    "selected": false,
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774366597002",
    "sourceHandle": "bottom",
    "target": "p_pay",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774366597002bottom-p_payleft",
    "selected": false,
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774366597002",
    "sourceHandle": "top",
    "target": "task-1774366692118",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774366597002top-task-1774366692118left",
    "selected": false,
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_gate_ready",
    "sourceHandle": "bottom",
    "target": "p_pickup",
    "targetHandle": "left",
    "id": "xy-edge__p_gate_readybottom-p_pickupleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774364906161",
    "sourceHandle": "top",
    "target": "task-1774366805300",
    "targetHandle": "top",
    "id": "xy-edge__gateway-1774364906161top-task-1774366805300top",
    "selected": false,
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774366805300",
    "sourceHandle": "right",
    "target": "event-1774538339428",
    "targetHandle": "left",
    "id": "xy-edge__task-1774366805300right-event-1774538339428left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774540254006",
    "sourceHandle": "bottom",
    "target": "task-1774540318120",
    "targetHandle": "top",
    "id": "xy-edge__task-1774540254006bottom-task-1774540318120top",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774540476761",
    "sourceHandle": "bottom",
    "target": "task-1774540254006",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774540476761bottom-task-1774540254006left",
    "selected": false,
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774540254006",
    "sourceHandle": "right",
    "target": "task-1774540749875",
    "targetHandle": "left",
    "id": "xy-edge__task-1774540254006right-task-1774540749875left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_show",
    "sourceHandle": "right",
    "target": "gateway-1774540476761",
    "targetHandle": "left",
    "id": "xy-edge__p_showright-gateway-1774540476761left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774364407309",
    "sourceHandle": "bottom",
    "target": "task-1774540749875",
    "targetHandle": "top",
    "id": "xy-edge__task-1774364407309bottom-task-1774540749875top",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774540749875",
    "sourceHandle": "right",
    "target": "gateway-1774540908267",
    "targetHandle": "left",
    "id": "xy-edge__task-1774540749875right-gateway-1774540908267left"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774540476761",
    "sourceHandle": "top",
    "target": "gateway-1774540908267",
    "targetHandle": "top",
    "id": "xy-edge__gateway-1774540476761top-gateway-1774540908267top",
    "selected": false,
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774540908267",
    "sourceHandle": "bottom",
    "target": "task-1774540886375",
    "targetHandle": "left",
    "id": "xy-edge__gateway-1774540908267bottom-task-1774540886375left",
    "selected": false,
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "task-1774540886375",
    "sourceHandle": "right",
    "target": "p_qr",
    "targetHandle": "left",
    "id": "xy-edge__task-1774540886375right-p_qrleft"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "database-1774541294048",
    "sourceHandle": "left",
    "target": "p_fetch",
    "targetHandle": "bottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    },
    "id": "xy-edge__database-1774541294048left-p_fetchbottom"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "database-1774541294048",
    "sourceHandle": "right",
    "target": "p_detail",
    "targetHandle": "left",
    "id": "xy-edge__database-1774541294048right-p_detailleft",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "p_show",
    "sourceHandle": "bottom",
    "target": "database-1774541294048",
    "targetHandle": "right",
    "id": "xy-edge__p_showbottom-database-1774541294048right",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "database-1774541384996",
    "sourceHandle": "right",
    "target": "task-1774540254006",
    "targetHandle": "bottom",
    "id": "xy-edge__database-1774541384996right-task-1774540254006bottom",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774540749875",
    "sourceHandle": "bottom",
    "target": "database-1774541490838",
    "targetHandle": "left",
    "id": "xy-edge__task-1774540749875bottom-database-1774541490838left",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gateway-1774540908267",
    "sourceHandle": "right",
    "target": "p_qr",
    "targetHandle": "top",
    "selected": false,
    "id": "xy-edge__gateway-1774540908267right-p_qrtop",
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "task-1774540886375",
    "sourceHandle": "bottom",
    "target": "database-1774541294048",
    "targetHandle": "right",
    "id": "xy-edge__task-1774540886375bottom-database-1774541294048right",
    "selected": true,
    "data": {
      "edgeStyle": "data"
    }
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "data": {
      "edgeStyle": "data"
    },
    "source": "p_edit",
    "target": "database-1774541294048",
    "sourceHandle": "top",
    "targetHandle": "right",
    "id": "xy-edge__p_edittop-database-1774541294048right"
  },
  {
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "p_products",
    "sourceHandle": "top",
    "target": "database-1774541384996",
    "targetHandle": "left",
    "selected": false,
    "data": {
      "edgeStyle": "data"
    },
    "id": "xy-edge__p_productstop-database-1774541384996left"
  }
] as any[];

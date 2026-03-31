// Auto-generated — do not edit by hand
export const pilotNodes = [
  {
    "id": "pool-guest",
    "type": "pool",
    "position": {
      "x": 56,
      "y": 0
    },
    "data": {
      "label": "Gäst",
      "color": "#f59e0b",
      "widthPx": 4600,
      "heightPx": 170
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -3,
    "measured": {
      "width": 4600,
      "height": 170
    }
  },
  {
    "id": "pool-staff",
    "type": "pool",
    "position": {
      "x": 56,
      "y": 210
    },
    "data": {
      "label": "Staff / parkpersonal",
      "color": "#fb7185",
      "widthPx": 4600,
      "heightPx": 180
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -3,
    "measured": {
      "width": 4600,
      "height": 180
    }
  },
  {
    "id": "pool-webapp",
    "type": "pool",
    "position": {
      "x": 56,
      "y": 430
    },
    "data": {
      "label": "WebApp",
      "color": "#38bdf8",
      "widthPx": 4600,
      "heightPx": 300
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -3,
    "measured": {
      "width": 4600,
      "height": 300
    }
  },
  {
    "id": "pool-cloud",
    "type": "pool",
    "position": {
      "x": 56,
      "y": 790
    },
    "data": {
      "label": "JumpYard Cloud",
      "color": "#22c55e",
      "widthPx": 4600,
      "heightPx": 410
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -3,
    "measured": {
      "width": 4600,
      "height": 410
    }
  },
  {
    "id": "pool-roller",
    "type": "pool",
    "position": {
      "x": 56,
      "y": 1250
    },
    "data": {
      "label": "Roller",
      "color": "#8b5cf6",
      "widthPx": 4600,
      "heightPx": 170
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -3,
    "measured": {
      "width": 4600,
      "height": 170
    }
  },
  {
    "id": "lane-guest",
    "type": "lane",
    "position": {
      "x": 56,
      "y": 0
    },
    "data": {
      "label": "Gäst",
      "width": "4600px",
      "heightPx": 170,
      "index": 0,
      "poolId": "pool-guest"
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -2,
    "measured": {
      "width": 4600,
      "height": 170
    },
    "selected": true
  },
  {
    "id": "lane-staff",
    "type": "lane",
    "position": {
      "x": 56,
      "y": 210
    },
    "data": {
      "label": "Staff / parkpersonal",
      "width": "4600px",
      "heightPx": 180,
      "index": 1,
      "poolId": "pool-staff"
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -2,
    "measured": {
      "width": 4600,
      "height": 180
    },
    "selected": true
  },
  {
    "id": "lane-webapp",
    "type": "lane",
    "position": {
      "x": 56,
      "y": 430
    },
    "data": {
      "label": "WebApp",
      "width": "4600px",
      "heightPx": 300,
      "index": 2,
      "poolId": "pool-webapp"
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -2,
    "measured": {
      "width": 4600,
      "height": 300
    },
    "selected": true
  },
  {
    "id": "lane-cloud-ops",
    "type": "lane",
    "position": {
      "x": 56,
      "y": 1070
    },
    "data": {
      "label": "Ops jobs",
      "width": "4600px",
      "heightPx": 130,
      "index": 4,
      "poolId": "pool-cloud"
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -2,
    "measured": {
      "width": 4600,
      "height": 130
    },
    "selected": true
  },
  {
    "id": "lane-cloud-aws",
    "type": "lane",
    "position": {
      "x": 56,
      "y": 790
    },
    "data": {
      "label": "AWS + Aurora",
      "width": "4600px",
      "heightPx": 280,
      "index": 3,
      "poolId": "pool-cloud"
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -2,
    "measured": {
      "width": 4600,
      "height": 280
    },
    "selected": true
  },
  {
    "id": "lane-roller",
    "type": "lane",
    "position": {
      "x": 56,
      "y": 1250
    },
    "data": {
      "label": "Roller API",
      "width": "4600px",
      "heightPx": 170,
      "index": 5,
      "poolId": "pool-roller"
    },
    "draggable": true,
    "selectable": true,
    "zIndex": -2,
    "measured": {
      "width": 4600,
      "height": 170
    },
    "selected": true
  },
  {
    "id": "guest-start",
    "type": "event",
    "position": {
      "x": 140,
      "y": 58
    },
    "data": {
      "label": "Bokning skapad",
      "type": "start",
      "lane": "Gäst",
      "details": "Piloten startar när en bokning redan finns.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 48,
      "height": 48
    }
  },
  {
    "id": "guest-open",
    "type": "task",
    "position": {
      "x": 240,
      "y": 46
    },
    "data": {
      "label": "Check-in startar",
      "lane": "Gäst",
      "details": "Gästen går in i check-in-flödet via länk, QR eller kiosk.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 151,
      "height": 43
    }
  },
  {
    "id": "guest-review",
    "type": "task",
    "position": {
      "x": 470,
      "y": 46
    },
    "data": {
      "label": "Granska bokning",
      "lane": "Gäst",
      "details": "Gästen ser bokning, deltagare och vad som redan ingår.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 150,
      "height": 43
    }
  },
  {
    "id": "guest-safety",
    "type": "task",
    "position": {
      "x": 720,
      "y": 46
    },
    "data": {
      "label": "Slutför safety",
      "lane": "Gäst",
      "details": "Safety slutförs innan bekräftelse och handoff.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 136,
      "height": 43
    }
  },
  {
    "id": "guest-addons",
    "type": "task",
    "position": {
      "x": 980,
      "y": 46
    },
    "data": {
      "label": "Välj tillägg och connected",
      "lane": "Gäst",
      "details": "Samma huvudsteg oavsett om gästen kommer via mobil eller kiosk.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 221,
      "height": 43
    }
  },
  {
    "id": "guest-pay",
    "type": "task",
    "position": {
      "x": 1280,
      "y": 46
    },
    "data": {
      "label": "Betala vid behov",
      "lane": "Gäst",
      "details": "Hoppas över när totalen är 0 efter tillägg och connected-val.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 144,
      "height": 43
    }
  },
  {
    "id": "guest-confirm",
    "type": "task",
    "position": {
      "x": 1540,
      "y": 46
    },
    "data": {
      "label": "Se bekräftelse + QR + kod",
      "lane": "Gäst",
      "details": "Bekräftelsen används sedan vid handoff hos staff.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 199,
      "height": 43
    }
  },
  {
    "id": "guest-arrive",
    "type": "task",
    "position": {
      "x": 2475.0178887326174,
      "y": 48.027919160162895
    },
    "data": {
      "label": "Anländ till staff",
      "lane": "Gäst",
      "details": "Piloten avslutas inte i self-service. Staff tar över sista steget.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 148,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "guest-present",
    "type": "task",
    "position": {
      "x": 3953.8013797141098,
      "y": 53.96218399010161
    },
    "data": {
      "label": "Visa QR-kod eller bokningskod hos staff",
      "lane": "Gäst",
      "details": "Det här är gästens sista steg före utlämning och bandkoppling.",
      "givesGuest": [
        "Tydlig QR-kod",
        "Kort bokningskod som reservväg"
      ],
      "staffVerifies": [
        "QR-kod",
        "Bokningskod"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 230,
      "height": 60
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "guest-end",
    "type": "event",
    "position": {
      "x": 4316.703798772467,
      "y": 47.77992718325875
    },
    "data": {
      "label": "Redo för park",
      "type": "end",
      "lane": "Gäst",
      "details": "Parkresan fortsätter efter att staff har slutfört handoff.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 48,
      "height": 48
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-start",
    "type": "task",
    "position": {
      "x": 182.96501715033222,
      "y": 532.7307753545732
    },
    "data": {
      "label": "VY: Start / länk",
      "lane": "WebApp",
      "details": "Gemensam ingång för mobil PWA och kiosk på plats.",
      "reads": [
        "checkin_token",
        "channel_hint",
        "venue context"
      ],
      "shownWhen": [
        "SMS-länk öppnas",
        "QR-kod vid park skannas",
        "Kiosk startas på plats"
      ],
      "givesGuest": [
        "Tydlig startpunkt för samma check-in-flöde"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 136,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gw-channel",
    "type": "gateway",
    "position": {
      "x": 390.650330722228,
      "y": 522.1014024983649
    },
    "data": {
      "label": "Kanal?",
      "lane": "WebApp",
      "details": "Kanalvalet sker tidigt. Därefter är huvudflödet gemensamt.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-mobile",
    "type": "task",
    "position": {
      "x": 539.7148957064657,
      "y": 472.77529911068615
    },
    "data": {
      "label": "Mobil i telefonens PWA",
      "lane": "WebApp",
      "details": "Mobilspåret avgör om gästen kommer via personlig SMS-länk eller parkens allmänna QR.",
      "shownWhen": [
        "Gästen använder egen telefon"
      ],
      "skippedWhen": [
        "Gästen väljer kiosk på plats"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 185,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gw-mobile-entry",
    "type": "gateway",
    "position": {
      "x": 789.4793473592185,
      "y": 462.77092613206344
    },
    "data": {
      "label": "Öppnad via?",
      "lane": "WebApp",
      "details": "SMS-länk med token går direkt in i bokningen. Park-QR går via en allmän sida och sedan lookup.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-onsite",
    "type": "task",
    "position": {
      "x": 929.5544388181429,
      "y": 472.32023919061754
    },
    "data": {
      "label": "Park-QR / allmän sida",
      "lane": "WebApp",
      "details": "Publik startsida från parkens QR där gästen kan välja att hitta befintlig bokning eller köpa på plats.",
      "reads": [
        "venue context",
        "channel = park_qr"
      ],
      "shownWhen": [
        "Park-QR öppnas i mobilen"
      ],
      "skippedWhen": [
        "SMS-länk med token används"
      ],
      "givesGuest": [
        "Tydlig start med val mellan befintlig bokning och köp på plats"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 178,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "kiosk-entry",
    "type": "task",
    "position": {
      "x": 541.2500154241886,
      "y": 599.5000004896567
    },
    "data": {
      "label": "Kiosk på plats",
      "lane": "WebApp",
      "details": "Kiosk är en alternativ ingång till samma WebApp-flöde.",
      "shownWhen": [
        "Gästen väljer kiosk i parken"
      ],
      "skippedWhen": [
        "Gästen använder egen telefon"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 129,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gw-kiosk-existing",
    "type": "gateway",
    "position": {
      "x": 837.6581586472229,
      "y": 589.4084365160055
    },
    "data": {
      "label": "Har du befintlig bokning?",
      "lane": "WebApp",
      "details": "Delad gateway för Park-QR och kiosk: antingen hitta befintlig bokning eller köpa på plats.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "kiosk-lookup",
    "type": "task",
    "position": {
      "x": 1001.7955369660431,
      "y": 557.4186592465851
    },
    "data": {
      "label": "Hitta befintlig bokning",
      "lane": "WebApp",
      "details": "Gemensam lookup för mobil via Park-QR och kiosk med befintlig bokning.",
      "reads": [
        "booking_ref",
        "telefon + efternamn",
        "QR-matchning"
      ],
      "shownWhen": [
        "Park-QR öppnas i mobilen",
        "Kiosk används och gästen redan har bokning"
      ],
      "skippedWhen": [
        "SMS-länk med token går direkt till bokningen"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 190,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "kiosk-buy",
    "type": "task",
    "position": {
      "x": 1124.5748650055932,
      "y": 661.9740546958573
    },
    "data": {
      "label": "Köp biljett på plats",
      "lane": "WebApp",
      "details": "Det här är kioskens huvudsakliga avvikelse från mobilflödet.",
      "writes": [
        "walk_in_purchase",
        "nya deltagare",
        "provisorisk operativ state"
      ],
      "shownWhen": [
        "Kiosk används och ingen befintlig bokning hittas"
      ],
      "givesGuest": [
        "Ny bokning som går vidare in i samma check-in-flöde"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 165,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-booking",
    "type": "task",
    "position": {
      "x": 1347.6849833160136,
      "y": 558.320451923705
    },
    "data": {
      "label": "VY: Bokning & deltagare",
      "lane": "WebApp",
      "details": "Gemensamt huvudsteg för både mobil och kiosk efter att bokningen är identifierad.",
      "reads": [
        "bokningssammanfattning",
        "deltagare",
        "produkter",
        "betalningsstatus"
      ],
      "shownWhen": [
        "Bokning finns eller har skapats"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 192,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-safety",
    "type": "task",
    "position": {
      "x": 1689.9999882482357,
      "y": 557.9999998041372
    },
    "data": {
      "label": "VY: Safety",
      "lane": "WebApp",
      "details": "Samma safetysteg oavsett kanal.",
      "writes": [
        "safety_status",
        "safety_completed_at"
      ],
      "givesGuest": [
        "Klart safety-läge inför resten av check-in-resan"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 102,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-addons",
    "type": "task",
    "position": {
      "x": 1884.4361340849705,
      "y": 560.9195078455252
    },
    "data": {
      "label": "VY: Tillägg",
      "lane": "WebApp",
      "details": "Val av tillägg och eventuell connected-produkt innan betalningsbeslut.",
      "reads": [
        "produktkatalog",
        "prisregler"
      ],
      "writes": [
        "valda tillägg",
        "connected_selected"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 106,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gw-app-connected",
    "type": "gateway",
    "position": {
      "x": 2232.075171164946,
      "y": 549.529245991438
    },
    "data": {
      "label": "Connected valt?",
      "lane": "WebApp",
      "details": "Connected-profiler visas bara om produkten valts.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-connected",
    "type": "task",
    "position": {
      "x": 2495.724219267691,
      "y": 513.7660320684965
    },
    "data": {
      "label": "VY: Connected-profiler",
      "lane": "WebApp",
      "details": "Fyra lätta profiler med namn och ikonval skapas i pilotens operativa state.",
      "writes": [
        "connected_profile_1..4",
        "ikonval",
        "connected_profile_status"
      ],
      "shownWhen": [
        "Connected-produkt är vald"
      ],
      "skippedWhen": [
        "Ingen connected-produkt är vald"
      ],
      "givesGuest": [
        "Fyra profiler redo för bandkoppling hos staff"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 192,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "gw-app-payment",
    "type": "gateway",
    "position": {
      "x": 2787.0194973276257,
      "y": 503.3314545696296
    },
    "data": {
      "label": "Betalning krävs?",
      "lane": "WebApp",
      "details": "No-payment-vägen är explicit i pilotflödet.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 64,
      "height": 64
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-payment",
    "type": "task",
    "position": {
      "x": 3008.941508017124,
      "y": 454.15597862100225
    },
    "data": {
      "label": "VY: Betalning",
      "lane": "WebApp",
      "details": "Gemensamt betalsteg när totalen är större än 0.",
      "writes": [
        "payment_status",
        "payment_reference",
        "pending_writeback"
      ],
      "shownWhen": [
        "Totalen är större än 0"
      ],
      "skippedWhen": [
        "Inga nya tillägg valdes eller totalen är 0"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 123,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-confirm",
    "type": "task",
    "position": {
      "x": 3099.1878602134834,
      "y": 572.1689503519211
    },
    "data": {
      "label": "VY: Bekräftelse + QR + kod",
      "lane": "WebApp",
      "details": "Gemensam slutskärm med QR och kort bokningskod för handoff hos staff.",
      "reads": [
        "confirmation_code",
        "token_payload",
        "payment_status"
      ],
      "givesGuest": [
        "QR-kod",
        "Kort bokningskod",
        "Bekräftelse att check-in-flödet är klart"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 203,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "kiosk-print",
    "type": "task",
    "position": {
      "x": 3490,
      "y": 459.28541061493274
    },
    "data": {
      "label": "Skriv ut kvitto / confirmation",
      "lane": "WebApp",
      "details": "Valfri kioskavvikelse efter avslutat flöde. Mobilen behöver normalt inte detta steg.",
      "shownWhen": [
        "Kanal = kiosk och utskrift behövs"
      ],
      "skippedWhen": [
        "Kanal = mobil eller ingen utskrift behövs"
      ],
      "givesGuest": [
        "Utskriven confirmation eller kvitto"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 230,
      "height": 60
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "app-present",
    "type": "task",
    "position": {
      "x": 3674.5580670570394,
      "y": 576.4270530746636
    },
    "data": {
      "label": "VY: Visa QR / bokningskod",
      "lane": "WebApp",
      "details": "Sista WebApp-vyn före staff-handoff.",
      "reads": [
        "QR payload",
        "booking code",
        "connected_profile_status"
      ],
      "givesGuest": [
        "Det som ska visas upp hos staff"
      ],
      "staffVerifies": [
        "QR-kod",
        "Bokningskod"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 202,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "job-daily",
    "type": "service",
    "position": {
      "x": 980.8528223251833,
      "y": 1085.5668377166778
    },
    "data": {
      "label": "Daglig seed",
      "lane": "Ops jobs",
      "details": "Laddar dagens Roller-data till den lokala snapshoten tidigt på dagen.",
      "cadence": "05:00 daily",
      "jobs": [
        "Hämtar dagens bokningar",
        "Upserta snapshot",
        "Förbereder SMS-fönster"
      ],
      "endpoints": [
        "Get attendance",
        "Get tickets",
        "Get payments"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 104
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "job-delta",
    "type": "service",
    "position": {
      "x": 1306.7512828750835,
      "y": 1085.5668377166778
    },
    "data": {
      "label": "Delta-synk",
      "lane": "Ops jobs",
      "details": "Håller snapshoten färsk utan att lägga bulklogik i användarflödet.",
      "cadence": "Every 5 min",
      "jobs": [
        "Diff mot payload_hash",
        "Uppdatera ändrade rader",
        "Skriv sync-event"
      ],
      "endpoints": [
        "Get attendance",
        "Get tickets",
        "Get payments"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 104
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "job-sms",
    "type": "service",
    "position": {
      "x": 1614.3778918111186,
      "y": 1084.1613106694574
    },
    "data": {
      "label": "SMS-trigger",
      "lane": "Ops jobs",
      "details": "Skapar token och skickar länk inför ankomst.",
      "cadence": "Every 1 min",
      "jobs": [
        "Hitta bokningar om 30 min",
        "Skapa token",
        "Skriv sms_outbox"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 104
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "job-refresh",
    "type": "service",
    "position": {
      "x": 1953.8516737562525,
      "y": 1083.6712423191495
    },
    "data": {
      "label": "Refresh vid länköppning",
      "lane": "Ops jobs",
      "details": "Kör live-refresh när länk eller på plats-lookup kräver färsk detalj.",
      "cadence": "On demand",
      "endpoints": [
        "Get detail of a booking"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 104
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "job-retry",
    "type": "service",
    "position": {
      "x": 2276.4807830581235,
      "y": 1084.8916804506885
    },
    "data": {
      "label": "Retry för writeback",
      "lane": "Ops jobs",
      "details": "Tar om writeback och redeem om externa anrop fallerar.",
      "cadence": "Retry queue",
      "endpoints": [
        "Edit booking",
        "Add transaction record",
        "Redeem tickets"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 104
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "aws-rdb",
    "type": "service",
    "position": {
      "x": 180,
      "y": 866
    },
    "data": {
      "label": "Aurora PostgreSQL",
      "lane": "AWS + Aurora",
      "details": "Primär operativ databas för JumpYard Cloud.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 81
    }
  },
  {
    "id": "aws-redis",
    "type": "service",
    "position": {
      "x": 430,
      "y": 866
    },
    "data": {
      "label": "Redis (valfri i V1)",
      "lane": "AWS + Aurora",
      "details": "Kortlivade tokens, sessionscache och rate limiting vid behov.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 81
    },
    "selected": false
  },
  {
    "id": "aws-s3",
    "type": "service",
    "position": {
      "x": 180,
      "y": 976
    },
    "data": {
      "label": "S3 rå-payloads",
      "lane": "AWS + Aurora",
      "details": "Rå Roller-payloads, exportfiler och senare analysdump.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 81
    }
  },
  {
    "id": "aws-sqs",
    "type": "service",
    "position": {
      "x": 430,
      "y": 976
    },
    "data": {
      "label": "SQS / EventBridge",
      "lane": "AWS + Aurora",
      "details": "Köar SMS, retryjobb och andra asynkrona steg.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 81
    },
    "selected": false
  },
  {
    "id": "store-snapshot",
    "type": "database",
    "position": {
      "x": 1098.072755565836,
      "y": 842.1314423536758
    },
    "data": {
      "label": "Aurora / Roller Snapshot",
      "lane": "AWS + Aurora",
      "collapsed": true,
      "expandLabel": "Expandera databas",
      "collapseLabel": "Fäll ihop databas",
      "summary": "Lokal snapshot av Roller-bokningar, tickets, produkter och betalningar.",
      "summaryItems": [
        "bookings",
        "booking_tickets",
        "booking_products"
      ],
      "tables": [
        "bookings",
        "booking_tickets",
        "booking_products",
        "booking_payments"
      ],
      "keyFields": [
        "roller_booking_ref",
        "ticket_ids",
        "payment_status",
        "payload_hash",
        "last_seen_from_roller_at"
      ],
      "writePattern": "Upsertas av daily seed, delta sync och link-open refresh.",
      "reads": [
        "WebApp: VY: Bokning & deltagare",
        "WebApp: Hitta befintlig bokning"
      ],
      "writes": [
        "Ops jobs: daily seed",
        "Ops jobs: delta sync",
        "Ops jobs: link-open refresh"
      ],
      "usedBy": [
        "WebApp bokningsvy",
        "Kiosk lookup",
        "Staff validering"
      ],
      "endpoints": [
        "Get attendance",
        "Get tickets",
        "Get payments",
        "Get detail of a booking"
      ],
      "contains": [
        "Bokning",
        "Tickets per booking",
        "Produktsammanfattning",
        "Betalningssnapshot"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 250,
      "height": 141
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "store-operational",
    "type": "database",
    "position": {
      "x": 1956.3185348201828,
      "y": 831.6853660694529
    },
    "data": {
      "label": "Aurora / Operativ state",
      "lane": "AWS + Aurora",
      "collapsed": true,
      "expandLabel": "Expandera databas",
      "collapseLabel": "Fäll ihop databas",
      "summary": "Pilotens egen state för safety, token, check-in, connected-profiler och handoff.",
      "summaryItems": [
        "booking_operational_state",
        "checkin_tokens",
        "connected_profile_drafts"
      ],
      "tables": [
        "booking_operational_state",
        "checkin_tokens",
        "sms_outbox",
        "guest_profiles",
        "connected_profile_drafts"
      ],
      "keyFields": [
        "local_checkin_status",
        "confirmation_code",
        "token_hash",
        "safety_status",
        "connected_profile_status"
      ],
      "writePattern": "Skrivs av WebApp, staff-handoff och SMS-jobb. Läser inför redeem och utlämning.",
      "reads": [
        "WebApp: VY: Safety",
        "WebApp: VY: Tillägg",
        "WebApp: VY: Betalning",
        "Staff: Utlämning hos staff"
      ],
      "writes": [
        "WebApp: Safety",
        "WebApp: Connected-profiler",
        "WebApp: Betalning",
        "Staff: Handoff"
      ],
      "ownedState": [
        "Safety completion",
        "Confirmation code",
        "Connected-profiler",
        "Handoff-status"
      ],
      "usedBy": [
        "SMS-trigger",
        "WebApp huvudflöde",
        "Utlämning hos staff"
      ],
      "endpoints": [
        "Get products",
        "Booking costs",
        "Edit booking",
        "Add transaction record",
        "Redeem tickets"
      ],
      "contains": [
        "Operativ status",
        "Tokens",
        "SMS-logg",
        "Lätta profilutkast för connected"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 250,
      "height": 157
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "store-events",
    "type": "database",
    "position": {
      "x": 2713.9183912765634,
      "y": 838.0000000000001
    },
    "data": {
      "label": "Aurora / Event & observability",
      "lane": "AWS + Aurora",
      "collapsed": true,
      "expandLabel": "Expandera databas",
      "collapseLabel": "Fäll ihop databas",
      "summary": "Append-only eventspår och sync-observability för pilotens drift.",
      "summaryItems": [
        "booking_events",
        "sync_runs",
        "error_summary"
      ],
      "tables": [
        "booking_events",
        "sync_runs"
      ],
      "keyFields": [
        "event_type",
        "event_source",
        "booking_id",
        "status",
        "error_summary"
      ],
      "writePattern": "Append-only från WebApp, staff och ops jobs.",
      "usedBy": [
        "Support",
        "Drift",
        "Funnelanalys"
      ],
      "jobs": [
        "Daglig seed",
        "Delta-synk",
        "Retry för writeback"
      ],
      "contains": [
        "Visit events",
        "SMS-händelser",
        "Sync-resultat",
        "Felspår"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 250,
      "height": 157
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "store-future",
    "type": "database",
    "position": {
      "x": 3185.758132978323,
      "y": 839.7673027869206
    },
    "data": {
      "label": "Connected experience senare",
      "lane": "AWS + Aurora",
      "collapsed": true,
      "expandLabel": "Expandera databas",
      "collapseLabel": "Fäll ihop databas",
      "future": true,
      "statusTag": "Senare",
      "summary": "Framtida full session- och device-modell, skild från pilotens lätta profilutkast.",
      "summaryItems": [
        "connected_sessions",
        "device_pairings",
        "live session state"
      ],
      "tables": [
        "connected_sessions",
        "device_pairings"
      ],
      "keyFields": [
        "session_started_at",
        "band_assigned",
        "device_id"
      ],
      "writePattern": "Senare scope. Inte aktivt i pilotens check-in.",
      "contains": [
        "Bandkoppling",
        "Session state",
        "Device pairing"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 250,
      "height": 197
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "roller-bulk",
    "type": "service",
    "position": {
      "x": 1114.3869058589235,
      "y": 1318.8773811717847
    },
    "data": {
      "label": "Get attendance / Get tickets / Get payments",
      "lane": "Roller API",
      "details": "Bulk- och snapshotsync för ops jobben.",
      "endpoints": [
        "Get attendance",
        "Get tickets",
        "Get payments"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 80
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "roller-booking",
    "type": "service",
    "position": {
      "x": 1691.3965398282976,
      "y": 1311.5471863067523
    },
    "data": {
      "label": "Get detail of a booking",
      "lane": "Roller API",
      "details": "Live-detail när bokning eller lookup behöver en färsk källa.",
      "endpoints": [
        "Get detail of a booking"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 81
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "roller-products",
    "type": "service",
    "position": {
      "x": 1972.75498090804,
      "y": 1294.443398288344
    },
    "data": {
      "label": "Get products / Booking costs",
      "lane": "Roller API",
      "details": "Produktkatalog och kostnadsberäkning för tillägg och connected.",
      "endpoints": [
        "Get products",
        "Booking costs"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 96
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "roller-writeback",
    "type": "service",
    "position": {
      "x": 2280.9908031595673,
      "y": 1299.3301948650321
    },
    "data": {
      "label": "Edit booking / Add transaction record",
      "lane": "Roller API",
      "details": "Writeback till Roller efter betalning och tillägg.",
      "endpoints": [
        "Edit booking",
        "Add transaction record"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 96
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "roller-redeem",
    "type": "service",
    "position": {
      "x": 4059.8498579828115,
      "y": 1298.6934055584802
    },
    "data": {
      "label": "Redeem tickets",
      "lane": "Roller API",
      "details": "Kritisk slutpunkt när staff slutför handoff i piloten.",
      "endpoints": [
        "Redeem tickets"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 220,
      "height": 81
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "staff-assist",
    "type": "task",
    "position": {
      "x": 3309.365614684786,
      "y": 337.6922386487423
    },
    "data": {
      "label": "Assisterad fallback",
      "lane": "Staff / parkpersonal",
      "details": "Används vid mismatch, saknad kod eller andra undantag.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 172,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "staff-manual",
    "type": "task",
    "position": {
      "x": 3641.9071537680243,
      "y": 274.8772348244092
    },
    "data": {
      "label": "Manuell kontroll",
      "lane": "Staff / parkpersonal",
      "details": "Staff kan kontrollera bokning manuellt innan utlämning eller alternativ hantering.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 156,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "staff-handoff",
    "type": "task",
    "position": {
      "x": 4095.5712243958405,
      "y": 274.7526672549376
    },
    "data": {
      "label": "Utlämning hos staff",
      "lane": "Staff / parkpersonal",
      "details": "Piloten avslutas hos staff efter att check-in-flödet är klart.",
      "why": "Staff verifierar QR-kod eller bokningskod, ger ut tillägg och kopplar Connected Experience-band till profilerna från check-in-flödet.",
      "reads": [
        "Bekräftad bokning",
        "QR-kod eller bokningskod",
        "Connected-profiler från operativ state"
      ],
      "writes": [
        "Redeem-status",
        "visit event",
        "utlämning klar",
        "bandkoppling slutförd"
      ],
      "givesGuest": [
        "Tillägg",
        "Connected Experience-band",
        "Klartecken att gå vidare"
      ],
      "staffVerifies": [
        "QR-kod",
        "Bokningskod"
      ],
      "endpoints": [
        "Redeem tickets"
      ],
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 173,
      "height": 43
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "staff-api-end",
    "type": "event",
    "position": {
      "x": 4284.518270182921,
      "y": 335.93930806135495
    },
    "data": {
      "label": "Manuell åtgärd klar",
      "type": "end",
      "lane": "Staff / parkpersonal",
      "details": "Fallbackgrenen avslutas här när normalen inte kunde användas.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "measured": {
      "width": 48,
      "height": 48
    },
    "selected": false,
    "dragging": false
  }
] as any[];

export const pilotEdges = [
  {
    "id": "g1",
    "source": "guest-start",
    "target": "guest-open",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "g2",
    "source": "guest-open",
    "target": "guest-review",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "g3",
    "source": "guest-review",
    "target": "guest-safety",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "g4",
    "source": "guest-safety",
    "target": "guest-addons",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "g5",
    "source": "guest-addons",
    "target": "guest-pay",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "g6",
    "source": "guest-pay",
    "target": "guest-confirm",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "g7",
    "source": "guest-confirm",
    "target": "guest-arrive",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "g8b",
    "source": "guest-present",
    "target": "staff-handoff",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w1",
    "source": "app-start",
    "target": "gw-channel",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w3",
    "source": "gw-channel",
    "target": "kiosk-entry",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "label": "Kiosk",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "bottom",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w4",
    "source": "app-mobile",
    "target": "gw-mobile-entry",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w6",
    "source": "gw-mobile-entry",
    "target": "app-onsite",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "label": "Park-QR",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w9",
    "source": "gw-kiosk-existing",
    "target": "kiosk-buy",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "bottom",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w12",
    "source": "app-booking",
    "target": "app-safety",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w13",
    "source": "app-safety",
    "target": "app-addons",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w14",
    "source": "app-addons",
    "target": "gw-app-connected",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w15",
    "source": "gw-app-connected",
    "target": "app-connected",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "top",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w18",
    "source": "gw-app-payment",
    "target": "app-payment",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "top",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w19",
    "source": "gw-app-payment",
    "target": "app-confirm",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w20",
    "source": "app-payment",
    "target": "app-confirm",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "top",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w22",
    "source": "app-confirm",
    "target": "app-present",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "label": "mobil / ingen utskrift",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "w23",
    "source": "kiosk-print",
    "target": "app-present",
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "top",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "o1",
    "source": "job-daily",
    "target": "job-delta",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "o2",
    "source": "job-delta",
    "target": "job-sms",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "o3",
    "source": "job-sms",
    "target": "job-refresh",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "o4",
    "source": "job-refresh",
    "target": "job-retry",
    "type": "smoothstep",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "d9",
    "source": "app-confirm",
    "target": "store-operational",
    "type": "step",
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Bekräftelsevyn läser token, QR och bokningskod från operativ state.",
      "operation": "Läsning",
      "fields": [
        "confirmation_code",
        "token_payload",
        "payment_status"
      ],
      "why": "Samma slutbild måste fungera för både mobil och kiosk.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-left",
    "targetHandle": "top-right",
    "zIndex": 0,
    "selected": false
  },
  {
    "id": "d9b",
    "source": "app-confirm",
    "target": "store-events",
    "type": "step",
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "WebApp-flödet skriver centrala händelser när check-in når bekräftat läge.",
      "operation": "Skrivning",
      "fields": [
        "booking_loaded",
        "safety_completed",
        "payment_recorded",
        "confirmation_ready"
      ],
      "why": "Eventspåret ska visa vad som faktiskt hände i WebApp-flödet, inte bara i staff och bakgrundsjobb.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-left",
    "targetHandle": "top",
    "zIndex": 0
  },
  {
    "id": "d16",
    "source": "job-delta",
    "target": "roller-bulk",
    "type": "step",
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Delta-synk hämtar ändringar under dagen.",
      "operation": "Sync",
      "fields": [
        "uppdaterade attendance-rader",
        "ändrade tickets",
        "nya payments"
      ],
      "why": "Snapshoten behöver hållas färsk utan att belasta happy path.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "zIndex": 0,
    "selected": false
  },
  {
    "id": "d16b",
    "source": "job-delta",
    "target": "store-events",
    "type": "step",
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Delta-synk skriver sync-observability och felutfall till eventlagret.",
      "operation": "Skrivning",
      "fields": [
        "sync_runs",
        "rows_changed",
        "error_summary",
        "booking_synced"
      ],
      "why": "Drift och felsökning behöver se att synk-jobben kördes och vad de faktiskt ändrade.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "top-right",
    "targetHandle": "bottom-left",
    "zIndex": 0
  },
  {
    "id": "d19",
    "source": "job-refresh",
    "target": "roller-booking",
    "type": "step",
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Refresh vid länköppning hämtar färsk booking detail.",
      "operation": "Läsning",
      "fields": [
        "booking detail",
        "produktstatus",
        "betalningsstatus",
        "tickets"
      ],
      "why": "Behövs när länk öppnas eller på plats-lookup kräver färsk data.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "zIndex": 0
  },
  {
    "id": "d22",
    "source": "job-retry",
    "target": "roller-writeback",
    "type": "step",
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Retryjobbet tar om writeback när betalning eller bokningsändring inte gick igenom.",
      "operation": "Writeback",
      "fields": [
        "Edit booking payload",
        "transaction record payload",
        "retry context"
      ],
      "why": "Externa Roller-anrop behöver ett separat återförsöksspår.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "zIndex": 0
  },
  {
    "id": "a1",
    "source": "aws-rdb",
    "target": "store-snapshot",
    "type": "step",
    "style": {
      "strokeWidth": 1.75,
      "stroke": "#94a3b8",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#94a3b8"
    },
    "data": {
      "edgeStyle": "arch",
      "baseStyle": {
        "strokeWidth": 1.75,
        "stroke": "#94a3b8",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#94a3b8"
      },
      "pathMode": "step",
      "details": "Aurora bär de operativa tabellgrupperna.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "a2",
    "source": "aws-rdb",
    "target": "store-operational",
    "type": "step",
    "style": {
      "strokeWidth": 1.75,
      "stroke": "#94a3b8",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#94a3b8"
    },
    "data": {
      "edgeStyle": "arch",
      "baseStyle": {
        "strokeWidth": 1.75,
        "stroke": "#94a3b8",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#94a3b8"
      },
      "pathMode": "step",
      "details": "Aurora bär pilotens egen operativa state.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "a3",
    "source": "aws-rdb",
    "target": "store-events",
    "type": "step",
    "style": {
      "strokeWidth": 1.75,
      "stroke": "#94a3b8",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#94a3b8"
    },
    "data": {
      "edgeStyle": "arch",
      "baseStyle": {
        "strokeWidth": 1.75,
        "stroke": "#94a3b8",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#94a3b8"
      },
      "pathMode": "step",
      "details": "Aurora bär observability och eventlogg.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "a4",
    "source": "aws-rdb",
    "target": "store-future",
    "type": "step",
    "style": {
      "strokeWidth": 1.75,
      "stroke": "#94a3b8",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#94a3b8"
    },
    "data": {
      "edgeStyle": "arch",
      "baseStyle": {
        "strokeWidth": 1.75,
        "stroke": "#94a3b8",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#94a3b8"
      },
      "pathMode": "step",
      "details": "Aurora kan senare bära full connected session state.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "a5",
    "source": "aws-redis",
    "target": "store-operational",
    "type": "step",
    "style": {
      "strokeWidth": 1.75,
      "stroke": "#94a3b8",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#94a3b8"
    },
    "data": {
      "edgeStyle": "arch",
      "baseStyle": {
        "strokeWidth": 1.75,
        "stroke": "#94a3b8",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#94a3b8"
      },
      "pathMode": "step",
      "details": "Redis kan cachea tokens och aktiv sessionstate i V1.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "a6",
    "source": "aws-s3",
    "target": "store-snapshot",
    "type": "step",
    "style": {
      "strokeWidth": 1.75,
      "stroke": "#94a3b8",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#94a3b8"
    },
    "data": {
      "edgeStyle": "arch",
      "baseStyle": {
        "strokeWidth": 1.75,
        "stroke": "#94a3b8",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#94a3b8"
      },
      "pathMode": "step",
      "details": "S3 kan lagra rå payloads och exportfiler vid behov.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "a7",
    "source": "aws-sqs",
    "target": "job-sms",
    "type": "step",
    "style": {
      "strokeWidth": 1.75,
      "stroke": "#94a3b8",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#94a3b8"
    },
    "data": {
      "edgeStyle": "arch",
      "baseStyle": {
        "strokeWidth": 1.75,
        "stroke": "#94a3b8",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#94a3b8"
      },
      "pathMode": "step",
      "details": "Asynkrona utskick och retryjobb kan gå via kö.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0
  },
  {
    "id": "a8",
    "source": "aws-sqs",
    "target": "job-retry",
    "type": "step",
    "style": {
      "strokeWidth": 1.75,
      "stroke": "#94a3b8",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#94a3b8"
    },
    "data": {
      "edgeStyle": "arch",
      "baseStyle": {
        "strokeWidth": 1.75,
        "stroke": "#94a3b8",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#94a3b8"
      },
      "pathMode": "step",
      "details": "Retryjobbet kan drivas via kö eller events.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "selected": false
  },
  {
    "id": "f1",
    "source": "guest-present",
    "target": "staff-assist",
    "type": "step",
    "label": "saknar kod / mismatch",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "data": {
      "edgeStyle": "dashed",
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#8b5cf6",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#8b5cf6"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "zIndex": 0,
    "selected": false
  },
  {
    "id": "f3",
    "source": "staff-manual",
    "target": "staff-handoff",
    "type": "step",
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "data": {
      "edgeStyle": "dashed",
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#8b5cf6",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#8b5cf6"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "zIndex": 0
  },
  {
    "id": "f5",
    "source": "staff-assist",
    "target": "staff-api-end",
    "type": "step",
    "label": "manuell väg",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    },
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "data": {
      "edgeStyle": "dashed",
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#8b5cf6",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#8b5cf6"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "zIndex": 0,
    "selected": false
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gw-channel",
    "target": "app-mobile",
    "label": "Mobil",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "top",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__gw-channeltop-app-mobileleft"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gw-kiosk-existing",
    "target": "kiosk-lookup",
    "label": "Ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__gw-kiosk-existingright-kiosk-lookupleft"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "kiosk-entry",
    "target": "gw-kiosk-existing",
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__kiosk-entryright-gw-kiosk-existingleft"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "app-onsite",
    "target": "gw-kiosk-existing",
    "sourceHandle": "bottom-left",
    "targetHandle": "top",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__app-onsitebottom-left-gw-kiosk-existingtop"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gw-mobile-entry",
    "target": "app-booking",
    "label": "SMS-länk med token",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "top",
    "targetHandle": "top-left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__gw-mobile-entrytop-app-bookingtop-left"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "kiosk-lookup",
    "target": "app-booking",
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__kiosk-lookupright-app-bookingleft"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "kiosk-buy",
    "target": "app-booking",
    "sourceHandle": "right",
    "targetHandle": "bottom-left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__kiosk-buyright-app-bookingbottom-left"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "app-connected",
    "target": "gw-app-payment",
    "sourceHandle": "right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__app-connectedright-gw-app-paymentleft"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "gw-app-connected",
    "target": "gw-app-payment",
    "label": "Nej",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "bottom",
    "targetHandle": "bottom",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__gw-app-connectedbottom-gw-app-paymentbottom"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "app-confirm",
    "target": "kiosk-print",
    "label": "kiosk / utskrift",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "top-right",
    "targetHandle": "left",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__app-confirmtop-right-kiosk-printleft"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    },
    "source": "job-retry",
    "target": "staff-assist",
    "label": "kritisk avvikelse",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "data": {
      "edgeStyle": "dashed",
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#8b5cf6",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#8b5cf6"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "top",
    "targetHandle": "bottom-right",
    "zIndex": 0,
    "id": "xy-edge__job-retrytop-staff-assistbottom-right",
    "selected": false
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#8b5cf6"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#8b5cf6",
      "strokeDasharray": "6,6"
    },
    "source": "staff-assist",
    "target": "staff-manual",
    "data": {
      "edgeStyle": "dashed",
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#8b5cf6",
        "strokeDasharray": "6,6"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#8b5cf6"
      },
      "pathMode": "step",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "zIndex": 0,
    "id": "xy-edge__staff-assistright-staff-manualleft"
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
    "source": "staff-handoff",
    "target": "guest-end",
    "sourceHandle": "right-top",
    "targetHandle": "bottom",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__staff-handoffright-top-guest-endbottom"
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
    "source": "guest-arrive",
    "target": "guest-present",
    "sourceHandle": "right",
    "targetHandle": "left-top",
    "data": {
      "baseStyle": {
        "strokeWidth": 2,
        "stroke": "#ff8e7d"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#ff8e7d"
      },
      "pathMode": "smoothstep",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "zIndex": 0,
    "id": "xy-edge__guest-arriveright-guest-presentleft-top"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "job-daily",
    "target": "roller-bulk",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Daglig seed hämtar dagens Roller-data.",
      "operation": "Sync",
      "fields": [
        "attendance",
        "tickets",
        "payments"
      ],
      "why": "Skapar dagens första lokala snapshot inför SMS och check-in.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-left",
    "targetHandle": "top-left",
    "zIndex": 0,
    "id": "xy-edge__job-dailybottom-left-roller-bulktop-left"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "job-daily",
    "target": "store-snapshot",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Daglig seed skriver dagens snapshot till Aurora.",
      "operation": "Skrivning",
      "fields": [
        "bookings",
        "booking_tickets",
        "booking_products",
        "booking_payments"
      ],
      "why": "Pilotens WebApp läser alltid lokal snapshot först.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "top-left",
    "targetHandle": "bottom-left",
    "zIndex": 0,
    "id": "xy-edge__job-dailytop-left-store-snapshotbottom-left"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "app-booking",
    "target": "store-snapshot",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Bokningsvyn läser den senaste snapshoten för gemensam visning.",
      "operation": "Läsning",
      "fields": [
        "bokningssammanfattning",
        "deltagare",
        "produktlista",
        "betalningsstatus"
      ],
      "why": "Både mobil och kiosk ska visa samma bokningsbild efter att bokningen hittats.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top-right",
    "zIndex": 0,
    "id": "xy-edge__app-bookingbottom-store-snapshottop-right"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "kiosk-lookup",
    "target": "store-snapshot",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Gemensam lookup läser en matchbar bokning från snapshoten.",
      "operation": "Läsning",
      "fields": [
        "booking_ref",
        "telefon + efternamn",
        "QR-matchning",
        "sessionstid"
      ],
      "why": "Samma lookup ska fungera för mobil via Park-QR och kiosk med befintlig bokning.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "zIndex": 0,
    "id": "xy-edge__kiosk-lookupbottom-store-snapshottop"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "staff-handoff",
    "target": "roller-redeem",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Staff-handoff triggar redeem när QR-kod eller bokningskod verifierats.",
      "operation": "Writeback",
      "fields": [
        "ticket_ids",
        "redeem request per ticket",
        "verified handoff context"
      ],
      "why": "Piloten är inte klar förrän staff slutfört handoff och check-in i Roller.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-right",
    "targetHandle": "top-right",
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__staff-handoffbottom-right-roller-redeemtop-right"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "app-connected",
    "target": "store-future",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Connected-profiler skickas vidare till connected experience som aktiv pilotdata.",
      "operation": "Skrivning",
      "fields": [
        "connected_profile_1..4",
        "ikonval",
        "profilslotar",
        "connected_profile_status"
      ],
      "why": "Connected experience ska vara en tydlig del av piloten och inte bara dold bakom operativ state.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-right",
    "targetHandle": "top-left",
    "zIndex": 0,
    "id": "xy-edge__app-connectedbottom-right-store-futuretop-left"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "staff-handoff",
    "target": "store-future",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Staff slutför connected-delen genom att koppla band till profilerna vid utlämning.",
      "operation": "Läsning + skrivning",
      "fields": [
        "connected-profiler",
        "band assignment",
        "pairing_status",
        "handoff_completed"
      ],
      "why": "Bandkopplingen är en aktiv pilotdel och ska därför synas som eget dataflöde till connected experience.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-left",
    "targetHandle": "right",
    "zIndex": 0,
    "id": "xy-edge__staff-handoffbottom-left-store-futureright"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "store-operational",
    "target": "roller-writeback",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Operativ state driver writeback till Roller efter tillägg och betalning.",
      "operation": "Writeback",
      "fields": [
        "selected_addons",
        "payment_status",
        "transaction reference"
      ],
      "why": "Cloud äger ordningen mellan lokal state och extern skrivning.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-right",
    "targetHandle": "top-left",
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__store-operationalbottom-right-roller-writebacktop-left"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "staff-handoff",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Staff läser och uppdaterar operativ state när handoff slutförs.",
      "operation": "Läsning + skrivning",
      "fields": [
        "QR-kod eller bokningskod",
        "connected-profiler",
        "utlämning klar",
        "bandkoppling"
      ],
      "why": "Piloten avslutas hos staff, inte i self-service.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "right-bottom",
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__staff-handoffbottom-store-operationalright-bottom"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "app-present",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Slutvyn läser det som gästen ska visa upp hos staff.",
      "operation": "Läsning",
      "fields": [
        "QR-kod",
        "bokningskod",
        "connected_profile_status"
      ],
      "why": "Staff-handoff behöver en tydlig och stabil slutvy oavsett kanal.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "right",
    "zIndex": 0,
    "id": "xy-edge__app-presentbottom-store-operationalright"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "kiosk-print",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Kiosk läser confirmation-data inför eventuell utskrift.",
      "operation": "Läsning",
      "fields": [
        "confirmation_code",
        "QR payload",
        "print status"
      ],
      "why": "Kioskens utskrift är ett litet sidospår efter det delade flödet.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-left",
    "targetHandle": "right-top",
    "zIndex": 0,
    "id": "xy-edge__kiosk-printbottom-left-store-operationalright-top"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "store-operational",
    "target": "roller-products",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Cloud använder produkts- och kostnadsendpoints för tilläggssteget.",
      "operation": "Läsning",
      "fields": [
        "produktkatalog",
        "prisberäkning",
        "connected-produkt"
      ],
      "why": "Tillägg och connected måste räknas innan betalningsbeslutet tas.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "zIndex": 0,
    "id": "xy-edge__store-operationalbottom-roller-productstop"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "job-sms",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "SMS-jobbet läser bokningar redo för utskick och skriver token/outbox-status.",
      "operation": "Läsning + skrivning",
      "fields": [
        "checkin_tokens",
        "sms_outbox",
        "checkin_link_sent_at"
      ],
      "why": "Unik länk måste skapas och spåras innan gästen öppnar flödet.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "top-left",
    "targetHandle": "bottom-left",
    "zIndex": 0,
    "id": "xy-edge__job-smstop-left-store-operationalbottom-left"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "app-safety",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Safetyresultat skrivs till operativ state.",
      "operation": "Skrivning",
      "fields": [
        "safety_status",
        "safety_completed_at"
      ],
      "why": "Safety ägs lokalt i JumpYard Cloud under piloten.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "left",
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__app-safetybottom-store-operationalleft"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "app-addons",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Tilläggsval och connected-flagga sparas inför betalningsbeslut och writeback.",
      "operation": "Skrivning",
      "fields": [
        "selected_addons",
        "connected_selected",
        "pricing_context"
      ],
      "why": "WebApp behöver en lokal operativ state innan Roller-writeback sker.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "left-top",
    "zIndex": 0,
    "id": "xy-edge__app-addonsbottom-store-operationalleft-top"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "app-connected",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Connected-profiler sparas som lätta profilutkast i piloten.",
      "operation": "Skrivning",
      "fields": [
        "4 profilnamn",
        "ikonval",
        "connected_profile_status"
      ],
      "why": "Staff ska kunna koppla band till profilerna som skapades i check-in-flödet.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__app-connectedbottom-store-operationaltop"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "app-payment",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Betalningsresultat skrivs innan writeback och bekräftelse.",
      "operation": "Skrivning",
      "fields": [
        "payment_status",
        "payment_reference",
        "writeback_pending"
      ],
      "why": "No-payment- och betalningsspåret behöver mötas i samma lokala state.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom",
    "targetHandle": "top-left",
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__app-paymentbottom-store-operationaltop-left"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "job-refresh",
    "target": "store-snapshot",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Färsk booking detail skrivs tillbaka till snapshoten.",
      "operation": "Skrivning",
      "fields": [
        "raw_payload_json",
        "payload_hash",
        "updated booking snapshot"
      ],
      "why": "WebApp ska fortsätta läsa lokal snapshot även efter live-refresh.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "top-left",
    "targetHandle": "right-top",
    "zIndex": 0,
    "id": "xy-edge__job-refreshtop-left-store-snapshotright-top"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "kiosk-buy",
    "target": "store-operational",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Walk-in-köp skriver första operativa state innan gemensamt huvudflöde fortsätter.",
      "operation": "Skrivning",
      "fields": [
        "walk_in_purchase",
        "nya deltagare",
        "channel = kiosk",
        "preliminary confirmation"
      ],
      "why": "Kiosk behöver kunna skapa en lokal operativ grund innan writeback och bekräftelse.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "right-bottom",
    "targetHandle": "left-bottom",
    "zIndex": 0,
    "selected": false,
    "id": "xy-edge__kiosk-buyright-bottom-store-operationalleft-bottom"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "staff-handoff",
    "target": "store-events",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Staff skriver visit event och utlämningsspår.",
      "operation": "Skrivning",
      "fields": [
        "handoff_completed",
        "redeem_succeeded",
        "band_paired"
      ],
      "why": "Append-only eventspår behövs för drift, analys och felsökning.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "bottom-left",
    "targetHandle": "right-top",
    "zIndex": 0,
    "id": "xy-edge__staff-handoffbottom-left-store-eventsright-top"
  },
  {
    "type": "step",
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#22d3ee"
    },
    "style": {
      "strokeWidth": 1.5,
      "stroke": "#22d3ee",
      "strokeDasharray": "3,5"
    },
    "source": "job-delta",
    "target": "store-snapshot",
    "data": {
      "edgeKind": "data",
      "edgeStyle": "data",
      "baseStyle": {
        "strokeWidth": 1.5,
        "stroke": "#22d3ee",
        "strokeDasharray": "3,5"
      },
      "baseMarkerEnd": {
        "type": "arrowclosed",
        "color": "#22d3ee"
      },
      "pathMode": "step",
      "details": "Delta-synk uppdaterar bara ändrade delar av snapshoten.",
      "operation": "Skrivning",
      "fields": [
        "payload_hash",
        "changed rows",
        "last_seen_from_roller_at"
      ],
      "why": "Minskar onödiga fulla omladdningar och håller datan begriplig.",
      "edgeHighlighted": false,
      "dimmed": false
    },
    "sourceHandle": "top-left",
    "targetHandle": "bottom-right",
    "zIndex": 0,
    "id": "xy-edge__job-deltatop-left-store-snapshotbottom-right"
  }
] as any[];

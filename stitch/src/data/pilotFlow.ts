// Auto-generated — do not edit by hand
export const pilotNodes = [
  {
    "id": "lane-guest",
    "type": "lane",
    "position": {
      "x": -100,
      "y": 0
    },
    "data": {
      "label": "Gäst / bokare",
      "index": 0,
      "height": "200px",
      "width": "6200px"
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
      "y": 200
    },
    "data": {
      "label": "JumpYard Cloud",
      "index": 1,
      "height": "200px",
      "width": "6200px"
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
    "id": "lane-roller",
    "type": "lane",
    "position": {
      "x": -100,
      "y": 400
    },
    "data": {
      "label": "Roller",
      "index": 2,
      "height": "200px",
      "width": "6200px"
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
    "id": "lane-payment",
    "type": "lane",
    "position": {
      "x": -100,
      "y": 600
    },
    "data": {
      "label": "Betalning",
      "index": 3,
      "height": "200px",
      "width": "6200px"
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
      "y": 800
    },
    "data": {
      "label": "Staff / fysisk drift",
      "index": 4,
      "height": "200px",
      "width": "6200px"
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
      "x": 92.95443064355118,
      "y": 93.78423058690238
    },
    "data": {
      "label": "Besök bokas",
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
    "id": "p_checkout",
    "type": "task",
    "position": {
      "x": 422.0884391423969,
      "y": 493.03143313302076
    },
    "data": {
      "label": "Roller checkout",
      "lane": "Roller",
      "tags": [
        "main"
      ],
      "note": "Bokning sker som vanligt i Roller.",
      "details": "Pilotens mobilflöde ersätter inte dagens checkout. Bokningen fortsätter att skapas i Roller via JumpYards hemsida.",
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
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_fetch",
    "type": "task",
    "position": {
      "x": 770,
      "y": 290
    },
    "data": {
      "label": "Hämta dagens bokningar",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Ingen webhook krävs för att trigga detta.",
      "details": "JumpYard Cloud kör ett schemalagt jobb som hämtar dagens bokningar och identifierar vilka gäster som ska få länk före sin session.",
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
      "width": 202,
      "height": 62
    }
  },
  {
    "id": "p_sms",
    "type": "task",
    "position": {
      "x": 1030,
      "y": 290
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
      "width": 317,
      "height": 62
    }
  },
  {
    "id": "p_open",
    "type": "task",
    "position": {
      "x": 1290,
      "y": 90
    },
    "data": {
      "label": "Öppna länken hemma, i bilen eller i entrén",
      "lane": "Gäst",
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
      "width": 312,
      "height": 62
    },
    "selected": false
  },
  {
    "id": "p_auth",
    "type": "task",
    "position": {
      "x": 1550,
      "y": 230
    },
    "data": {
      "label": "Autentisera mot Roller",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Cloud pratar med Roller i bakgrunden.",
      "details": "Webbappen eller cloud-lagret autentiserar för att kunna hämta bokning och skriva tillbaka add-ons och redeem senare.",
      "why": "Nödvändig systemsäkring före bokningsuppslag.",
      "systems": [
        "OAuth2 mot Roller"
      ],
      "sources": [
        "Chat transfer: Fas 2"
      ]
    },
    "measured": {
      "width": 193,
      "height": 62
    }
  },
  {
    "id": "p_detail",
    "type": "task",
    "position": {
      "x": 1810,
      "y": 430
    },
    "data": {
      "label": "GET BookingDetail",
      "lane": "Roller",
      "tags": [
        "main"
      ],
      "note": "Hämtar bokning, produkter, tickets och status.",
      "details": "Detta ger appen rätt bokningsdata inför resten av flödet.",
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
      "width": 156,
      "height": 62
    }
  },
  {
    "id": "p_show",
    "type": "task",
    "position": {
      "x": 1916.90588484532,
      "y": 289.3758347255492
    },
    "data": {
      "label": "Visa bokning och biljettinnehåll",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Tid, antal tickets och produkter syns för gästen."
    },
    "measured": {
      "width": 256,
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_quiz",
    "type": "task",
    "position": {
      "x": 2070,
      "y": 90
    },
    "data": {
      "label": "Genomför safety quiz",
      "lane": "Gäst",
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
      "height": 62
    },
    "selected": false
  },
  {
    "id": "p_store_quiz",
    "type": "task",
    "position": {
      "x": 2256.348497614805,
      "y": 229.37583472554923
    },
    "data": {
      "label": "Spara quiz i JumpYard Cloud",
      "lane": "JumpYard Cloud",
      "tags": [
        "main"
      ],
      "note": "Waiver-delen hålls utanför Roller.",
      "details": "Enligt designbeslutet sparas safety quiz i JumpYard Cloud och inte som Roller-waiver.",
      "why": "Minskar beroende till Roller-waiverflöde.",
      "systems": [
        "JumpYard Cloud"
      ],
      "risks": [
        "Det juridiska formatet för safety-accept behöver verifieras separat."
      ],
      "sources": [
        "Chat transfer: Fas 2",
        "Designbeslut: waiver utanför Roller"
      ]
    },
    "measured": {
      "width": 224,
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_addons",
    "type": "task",
    "position": {
      "x": 2460,
      "y": 90
    },
    "data": {
      "label": "Välj tillägg i samma flöde",
      "lane": "Gäst",
      "tags": [
        "main"
      ],
      "note": "Strumpor, band eller upplevelsepaket."
    },
    "measured": {
      "width": 208,
      "height": 62
    },
    "selected": false
  },
  {
    "id": "p_products",
    "type": "task",
    "position": {
      "x": 2613.309282878492,
      "y": 472.3582590764893
    },
    "data": {
      "label": "GET Products + POST Booking Costs",
      "lane": "Roller",
      "tags": [
        "main"
      ],
      "note": "Pris och köpbara tillägg hämtas utan ny bokning.",
      "details": "Roller används för att visa köpbara produkter och beräkna kostnad innan gästen betalar.",
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
      "width": 272,
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_pay",
    "type": "task",
    "position": {
      "x": 2850,
      "y": 90
    },
    "data": {
      "label": "Betala tillägg",
      "lane": "Gäst",
      "tags": [
        "main"
      ],
      "note": "Tänkt via Swish eller Adyen."
    },
    "measured": {
      "width": 150,
      "height": 62
    }
  },
  {
    "id": "p_provider",
    "type": "task",
    "position": {
      "x": 2811.964279811588,
      "y": 640.8673486252605
    },
    "data": {
      "label": "Extern betalning genomförs",
      "lane": "Betalning",
      "tags": [
        "main"
      ],
      "note": "Pilotantagande: extern betalning, sedan återrapportering."
    },
    "measured": {
      "width": 229,
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_edit",
    "type": "task",
    "position": {
      "x": 3110,
      "y": 430
    },
    "data": {
      "label": "PUT Edit Booking + POST Add Transaction Record",
      "lane": "Roller",
      "tags": [
        "main"
      ],
      "note": "Lägger till produkter på befintlig bokning.",
      "details": "Efter betalning uppdateras samma bokning och extern betalning registreras i Roller.",
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
      "width": 356,
      "height": 62
    }
  },
  {
    "id": "p_qr",
    "type": "task",
    "position": {
      "x": 3176.561194470362,
      "y": 255.22448439916616
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
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_arrive",
    "type": "task",
    "position": {
      "x": 3630,
      "y": 90
    },
    "data": {
      "label": "Anländ till park",
      "lane": "Gäst",
      "tags": [
        "main",
        "fallback"
      ],
      "note": "Nu ska flödet vara klart eller nästan klart."
    },
    "measured": {
      "width": 150,
      "height": 62
    }
  },
  {
    "id": "p_gate_ready",
    "type": "gateway",
    "position": {
      "x": 3851.151305408439,
      "y": 913.4086307292703
    },
    "data": {
      "label": "Pre-check-in klar?",
      "tags": [
        "main",
        "fallback"
      ]
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
      "x": 3981.7554611173464,
      "y": 106.04421957119857
    },
    "data": {
      "label": "Scanna entré-QR och gör webbflöde på plats",
      "lane": "Gäst",
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
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_fallback_tablet",
    "type": "task",
    "position": {
      "x": 4252.499581908861,
      "y": 910.520923095804
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
      "width": 298,
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_validate",
    "type": "task",
    "position": {
      "x": 4083.7616708514915,
      "y": 273.8595924276541
    },
    "data": {
      "label": "Validera QR eller pickup-kod",
      "lane": "JumpYard Cloud",
      "tags": [
        "main",
        "fallback"
      ],
      "note": "Molnlagret kontrollerar att gästen är redo."
    },
    "measured": {
      "width": 227,
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_redeem",
    "type": "task",
    "position": {
      "x": 4570.084053141222,
      "y": 467.98462187857444
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
      "details": "När gästen är framme markeras tickets som incheckade. Tidigare risk kring waiver ser ut att vara låg eftersom Gustav säger att de inte kör waiver i nuläget.",
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
      "width": 240,
      "height": 62
    },
    "selected": false,
    "dragging": false
  },
  {
    "id": "p_confirm",
    "type": "task",
    "position": {
      "x": 4930,
      "y": 230
    },
    "data": {
      "label": "Visa klar-bekräftelse till gäst",
      "lane": "JumpYard Cloud",
      "tags": [
        "main",
        "fallback"
      ],
      "note": "Kan bygga på HTTP 200 eller senare webhook.",
      "details": "Efter redeem får gästen en tydlig OK-status i mobilen som kan användas vid handout eller kontroll.",
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
      "width": 242,
      "height": 62
    }
  },
  {
    "id": "p_exception",
    "type": "task",
    "position": {
      "x": 4930,
      "y": 950
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
      "height": 62
    }
  },
  {
    "id": "p_pickup",
    "type": "task",
    "position": {
      "x": 5190,
      "y": 90
    },
    "data": {
      "label": "Hämta strumpor, band och ev. skåpkod",
      "lane": "Gäst",
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
      "width": 296,
      "height": 62
    }
  },
  {
    "id": "p_enter",
    "type": "event",
    "position": {
      "x": 5700.0339195421275,
      "y": 96.57983998795073
    },
    "data": {
      "label": "Inne i park",
      "type": "end",
      "tags": [
        "main",
        "fallback"
      ]
    },
    "measured": {
      "width": 48,
      "height": 48
    },
    "selected": true,
    "dragging": false
  }
] as any[];

export const pilotEdges = [
  {
    "id": "e-fetch-sms",
    "source": "p_fetch",
    "target": "p_sms",
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
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_checkout",
    "target": "p_fetch",
    "selected": false,
    "id": "xy-edge__p_checkouttop-p_fetch",
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
    "source": "p_sms",
    "target": "p_open",
    "sourceHandle": "top",
    "targetHandle": "left",
    "id": "xy-edge__p_smstop-p_openleft"
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
    "target": "p_auth",
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "id": "xy-edge__p_openbottom-p_authtop"
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
    "source": "p_start",
    "target": "p_checkout",
    "selected": false,
    "id": "xy-edge__p_startright-p_checkout",
    "sourceHandle": "right",
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
    "source": "p_detail",
    "target": "p_show",
    "sourceHandle": "top",
    "targetHandle": "bottom",
    "id": "xy-edge__p_detailtop-p_showbottom"
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
    "target": "p_quiz",
    "sourceHandle": "top",
    "targetHandle": "left",
    "id": "xy-edge__p_showtop-p_quizleft"
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
    "source": "p_store_quiz",
    "target": "p_addons",
    "selected": false,
    "id": "xy-edge__p_store_quiztop-p_addons",
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
    "source": "p_quiz",
    "target": "p_store_quiz",
    "sourceHandle": "bottom",
    "targetHandle": "left",
    "id": "xy-edge__p_quizbottom-p_store_quizleft",
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
    "source": "p_quiz",
    "sourceHandle": "right",
    "target": "p_addons",
    "targetHandle": "top",
    "id": "xy-edge__p_quizright-p_addonstop"
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
    "source": "p_provider",
    "target": "p_edit",
    "id": "xy-edge__p_providerright-p_edit",
    "sourceHandle": "right",
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
    "source": "p_pay",
    "target": "p_provider",
    "selected": false,
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "id": "xy-edge__p_paybottom-p_providertop"
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
    "source": "p_edit",
    "target": "p_qr",
    "sourceHandle": "top",
    "targetHandle": "bottom",
    "id": "xy-edge__p_edittop-p_qrbottom"
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
    "source": "p_qr",
    "target": "p_arrive",
    "sourceHandle": "top",
    "targetHandle": "left",
    "id": "xy-edge__p_qrtop-p_arriveleft"
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
    "source": "p_products",
    "target": "p_pay",
    "id": "xy-edge__p_productstop-p_pay",
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
    "source": "p_addons",
    "sourceHandle": "bottom",
    "target": "p_products",
    "targetHandle": "left",
    "id": "xy-edge__p_addonsbottom-p_productsleft"
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
    "markerEnd": {
      "type": "arrowclosed",
      "color": "#ff8e7d"
    },
    "style": {
      "strokeWidth": 2,
      "stroke": "#ff8e7d"
    },
    "source": "p_gate_ready",
    "target": "p_validate",
    "label": "ja",
    "labelStyle": {
      "fill": "#fff",
      "fontWeight": 700
    },
    "labelBgStyle": {
      "fill": "#1a1a1a"
    },
    "sourceHandle": "right",
    "targetHandle": "left",
    "id": "xy-edge__p_gate_readyright-p_validateleft"
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
  }
] as any[];

/* ============================================================
   BHHP – Featured Listings Update Patch
   Replaces stale / under-contract cards with current active ones.

   Last rotation: 2026-08-24
   To add more swaps: push another object into REPLACEMENTS.
   ============================================================ */
(function () {
  'use strict';

  /* ── Replacement manifest ──────────────────────────────────
     find  : substring of the address currently shown on the card
     price : new price string
     addr  : new address (short form shown on card)
     specs : new bed/bath/sqft line
     img   : primary photo URL from the IDX detail page
     url   : full IDX detail-page URL for the new listing
  ─────────────────────────────────────────────────────────── */
  var REPLACEMENTS = [
    // ── Hilton Head Island (HHI cards use | separator) ───────
    {
      find:  '12 Widewater',                   // hardcoded card
      price: '$8,995,000',                     // 2026-08-24: reduced from $9,375,000
      addr:  '33 Ruddy Turnstone Road',
      specs: '5 BD  |  5 BA  |  5,837 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/c9c84a52441eec713b4ea4a9b87d6cc6,1783001761140_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/265106786?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '100 Harbour Passage',       // card slot 2
      price: '$9,495,000',
      addr:  '52 Canvasback Road',
      specs: '4 BD  |  5 BA  |  4,025 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/64ae77744f344eb4d4f03997bd673e2b,1781634544220_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/259252093?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '46 Yorkshire',                    // hardcoded card
      price: '$5,295,000',
      addr:  '4 Plantation Drive',
      specs: '5 BD  |  6 BA  |  4,965 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/e68537ecfffa3ed568db2528e6745bc3,1782661620867_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/257617988?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '219 Jonesville Road',       // card slot 5
      price: '$3,875,000',
      addr:  '47 River Club Drive',
      specs: '5 BD  |  5 BA  |  6,330 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/cd7d8b9aaf2489a8d586e3f1b687dfc9,1784015281237_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/259588391?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '44 Sparwheel Lane',         // card slot 4 (2026-08-24: replaced 3 Stella Del Mare Manor)
      price: '$2,600,000',
      addr:  '17 Arthur Hills Court',
      specs: '5 BD  |  5 BA  |  3,600 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/ee1e32aed14a1c99241d91478abec1ce,1787462165300_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/268808611?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '2 Talon Court',             // card slot 6
      price: '$675,000',
      addr:  '34 Sweet Bay Lane',
      specs: '3 BD  |  4 BA  |  1,983 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/c1cd1cf08afbb9c72ea78b83cbe4c2b6,1784909220713_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267652061?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    // ── Bluffton (Bluffton cards use · separator) ────────────
    {
      find:  '16 Baldwin Lane',           // card slot 1
      price: '$2,400,000',
      addr:  '216 Hunting Lodge Road',
      specs: '4 BD  ·  5 BA  ·  3,475 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/c9898ff6e976c234916cf48d19768088,1786666595563_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267774583?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '91 Farnsleigh',             // hardcoded card (2026-08-24: original listing went inactive)
      price: '$1,475,000',
      addr:  '275 Belfair Oaks Boulevard',
      specs: '3 BD  ·  4 BA  ·  4,200 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/095c453ce8a505cf74d877de5ac2fd4d,1787146552053_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/268659484?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '30 Heathrow Avenue',        // card slot 2
      price: '$1,249,000',                // 2026-08-24: reduced from $1,300,000
      addr:  '55 Wicklow Drive',
      specs: '5 BD  ·  4 BA  ·  3,100 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/c905aaafb6f90e568732169bdc003999,1785267614767_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267750357?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '38 Newberry Court',         // hardcoded card (2026-08-24: original listing went inactive)
      price: '$1,050,000',
      addr:  '36 Skipperling Court',
      specs: '4 BD  ·  4 BA  ·  3,080 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/aeb3cbb7f52c45e7730525d7e2fecef7,1787163113793_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/268674581?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '108 Keller Springs',        // card slot 4 (2026-08-24: replaced 25 Golden Poppy Lane, pending)
      price: '$879,000',
      addr:  '110 Great Heron Way',
      specs: '3 BD  ·  3 BA  ·  2,360 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/49c5f9fac33745c9fc1121b636c9d389,1787330294690_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/268764582?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '149 Rudder Run',            // card slot 5 (2026-08-24: replaced 53 Coral Cove Road, pending)
      price: '$645,000',
      addr:  '231 Bluff Point Lane',
      specs: '3 BD  ·  2 BA  ·  2,172 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/018d5dc2b3851137b171f9232f56f11e,1787495460790_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/268812487?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    // ── Add more swaps here as needed ─────────────────────
  ];

  /* ── Core patch function ────────────────────────────────── */
  function applyReplacements() {
    var cards = document.querySelectorAll('.hhi-card');
    if (!cards.length) return false;

    var applied = 0;

    cards.forEach(function (card) {
      var addrEl = card.querySelector('.hhi-card-addr');
      if (!addrEl) return;

      var currentAddr = addrEl.textContent.trim();

      var match = null;
      for (var i = 0; i < REPLACEMENTS.length; i++) {
        if (currentAddr.toLowerCase().indexOf(REPLACEMENTS[i].find.toLowerCase()) !== -1) {
          match = REPLACEMENTS[i];
          break;
        }
      }
      if (!match) return;

      /* Update text nodes */
      var priceEl = card.querySelector('.hhi-card-price');
      var specsEl = card.querySelector('.hhi-card-specs');

      if (priceEl) priceEl.textContent = match.price;
      addrEl.textContent = match.addr;
      if (specsEl) specsEl.textContent = match.specs;

      /* Update hero image */
      var imgEl = card.querySelector('img');
      if (imgEl) {
        imgEl.src = match.img;
        imgEl.alt = match.addr + ' — Hilton Head Island';
      }

      /* Update the card link (the <a> is the card root or its first ancestor) */
      var anchor = card.tagName === 'A' ? card : card.querySelector('a');
      if (anchor) {
        anchor.setAttribute('href', match.url);
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }

      applied++;
    });

    return applied > 0;
  }

  /* ── Carousel order ────────────────────────────────────────
     Explicit order per rail, highest price first. Cards whose
     address matches no entry keep their relative position at
     the end of the rail.
  ─────────────────────────────────────────────────────────── */
  var HHI_ORDER = [
    '52 Canvasback',
    '33 Ruddy Turnstone',
    '4 Plantation Drive',
    '47 River Club',
    '17 Arthur Hills',
    '34 Sweet Bay',
  ];

  var BLUFFTON_ORDER = [
    '216 Hunting Lodge',
    '275 Belfair Oaks',
    '55 Wicklow',
    '36 Skipperling',
    '110 Great Heron',
    '231 Bluff Point',
  ];

  function reorderTrack(trackIndex, order) {
    var tracks = document.querySelectorAll('.hhi-track');
    if (tracks.length <= trackIndex) return false;

    var track = tracks[trackIndex];
    var cards = Array.prototype.slice.call(track.querySelectorAll('.hhi-card'));
    if (!cards.length) return false;

    function rankOf(card) {
      var el = card.querySelector('.hhi-card-addr');
      var addr = el ? el.textContent.trim().toLowerCase() : '';
      for (var i = 0; i < order.length; i++) {
        if (addr.indexOf(order[i].toLowerCase()) !== -1) return i;
      }
      return order.length; // unmatched cards fall to the end
    }

    var matched = false;
    var ranked = cards.map(function (card, index) {
      var rank = rankOf(card);
      if (rank < order.length) matched = true;
      return { card: card, rank: rank, index: index };
    });

    if (!matched) return false;

    ranked.sort(function (a, b) {
      return a.rank - b.rank || a.index - b.index;
    });

    ranked.forEach(function (entry) { track.appendChild(entry.card); });
    return true;
  }

  function reorderHHI()      { return reorderTrack(0, HHI_ORDER); }
  function reorderBluffton() { return reorderTrack(1, BLUFFTON_ORDER); }

  /* ── Run with retry (in case carousel renders after DOMContentLoaded) ─── */
  function run() {
    var replaced = applyReplacements();
    var reorderedH = reorderHHI();
    var reordered = reorderBluffton();

    if (replaced || reorderedH || reordered) return;

    var attempts = 0;
    var timer = setInterval(function () {
      var r1 = applyReplacements();
      var r0 = reorderHHI();
      var r2 = reorderBluffton();
      if ((r1 || r0 || r2) || ++attempts >= 15) {
        clearInterval(timer);
      }
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();

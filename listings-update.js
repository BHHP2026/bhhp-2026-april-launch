/* ============================================================
   BHHP – Featured Listings Update Patch
   Replaces stale / under-contract cards with current active ones.

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
      find:  '100 Harbour Passage',       // card slot 2
      price: '$9,495,000',
      addr:  '52 Canvasback Road',
      specs: '4 BD  |  5 BA  |  4,025 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/64ae77744f344eb4d4f03997bd673e2b,1781634544220_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/259252093?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '44 Sparwheel Lane',         // card slot 4
      price: '$7,400,000',
      addr:  '3 Stella Del Mare Manor',
      specs: '4 BD  |  6 BA  |  5,831 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/be136b5e1dad462660578c11274f83b7,1784145672990_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267293924?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '219 Jonesville Road',       // card slot 5
      price: '$3,999,000',
      addr:  '47 River Club Drive',
      specs: '5 BD  |  5 BA  |  6,330 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/cd7d8b9aaf2489a8d586e3f1b687dfc9,1784015281237_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/259588391?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '2 Talon Court',             // card slot 6
      price: '$675,000',
      addr:  '34 Sweet Bay Lane',
      specs: '3 BD  |  4 BA  |  1,983 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/c1cd1cf08afbb9c72ea78b83cbe4c2b6,1784909220713_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267652061?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '12 Widewater',                   // hardcoded card (1st visible)
      price: '$9,375,000',
      addr:  '33 Ruddy Turnstone Road',
      specs: '5 BD  |  5 BA  |  5,837 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/c9c84a52441eec713b4ea4a9b87d6cc6,1783001761140_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/265106786?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '46 Yorkshire',                    // hardcoded card (3rd visible)
      price: '$5,295,000',
      addr:  '4 Plantation Drive',
      specs: '5 BD  |  6 BA  |  4,965 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/e68537ecfffa3ed568db2528e6745bc3,1782661620867_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/257617988?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    // ── Bluffton (Bluffton cards use · separator) ────────────
    {
      find:  '16 Baldwin Lane',           // card slot 1
      price: '$2,400,000',
      addr:  '216 Hunting Lodge Road',
      specs: '4 BD  ·  5 BA  ·  3,475 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/045e9e16a9ce86fc9e64389ee5d7d6b0,1784824921283_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267774583?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '30 Heathrow Avenue',        // card slot 2
      price: '$1,300,000',
      addr:  '55 Wicklow Drive',
      specs: '5 BD  ·  4 BA  ·  3,100 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/d0236e2165a3f69f5ffcf052a97d63c0,1784991180980_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267750357?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '108 Keller Springs',        // card slot 4
      price: '$739,815',
      addr:  '25 Golden Poppy Lane',
      specs: '3 BD  ·  4 BA  ·  2,700 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/cc48a24dec2e46bfce6bbcb83239deaa,1785092763313_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267769171?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '149 Rudder Run',            // card slot 5
      price: '$684,430',
      addr:  '53 Coral Cove Road',
      specs: '5 BD  ·  3 BA  ·  2,800 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/d85b74c2b6c68c6da1147b3c9c2c0422,1785095162390_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267769861?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
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

  /* ── Bluffton carousel reorder ─────────────────────────────
     Target order (by address substring):
       1st : 82 Plantation House Drive
       2nd : 41 Buck Point Road
       last: 38 Newberry Court
     All other cards keep their relative positions in between.
  ─────────────────────────────────────────────────────────── */
  var BLUFFTON_ORDER = {
    first:  '82 Plantation House',
    second: '41 Buck Point',
    last:   '38 Newberry Court',
  };

  function reorderBluffton() {
    var tracks = document.querySelectorAll('.hhi-track');
    if (tracks.length < 2) return false;

    var track = tracks[1]; // Bluffton is the second hhi-track
    var cards = Array.from(track.querySelectorAll('.hhi-card'));
    if (!cards.length) return false;

    function addrOf(card) {
      var el = card.querySelector('.hhi-card-addr');
      return el ? el.textContent.trim().toLowerCase() : '';
    }

    var firstCard  = cards.find(function(c){ return addrOf(c).indexOf(BLUFFTON_ORDER.first.toLowerCase())  !== -1; });
    var secondCard = cards.find(function(c){ return addrOf(c).indexOf(BLUFFTON_ORDER.second.toLowerCase()) !== -1; });
    var lastCard   = cards.find(function(c){ return addrOf(c).indexOf(BLUFFTON_ORDER.last.toLowerCase())   !== -1; });

    if (!firstCard && !secondCard && !lastCard) return false;

    // Move "last" card to the end
    if (lastCard) track.appendChild(lastCard);

    // Move "second" card to front, then "first" in front of it
    var firstChild = track.firstChild;
    if (secondCard) track.insertBefore(secondCard, firstChild);
    if (firstCard)  track.insertBefore(firstCard,  track.firstChild);

    return true;
  }

  /* ── HHI carousel reorder ──────────────────────────────────
     Pin 201 Jonesville Road first; all other cards keep order.
  ─────────────────────────────────────────────────────────── */
  function reorderHHI() {
    var tracks = document.querySelectorAll('.hhi-track');
    if (!tracks.length) return false;

    var track = tracks[0]; // HHI is the first hhi-track
    var cards = Array.from(track.querySelectorAll('.hhi-card'));
    if (!cards.length) return false;

    function addrOf(card) {
      var el = card.querySelector('.hhi-card-addr');
      return el ? el.textContent.trim().toLowerCase() : '';
    }

    var firstCard = cards.find(function (c) { return addrOf(c).indexOf('201 jonesville') !== -1; });
    if (!firstCard) return false;

    if (track.firstChild !== firstCard) track.insertBefore(firstCard, track.firstChild);
    return true;
  }

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

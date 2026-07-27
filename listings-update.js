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
      price: '$5,900,000',
      addr:  '10 Bald Eagle Road',
      specs: '7 BD  |  7 BA  |  5,203 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/52d266bac61d2bacf720900e06e2c7d7,1784773560780_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267565988?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '44 Sparwheel Lane',         // card slot 4
      price: '$1,875,000',
      addr:  '50 Plantation Drive',
      specs: '3 BD  |  4 BA  |  2,721 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/b163c2acebd88d6849dfa24d3ec9ed70,1784743682513_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267546372?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '219 Jonesville Road',       // card slot 5
      price: '$1,195,000',
      addr:  '9 Wild Holly Court',
      specs: '3 BD  |  3 BA  |  2,244 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/8177a7a6f7e69af93feb228fb9393d02,1784838380040_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267652065?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
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

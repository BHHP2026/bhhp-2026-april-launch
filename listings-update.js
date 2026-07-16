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
      price: '$7,400,000',
      addr:  '3 Stella Del Mare Manor',
      specs: '4 BD  |  6 BA  |  5,831 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/be136b5e1dad462660578c11274f83b7,1784145672990_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267293924?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '44 Sparwheel Lane',         // card slot 4
      price: '$2,599,000',
      addr:  '37 Woodbine Place',
      specs: '4 BD  |  4 BA  |  2,767 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/84a71f6dbd5feb6a8819d032e194a66c,1784089220323_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267263086?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '219 Jonesville Road',       // card slot 5
      price: '$1,499,000',
      addr:  '44 Off Shore',
      specs: '4 BD  |  3 BA  |  1,932 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/6329bf01ff6bf99c2116191cffebbd82,1784140021400_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267271144?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '2 Talon Court',             // card slot 6
      price: '$965,000',
      addr:  '312 Seabrook Drive',
      specs: '3 BD  |  3 BA  |  2,588 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/1676f09038c6a8d9b7b970061b3b8ffb,1783716721453_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267084267?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    // ── Bluffton (Bluffton cards use · separator) ────────────
    {
      find:  '16 Baldwin Lane',           // card slot 1
      price: '$1,395,000',
      addr:  '20 Driftwood Court W',
      specs: '5 BD  ·  4 BA  ·  4,699 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/24443d47d90b10208589583acb1f0f80,1784213341340_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267321053?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '30 Heathrow Avenue',        // card slot 2
      price: '$800,000',
      addr:  '2 Lake Somerset Circle',
      specs: '3 BD  ·  3 BA  ·  2,994 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/cb902c978b8cf8d885481c0736ddf2a2,1784199419677_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267316955?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '108 Keller Springs',        // card slot 4
      price: '$615,000',
      addr:  '43 Yonges Island Drive',
      specs: '4 BD  ·  4 BA  ·  3,016 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/346ff43052469c42d05630ffba05bebd,1784213503450_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267324964?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '149 Rudder Run',            // card slot 5
      price: '$1,225,000',
      addr:  '2 Rice Mill Road',
      specs: '4 BD  ·  5 BA  ·  2,783 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/21066b04c8952671a44bb3e72bb74141,1784113860653_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/267262866?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
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

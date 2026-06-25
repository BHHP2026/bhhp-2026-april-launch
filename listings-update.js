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
      find:  '100 Harbour Passage',           // card slot 2
      price: '$3,995,000',
      addr:  '10 Wexford Drive',
      specs: '6 BD  |  7 BA  |  5,513 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/122a7238f04f1eda1dd445b4f134db19,1781772336170_auto_294',
      url:   'https://search.besthiltonheadproperties.com/search/detail/266332790?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '44 Sparwheel Lane',              // card slot 4
      price: '$2,100,000',
      addr:  '27 Cotesworth Place',
      specs: '5 BD  |  6 BA  |  4,494 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/26f389872e6fa76940cd2ba8588622fd,1781624407527_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/265562218?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=2&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '219 Jonesville Road',            // card slot 5
      price: '$1,825,000',
      addr:  '34 Seabrook Landing Drive',
      specs: '4 BD  |  5 BA  |  3,622 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/ee82ae941f8cb9064ad702efc6c4041c,1781613914660_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/265066000?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=3&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '2 Talon Court',                  // card slot 6
      price: '$1,799,000',
      addr:  '201 Jonesville Road',
      specs: '4 BD  |  4 BA  |  3,846 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/fe37ed2afaf096ecb47542913fb83843,1781296904993_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/265663936?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=2&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    // ── Bluffton (Bluffton cards use · separator) ────────────
    {
      find:  '16 Baldwin Lane',                // card slot 1 (was 37 5th Avenue)
      price: '$3,395,000',
      addr:  '82 Plantation House Drive',
      specs: '3 BD  ·  4 BA  ·  5,813 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/c3f1d1c4acea87737300147a63220bcd,1780930297920_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/265293328?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=5&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '30 Heathrow Avenue',             // card slot 2 (was 239 Belfair Oaks)
      price: '$2,298,000',
      addr:  '41 Buck Point Road',
      specs: '4 BD  ·  4 BA  ·  3,791 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/1adaa4350308f84e2b28b6811704e0e1,1780420242583_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/265019409?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=6&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '108 Keller Springs',             // card slot 4
      price: '$1,695,000',
      addr:  '9 Big Game Road',
      specs: '3 BD  ·  3 BA  ·  2,257 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/5a4fb88fef0ceb439a87b606090ad935,1782147661233_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/266158352?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=2&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '149 Rudder Run',                 // card slot 5
      price: '$799,000',
      addr:  '11 Tillinghast Circle',
      specs: '4 BD  ·  4 BA  ·  2,500 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/394fe2040257aa9378c1556bb81433e0,1781656412043_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/265735838?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=4&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    // ── Add more swaps here as needed ───────────────────────
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

  /* ── Run with retry (in case carousel renders after DOMContentLoaded) ─── */
  function run() {
    var replaced = applyReplacements();
    var reordered = reorderBluffton();

    if (replaced || reordered) return;

    var attempts = 0;
    var timer = setInterval(function () {
      var r1 = applyReplacements();
      var r2 = reorderBluffton();
      if ((r1 || r2) || ++attempts >= 15) {
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

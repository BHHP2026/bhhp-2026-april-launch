/* ============================================================
   BHHP – Featured Listings Update Patch
   Replaces stale / under-contract cards with current active ones.

   Last rotation: 2026-10-06
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
      find:  '12 Widewater',  // hardcoded card
      price: '$11,995,000',
      addr:  '19 Cedar Wax Wing Road',
      specs: '5 BD  |  7 BA  |  4,871 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/e8452db9cc6e2726a95b0891c1bbb32f,1790611805717_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270568244?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '100 Harbour Passage',  // card slot
      price: '$3,899,000',
      addr:  '18 Marsh Drive',
      specs: '4 BD  |  6 BA  |  4,631 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/1d13463d345b77813d2b841bb032e6e8,1790974822007_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270564105?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '46 Yorkshire',  // hardcoded card
      price: '$2,195,000',
      addr:  '12 Hummock Place',
      specs: '4 BD  |  5 BA  |  4,300 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/f7005080cbcfe55e061bc55e4c9c03bf,1791210319433_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270810382?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '219 Jonesville Road',  // card slot
      price: '$1,599,000',
      addr:  '121 Sandcastle Court',
      specs: '6 BD  |  4 BA  |  3,333 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/7bf32b8cdc62419b883d6d53308f7b2b,1790959741407_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270712871?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '44 Sparwheel Lane',  // card slot
      price: '$1,049,000',
      addr:  '11 Dolphin Point Lane',
      specs: '3 BD  |  3 BA  |  2,208 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/a8a32e71025f8cc8a9a935e985baa5f7,1790952203417_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270739294?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '2 Talon Court',  // card slot
      price: '$895,000',
      addr:  '42 Black Gum Lane',
      specs: '3 BD  |  3 BA  |  2,390 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/556fbfc83a7651a894354414c3591b2d,1791223260593_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270814001?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    // ── Bluffton (Bluffton cards use · separator) ────────────
    {
      find:  '16 Baldwin Lane',  // card slot
      price: '$5,600,000',
      addr:  '16 Nottingham Road',
      specs: '4 BD  ·  5 BA  ·  4,832 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/1a54589cfb9916d30c2888af2faac61c,1791136081617_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270797149?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '91 Farnsleigh',  // hardcoded card
      price: '$2,795,000',
      addr:  '49 Mason Street',
      specs: '4 BD  ·  5 BA  ·  3,075 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/e8e7a0643e2051ace09ca492cdd549d5,1791226320920_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270822971?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '30 Heathrow Avenue',  // card slot
      price: '$1,315,000',
      addr:  '126 Hampton Hall Boulevard',
      specs: '4 BD  ·  4 BA  ·  3,360 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/bc6b299734d7bd2f8d7a23e0825adf5a,1790517481290_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270545588?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '38 Newberry Court',  // hardcoded card
      price: '$1,048,000',
      addr:  '1 Great Heron Way',
      specs: '4 BD  ·  4 BA  ·  2,670 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/3f6633bae456eff610488543ed9a2476,1791224342443_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270806186?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '108 Keller Springs',  // card slot
      price: '$899,000',
      addr:  '25 Little Pine Court',
      specs: '4 BD  ·  3 BA  ·  3,182 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/6e1592008ae5d1226d9712b1b2d7f011,1790349963963_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270488275?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '149 Rudder Run',  // card slot
      price: '$639,900',
      addr:  '913 Danner Drive',
      specs: '5 BD  ·  4 BA  ·  3,128 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/40762fe699d83daaecea31f8d45d5700,1791228916967_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/270616589?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
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
    '19 Cedar Wax Wing',
    '18 Marsh',
    '12 Hummock',
    '121 Sandcastle',
    '11 Dolphin Point',
    '42 Black Gum',
  ];

  var BLUFFTON_ORDER = [
    '16 Nottingham',
    '49 Mason',
    '126 Hampton Hall',
    '1 Great Heron',
    '25 Little Pine',
    '913 Danner',
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

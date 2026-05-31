/* ============================================================
   BHHP - Featured Listings Update Patch
   Replaces stale / under-contract cards with current active ones.
   To add more swaps: push another object into REPLACEMENTS.
   ============================================================ */
(function () {
  'use strict';

  var REPLACEMENTS = [
    {
      find:  '100 Harbour Passage',
      price: '$1,799,000',
      addr:  '12 Primrose Lane',
      specs: '4 BD  |  5 BA  |  3,176 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/f03d8a6821b19f55660329bb54815d4c,1778584684347_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/263946582?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=2&s[locations][0][city]=Hilton%20Head%20Island&s[locations][0][state]=SC',
    },
    {
      find:  '30 Heathrow Avenue',
      price: '$1,499,000',
      addr:  '239 Belfair Oaks Boulevard',
      specs: '4 BD  .  4 BA  .  4,092 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/fdd36be12f1450236f3a1c7b9cdaa488,1780023360603_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/264812806?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=1&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
    {
      find:  '16 Baldwin Lane',
      price: '$600,000',
      addr:  '37 5th Avenue',
      specs: '3 BD  .  3 BA  .  2,088 SF',
      img:   'https://d25fhp1qfwqa2h.cloudfront.net/d3d83848eccd4f62228e8379ddba076b,1778250772663_auto_650',
      url:   'https://search.besthiltonheadproperties.com/search/detail/263820475?s[orderBy]=sourceCreationDate%2Cdesc&s[page]=5&s[locations][0][city]=Bluffton&s[locations][0][state]=SC',
    },
  ];

  var BLUFFTON_ORDER = {
    first:  '37 5th Avenue',
    second: '239 Belfair Oaks',
    last:   '38 Newberry Court',
  };

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
          match = REPLACEMENTS[i]; break;
        }
      }
      if (!match) return;
      var priceEl = card.querySelector('.hhi-card-price');
      var specsEl = card.querySelector('.hhi-card-specs');
      if (priceEl) priceEl.textContent = match.price;
      addrEl.textContent = match.addr;
      if (specsEl) specsEl.textContent = match.specs;
      var imgEl = card.querySelector('img');
      if (imgEl) { imgEl.src = match.img; imgEl.alt = match.addr; }
      var anchor = card.tagName === 'A' ? card : card.querySelector('a');
      if (anchor) { anchor.setAttribute('href', match.url); anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
      applied++;
    });
    return applied > 0;
  }

  function reorderBluffton() {
    var tracks = document.querySelectorAll('.hhi-track');
    if (tracks.length < 2) return false;
    var track = tracks[1];
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
    if (lastCard)   track.appendChild(lastCard);
    var ref = track.firstChild;
    if (secondCard) track.insertBefore(secondCard, ref);
    if (firstCard)  track.insertBefore(firstCard,  track.firstChild);
    return true;
  }

  function run() {
    var r1 = applyReplacements();
    var r2 = reorderBluffton();
    if (r1 || r2) return;
    var attempts = 0;
    var timer = setInterval(function () {
      var a = applyReplacements();
      var b = reorderBluffton();
      if ((a || b) || ++attempts >= 15) clearInterval(timer);
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
})();

// BHHP Floating Contact Widget
(function() {
  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var css = [
    '.bhhp-float{position:fixed;bottom:28px;right:28px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:12px;}',
    '.bhhp-float-panel{background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.18);padding:24px 28px 20px;min-width:268px;display:none;flex-direction:column;align-items:center;text-align:center;border-top:3px solid #B8942E;}',
    '.bhhp-float-panel.open{display:flex;}',
    '.bhhp-float-brand{font-family:"Lora",serif;font-size:15px;font-weight:600;color:#0a1628;margin-bottom:4px;line-height:1.3;}',
    '.bhhp-float-subtitle{font-family:"Montserrat",sans-serif;font-size:10px;font-weight:700;color:#B8942E;text-transform:uppercase;letter-spacing:1.8px;margin-bottom:18px;}',
    '.bhhp-float-phone{display:flex;align-items:center;gap:10px;text-decoration:none;font-family:"Montserrat",sans-serif;font-size:19px;font-weight:700;color:#0a1628;margin-bottom:10px;transition:color 0.2s;}',
    '.bhhp-float-phone:hover{color:#B8942E;}',
    '.bhhp-float-tagline{font-family:"Montserrat",sans-serif;font-size:11px;color:#888;line-height:1.6;}',
    '.bhhp-float-btn{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#9a7a24);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(184,148,46,0.5);transition:transform 0.2s;position:relative;}',
    '.bhhp-float-btn:hover{transform:scale(1.08);}',
    '.bhhp-float-dot{position:absolute;top:4px;right:4px;width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #fff;}',
    '@media(max-width:640px){.bhhp-float{bottom:18px;right:18px;}.bhhp-float-panel{display:none!important;}}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  var panel = '<div class="bhhp-float" id="bhhpFloat">'
    + '<div class="bhhp-float-panel" id="bhhpPanel">'
    + '<div class="bhhp-float-brand">Best Hilton Head Properties</div>'
    + '<div class="bhhp-float-subtitle">Do you have questions?</div>'
    + '<a href="tel:+18435483337" class="bhhp-float-phone">'
    + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8942E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.29 6.29l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
    + '(843) 548-3337</a>'
    + '<div class="bhhp-float-tagline">Call or text today, we are here to help!</div>'
    + '</div>'
    + '<button class="bhhp-float-btn" id="bhhpToggle" aria-label="Contact Best Hilton Head Properties">'
    + '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.29 6.29l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
    + '<span class="bhhp-float-dot"></span>'
    + '</button>'
    + '</div>';
  document.body.insertAdjacentHTML('beforeend', panel);
  document.getElementById('bhhpToggle').addEventListener('click', function() {
    if (isMobile) { window.location.href = 'tel:+18435483337'; }
    else { document.getElementById('bhhpPanel').classList.toggle('open'); }
  });
})();
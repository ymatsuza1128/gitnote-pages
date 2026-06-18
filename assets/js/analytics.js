// assets/js/analytics.js
// GA4 + outbound/store click tracking. Single source of truth for the site's web analytics.
(function () {
  var GA_ID = 'G-6HLJ4Y1VLP';

  // 1) Load gtag.js
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  // 2) Outbound / store click tracking (event delegation; covers every <a> on the page)
  var STORE_HOSTS = ['play.google.com', 'apps.apple.com', 'apps.microsoft.com'];
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (_) { return; }
    if (STORE_HOSTS.indexOf(url.hostname) !== -1) {
      gtag('event', 'store_click', {
        link_url: a.href, link_domain: url.hostname, page_path: location.pathname
      });
    } else if (url.hostname && url.hostname !== location.hostname) {
      gtag('event', 'outbound_click', {
        link_url: a.href, link_domain: url.hostname, page_path: location.pathname
      });
    }
  }, true);
})();

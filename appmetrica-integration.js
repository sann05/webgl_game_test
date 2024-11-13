import { APP_METRICA_KEY } from './config';

(function (m, e, t, r, i, k, a) {
  m[i] = m[i] || function () {
    (m[i].a = m[i].a || []).push(arguments);
  };
  m[i].l = 1 * new Date();
  k = e.createElement(t),
    a = e.getElementsByTagName(t)[0];
  k.async = 1;
  k.src = r;
  a.parentNode.insertBefore(k, a);
})(window, document, 'script', 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js', 'ym');

// Wait for the SDK to load before initializing with key
window.addEventListener('load', function () {
  if (window.APP_METRICA_KEY) {
    ym(window.APP_METRICA_KEY, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  } else {
    console.error('AppMetrica API key is missing');
  }
});

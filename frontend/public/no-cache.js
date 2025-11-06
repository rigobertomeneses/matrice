// Script para deshabilitar el caché en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Deshabilitar service workers en desarrollo
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }

  // Agregar meta tags para prevenir caché
  const metaNoCache = document.createElement('meta');
  metaNoCache.httpEquiv = 'Cache-Control';
  metaNoCache.content = 'no-cache, no-store, must-revalidate';
  document.head.appendChild(metaNoCache);

  const metaPragma = document.createElement('meta');
  metaPragma.httpEquiv = 'Pragma';
  metaPragma.content = 'no-cache';
  document.head.appendChild(metaPragma);

  const metaExpires = document.createElement('meta');
  metaExpires.httpEquiv = 'Expires';
  metaExpires.content = '0';
  document.head.appendChild(metaExpires);

  // Agregar timestamp a las URLs de recursos
  const timestamp = Date.now();

  // Forzar recarga de recursos con timestamp
  document.querySelectorAll('script[src], link[href]').forEach(element => {
    const attr = element.tagName === 'SCRIPT' ? 'src' : 'href';
    const url = element.getAttribute(attr);
    if (url && !url.includes('?')) {
      element.setAttribute(attr, `${url}?v=${timestamp}`);
    }
  });

  console.log('Caché deshabilitado en desarrollo');
}
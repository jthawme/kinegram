(function() {
  if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      if (registration.active) {
        console.log('Service worker installed');
      }
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;

        installingWorker.onstatechange = function() {
          switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              const event = new CustomEvent('sw-updated');
              window.dispatchEvent(event);
            } else {
              console.log('A new Service worker was installed');
            }
            break;
          case 'redundant':
            console.log('The Service worker was made redundant');
            break;
          }
        };
      };
    });
  }
})();

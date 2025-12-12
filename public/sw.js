/**
 * Vyxo Codex 2.0 - Service Worker
 * Gère les notifications push et le cache offline
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `vyxo-codex-${CACHE_VERSION}`;

// Ressources à mettre en cache
const STATIC_CACHE = [
  '/icons/vyxo-logo-192.png',
  '/icons/vyxo-badge-72.png',
  '/manifest.json',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_CACHE);
    })
  );

  // Activer immédiatement
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    // Nettoyer les anciens caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Prendre le contrôle immédiatement
  self.clients.claim();
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  if (!event.data) {
    console.warn('[SW] Push event has no data');
    return;
  }

  try {
    const data = event.data.json();

    const options = {
      body: data.body || data.message || '',
      icon: data.icon || '/icons/vyxo-logo-192.png',
      badge: data.badge || '/icons/vyxo-badge-72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.data?.url || data.url || '/dashboard',
        timestamp: Date.now(),
        ...data.data,
      },
      actions: [
        {
          action: 'open',
          title: 'Voir',
          icon: '/icons/action-open.png',
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/icons/action-close.png',
        },
      ],
      tag: data.tag || 'vyxo-notification',
      renotify: true,
      requireInteraction: data.priority === 'urgent',
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Vyxo Codex', options)
    );
  } catch (error) {
    console.error('[SW] Error parsing push notification:', error);
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Action 'open' ou clic sur la notification
  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Vérifier si une fenêtre Vyxo est déjà ouverte
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // Naviguer vers la bonne URL puis focus
          return client.navigate(urlToOpen).then((client) => client.focus());
        }
      }

      // Ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Gestion des erreurs de notification push
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] Push subscription changed');

  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        console.log('[SW] Subscription renewed:', subscription);
        // TODO: Envoyer la nouvelle subscription au serveur
        return fetch('/api/notifications/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription.toJSON()),
        });
      })
  );
});

// Stratégie de cache pour les requêtes réseau
self.addEventListener('fetch', (event) => {
  // Ne cacher que les assets statiques
  if (event.request.url.includes('/icons/') || event.request.url.includes('/manifest.json')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }

  // Laisser passer toutes les autres requêtes
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service worker loaded');

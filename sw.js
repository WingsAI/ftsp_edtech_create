// Service Worker para PWA - Cache First Strategy
const CACHE_NAME = 'conversalearn-v1';
const ASSETS_TO_CACHE = [
    '/index.html',
    '/styles.css',
    '/app.js',
    '/content-structure.json',
    '/manifest.json'
];

// Instalação - Cachear arquivos essenciais
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando arquivos da aplicação');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Ativação - Limpar caches antigos
self.addEventListener('activate', (event) => {
    console.log('[SW] Ativando Service Worker...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Cache First com fallback para rede
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Se encontrou no cache, retorna
                if (cachedResponse) {
                    console.log('[SW] Servindo do cache:', event.request.url);
                    return cachedResponse;
                }

                // Se não, busca na rede e cacheia
                return fetch(event.request)
                    .then((response) => {
                        // Não cachear se não for uma resposta válida
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clonar a resposta (pode ser usada apenas uma vez)
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Se offline e não está no cache, retorna página de erro
                        console.log('[SW] Offline e recurso não encontrado no cache');

                        // Aqui você pode retornar uma página offline customizada
                        // return caches.match('/offline.html');
                    });
            })
    );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

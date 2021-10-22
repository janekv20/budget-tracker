const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = "data-cache-" + VERSION;

const FILES_TO_CACHE = [
    './index.html',
    './js/idb.js',
    './js/index.js',
    './css/style.css',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png'

];
//Service Worker installation
self.addEventListener('install', function(e) {
    e.waituntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('install cache: ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

//Activation of Service Worker and deleting old cache data
self.addEventListener('activate', function(e) {
    e.waituntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Old cahced data being removed', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
//Fetch Requests
self.addEventListener('fetch', function(e) {
    if (e.request.url.includes('/api/')) {
        e.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(e.request)
                .then(response => {
                    if (response.status ===200) {
                        cache.put(e.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(e.request);
                })
            })
            .catch(err => console.log(err))
        )
        return;
    }
    e.respondWith(
        fetch(e.request).catch(function () {
            return caches.match(e.request).then(function (response) {
                if (response) {
                    return response;
                }
                else if (e.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/');
                }
            })
        })
    )
})
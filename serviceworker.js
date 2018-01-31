/**
 *
 * serviceworker.js
 * Event listeners of 'install' and 'fetch' for service worker's cache API
 *
 * @author kartik
 * @updated 2018-01-12
 * @version 1.0
 *
 */


/**
 * Install service worker and provide list of files to be cached
 */
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('mwsrrs3').then(function (cache) {
            return cache.addAll(
                [
                    '/img',
                    '/css/styles.css',
                    '/js/dbhelper.js',
                    '/js/main.js'
                ]
            );
        })
    );
});


/**
 * Retrieve from service worker when available, otherwise fetch from network and cache
 */
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open('mwsrrs3').then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('static').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/static/images/content/foto-13.jpg',
                '/static/css/styles.min.css',
                '/static/js/main.js',
                '/static/js/libs.min.js',
                '/static/js/jquery-3.3.1.min.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(resp) {
            return resp || fetch(event.request).then(function (response) {
                    return caches.open('static').then(function (cache) {
                        cache.put(event.request, response);
                        return response;
                    });
                }).catch(function () {
                    return cahces.match('/static/images/content/foto-13.jpg')
                });
        })
    );
});

self.addEventListener('fetch', function(event) {
    let response;
    event.respondWith(caches.match(event.request).then(function() {
        return fetch(event.request);
    }).then(function(r) {
        response = r;
        caches.open('static').then(function(cache) {
            cache.put(event.request, response);
        });
        return response.clone();
    }).catch(function() {
        return caches.match('/static/images/content/foto-13.jpg');
    }));
});
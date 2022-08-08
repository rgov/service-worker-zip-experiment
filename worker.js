// On installation of this service worker, prepare our dependencies
let db;
self.addEventListener("install", (e) => {
    console.log("Service Worker: Installing");

    // Load JSZip from the CDN
    e.waitUntil((async () => {
        const url = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        const request = await fetch(url);

        console.log("Service Worker: JSZip has arrived");
        eval(await request.text());
    })());

    // Connect to the database
    e.waitUntil(new Promise((resolve, reject) => {
        const request = indexedDB.open("db");

        request.onsuccess = (e) => {
            console.log("Service Worker: IndexedDB is ready");
            db = e.target.result;
            resolve();
        };

        request.onupgradeneeded = (e) => {
            console.error("Service Worker: Database needs upgrade?");
            reject();
        };

        request.onerror = (e) => {
            console.error("Service Worker: Could not load IndexedDB");
            reject();
        };
    }));
});


// On activation of this service worker, take control of all clients
self.addEventListener("activate", (e) => {
    console.log("Service Worker: Activating");

    // Important! Start processing fetches for all clients immediately.
    //
    // MDN: "When a service worker is initially registered, pages won't use it
    // until they next load. The claim() method causes those pages to be
    // controlled immediately."
    e.waitUntil(clients.claim());
});


self.addEventListener("fetch", (e) => {
    console.log("Service Worker: Handling fetch to", e.request.url);

    // Pass through any requests that do not appear relevant
    if (!(new URL(e.request.url)).pathname.startsWith("/localzip/")) {
        e.respondWith(fetch(e.request));
        return;
    }

    console.log("I will intercept this request!");
});

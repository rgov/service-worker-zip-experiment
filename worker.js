// On installation of this service worker, connect to the database
let db;
self.addEventListener("install", (e) => {
    console.log("Service Worker: Installing");

    // Wait until we are connected to the database before we consider ourselves
    // "installed".
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
    console.log("fetch");
});

// Fetch and render the README text
(async () => {
    const response = await fetch("README.md");
    document.getElementById("readme").innerHTML =
        (new showdown.Converter()).makeHtml(await response.text());
})();


// Function to start the service worker once the database is ready
const registerServiceWorker = () => {
    console.log("Registering service worker");
    navigator.serviceWorker.register('worker.js', { scope: '/localzip/' });
};

// Create an IndexedDB database
let db;
(() => {
    const request = indexedDB.open("db");

    request.onsuccess = (e) => {
        console.log("IndexedDB is ready");
        db = e.target.result;
        registerServiceWorker();
    };

    // Called the first time to set up our database
    request.onupgradeneeded = (e) => {
        let db = e.target.result;
        db.createObjectStore("zip");
    };

    request.onerror = (e) => {
        console.error("Could not load IndexedDB");
    };
})();


// Click event handler for Download button
document.getElementById("load").addEventListener("click", async (e) => {
    const response = await fetch("archive.zip");
    const buffer = await response.arrayBuffer();

    const transaction = db.transaction(["zip"], "readwrite");
    transaction.oncomplete = (e) => {
        document.getElementById("loadstatus").innerText = "Loaded!";
    };

    transaction.objectStore("zip").put(buffer, 0 /* key */);
});


// Click event handler for Display button
document.getElementById("display").addEventListener("click", (e) => {
    document.getElementById("image").src = "/localzip/maeby.jpg";
});


// Load event handler for image, to update caption with URL
document.getElementById("image").addEventListener("load", (e) => {
    document.getElementById("caption").innerText = `URL: ${e.target.src}`;
});

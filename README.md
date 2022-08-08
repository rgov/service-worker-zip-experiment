# Service Worker Zip Experiment

This projects demonstrates a service worker capable of serving resources from a zip archive stored in the browser's local IndexedDB.

Requests to `/localzip/resource` are intercepted by the service worker, which serves the corresponding `resource` file from the zip.

To create the archive, use: `zip archive.zip archive/*`

let dbname = 'mwsrrs2',
    objectStoreName = 'restaurants',
    indexeddbSupport;
var db;


document.addEventListener('DOMContentLoaded', (event) => {
// Get indexeddb support
    indexeddbSupport = "indexedDB" in window;
    var openRequest = indexedDB.open(dbname, 1);

    openRequest.onupgradeneeded = function (event) {
        console.log("onupgradeneeded");
        db = event.target.result;
        openRequest.result.createObjectStore(objectStoreName, {keyPath: "id"});
    };

    openRequest.onsuccess = function (event) {
        console.debug("DB open");
        db = event.target.result;
    };

    openRequest.onerror = function (event) {
        console.error("Could not open db");
        console.dir(event);
    };
}, false);


storeInDB = (restaurants) => {

    var transaction = db.transaction([objectStoreName], 'readwrite');

    var objectStore = transaction.objectStore(objectStoreName);

    if (restaurants != undefined) {
        restaurants.forEach(function (restaurant) {
            objectStore.put(restaurant);
        });
    }
    transaction.oncomplete = function () {
        console.info("Write complete");
    };
    transaction.onerror = function (event) {
        console.error(event);
    };
};

fetchFromDb = () => {

    var data;
    var transaction = db.transaction([objectStoreName], "readonly");
    var objectStore = transaction.objectStore(objectStoreName);
    data = [];
    var cursorr = objectStore.openCursor();
    cursorr.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            data.push(cursor.value);
            cursor.continue();
        }
    };
    cursorr.onerror = function (event) {
        console.log(event);
    };
    return data;
};

fetchFromDbById = (id) => {

    var transaction = db.transaction([objectStoreName], "readonly");
    var objectStore = transaction.objectStore(objectStoreName);

    let data = objectStore.get(Number(id));

    data.onsuccess = function (e) {
        console.log(e.target.result);
        return e.target.result;
    };

    data.onerror = function (e) {
        console.log(e);
    }
};
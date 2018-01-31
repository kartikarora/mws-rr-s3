let dbname = 'mwsrrs3',
    resObjectStoreName = 'restaurants',
    revObjectStoreName = 'reviews',
    indexeddbSupport;
var db;


document.addEventListener('DOMContentLoaded', (event) => {
// Get indexeddb support
    indexeddbSupport = "indexedDB" in window;
    var openRequest = indexedDB.open(dbname, 1);

    openRequest.onupgradeneeded = function (event) {
        console.log("onupgradeneeded");
        db = event.target.result;
        openRequest.result.createObjectStore(resObjectStoreName, {keyPath: "id"});
        openRequest.result.createObjectStore(revObjectStoreName, {keyPath: "id"});
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


storeRestaurantsInDB = (restaurants) => {

    var transaction = db.transaction([resObjectStoreName], 'readwrite');

    var objectStore = transaction.objectStore(resObjectStoreName);

    if (restaurants) {
        restaurants.forEach(function (restaurant) {
            objectStore.put(restaurant);
        });
    }
    transaction.oncomplete = function () {
        console.info("Restaurant write complete");
    };
    transaction.onerror = function (event) {
        console.error(event);
    };
};

storeReviewsInDB = (reviews) => {

    var transaction = db.transaction([revObjectStoreName], 'readwrite');

    var objectStore = transaction.objectStore(revObjectStoreName);

    if (reviews) {
        reviews.forEach(function (review) {
            objectStore.put(review);
        });
    }
    transaction.oncomplete = function () {
        console.info("Review write complete");
    };
    transaction.onerror = function (event) {
        console.error(event);
    };
};

fetchRestaurantFromDb = () => {

    var data;
    var transaction = db.transaction([resObjectStoreName], "readonly");
    var objectStore = transaction.objectStore(resObjectStoreName);
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

fetchRestaurantFromDbById = (id) => {

    var transaction = db.transaction([resObjectStoreName], "readonly");
    var objectStore = transaction.objectStore(resObjectStoreName);

    let data = objectStore.get(Number(id));

    data.onsuccess = function (e) {
        console.log(e.target.result);
        return e.target.result;
    };

    data.onerror = function (e) {
        console.log(e);
    }
};

fetchReviewFromDb = () => {

    var data;
    var transaction = db.transaction([resObjectStoreName, revObjectStoreName], "readonly");
    var objectStore = transaction.objectStore(revObjectStoreName);
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

fetchReviewByRestaurantIdFromDb = (id) => {

    var data;
    var transaction = db.transaction([revObjectStoreName], "readonly");
    var objectStore = transaction.objectStore(revObjectStoreName);
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
let allRestaurants, allReviews;

window.onload = function () {
    storeRestaurantsInDB(allRestaurants);
    storeReviewsInDB(allReviews);
};

/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return "http://localhost:1337";
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', DBHelper.DATABASE_URL + "/restaurants");
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) { // Got a success response from server!
                const json = JSON.parse(xhr.responseText);
                allRestaurants = json;
                callback(null, json);
            } else { // Oops!. Got an error from server.
                const error = (`Request failed. Returned status of ${xhr.status}`);
                // callback(error, null);
                const json = fetchRestaurantFromDb();
                callback(null, json);
            }
        };
        xhr.send();
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {

        // fetch all restaurants with proper error handling.
        let xhr = new XMLHttpRequest();
        xhr.open('GET', DBHelper.DATABASE_URL + "/restaurants/" + id);
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) { // Got a success response from server!
                const json = JSON.parse(xhr.responseText);
                if (json) { // Got the restaurant
                    callback(null, json);
                } else { // Restaurant does not exist in the database
                    const json = fetchRestaurantFromDbById(id);
                    callback(null, json);
                }
            }
        };
        xhr.send();
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        let src = "/img/" + (restaurant.photograph ? "placeholder.png" : (restaurant.photograph + ".jpg"));
        return (src);
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
                position: restaurant.latlng,
                title: restaurant.name,
                url: DBHelper.urlForRestaurant(restaurant),
                map: map,
                animation: google.maps.Animation.DROP
            }
        );
        return marker;
    }

    /**
     * Fetch all reviews.
     */
    static fetchReviews(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', DBHelper.DATABASE_URL + "/reviews/");
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) { // Got a success response from server!
                const json = JSON.parse(xhr.responseText);
                allReviews = json;
                callback(null, json);
            } else { // Oops!. Got an error from server.
                const error = (`Request failed. Returned status of ${xhr.status}`);
                // callback(error, null);
                const json = fetchReviewFromDb();
                callback(null, json);
            }
        };
        xhr.send();
    }

    /**
     * Fetch all reviews by restaurant id.
     */
    static fetchReviewsByRestaurantId(id, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', DBHelper.DATABASE_URL + "/reviews/?restaurant_id=" + id);
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) { // Got a success response from server!
                const json = JSON.parse(xhr.responseText);
                callback(null, json);
            } else { // Oops!. Got an error from server.
                const error = (`Request failed. Returned status of ${xhr.status}`);
                // callback(error, null);
                const json = fetchReviewByRestaurantIdFromDb(id);
                callback(null, json);
            }
        };
        xhr.send();
    }

}

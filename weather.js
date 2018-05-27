const weatherApiKey = 'c92d29f26dc95d07fb107f05df96fa90';
const googleMapsApiKey = 'AIzaSyCA6iVmM_bCQIKI5HejVIRxtCHPlmWT5V0';
const weatherUrl = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${
    weatherApiKey}/`;
const mapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
const locUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleMapsApiKey}`;

function getCardinalDir(deg) {
    if (typeof deg === 'undefined') {
        return "N";
    }
    var directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW",
        "W", "WNW", "NW", "NNW", "N"];
    var index = Math.round((deg % 360)/22.5);
    return directions[index];
}

function getCityAndState(json) {
    var city, state, c, t;
    var prefix = json.results[0];

    for (c in prefix.address_components) {
        var cPrefix = prefix.address_components[c];

        for (t in cPrefix.types) {
            if (cPrefix.types[t] === "locality" && city === undefined) {
                city = cPrefix.short_name;
            } else if (cPrefix.types[t] === "administrative_area_level_1" && state === undefined) {
                state = cPrefix.short_name;
            }
        }
    }

    return `${city}, ${state}`;
}

function printTimeFromUnix(unixTime) {
    var date = new Date(unixTime * 1000);
    var timeOfDay;
    var hour = date.getHours() + (date.getTimezoneOffset() / 60) - 5;
    var min = String(date.getMinutes());

    if (min.length < 2) {
        min = "0" + min;
    }

    if (hour === 0 || hour === 24) {
        hour = 12;
        timeOfDay = 'AM';
    } else if (hour < 12) {
        timeOfDay = 'AM';
    } else {
        timeOfDay = 'PM';
        if (hour > 12) {
            hour = hour % 12;
        }
    }

    return `Updated ${hour}:${min} ${timeOfDay}`;
}

function printDateFromUnix(unixTime) {
    var date = new Date(unixTime * 1000 + 86400000);
    var day = date.getDate();
    var month = date.getMonth() + 1;

    return `${month}/${day}`;
}

var loc;
var weatherRequestUrl;
var mapsRequestUrl;

var locRequest = new Request(locUrl, { method: 'POST' });

fetch(locRequest).then(response => {
    if (response.status === 200) {
        response.json().then(json => {
            mapsRequestUrl = `${mapsUrl}latlng=${json.location.lat},${json.location.lng}&key=${
                googleMapsApiKey}`;

            var request = new Request(mapsRequestUrl);
            fetch(request).then(response => {
                if (response.status === 200) {
                    response.json().then(json => {
                        document.getElementById("name").innerHTML = getCityAndState(json);
                        document.getElementById("coords").innerHTML =
                                `Long: ${json.results[0].geometry.location.lng.toFixed(2)},
                                Lat: ${json.results[0].geometry.location.lat.toFixed(2)}`;

                        weatherRequestUrl =
                            `${weatherUrl}${json.results[0].geometry.location.lat.toFixed(2)},` +
                            `${json.results[0].geometry.location.lng.toFixed(2)}?units=uk2`;

                        request = new Request(weatherRequestUrl);
                        return fetch(request).then(response => {
                            if (response != undefined) {        //DarkSky response header doesn't contain status
                                response.json().then(json => {
                                    document.getElementById("temp").innerHTML =
                                        `${Math.round(json.currently.temperature)}\u2103`;
                                    document.getElementById("precip").innerHTML = 
                                        `${Math.round(json.currently.precipProbability * 100)} perc`
                                    document.getElementById("pressure").innerHTML = `${parseFloat(
                                        json.currently.pressure / 33.86).toFixed(2)} inhg`;
                                    document.getElementById("humid").innerHTML =
                                        `${Math.round(json.currently.humidity * 100)} perc`;
                                    document.getElementById("wind").innerHTML = `${parseFloat(
                                        json.currently.windSpeed)}&nbsp;&nbsp;mph`;
                                    document.getElementById("windIcon").innerHTML =
                                        `<i class="wi wi-wind from-${json.currently.windBearing
                                        }-deg"></i>`;
                                    document.getElementById("time").innerHTML =
                                        `${printTimeFromUnix(json.currently.time)}`;
                                    document.getElementById("icon").innerHTML =
                                        `<i class="wi wi-forecast-io-${json.currently.icon}"></i>`;

                                    var i;
                                    for(i = 1; i <= 5; i++) {
                                        var prefix = json.daily.data;

                                        document.getElementById(`day${i}Icon`).innerHTML =
                                            `<i class="wi wi-forecast-io-${prefix[i].icon}"></i>`;
                                        document.getElementById(`day${i}Date`).innerHTML =
                                            printDateFromUnix(prefix[i].time);
                                        document.getElementById(`day${i}High`).innerHTML =
                                            `${Math.round(prefix[i].temperatureHigh)}&deg;`;
                                        document.getElementById(`day${i}Low`).innerHTML =
                                            `${Math.round(prefix[i].temperatureLow)}&deg;`;
                                    }
                                });
                            } else {
                                throw new Error('Unable to contact DarkSky API');
                            }
                        });
                    });
                } else {
                    throw new Error('Unable to contact Google Maps API');
                }
            });
        });
    } else {
        throw new Error('Unable to contact Google Geolocation API');
    }
});

"use strict";

(function() {

/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
    var RESPONSES = {
        '/countries': [
            {name: 'Cameroon', continent: 'Africa'},
            {name :'Fiji Islands', continent: 'Oceania'},
            {name: 'Guatemala', continent: 'North America'},
            {name: 'Japan', continent: 'Asia'},
            {name: 'Yugoslavia', continent: 'Europe'},
            {name: 'Tanzania', continent: 'Africa'}
        ],
        '/cities': [
            {name: 'Bamenda', country: 'Cameroon'},
            {name: 'Suva', country: 'Fiji Islands'},
            {name: 'Quetzaltenango', country: 'Guatemala'},
            {name: 'test', country: 'Guatemala'},
            {name: 'Osaka', country: 'Japan'},
            {name: 'Subotica', country: 'Yugoslavia'},
            {name: 'Zanzibar', country: 'Tanzania'}
        ],
        '/populations': [
            {count: 138000, name: 'Bamenda'},
            {count: 77366, name: 'Suva'},
            {count: 90801, name: 'Quetzaltenango'},
            {count: 2595674, name: 'Osaka'},
            {count: 100386, name: 'Subotica'},
            {count: 157634, name: 'Zanzibar'}
        ]
    };

    setTimeout(function () {
        var result = RESPONSES[url];
        if (!result) {
            return callback('Unknown url');
        }

        callback(null, result);
    }, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
 */

var requests = ['/countries', '/cities', '/populations'];

/**
* Обертка над запросом к API, которая возвращает Promise
*
* @param {String} url
* @returns {Promise}
*/

function getDataPromise(url) {
    return new Promise(function(resolve, reject){
        getData(url, function(err, result){
            if (err) {
                reject({
                    url: url,
                    error: err
                });
            }
            else {
                resolve(result);
            }
        });
    });
}

/**
* Ф-ия возвращает Promise данных API
*
* @param {Array} urls - массив urls, куда необходимо сделать запрос
* @return {Promise}
*/

function getAllData(urls) {
    return Promise.all(urls.map(function(url){
        return getDataPromise(url);
    }));
}

/**
*
* @param {String} name
* @returns {Promise}
*/
function getPopulation(name) {
    return getAllData(requests)
        .then(function(results){
            var countries = results[0];
            var cities = results[1];
            var population = results[2];
            // Захардкодим вычисление населения Африки для более быстрого поиска
            if (name === 'Africa') {
                return calcAfricaPopulation(countries, cities, population);
            }
            else {
                return calcPopulation(name, cities, population);
            }
        });
}

/**
*
* @param {Array} countries
* @param  {Array} cities
* @param  {Array} populations
* @returns {number}
*/
function calcAfricaPopulation(countries, cities, populations) {
    var africaCountries = [];
	var africaCities = [];
	var population = 0;
	var i;

    for (i = 0; i < countries.length; i++) {
        if (countries[i].continent === 'Africa') {
            africaCountries.push(countries[i].name);
        }
    }
    for (i = 0; i < cities.length; i++) {
        if (africaCountries.indexOf(cities[i].country) !== -1) {
            africaCities.push(cities[i].name);
        }
    }
    for (i = 0; i < populations.length; i++) {
        if (africaCities.indexOf(populations[i].name) !== -1) {
            population += populations[i].count;
        }
    }

    return population;
}

/**
*
* @param {String} name
* @param {Array} cities
* @param {Array} populations
* @returns {number}
*/
function calcPopulation(name, cities, populations) {
	var resultCities = [];
	var population = 0;
	var i;

    for (i = 0; i < populations.length; i++) {
        if (populations[i].name === name) {
            return populations[i].count;
        }
    }

    for (i = 0; i < cities.length; i++) {
        if (cities[i].country === name) {
			resultCities.push(cities[i].name);
        }
    }

	for (i = 0; i < populations.length; i++) {
		if (resultCities.indexOf(populations[i].name) !== -1) {
            population += populations[i].count;
        }
	}

	return population;
}

getPopulation('Africa')
	.then(function(value){
		console.log('Total population in African cities: ', value);
	})
	.catch(function(){
		alert('Got an API error');
	});

var name = window.prompt('Enter name of a city or country');
if (name) {
	getPopulation(name)
		.then(function(value){
			console.log('Total population of ' + name +': ', value);
		})
		.catch(function(){
			alert('Got an API error');
		});
}
})();


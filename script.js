const URL_METEO = "https://api.openweathermap.org/data/2.5/weather";
const APIKEY = "7a0ee5988d92e87091d7c7331b08e5be";


class City{
    constructor(name,lat,lon){
        this.name = name;
        this.lat = lat;
        this.lon = lon ;
        this.tempRes = 0;
        this.tempMin = 0;
        this.tempMax = 0;
        this.icon = "";
        this.wet = 0;
        this.windDir = 0;
        this.windSpeed = 0;
    }

}



function getCitiesObjects(cityName){
    fetch(`https://geo.api.gouv.fr/communes?nom=${cityName}&fields=centre`)
    .then(function(data) {
        /*console.log(data.json());*/
        return data.json()
    })
    .then(function(dataJson){
        let cityList = []
        for (i=0;i<dataJson.length;i++){
            cityList.push(
                new City(
                    dataJson[i].nom,
                    dataJson[i].centre.coordinates[0],
                    dataJson[i].centre.coordinates[1]))
        };
        return cityList;
    })
    .then(function(cities){
        for (i=0;i<cities.length;i++){
            let curCity = cities[i]
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cities[i].lat}&lon=${cities[i].lon}&appid=${APIKEY}&units=metric`)
            .then(function(meteodata){
                return meteodata.json()
            })
            .then(function(meteodataJson){
                curCity.tempRes = meteodataJson.main.temp;
                curCity.tempMin = meteodataJson.main.temp_min;
                curCity.tempMax = meteodataJson.main.temp_max;
                curCity.wet = meteodataJson.main.humidity;
                curCity.windDir = meteodataJson.wind.deg;
                curCity.windSpeed = meteodataJson.wind.speed;
                curCity.icon = meteodataJson.weather[0].icon;
            })

        }
        console.log(cities);
    })
    /*
    .catch(function(data) {
        console.log("catch",data.json());
    })*/
}

getCitiesObjects("Toulouse")

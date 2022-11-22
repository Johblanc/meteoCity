const APIKEY = "7a0ee5988d92e87091d7c7331b08e5be";
const DIV_AFFICHAGE = document.getElementById("citiesInfo")

class City{
    constructor(name,lat,lon){
        this.name = name;
        this.lat = lat;
        this.lon = lon ;
        this.tempRes = 0;
        this.tempMin = 0;
        this.tempMax = 0;
        this.iconImage = "";
        this.wet = 0;
        this.windDir = 0;
        this.windSpeed = 0;
    }
    appendCity(){
        let result = this.#appendListElement();
        result.appendChild(this.#appendNom(this.name));
        result.appendChild(this.#appendIcon(`https://openweathermap.org/img/wn/${this.iconImage}@2x.png`));
        result.appendChild(this.#appendParagraphe(this.tempMin));
        result.appendChild(this.#appendParagraphe(this.tempMax));
        result.appendChild(this.#appendParagraphe(this.tempRes));
        result.appendChild(this.#appendParagraphe(this.windSpeed));
        result.appendChild(this.#appendParagraphe(this.windDir));
        result.appendChild(this.#appendParagraphe(this.wet));
        console.log(result);

        return result;
    }

    #appendNom(content){
        const newh2 = document.createElement("h2");
        newh2.textContent = content;
        return newh2;
    }
    #appendIcon(src){
        const newImg = document.createElement("img");
        newImg.setAttribute("src",src);
        return newImg;
    }
    #appendParagraphe(content){
        const newP = document.createElement("p");
        newP.textContent = content;
        return newP;
    }
    #appendDivision(){
        const newDiv = document.createElement("div");
        return newDiv;
    }

    #appendListElement(){
        const newDiv = document.createElement("li");
        return newDiv;
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
                return meteodata.json();
            })
            .then(function(meteodataJson){
                //const meteoCopy = JSON.parse(JSON.stringify(meteodataJson))
                curCity.tempRes = Number(meteodataJson.main.temp);
                curCity.tempMin = Number(meteodataJson.main.temp_min);
                curCity.tempMax = Number(meteodataJson.main.temp_max);
                curCity.wet = Number(meteodataJson.main.humidity);
                curCity.windDir = Number(meteodataJson.wind.deg);
                curCity.windSpeed = Number(meteodataJson.wind.speed);
                curCity.iconImage = String(meteodataJson.weather[0].icon);
                affichageCity( curCity);
            })

        }
    })

    function affichageCity(completCity){
        DIV_AFFICHAGE.appendChild( completCity.appendCity());
    }
    /*
    .catch(function(data) {
        console.log("catch",data.json());
    })*/
}

getCitiesObjects("Toulouse")

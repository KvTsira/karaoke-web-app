var search = document.getElementById("search-field");
var searchBtn = document.getElementById("search");
var songList = document.getElementById("song-list")
var accessToken = "UAzdTm4zgiU6lk_3xsyqJf9iI_5bv5yIDVbgLld44Y3U90kuq2IR3uoBZ6j66XbT";


var getArtistSongs = function(artist){
    var apiUrl = "https://api.genius.com/search?q=" + artist + "&access_token=" + accessToken
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data)
                songList.innerHTML = "";
                if(data.response.hits.length === 0){
                    songList.textContent = "Please Enter A Valid Artist"
                }
                for (let i=0; i<data.response.hits.length; i++){
                    var songItemEl = document.createElement("li")
                    var title = data.response.hits[i].result.title;
                    var artist = data.response.hits[i].result.artist_names;
                    var songEl = document.createElement("a");
                    songEl.href = "#"
                    songEl.textContent = title + " by " + artist
                    songItemEl.appendChild(songEl);
                    songList.appendChild(songItemEl);
                }
            })
        } 
    })
}

var searchButtonHandler = function(event){
    event.preventDefault();
    var userInput = search.value
    getArtistSongs(userInput);
}
searchBtn.addEventListener("click", searchButtonHandler)

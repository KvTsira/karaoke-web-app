var search = document.getElementById("search-field");
var accessToken = config.genius_api_token;
var getArtistSongs = function(){
    var apiUrl = "https://api.genius.com/search?q=Kendrick%20Lamar&access_token=" + accessToken
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
    })
}

getArtistSongs();
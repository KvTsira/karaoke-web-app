var search = document.getElementById("search-field");
var searchBtn = document.getElementById("search");
var accessToken = "UAzdTm4zgiU6lk_3xsyqJf9iI_5bv5yIDVbgLld44Y3U90kuq2IR3uoBZ6j66XbT";
var searchHistory = document.getElementById("search-history");
var txtResult=document.getElementById("result")
var artistSearches = [];
var tableBody = document.getElementById("tbody");

// Get the modal
var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var tbodyEl = document.querySelector('tbody');

//removes the rows from the table
var removeRows = function() {
    while(tbodyEl.hasChildNodes())
    {
        tbodyEl.removeChild(tbodyEl.firstChild);
    }
}

var getArtistSongs = function(artist){
    //call api based on search terms
    var apiUrl = "https://api.genius.com/search?q=" + artist + "&access_token=" + accessToken
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //if the artist or song returns no hits display message
                if(data.response.hits.length === 0){
                    tableBody.textContent = "Please Enter A Valid Artist or Song Title"
                    return;
                } else{
                    //set artist searches array into local storage
                    localStorage.setItem("history", JSON.stringify(artistSearches));
                    //run for loop and iterate through song list and display them in a list as buttons
                    for (let i=0; i<data.response.hits.length; i++){
                        var songItemEl = document.createElement("li")
                        //pull data from response and create two variables 
                        var title = data.response.hits[i].result.title;
                        var artist = data.response.hits[i].result.artist_names;

                        tbodyEl.innerHTML += `
                            <tr>
                                <td class=".row-data">${artist}</td>
                                <td class=".row-data">${title}</td>
                                <td><button class="selectBtn btn-primary">Select</button></td>
                            </tr>
                        `;
                    }
                }
            })
        } 
    })
}

var getLyrics = function(artist, title){
    var apiUrl = "https://api.lyrics.ovh/v1/" + artist + "/" + title
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                modal.style.display = "block";
                txtResult.textContent = data.lyrics
            })
        } else {
            var error = document.getElementById("error-message")
            error.textContent = "No Lyrics Found for Song"
            return;
        }
    })
}
//add a function that responses to click events
function onselectRow(e){
    //check if the button is clicked
    if(!e.target.classList.contains('selectBtn')){
        return;
    }
    
    //get the row number
    var row_num = parseInt($(e.target).parent().parent().index());
    var oCells=tbodyEl.rows.item(row_num).cells;
    var artist = oCells.item(0).innerHTML
    var song = oCells.item(1).innerHTML

    //write the selected item artist and title to the text box

    txtResult.innerHTML="Artist: " + oCells.item(0).innerHTML + "; Title: " + oCells.item(1).innerHTML ; 
    var error = document.getElementById("error-message")
    error.innerHTML = "";
    getLyrics(artist.replace(/\([^()]*\)/g, ''), song.replace(/\([^()]*\)/g, ''))
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

//add an event to table rows buttons
tbodyEl.addEventListener('click', onselectRow);


var searchButtonHandler = function(event){
    event.preventDefault();
    //pull whatever is in local storage
    var tempStorageArr = JSON.parse(localStorage.getItem("history"))
    if(!tempStorageArr){
        //if empty just return an empty array
        tempStorageArr =[];
    } else {
        //add whatever is in local storage into the artistSearches arr
        artistSearches = tempStorageArr
    }
    //on click grab data from search bar
    var userInput = search.value

    //clear the table
    removeRows();

    //run that data as a parameter through get artist songs function
    getArtistSongs(userInput);

    //push the input into artist searches array
    //check if the user input was valid
    if(userInput !== null && userInput !== ""){

        //check if the item already exists in the array
        if(artistSearches.includes(userInput)) {
            return;
        }

        //check for the artistSearches length
        if(artistSearches.length===10) {
            //remove the first(oldest item)
            artistSearches.splice(0,1)
        } 
        //add search item to the aray
        artistSearches.push(userInput);
    }
   
}

var searchHistoryHandler = function(){
    //get any info from local storage
    var searchHistoryArr = JSON.parse(localStorage.getItem("history")) 
    //if no info, return empty array
        if(!searchHistoryArr){
            searchHistoryArr = [];
        }
    for(let i=0; i<searchHistoryArr.length; i++){
        var searchHistoryBtns = document.createElement("button");
        searchHistoryBtns.textContent = searchHistoryArr[i];
        searchHistoryBtns.setAttribute("id","history-btn")
        searchHistory.appendChild(searchHistoryBtns)
    }
    
}
var searchHistoryBtnHandler = function (event){
    //if the user clicks the button then it will run getArtistSongs with the text content of the button as input
    if(event.target.id = "history-btn"){
        event.preventDefault();
        //take the text content of the button and create a variable for it
        var input = event.target.textContent
        //clear the table
        removeRows();
        //pass the input as a parameter for getArtistSongs
        getArtistSongs(input);
    }
}
searchBtn.addEventListener("click", searchButtonHandler);
searchHistory.addEventListener("click", searchHistoryBtnHandler);
searchHistoryHandler();

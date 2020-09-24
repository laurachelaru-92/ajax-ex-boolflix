$(document).ready(function(){


// Evento al click sul bottone "cerca"
$("#cerca").click(function() {
  // Prendiamo come query per la ricerca dei film l'input dell'utente
  var inputUtente = $("#search-input").val();
  // Chiamiamo la funzione di ricerca del film SE l'input non è vuoto
  if(inputUtente != "") {
    clearSearch();
    movieSearch(inputUtente);
    tvSearch(inputUtente);
  }
});

// Evento all'invio
$("#search-input").keyup(
  function(e){
    if(e.which == 13) {
    // Prendiamo come query per la ricerca dei film l'input dell'utente
      var inputUtente = $("#search-input").val();
      // Chiamiamo la funzione di ricerca del film SE l'input non è vuoto
      if(inputUtente != "") {
        clearSearch();
        movieSearch(inputUtente);
        tvSearch(inputUtente);
      }
    }
  });


// FUNZIONI --------------------------------------------------------------------

// Funzione che converte il "vote" con massimale "max" in un numero con massimale 5
function convertVote(vote, max) {
  // "Rating5" è il voto con massimale 5.
  var vote5 = Math.ceil((vote * 5) / max);
  return vote5;
}

// Funzione che stampa il voto "num" in stelle (max 5)
function starPrint(num) {
  var fullStar = $("#fullstar-template").html();
  var emptyStar = $("#emptystar-template").html();
  var result = "";
  for(var i = 0; i < num; i++) {
    result += fullStar;
  }
  for(var j = 0; j < (5-num); j++) {
    result += emptyStar;
  }
  return result;
}

// Funzione che prende la lingua originale e ne stampa la bandiera
function savedFlags(lang) {
  var flagsArray = ["en", "it", "de", "fr", "es", "ro", "ja", "sv"];
  if(flagsArray.includes(lang)) {
    return true;
  }
  else {
    return false;
  }
}

// Funzione che prende un input e ricerca film nell'API
function movieSearch(inputGenerico) {
  $.ajax({
    "url": "https://api.themoviedb.org/3/search/movie",
    "data": {
      "api_key": "4c51a288148bd58a06eb503205aefc6f",
      "language": "it-IT",
      "query": inputGenerico,
      "page": 1,
      "include_adult": false,
    },
    "method": "GET",
    "success": function(dati) {
      var risultati = dati.results;
      movieTvPrint("film", risultati);
    },
    "error": function(error) {
      alert("You've got an error!");
    }
  });
}

// Funzione che prende un input e ricerca serie tv nell'API
function tvSearch(inputGenerico) {
  $.ajax({
    "url": "https://api.themoviedb.org/3/search/tv",
    "data": {
      "api_key": "4c51a288148bd58a06eb503205aefc6f",
      "language": "it-IT",
      "query": inputGenerico,
      "page": 1,
      "include_adult": false,
    },
    "method": "GET",
    "success": function(data) {
      var risultati = data.results;
      movieTvPrint("tv", risultati);
    },
    "error": function(error) {
      alert("Another error");
    }
  });
}

// Funzione che prende un array e stampa ogni suo FILM nel template handlebars
function movieTvPrint(type,objectArray) {
  for(var i=0; i < objectArray.length; i++) {
    // Prendiamo il template di handlebars
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);
    // Controlliamo se il poster_path è diverso da null
    if(objectArray[i].poster_path != null) {
      var isPosterJS = true;
    } else {
      var isPosterJS = false;
    }
    // Calcoliamo il voto da 1 a 5
    var vote10 = objectArray[i].vote_average;
    var vote5 = convertVote(vote10, 10);
    // Mettiamo il valore di "original_language" in una variabile
    var language = objectArray[i].original_language;
    // Riempiamo il template di handlebars e lo appendiamo
    var content = {
      "title": objectArray[i].title || objectArray[i].name,
      "isPosterHTML": isPosterJS,
      "poster-path": objectArray[i].poster_path,
      "original_title": objectArray[i].original_title || objectArray[i].original_name,
      "img-flag": savedFlags(language),
      "flag-lang": language,
      "vote_average": starPrint(vote5),
      "content-type": type
    };
    var html = template(content);
    $("#movies").append(html);
  }
}

// Funzione che svuota il valore di html e value dopo la ricerca
function clearSearch() {
  $("ul#movies").empty();
  $("ul#tv-series").empty();
  $("#search-input").val("");
}


});

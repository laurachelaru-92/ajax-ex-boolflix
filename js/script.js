$(document).ready(function(){


// Evento al click sul bottone "cerca"
$("#cerca").click(function() {
  // Prendiamo come query per la ricerca dei film l'input dell'utente
  var inputUtente = $("#movie-input").val();
  // Chiamiamo la funzione di ricerca del film
  movieSearch(inputUtente);
  clearSearch();
});

// Evento all'invio
$("#movie-input").keyup(
  function(e){
    if(e.which == 13) {
      // Prendiamo come query per la ricerca dei film l'input dell'utente
      var inputUtente = $("#movie-input").val();
      movieSearch(inputUtente);
      clearSearch();
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
function printFlag(lang) {
  return "img/flags/"+lang+".svg";
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
      moviePrint(risultati);
    },
    "error": function(error) {
      alert("You've got an error!");
    }
  });
}

// Funzione che svuota il valore di html e value dopo la ricerca
function clearSearch() {
  $("ul#movies").empty();
  $("#movie-input").val("");
}

// Funzione che prende un array e stampa ogni suo elemento nel template handlebars
function moviePrint(objectArray) {
  for(var i=0; i < objectArray.length; i++) {
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);
    // Calcoliamo il voto da 1 a 5
    var vote10 = objectArray[i].vote_average;
    var vote5 = convertVote(vote10, 10);
    // Mettiamo il valore di "original_language" in una variabile
    var language = objectArray[i].original_language;
    // Riempiamo il template di handlebars e lo appendiamo
    var content = {
      "title": objectArray[i].title,
      "original_title": objectArray[i].original_title,
      "original_language": printFlag(language),
      "no_flag": objectArray[i].original_language,
      "vote_average": starPrint(vote5)
      };
    var html = template(content);
    $("#movies").append(html);
  }
}


});

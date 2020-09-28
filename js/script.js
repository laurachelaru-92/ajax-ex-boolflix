$(document).ready(function(){

// Evento al click sul bottone "cerca"
$("#cerca").click(function() {
  // Prendiamo come query per la ricerca dei film l'input dell'utente
  var inputUtente = $("#search-input").val();
  // Chiamiamo la funzione di ricerca del film SE l'input non è vuoto
  if(inputUtente != "") {
    clearSearch();
    movieTvSearch("movie", inputUtente);
    movieTvSearch("tv", inputUtente);
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
        movieTvSearch("movie", inputUtente);
        movieTvSearch("tv", inputUtente);
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

// Funzione che prende un input e ricerca film e serie tv nell'API
function movieTvSearch(type,inputGenerico) {
  $.ajax({
    "url": "https://api.themoviedb.org/3/search/"+type,
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
      // Stampiamo in HTML i film e/o le serie tv se ci sono risultati
      if(dati.total_results > 0) {
        $("#"+type+"-section").removeClass("d-none");
        movieTvPrint(type, risultati);
      } else {
        notFound(type);
      }
    },
    "error": function(error) {
      alert("You've got an error!");
    }
  });
}

// Funzione per nessun risultato trovato
function notFound(type) {
  var source = $("#not-found-template").html();
  $("#"+type+"-section").removeClass("d-none");
  $("#"+type+"-section").children("i").addClass("d-none");
  $("#"+type+"-section").append(source);
}

// Funzione che prende un array e stampa ogni suo FILM nel template handlebars
function movieTvPrint(type,objectArray) {
  for(var i=0; i < objectArray.length; i++) {
    // Prendiamo il template di handlebars
    var source = $("#element-template").html();
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
    // Facciamo una chiamata ajax degli attori prendendo l'id e il type
    var movieId = (objectArray[i].id).toString();
    var actorsArray = [];
    $.ajax({
      "url": "https://api.themoviedb.org/3/"+type+"/"+movieId+"/credits",
      "data": {
        "api_key": "4c51a288148bd58a06eb503205aefc6f",
      },
      "method": "GET",
      "success": function(data) {
        var risultati = data.cast;
        actorsArray.push(risultati[0].name);
      },
      "error": function(err) {
        alert("errore!");
      }
    });
    console.log("Actors: " + actorsArray);
    // Riempiamo il template di handlebars
    var content = {
      "title": objectArray[i].title || objectArray[i].name,
      "isPosterHTML": isPosterJS,
      "poster-path": objectArray[i].poster_path,
      "original_title": objectArray[i].original_title || objectArray[i].original_name,
      "attori5": actorsArray.join(", "),
      "img-flag": savedFlags(objectArray[i].original_language),
      "flag-lang": objectArray[i].original_language,
      "vote_average": starPrint(vote5),
      "content-type": type
    };
    // Appendiamo l'elemento nella lista corrispondente
    var html = template(content);
    if(type == "movie") {
      $("#movies").append(html);
    } else if (type == "tv") {
      $("#tv-series").append(html);
    }
    // Facciamo sì che la scrollbar della lista sia impostata all'inizio
    $("ul").scrollLeft(0);
  }
}

// Funzione che svuota il valore di html e value dopo la ricerca
function clearSearch() {
  $("ul#movies li").remove();
  $("ul#tv-series li").remove();
  $("section > p").remove();
  $("#search-input").val("");
}

// Funzione che, al click sulla freccia destra/sinistra scrolla nella direzione
$("main").on("click", "section > i", function() {
  var scrollPosition = $(this).siblings("ul").scrollLeft();
  if($(this).hasClass("fa-chevron-circle-right")) {
    $(this).siblings("ul").scrollLeft(scrollPosition + 400);
  } else if($(this).hasClass("fa-chevron-circle-left")) {
    $(this).siblings("ul").scrollLeft(scrollPosition - 400);
  }
});

// Funzione che, preso l'id di un film o serie tv, ne cerca gli attori
// function getActors(type, movieId) {
//
// }



});

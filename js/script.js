$(document).ready(function(){


// Evento al click sul bottone "cerca"
$("#cerca").click(movieSearch);

// Evento all'invio
$("#movie-input").keyup(
  function(e){
    if(e.which == 13) {
      movieSearch();
    }
  });

// Creiamo la funzione che prende l'input e ricerca tra i film
function movieSearch() {
  // Prendiamo come query per la ricerca dei film l'input dell'utente
  var inputUtente = $("#movie-input").val();
  // Svuotiamo l'html che contiene la nostra lista di film
  $("ul#movies").empty();
  // Parte la chiamata ajax
  $.ajax({
    "url": "https://api.themoviedb.org/3/search/movie",
    "data": {
      "api_key": "4c51a288148bd58a06eb503205aefc6f",
      "language": "it-IT",
      "query": inputUtente,
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
  // Svuotiamo il valore di input
  $("#movie-input").val("");
};

// Creiamo una funzione che prenda un array e stampi ogni suo elemento nel template handlebars
function moviePrint(objectArray) {
  for(var i=0; i < objectArray.length; i++) {
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);
    var content = {
      "title": objectArray[i].title,
      "original_title": objectArray[i].original_title,
      "original_language": objectArray[i].original_language,
      "vote_average": objectArray[i].vote_average
      };
    var html = template(content);
    $("#movies").append(html);
  }
};


});

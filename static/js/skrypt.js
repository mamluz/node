$(document).ready(function(){
  var poj= $(".poj")
  poj.css("background-color","darkgrey")
  poj.css("border","1px solid black")

  function obrlogin() {
    imge = $("<img>")
    imge.css("width","400px")
    imge.css("height","250px")
    imge.attr("src","/bg.jpg")
    imge.css("position","absolute")
    imge.css("left","50px")
    imge.css("border","2px solid black")
    $("#glowny").append(imge)
  }

  function obrfirst() {
    imge = $("<img>")
    imge.css("width","400px")
    imge.css("height","250px")
    imge.attr("src","/bgf.jpg")
    imge.css("position","absolute")
    imge.css("left","50px")
    imge.css("border","2px solid black")
    $("#first").append(imge)
  }
  obrfirst()
  obrlogin()
  //ustawianie pojemnika w adminie
  $(".wielki").css("position","relative")
  $(".wielki").css("width","800px")
  $(".wielki").css("height","auto")
  $(".wielki").css("background-color","lightgrey")
  $(".wielki").css("margin","0 auto")
  $(".wielki").css("border","3px solid black")
//ustawianie przycisku wylogowywania
  $("#logout").css("position","absolute")
  $("#logout").css("right","30px")

  $("input").css("background-color","cyan")
  $("input").css("border","2px solid green")
  $("input").css("border-radius","25px")

  $("#logout").click(function () {
    window.location.href = "http://localhost:3000/logout"
  })

})

// var title = $(".title")
// var body = $(".body")
// var save = $(".save")
// var bottom = $(".bottom-section")
//
//cardLibrary is our storage object
console.log('this is connected');


var search = $(".search")

function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }


search.on('keyup', function() {
  // console.log('search stuff')
  var searchTerm = $(this).val().toLowerCase();
  for (var cardId in cardLibrary) {
    var cardObject = cardLibrary[cardId]
    console.log(isFunction (cardObject))
  }
})

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
  var cards = []
  for (var cardID in cardLibrary) {
    cards.push(cardID)
    }
  onlyCardIDs = cards.filter(function(c) {
    return c > 0 ? c : null
  })
  console.log(onlyCardIDs)
  onlyCardIDs.map(function (c) {
    var card = cardLibrary[c]
    var title = card.title.toLowerCase()
    var body = card.body.toLowerCase()
    var $card = $('#'+card.id)
    if (title.match(searchTerm) || body.match(searchTerm)) {
      console.log('match');
      $card.toggle(true)
    } else {
      $card.toggle(false)
    }
  })
})


//

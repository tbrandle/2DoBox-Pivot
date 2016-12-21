//cardLibrary is our storage object
var search = $(".search")

search.on('keyup', function() {
  var searchTerm = $(this).val().toLowerCase();
  var cards = []
  for (var cardID in cardLibrary) {
    cards.push(cardID)
    }
  onlyCardIDs = cards.filter(function(c) {
    return c > 0 ? c : null
  })
  onlyCardIDs.map(function (c) {
    var card = cardLibrary[c]
    var title = card.title.toLowerCase()
    var body = card.body.toLowerCase()
    var $card = $('#'+card.id)
    if (title.match(searchTerm) || body.match(searchTerm)) {
      $card.toggle(true)
    } else {
      $card.toggle(false)
    }
  })
})

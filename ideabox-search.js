//cardLibrary is our storage object

$('.search').on('keyup', function() {
  var searchTerm = $(this).val().toLowerCase();
  var cardIDs = Object.keys(cardLibrary)
  cardIDs.map(function (c) {
    var card = cardLibrary[c]
    var $card = $('#'+card.id)
    if (card.title.toLowerCase().match(searchTerm)
    || card.body.toLowerCase().match(searchTerm)) {
      $card.toggle(true)
    } else {
      $card.toggle(false)
    }
  })
})
'

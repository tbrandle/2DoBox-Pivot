//cardLibrary is our storage object

$('.search').on('keyup', function() {
  const searchTerm = $(this).val().toLowerCase();
  const cardIDs = Object.keys(cardLibrary)
  cardIDs.map( c => {
    const card = cardLibrary[c]
    const $card = $('#'+card.id)
    if (card.title.toLowerCase().match(searchTerm)
    || card.body.toLowerCase().match(searchTerm)) {
      $card.toggle(true)
    } else {
      $card.toggle(false)
    }
  })
})

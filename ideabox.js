var title = $(".title")
var body = $(".body")
var save = $(".save")
var bottom = $(".bottom-section")

var cardLibrary = {}
// cardLibrary = {cardID: Card}

// {id: cardObject, id2: cardobject}

$("form").submit(function(e) {
   e.preventDefault();
})

save.on("click", function() {
  console.log(title.val());
  console.log(body.val());
  var newCard = new Card(title.val(), body.val())
  newCard.addCardToPage()
  cardLibrary[getCardID($(newCard))] = newCard
})

function getCardID(card) {
  //card is a jQuery object
  return card.attr('id')
}

//new card object > localStorage > card processing > display

function Card (title, body, quality) {
  this.title = title;
  this.body = body;
  this.quality = quality || "swill"
  this.id = Date.now();
}

Card.prototype.createHTML = function () {
  return `<article id = "${this.id}" class = "card">
     <h2>${this.title}</h2>
     <button class = "close-card">X</button>
     <p class = "card-body">${this.body}</p>
     <div class = "quality-arrows">
        <button class = "up-arrow">^</button>
        <button class = "down-arrow">v</button>
        <p class = "card-quality">quality: swill</p>
     </div>
     <hr>
  </article>`
};

Card.prototype.addCardToPage = function () {
  console.log(this.id)
  var html = this.createHTML()
  bottom.append(html)
};

bottom.on('click', '.close-card', function() {
  $(this).parent().remove()
})

bottom.on('click', '.up-arrow', function() {
  //get the card id, pull that card from the library, update the quality(both on page and in storage)
  var cardID = getCardID($(this).closest('.card'))
  console.log(cardID)
})

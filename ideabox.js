var title = $(".title")
var body = $(".body")
var save = $(".save")
var bottom = $(".bottom-section")

$("form").submit(function(e) {
   e.preventDefault();
})

function Library() {}
// cardLibrary = {cardID: Card}
// {id1: cardObject, id2: cardobject}

Library.prototype.store = function () {
  localStorage.setItem('lib1', JSON.stringify(this))
  console.log(JSON.parse(localStorage.getItem('lib1')));
};

Library.prototype.load = function (library) {
  //check if localStorage, if so, load the saved library
  if(localStorage.length) {
    var libLoad = JSON.parse(localStorage.getItem('lib1'))
    for (var card in libLoad) {
      card = libLoad[card]
      regenCard = new Card(card.title, card.body, card.quality, card.id)
      regenCard.post()
      console.log(regenCard);
      library[regenCard.id] = regenCard
    }
  }
};


Library.prototype.pullCard = function (e) {
  console.log('in PullCard')
  return cardLibrary[$(e).closest('.card').attr('id')]
};

Library.prototype.removeCard = function (card) {

};


// function Library() {
//   protos:
//   -add new card (both on screen and in library)
//   -remove card
//   -store library
//   -load library
// }


function Card (title, body, quality, id) {
  this.id = id || Date.now();
  this.title = title;
  this.body = body;
  this.quality = quality || "swill"
}

Card.prototype.post = function () {
  bottom.prepend(
    `<article id = "${this.id}" class = "card">
       <h2>${this.title}</h2>
       <button class = "close-card">X</button>
       <p class = "card-body">${this.body}</p>
       <div class = "quality-arrows">
          <button class = "up-arrow">^</button>
          <button class = "down-arrow">v</button>
          <p class = "card-quality">quality: ${this.quality}</p>
       </div>
       <hr>
    </article>`
  )}


Card.prototype.upvoteFunction = function(card) {
  if (this.quality === 'swill') {
    this.quality = 'plausible'
    card.find('.card-quality').replaceWith('<p class = "card-quality">quality: plausible</p>')
  } else if (this.quality === 'plausible') {
    this.quality = 'genius'
    card.find('.card-quality').replaceWith('<p class = "card-quality">quality: genius</p>')
  }
}

Card.prototype.downvoteFunction = function(card) {
  if (this.quality === 'genius') {
    this.quality = 'plausible'
    card.find('.card-quality').replaceWith('<p class = "card-quality">quality: plausible</p>')
  } else if (this.quality === 'plausible') {
    this.quality = 'swill'
    card.find('.card-quality').replaceWith('<p class = "card-quality">quality: swill</p>')
  }
}

function findCard(e) {
  return $(e).closest('.card')
}


bottom.on('click', '.close-card', function() {
  cardLibrary.removeCard(this)

  $(this).parent().remove()
  //Remove from library

})

bottom.on('click', '.up-arrow', function() {
  var thisCard = cardLibrary.pullCard(this)
  thisCard.upvoteFunction($(this).closest('.card'))
})

bottom.on('click', '.down-arrow', function() {
  var thisCard = cardLibrary.pullCard(this)
  thisCard.downvoteFunction($(this).closest('.card'))
})


save.on("click", function() {
  var newCard = new Card(title.val(), body.val())
  newCard.post()
  cardLibrary[$(newCard).attr('id')] = newCard
})


cardLibrary = new Library
cardLibrary.load(cardLibrary)

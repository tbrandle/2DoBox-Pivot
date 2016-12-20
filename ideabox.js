var title = $(".title")
var body = $(".body")
var save = $(".save")
var bottom = $(".bottom-section")

var cardLibrary = {}
// cardLibrary = {cardID: Card}
// {id1: cardObject, id2: cardobject}

$("form").submit(function(e) {
   e.preventDefault();
})

//new card object > localStorage > card processing > display

function Card (title, body) {
  this.title = title;
  this.body = body;
  this.quality = "swill";
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

Card.prototype.addCardToPage = function() {
  console.log(this.id)
  var html = this.createHTML()
  bottom.append(html)
};

Card.prototype.upvoteFunction = function(card) {
  if (this.quality === 'swill') {
    this.quality = 'plausible'
    card.find('.card-quality').replaceWith('<p class = "card-quality">quality: plausible</p>')
  } else if (this.quality === 'plausible') {
    this.quality = 'genius'
    card.find('.card-quality').replaceWith('<p class = "card-quality">quality: genius</p>')
  }
}


function pullCardObject(e) {
  return cardLibrary[$(e).closest('.card').attr('id')]
}

bottom.on('click', '.close-card', function() {
  $(this).parent().remove()
})

bottom.on('click', '.up-arrow', function() {
  var thisCard = pullCardObject(this)
  thisCard.upvoteFunction($(this).closest('.card'))
})

save.on("click", function() {
  console.log(title.val());
  console.log(body.val());
  var newCard = new Card(title.val(), body.val())
  newCard.addCardToPage()
  cardLibrary[$(newCard).attr('id')] = newCard
})

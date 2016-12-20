var title = $(".title")
var body = $(".body")
var save = $(".save")
var bottom = $(".bottom-section")

function Library() {}
// cardLibrary = {cardID: Card}
// {id1: cardObject, id2: cardobject}

Library.prototype.store = function () {
  console.log(this)
  console.log(JSON.stringify(this))
  console.log('end logg');
  localStorage.setItem('lib1', [JSON.stringify(this)])


  var back = JSON.parse(localStorage.getItem('lib1'))
  console.log(back);

};

Library.prototype.load = function () {
  //check if localStorage, if so, load the saved library
  if(localStorage.length) {
    var tempCardStore = []
    var lib = JSON.parse(localStorage.getItem('lib1'))
    console.log(lib);
    for (var card in lib) {
      console.log(lib[card]);
      tempCardStore.push(lib[card])
    }
    tempCardStore.forEach(function(card) {
      console.log(card);
    })
  }
};

cardLibrary = new Library

$("form").submit(function(e) {
   e.preventDefault();
})

// function Library() {
//   protos:
//   -add new card (both on screen and in library)
//   -remove card
//   -store library
//   -load library
// }
function pullCardObject(e) {
  return cardLibrary[$(e).closest('.card').attr('id')]
}

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

Card.prototype.downvoteFunction = function(card) {
  if (this.quality === 'genius') {
    this.quality = 'plausible'
    card.find('.card-quality').replaceWith('<p class = "card-quality">quality: plausible</p>')
  } else if (this.quality === 'plausible') {
    this.quality = 'swill'
    card.find('.card-quality').replaceWith('<p class = "card-quality">quality: swill</p>')
  }
}



bottom.on('click', '.close-card', function() {
  $(this).parent().remove()
  //Remove from library
})

bottom.on('click', '.up-arrow', function() {
  var thisCard = pullCardObject(this)
  thisCard.upvoteFunction($(this).closest('.card'))
})

bottom.on('click', '.down-arrow', function() {
  var thisCard = pullCardObject(this)
  thisCard.downvoteFunction($(this).closest('.card'))
})


save.on("click", function() {
  var newCard = new Card(title.val(), body.val())
  newCard.addCardToPage()
  cardLibrary[$(newCard).attr('id')] = newCard
})

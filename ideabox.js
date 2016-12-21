var $title = $('.title')
var $body = $('.body')
var $save = $('.save')
var $bottom = $('.bottom-section')

$('form').submit(function(e) {
   e.preventDefault()
})


function Library() {}

Library.prototype.store = function () {
  localStorage.setItem('lib1', JSON.stringify(this))
}

Library.prototype.load = function (library) {
  if(localStorage.length) {
    var libLoad = JSON.parse(localStorage.getItem('lib1'))
    for (var c in libLoad) {
      cardLoad = libLoad[c]
      regenCard = new Card(cardLoad.title, cardLoad.body, cardLoad.quality, cardLoad.id)
      regenCard.post()
      library[regenCard.id] = regenCard
    }
  }
}


function Card (title, body, quality, id) {
  this.id = id || Date.now();
  this.title = title;
  this.body = body;
  this.quality = quality || 'swill'
}

Card.prototype.post = function () {
  $bottom.prepend(
    `<article id = "${this.id}" class = "card">
       <h2 class = "card-header" contenteditable="true">${this.title}</h2>
       <button class = "close-card"></button>
       <p class = "card-body" contenteditable="true">${this.body}</p>
       <div class = "quality-arrows">
          <button class = "up-arrow"></button>
          <button class = "down-arrow"></button>
          <p class = "card-quality">quality: ${this.quality}</p>
       </div>
       <hr>
    </article>`
  )
}

$.prototype.updateQuality = function (quality) {
  this.find('.card-quality').replaceWith(`<p class = "card-quality">quality: ${quality}</p>`)
};

Card.prototype.upvoteFunction = function($card) {
  if (this.quality === 'swill') {
    this.quality = 'plausible'
    $card.updateQuality('plausible')
  } else if (this.quality === 'plausible') {
    this.quality = 'genius'
    $card.updateQuality('genius')
  }
}

Card.prototype.downvoteFunction = function($card) {
  if (this.quality === 'genius') {
    this.quality = 'plausible'
    $card.updateQuality('plausible')
  } else if (this.quality === 'plausible') {
    this.quality = 'swill'
    $card.updateQuality('swill')
  }
}

function findCardJq(e) {
  return $(e).closest('.card')
}

$save.on('click', function() {
  var newCard = new Card($title.val(), $body.val())
  newCard.post()
  cardLibrary[$(newCard).attr('id')] = newCard
  cardLibrary.store()
})

$bottom.on('click', '.close-card', function() {
  delete cardLibrary[findCardJq(this).attr('id')]
  $(this).parent().remove()
  cardLibrary.store()
})

$bottom.on('click', '.up-arrow', function() {
  var thisCard = cardLibrary[findCardJq(this).attr('id')]
  thisCard.upvoteFunction(findCardJq(this))
  cardLibrary.store()
})

$bottom.on('click', '.down-arrow', function() {
  var thisCard = cardLibrary[findCardJq(this).attr('id')]
  thisCard.downvoteFunction(findCardJq(this))
  cardLibrary.store()
})

$bottom.on('blur', '.card-header', function() {
  var thisCard = cardLibrary[findCardJq(this).attr('id')]
  thisCard.title = $(this).text()
  cardLibrary.store()
})

$bottom.on('blur', '.card-body', function() {
  var thisCard = cardLibrary[findCardJq(this).attr('id')]
  thisCard.body = $(this).text()
  cardLibrary.store()
})


cardLibrary = new Library
cardLibrary.load(cardLibrary)

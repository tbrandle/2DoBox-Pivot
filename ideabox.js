const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $bottom = $('.bottom-section');

$('form').submit(e => {
   e.preventDefault()
})


class Library {
  store() {
    localStorage.setItem('lib1', JSON.stringify(this))
  }

  load(library) {
    if(localStorage.length) {
      const libLoad = JSON.parse(localStorage.getItem('lib1'));
      for (const c in libLoad) {
        let cardLoad = libLoad[c]
        let regenCard = new Card(cardLoad.title, cardLoad.body, cardLoad.quality, cardLoad.id)
        regenCard.post()
        this[regenCard.id] = regenCard
      }
    }
  }
}

class Card {
  constructor(title, body, quality, id) {
    this.id = id || Date.now();
    this.title = title;
    this.body = body;
    this.quality = quality || 'swill'
  }

  post() {
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

  upvoteFunction($card) {
    if (this.quality === 'swill') {
      this.quality = 'plausible'
      $card.updateQuality('plausible')
    } else if (this.quality === 'plausible') {
      this.quality = 'genius'
      $card.updateQuality('genius')
    }
  }

  downvoteFunction($card) {
    if (this.quality === 'genius') {
      this.quality = 'plausible'
      $card.updateQuality('plausible')
    } else if (this.quality === 'plausible') {
      this.quality = 'swill'
      $card.updateQuality('swill')
    }
  }
}

$.prototype.updateQuality = function (quality) {
  this.find('.card-quality').replaceWith(`<p class = "card-quality">quality: ${quality}</p>`)
};

function findCardJq(e) {
  return $(e).closest('.card')
}

$save.on('click', () => {
  const newCard = new Card($title.val(), $body.val());
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
  const thisCard = cardLibrary[findCardJq(this).attr('id')];
  thisCard.upvoteFunction(findCardJq(this))
  cardLibrary.store()
})

$bottom.on('click', '.down-arrow', function() {
  const thisCard = cardLibrary[findCardJq(this).attr('id')];
  thisCard.downvoteFunction(findCardJq(this))
  cardLibrary.store()
})

$bottom.on('blur', '.card-header', function() {
  const thisCard = cardLibrary[findCardJq(this).attr('id')];
  thisCard.title = $(this).text()
  cardLibrary.store()
})

$bottom.on('blur', '.card-body', function() {
  const thisCard = cardLibrary[findCardJq(this).attr('id')];
  thisCard.body = $(this).text()
  cardLibrary.store()
})


cardLibrary = new Library
cardLibrary.load()

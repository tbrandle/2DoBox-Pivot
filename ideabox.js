const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $cardSection = $('.bottom-section');

$('form').submit(e => {
   e.preventDefault()
})

class Library {
  store() {
    localStorage.setItem('lib1', JSON.stringify(this))
  }

  load() {
    if(localStorage.getItem('lib1')) {
      const libLoad = JSON.parse(localStorage.getItem('lib1'))
      Object.keys(libLoad).forEach(id => {
        const cardLoad = libLoad[id]
        const regenCard = new Card(cardLoad.title, cardLoad.body, cardLoad.quality, cardLoad.id)
      })
    }
  }
}

class Card {
  constructor(title, body, quality, id) {
    this.id = id || Date.now();
    this.title = title;
    this.body = body;
    this.quality = quality || 'swill'
    $cardSection.prepend(
      `<article id="${this.id}" class="card">
         <h2 class="card-header" contenteditable="true">${this.title}</h2>
         <button class="close-card"></button>
         <p class="card-body" contenteditable="true">${this.body}</p>
         <div class="quality-arrows">
            <button class="up-arrow"></button>
            <button class="down-arrow"></button>
            <p class="card-quality">quality: ${this.quality}</p>
         </div>
         <hr>
      </article>`
    )
    cardLibrary[this.id] = this
    cardLibrary.store()
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

$cardSection.on('click', (e) => {
  const $target = $(e.target)
  const action = $target[0].attributes.class.nodeValue
  const $card = $target.closest('.card')
  const card = cardLibrary[$card.attr('id')]
  switch (action) {
    case 'up-arrow':
      card.upvoteFunction($card)
      break
    case 'down-arrow':
      card.downvoteFunction($card)
      break
    case 'close-card':
      delete cardLibrary[card.id]
      $card.remove()
      break
    default:
  }
  cardLibrary.store()
})

$save.on('click', () => {
  new Card($title.val(), $body.val());
})


const findCardJq = (e) => {
  return $(e).closest('.card')
}

$cardSection.on('blur', '.card-header', function() {
  const thisCard = cardLibrary[findCardJq(this).attr('id')];
  thisCard.title = $(this).text()
  cardLibrary.store()
})

$cardSection.on('blur', '.card-body', function() {
  const thisCard = cardLibrary[findCardJq(this).attr('id')];
  thisCard.body = $(this).text()
  cardLibrary.store()
})

cardLibrary = new Library
cardLibrary.load()

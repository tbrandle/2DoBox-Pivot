const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $bottom = $('.bottom-section');

class Library {
  store() {
    localStorage.setItem('lib1', JSON.stringify(this))
  }

  load(library) {
    if(localStorage.length) {
      const libLoad = JSON.parse(localStorage.getItem('lib1'));
      for (const card in libLoad) {
        cardLoad = libLoad[card]
        regenCard = new Card(cardLoad.title, cardLoad.body, cardLoad.quality, cardLoad.id, cardLoad.counter)
        regenCard.post()
        library[regenCard.id] = regenCard
      }
    }
  }
}

class Card {
  constructor(title, body, quality, id, counter) {
    this.id = id || Date.now();
    this.title = title;
    this.body = body;
    this.quality = quality || 'swill';
    this.counter = counter || 0;
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

  voteFunction($card) {
    if (this.counter <= 0) {
      this.quality = 'swill';
      $card.updateQuality(this.quality)
      this.counter = 0;
    } else if (this.counter === 1) {
      this.quality = 'plausible'
      $card.updateQuality(this.quality)
    } else if (this.counter >= 2) {
      this.quality = 'genius';
      $card.updateQuality(this.quality)
      this.counter = 2;
    }
  }
}

$.prototype.updateQuality = function (quality) {
  this.find('.card-quality').replaceWith(`<p class = "card-quality">quality: ${quality}</p>`)
};

function findCardJq(e) {
  return $(e).closest('.card')
}

function thisCard() {
  return cardLibrary[findCardJq(this).attr('id')]
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
  thisCard.call(this).counter ++;
  thisCard.call(this).voteFunction(findCardJq(this))
  cardLibrary.store()
})


$bottom.on('click', '.down-arrow', function() {
  thisCard.call(this).counter --;
  thisCard.call(this).voteFunction(findCardJq(this))
  cardLibrary.store()
})

$bottom.on('blur', '.card-header', function() {
  thisCard.call(this).title = $(this).text()
  cardLibrary.store()
})

$bottom.on('blur', '.card-body', function() {
  thisCard.call(this).body = $(this).text()
  cardLibrary.store()
})

cardLibrary = new Library
cardLibrary.load(cardLibrary)

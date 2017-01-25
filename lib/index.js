const $ = require('jquery');

const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $cardSection = $('.bottom-section');

//redo all this shit with closures
$('form').submit(e => {
   e.preventDefault()
})

function findCardJq(e) {
  return $(e).closest('.card')
}

function thisCard() {
  return cardLibrary[findCardJq(this).attr('id')]
}

class Library {
  store() {
    localStorage.setItem('lib1', JSON.stringify(this))
  }

  load() {
    if(localStorage.getItem('lib1')) {
      const libLoad = JSON.parse(localStorage.getItem('lib1'))
      Object.keys(libLoad).forEach(id => {
        const cardLoad = libLoad[id]
        const regenCard = new Card(cardLoad.title, cardLoad.body, cardLoad.quality, cardLoad.id, cardLoad.counter)
      })
    }
  }
}

class Card {
  constructor(title, body, quality, id, counter) {
    this.id = id || Date.now();
    this.title = title;
    this.body = body;
    this.quality = quality || 'swill';
    this.completed = false;
    this.counter = counter || 0;
    $cardSection.prepend(
      `<article id="${this.id}" class="card">
         <h2 class="card-header" contenteditable="true">${this.title}</h2>
         <button class="close-card"></button>
         <button class="complete-task">complete</button>
         <p class="card-body" contenteditable="true">${this.body}</p>
         <div class="quality-arrows">
            <button class="up-arrow"></button>
            <button class="down-arrow"></button>
            <p class="card-quality">quality: ${this.quality}</p>
         </div>
         <hr>
      </article>`
    )
    this.$card = $(`#${this.id}`)
    cardLibrary[this.id] = this
    cardLibrary.store()
  }

  voteFunction() {
    if (this.counter <= 0) {
      this.quality = 'swill'
      this.counter = 0;
    } else if (this.counter === 1) {
      this.quality = 'plausible'
    } else if (this.counter >= 2) {
      this.quality = 'genius'
      this.counter = 2
    }
    this.$card.find('.card-quality').replaceWith(`<p class = "card-quality">quality: ${quality}</p>`)
  }

  remove() {
    delete cardLibrary[this.id]
    this.$card.remove()
  }

  complete() {
    this.$card.toggleClass('completed')
    this.completed = !this.completed
  }
}

$cardSection.on('click', (e) => {
  const $target = $(e.target)
  const targetClass = $target[0].attributes.class.nodeValue
  const card = cardLibrary[$target.closest('.card').attr('id')]
  switch (targetClass) {
    case 'up-arrow':
      card.counter ++;
      card.voteFunction();
      break
    case 'down-arrow':
      card.counter --;
      card.voteFunction();
      break
    case 'close-card':
      card.remove();
      break
    case 'complete-task':
      card.complete();
      break
  }
  cardLibrary.store()
})

$save.on('click', () => {
  new Card($title.val(), $body.val());
})

$cardSection.on('blur', '.card-header', function() {
  thisCard.call(this).title = $(this).text()
  cardLibrary.store()
})

$cardSection.on('blur', '.card-body', function() {
  thisCard.call(this).body = $(this).text()
  cardLibrary.store()
})

$('.search').on('keyup', function() {
  const searchTerm = $(this).val().toLowerCase();
  const cardIDs = Object.keys(cardLibrary)
  cardIDs.forEach( c => {
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

const cardLibrary = new Library
cardLibrary.load()

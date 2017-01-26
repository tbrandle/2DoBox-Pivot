const $ = require('jquery');

const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $cardSection = $('.bottom-section');

const cardQualities = ['none', 'low', 'normal', 'high', 'critical', 'gnarly', 'totz ma goats']

function createNewCardBase () {
  const $card = $(
    `<article class="card">
    <h2 contenteditable="true">${$title.val()}</h2>
    <p class="card-body" contenteditable="true">${$body.val()}</p>
    </article>`
  )
  return $card
}

function buildCard(title, body, qualityIndex) {
  const card = createNewCardBase()
  //build the button closures. take the $card and attach click listeners to each button
  addDeleteButton(card)
  let cardQualityVar =  cardQualities[qualityIndex]
  // addArrows(card)
  const arrowBox = $(`<div class="quality-arrows"><p class="card-quality" id=${2}>quality: ${'normal'}</p><div>`)
  addDownVoteButton(arrowBox)
  addUpVoteButton(arrowBox)
  card.append(arrowBox)
  // addUpVote
  //addDownVote
  return card
}

function addDeleteButton(card) {
  const deleteBtn = createButton('close-card');
  card.append(deleteBtn);
  deleteBtn.on('click',function(){
    card.remove();
    // this.remove();
  });
}

function addUpVoteButton(arrowBox) {
  const btn = createButton('up-arrow');
  arrowBox.prepend(btn);
  btn.on('click',function(){
    upVote(arrowBox);
    // this.remove();
  });
}

function addDownVoteButton(arrowBox) {
  const btn = createButton('down-arrow');
  arrowBox.prepend(btn);
  btn.on('click',function(){
    downVote(arrowBox);
    // this.remove();
  });
}


function upVote(arrowBox) {
  console.log('up vote');
  const cardQualitySection = arrowBox.children('.card-quality')
  let index = cardQualitySection.attr('id')
  if (index < cardQualities.length -1) {
      index++
  }
  cardQualitySection.attr('id', index)
  cardQualitySection.text(`quality: ${cardQualities[index]}`)
}

function downVote(arrowBox) {
  console.log('down vote');
  console.log(arrowBox.children('.card-quality').html());
}


function createButton(classes) {
  return $('<button class="'+classes+'"></button>');
}

//redo all this shit with closures
$('form').submit(e => {
   e.preventDefault()
   $cardSection.prepend(buildCard())
   //update and save storage
})

// function findCardJq(e) {
//   return $(e).closest('.card')
// }
//
// function thisCard() {
//   return cardLibrary[findCardJq(this).attr('id')]
// }
//
// class Library {
//   store() {
//     localStorage.setItem('lib1', JSON.stringify(this))
//   }
//
//   load() {
//     if(localStorage.getItem('lib1')) {
//       const libLoad = JSON.parse(localStorage.getItem('lib1'))
//       Object.keys(libLoad).forEach(id => {
//         const cardLoad = libLoad[id]
//         const regenCard = new Card(cardLoad.title, cardLoad.body, cardLoad.quality, cardLoad.id, cardLoad.counter, cardLoad.classList)
//       })
//     }
//   }
// }
//
// class Card {
//   constructor(title, body, quality, id, counter, classList) {
//     this.id = id || Date.now();
//     this.title = title;
//     this.body = body;
//     this.quality = quality || 'normal';
//     this.counter = counter || 2;
//     // this.completed = completed || false;
//     this.classList = classList || 'card'
//
//     $cardSection.prepend(
//       `<article id="${this.id}" class="${this.classList}">
//          <h2 class="card-header" contenteditable="true">${this.title}</h2>
//          <button class="close-card"></button>
//          <button class="complete-task">complete</button>
//          <p class="card-body" contenteditable="true">${this.body}</p>
//          <div class="quality-arrows">
//             <button class="up-arrow"></button>
//             <button class="down-arrow"></button>
//             <p class="card-quality">quality: ${this.quality}</p>
//          </div>
//          <hr>
//       </article>`
//     )
//     this.$card = $(`#${this.id}`)
//     cardLibrary[this.id] = this
//     cardLibrary.store()
//   }
//
//   voteFunction() {
//     if (this.counter <= 0) {
//       this.quality = 'none'
//       this.counter = 0;
//     } else if (this.counter === 1) {
//       this.quality = 'low'
//     } else if (this.counter === 2) {
//       this.quality = 'normal'
//     } else if (this.counter === 3) {
//       this.quality = 'high'
//     } else if (this.counter >= 4) {
//       this.quality = 'critical'
//       this.counter = 4
//     }
//     this.$card.find('.card-quality').replaceWith(`<p class = "card-quality">quality: ${this.quality}</p>`)
//   }
//
//   remove() {
//     delete cardLibrary[this.id]
//     this.$card.remove()
//   }
//
//   complete() {
//     this.$card.toggleClass('completed')
//     this.classList = this.$card.attr('class')
//     // this.completed = !this.completed
//     cardLibrary.store()
//   }
// }
//
// $cardSection.on('click', (e) => {
//   const $target = $(e.target)
//   const targetClass = $target[0].attributes.class.nodeValue
//   const card = cardLibrary[$target.closest('.card').attr('id')]
//   switch (targetClass) {
//     case 'up-arrow':
//       card.counter ++;
//       card.voteFunction();
//       break
//     case 'down-arrow':
//       card.counter --;
//       card.voteFunction();
//       break
//     case 'close-card':
//       card.remove();
//       break
//     case 'complete-task':
//       card.complete();
//       break
//   }
//   cardLibrary.store()
// })
//
// $save.on('click', () => {
//   new Card($title.val(), $body.val());
// })
//
// $cardSection.on('blur', '.card-header', function() {
//   thisCard.call(this).title = $(this).text()
//   cardLibrary.store()
// })
//
// $cardSection.on('blur', '.card-body', function() {
//   thisCard.call(this).body = $(this).text()
//   cardLibrary.store()
// })
//
// $('.search').on('keyup', function() {
//   const searchTerm = $(this).val().toLowerCase();
//   const cardIDs = Object.keys(cardLibrary)
//   cardIDs.forEach( c => {
//     const card = cardLibrary[c]
//     const $card = $('#'+card.id)
//     if (card.title.toLowerCase().match(searchTerm)
//     || card.body.toLowerCase().match(searchTerm)) {
//       $card.toggle(true)
//     } else {
//       $card.toggle(false)
//     }
//   })
// })
//
// const cardLibrary = new Library
// cardLibrary.load()

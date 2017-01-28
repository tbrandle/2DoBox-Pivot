const $ = require('jquery');

const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $cardSection = $('.bottom-section');

const cardQualities = ['none', 'low', 'normal', 'high', 'critical']
const showArray = [];
const hiddenArray = [];

function loadLocalCards() {
  const loadedCardArray = JSON.parse(localStorage.getItem('lib1'))
  console.log(loadedCardArray);
  if(loadedCardArray) {
    loadedCardArray.forEach((card) => {
      if (showArray.length < 10) {
        showArray.push(card)
      } else {
        showArray.push(card)
        let firstCard = showArray.shift()
        hiddenArray.unshift(firstCard)
      }
    })
    showArray.forEach((card) => {
      $cardSection.prepend(buildCard(card))
    })
  }
}
//cap the bottom section at ten
//if the bottom section is more than 10 articles, push to new Array
//new array should be hidden.

loadLocalCards()

function storeCurrentCardInfo() {
  let cardArray = []
  cards = $cardSection.children('.card')
  cards.each((i) => {
    card = $(cards[i]);
    const title = card.children('h2').text()
    const body = card.children('.card-body').text()
    const qualityIndex = card.find('.card-quality').attr('id')
    cardArray.unshift({title: title, body: body, qualityIndex: qualityIndex})
  })
  localStorage.setItem('lib1', JSON.stringify(cardArray))
}

function createNewCardBase (title, body) {
  const $card = $(
    `<article class="card">
      <h2 class="card-header" contenteditable="true">${title}</h2>
      <p class="card-body" contenteditable="true">${body}</p>
    </article>`
  )
  return $card
}

function buildCard(options) {
  const card = createNewCardBase(options.title, options.body)
  addDeleteButton(card)
  const arrowBox = $(`<div class="quality-arrows"><p class="card-quality" id=${options.qualityIndex || 2}>quality: ${cardQualities[options.qualityIndex || 2]}</p><div>`)
  addDownVoteButton(arrowBox)
  addUpVoteButton(arrowBox)
  addBlurListener(card)
  card.append(arrowBox)
  return card
}

function addBlurListener(card) {
  card.on('blur', '.card-header', function(){
    storeCurrentCardInfo()
  });
  card.on('blur', '.card-body', function(){
    storeCurrentCardInfo()
  });
}

function addDeleteButton(card) {
  const deleteBtn = createButton('close-card');
  card.append(deleteBtn);
  deleteBtn.on('click',function(){
    card.remove();
    storeCurrentCardInfo()
  });
}

function addUpVoteButton(arrowBox) {
  const btn = createButton('up-arrow');
  arrowBox.prepend(btn);
  btn.on('click',function(){
    upVote(arrowBox);
  });
}

function addDownVoteButton(arrowBox) {
  const btn = createButton('down-arrow');
  arrowBox.prepend(btn);
  btn.on('click',function(){
    downVote(arrowBox);
  });
}

function upVote(arrowBox) {
  console.log('hello');
  const cardQualitySection = arrowBox.children('.card-quality')
  let index = cardQualitySection.attr('id')
  if (index < cardQualities.length -1) {
    index++
  }
  cardQualitySection.attr('id', index)
  cardQualitySection.text(`quality: ${cardQualities[index]}`)
  storeCurrentCardInfo()
}

function downVote(arrowBox) {
  console.log('down vote');
  let index = arrowBox.children('.card-quality').attr('id');
  if (index > 0) {
    index --;
  }
  arrowBox.children('.card-quality').attr('id', index);
  arrowBox.children('.card-quality').text('quality: ' + cardQualities[index])
  storeCurrentCardInfo()
}

function createButton(classes) {
  return $('<button class="'+classes+'"></button>');
}

$('.more-todo').on('click', function () {

  hiddenArray.forEach((card) => {
    $cardSection.append(buildCard(card))
  })

})

$('.search').on('keyup', function() {
  const cards = $cardSection.children('.card')
  const searchTerm = $(this).val().toLowerCase();
  cards.each((i) => {
    card = $(cards[i]);
    const title = card.children('h2').text()
    const body = card.children('.card-body').text()
    if (title.toLowerCase().match(searchTerm)
    || body.toLowerCase().match(searchTerm)) {
      card.toggle(true)
    } else {
      card.toggle(false)
    }
  })
})

$('form').submit(e => {
    console.log('this is saving a card');
   e.preventDefault()
   const cardInput = {title: $title.val(), body: $body.val()}
   const card = buildCard(cardInput)
   $cardSection.prepend(card)
   storeCurrentCardInfo()
  //  hiddenArrayFunction(card)
})

function hiddenArrayFunction(card) {
  if (showArray.length < 10) {
    showArray.unshift(card)
    // console.log('item in show array');
    // console.log('show array: ' + showArray);
  } else {
    let lastItem = showArray[9]
    console.log(lastItem);
    showArray.pop(lastItem)
    hiddenArray.unshift(lastItem);
    hiddenArray.map(function (card) {
      console.log(card);
      // card.style.display = 'none'
    })
    //  hiddenArray.push(card)
    //  console.log('item in hidden array');
  }
}

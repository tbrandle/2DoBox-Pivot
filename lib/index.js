const $ = require('jquery');

const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $cardSection = $('.bottom-section');

const cardQualities = ['none', 'low', 'normal', 'high', 'critical']
let showArray = [];
let hiddenArray = [];
let completedArray = [];

function loadLocalCards() {
  const loadedCardArray = JSON.parse(localStorage.getItem('lib1'))
  if(loadedCardArray) {
    loadedCardArray.forEach((card) => {
      addCardToPage(card)
    })
    console.log(completedArray);
  }
}

function addCardToPage(card) {
  if (card.completed) {
    console.log('completed card found');
    completedArray.push(card);
  } else {
    if (showArray.length < 10) {
      showArray.push(card)
    } else {
      const lastCard = showArray.shift();
      const $lastCard = $cardSection.children('.card').last()
      const title = $lastCard.find('h2').text()
      const body = $lastCard.find('.card-body').text()
      const qualityIndex = $lastCard.find('.card-quality').attr('id')
      hiddenArray.unshift({title: title, body: body, qualityIndex: qualityIndex})
      showArray.push(card)
      $lastCard.remove()
    }
    $cardSection.prepend(buildCard(card))
  }
}

$('form').submit(e => {
  console.log('this is saving a card');
  e.preventDefault()
  const cardInput = {title: $title.val(), body: $body.val()}
  addCardToPage(cardInput)
  storeCurrentCardInfo()
})


//cap the bottom section at ten
//if the bottom section is more than 10 articles, push to new Array
//new array should be hidden.

loadLocalCards()

function storeCurrentCardInfo() {
  let cardArray = []
  cards = $cardSection.children('.card');
  cards.each((i) => {
    card = $(cards[i]);
    const title = card.children('h2').text()
    const body = card.children('.card-body').text()
    const qualityIndex = card.find('.card-quality').attr('id')
    // const store the completed status
    const completed = (card.attr('class').split(' ')[1] === 'completed')
    cardArray.unshift({title: title, body: body, qualityIndex: qualityIndex, completed: completed})
  })
  const newShowArray = cardArray.slice()
  if (hiddenArray.length > 0) {
    cardArray = hiddenArray.concat(cardArray)
  }
  if (completedArray.length > 0) {
    cardArray = completedArray.concat(cardArray)
  }
  localStorage.setItem('lib1', JSON.stringify(cardArray))
  return newShowArray
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
  addCompleteCheckbox(card)
  const arrowBox = $(`<div class="quality-arrows"><p class="card-quality" id=${options.qualityIndex || 2}>quality: ${cardQualities[options.qualityIndex || 2]}</p><div>`)
  addDownVoteButton(arrowBox)
  addUpVoteButton(arrowBox)
  addBlurListener(card)
  card.append(arrowBox)
  return card
}

function addCompleteCheckbox(card) {
  const checkbox = $(`<label><input type="checkbox" value="complete-task">Complete Task</label>`)
  card.append(checkbox)
  checkbox.on('change', function(){
    card.toggleClass('completed')
    storeCurrentCardInfo()
  });
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
    removeCard(card)
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

function removeCard(card) {
  card.remove();
  showArray = storeCurrentCardInfo()
  if(hiddenArray.length > 0) {
    const bottomCard = hiddenArray.shift()
    showArray.unshift(bottomCard)
    $cardSection.append(buildCard(bottomCard))
    storeCurrentCardInfo()
  }
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
    showArray.push(card)
  })
  hiddenArray = []
  $('.more-todo').attr("disabled", "disabled");
  storeCurrentCardInfo()
})

$('.show-completed').on('click', function () {
  completedArray.forEach((cardOptions) => {
    const card = buildCard(cardOptions)
    card.addClass('completed')
    $cardSection.prepend(card)
  })
  $('.show-completed').toggle();
  completedArray = []
  storeCurrentCardInfo()
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

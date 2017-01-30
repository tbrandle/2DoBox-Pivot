const $ = require('jquery');

const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $cardSection = $('.bottom-section');

const cardQualities = ['none', 'low', 'normal', 'high', 'critical']
let showArray = [];
let hiddenArray = [];
let completedArray = [];

$('.save').attr('disabled', 'disabled');

/*********** loading/storing functions **************/

function loadLocalCards() {
  const loadedCardArray = JSON.parse(localStorage.getItem('lib1'))
  if(loadedCardArray) {
    loadedCardArray.forEach((card) => {
      addCardToPage(card)
    })
  }
}

function addCardToPage(card) {
  if (card.completed) {
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

function storeCurrentCardInfo() {
  let cardArray = []
  let mergedArray = []
  cards = $cardSection.children('.card');
  cards.each((i) => {
    card = $(cards[i]);
    const title = card.children('h2').text()
    const body = card.children('.card-body').text()
    const qualityIndex = card.find('.card-quality').attr('id')
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

/*********** Build card functions **************/

function buildCard(options) {
  const card = createNewCardBase(options.title, options.body)
  addDeleteButton(card)
  addCompleteCheckbox(card, options.completed)
  const arrowBox = $(`<div class="quality-arrows"><p class="card-quality" id=${options.qualityIndex || 2}>quality: ${cardQualities[options.qualityIndex || 2]}</p><div>`)
  addDownVoteButton(arrowBox)
  addUpVoteButton(arrowBox)
  addBlurListener(card)
  card.append(arrowBox)
  return card
}

function createNewCardBase (title, body) {
  const $card = $(
    `<article class="card">
      <h2 class="card-header" maxlength="75" contenteditable="true">${title}</h2>
      <p class="card-body" maxlength="120" contenteditable="true">${body}</p>
    </article>`
  )
  return $card
}

function addCompleteCheckbox(card, completed) {
  let checkbox
  if (completed) {
    checkbox = $(`<label><input class="checkbox" checked="checked" type="checkbox" value="complete-task">Complete Task</label>`)
  } else {
    checkbox = $(`<label><input class="checkbox" type="checkbox" value="complete-task">Complete Task</label>`)
  }
  card.append(checkbox)
  checkbox.on('change', function(){
    card.toggleClass('completed')
    storeCurrentCardInfo()
  });
}

function createButton(classes) {
  return $('<button class="'+classes+'"></button>');
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
  let index = arrowBox.children('.card-quality').attr('id');
  if (index > 0) {
    index --;
  }
  arrowBox.children('.card-quality').attr('id', index);
  arrowBox.children('.card-quality').text('quality: ' + cardQualities[index])
  storeCurrentCardInfo()
}

function addBlurListener(card) {
  card.on('blur', '.card-header', function(){
    storeCurrentCardInfo()
  });
  card.on('blur', '.card-body', function(){
    storeCurrentCardInfo()
  });
}

/********* input handeling **************/

function clearCardsInView() {
  let cards = $('.card')
  showArray = []
  cards.each((i) => {
    $(cards[i]).remove()
  })
}

function clearFields() {
  $title.val('');
  $body.val('');
  characterCount()
  $('.save').attr('disabled', 'disabled');
}

function characterCount() {
  $('.counter').text('character count: ' + $body.val().length);
  if ($body.val().length >= 120 ) {
    $('.counter').text('character count: 120 max length' );
  }
}

/********* call functions **************/

loadLocalCards()

/********* event listeners **************/

$('form').submit(e => {
  console.log('this is saving a card');
  e.preventDefault()
  const cardInput = {title: $title.val(), body: $body.val()}
  addCardToPage(cardInput);
  storeCurrentCardInfo();
  clearFields();
})

$('.more-todo').on('click', () => {
  hiddenArray.forEach((card) => {
    $cardSection.append(buildCard(card))
    showArray.push(card)
  })
  hiddenArray = []
  $('.more-todo').attr("disabled", "disabled");
  storeCurrentCardInfo()
})

$('.filter').on('click', (e) => {
  clearCardsInView()
  hiddenArray = []
  loadLocalCards()
  if(e.currentTarget.name != 'clear') {
    const filterID = parseInt(cardQualities.findIndex((element) => {
      return element === e.currentTarget.name;
    }))
    cards = $('.card')
    cards.each((i) => {
      const card = $(cards[i])
      if(parseInt(card.find('.card-quality').attr('id')) !== filterID) {
        card.remove()
      }
    })
    hiddenArray.forEach((card) => {
      if(card.qualityIndex === filterID) {
        addCardToPage(card)
      }
    })
  }
})

$('.show-completed').on('click', () => {
  completedArray.forEach((cardOptions) => {
    const card = buildCard(cardOptions)
    card.addClass('completed')
    $cardSection.prepend(card)
  })
  $('.show-completed').toggle();
  completedArray = []
  storeCurrentCardInfo()
})

$('.search').on('keyup', () => {
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

$('input').on('keyup', () => {
  if ($title.val() !== '' && $body.val() !== '') {
    $('.save').removeAttr('disabled', 'disabled');
  } else {
    $('.save').attr('disabled', 'disabled');
  }
  characterCount()
})

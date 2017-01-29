const $ = require('jquery');

const $title = $('.title');
const $body = $('.body');
const $save = $('.save');
const $cardSection = $('.bottom-section');

const cardQualities = ['none', 'low', 'normal', 'high', 'critical']
const showArray = [];
const hiddenArray = [];

$('.save').attr('disabled', 'disabled');

function loadLocalCards() {
  const loadedCardArray = JSON.parse(localStorage.getItem('lib1'))
  console.log(loadedCardArray);
  if(loadedCardArray) {
    loadedCardArray.forEach((card) => {
      if (showArray.length < 10) {
        showArray.push(card)
      } else {
        showArray.push(card)
        let lastCard = showArray.shift();
        hiddenArray.push(lastCard)
      }
    })
    showArray.forEach((card) => {
      $cardSection.prepend(buildCard(card))
    })
  }
}

loadLocalCards()

function storeCurrentCardInfo() {
  let cardArray = []
  let mergedArray = []
  cards = $cardSection.children('.card');
  cards.each((i) => {
    card = $(cards[i]);
    const title = card.children('h2').text()
    const body = card.children('.card-body').text()
    const qualityIndex = card.find('.card-quality').attr('id')
    cardArray.unshift({title: title, body: body, qualityIndex: qualityIndex})
  })
  if (hiddenArray) {
    mergedArray = hiddenArray.concat(cardArray)
    localStorage.setItem('lib1', JSON.stringify(mergedArray))
  } else {
    localStorage.setItem('lib1', JSON.stringify(cardArray))
  }
  console.log(mergedArray);
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

function showArrayCheck(card) {
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
    console.log(hiddenArray);
  }
}

function clearFields() {
  $title.val('');
  $body.val('');
}

$('.more-todo').on('click', function () {
  hiddenArray.forEach((card) => {
    $cardSection.append(buildCard(card))
  })
  $('.more-todo').attr("disabled", "disabled");
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

function characterCount() {
  $('.counter').text('character count: ' + $body.val().length);
  if ($body.val().length >= 120 ) {
    $('.counter').text('character count: 120 max length' );
  }
}

// function disableSaveBtn() {
//   if ($('input[type="text"]') !== '') {
//     $('.save').removeAttr('disabled', 'disabled');
//   } else {
//     $('.save').attr('disabled', 'disabled');
//   }
// }
//
// disableSaveBtn()

$('input').on('keyup', function {
  if ($title.val() !== '' && $body.val() !== '') {
    $('.save').removeAttr('disabled', 'disabled');
  } else {
    $('.save').attr('disabled', 'disabled');
  }
  characterCount()
})

$('form').submit(e => {
   e.preventDefault()
   const cardInput = {title: $title.val(), body: $body.val()}
   const card = buildCard(cardInput)
   $cardSection.prepend(card)
   showArrayCheck(card)
   storeCurrentCardInfo();
   clearFields();
   disableSaveBtn()
})

//on keyup in body, add plus one
//if counter is greater than 120, disabled

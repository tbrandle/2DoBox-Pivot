var title = $(".title")
var body = $(".body")
var save = $(".save")
var bottom = $(".bottom-section")

$("form").submit(function(e) {
   e.preventDefault();
})

save.on("click", function() {
  console.log(title.val());
  console.log(body.val());
  var newCard = new Card(title.val(), body.val())
  newCard.addCardToPage()
})

function Card (title, body) {
  this.title = title;
  this.body = body;
}

Card.prototype.createHTML = function () {
  return `<article class = "card">
     <h2>${this.title}</h2>
     <button class = "close-card">X</button>
     <p class = "card-body">${this.body}</p>
     <div class = "quality-arrows">
        <button class = "up-arrow">^</button>
        <button class = "down-arrow">v</button>
        <p class = "card-quality">quality: swill</p>
     </div>
     <hr>
  </article>`
};

Card.prototype.addCardToPage = function () {
  var html = this.createHTML()
  bottom.append(html)
};

bottom.on('click', '.close-card', function() {
  $(this).parent().remove()
})

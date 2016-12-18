var title = $(".title")
var body = $(".body")
var save = $(".save")

$("form").submit(function(e) {
   e.preventDefault();
})

save.on("click", function() {
  console.log("Hello");
})

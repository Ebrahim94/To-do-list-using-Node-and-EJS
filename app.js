//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser({extended:true}));
app.set('view engine', 'ejs');

app.get('/', function(req,res){

  var today = new Date();
  var currentDate = today.getDay();
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  day = days[currentDate]

  res.render("list", {kindOfDay: day});

});


app.listen(3000, function(){
  console.log("Sever is up");
});

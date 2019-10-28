//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")


var app = express();

app.use(express.static('public'))

let items = ['One', 'Two', 'Three']
let workList = []

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/', function(req,res){

  let day = date.getDate()

  res.render("list", {listTitle: day, newAddItem:items});
  console.log(items)

});

app.get('/work', function(req,res){
  res.render('list', {listTitle: "work", newAddItem:workList})
})

app.get('/about', function(req,res){
  res.render('about')
})


app.post('/', function(req,res){
  console.log(req.body)
  if (req.body.list === "work"){
    item = req.body.newItem;
    workList.push(item);
    res.redirect('/work');
  }else{
    item = req.body.newItem
    items.push(item)
  res.redirect('/')
  }

})

app.post('/work', function(req,res){
  item = req.body.newItem
  items.push(item)
  res.redirect('/work')
})


app.listen(3000, function(){
  console.log("Sever is up");
});

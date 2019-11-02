//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser:true});

const itemsSchema = mongoose.Schema({
  name:String
})

const Item = mongoose.model('item',itemsSchema)

const item1 = new Item({
  name:'welcome to your to do list'
})

const item2 = new Item({
  name:'Hit the + button to add an item'
})

const item3 = new Item({
  name:'hit the - button to remove an item'
})

const defaultItems = [item1, item2, item3]

const listSchema = mongoose.Schema({
  name:String,
  items: [itemsSchema]
})

const List = mongoose.model('list', listSchema);



var app = express();

app.use(express.static('public'))



app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get('/', function(req,res){

  Item.find({},function(err,items){

    if(items.length == 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log('you ran into an error while trying to insert ' + err)
        }else{
          console.log('default items have been inserted')
        }
        res.redirect('/')
      })
    }else{
      res.render("list", {listTitle: 'Today', newAddItem:items});
    }})

});

app.get('/work', function(req,res){
  res.render('list', {listTitle: "work", newAddItem:workList})
})

app.get('/about', function(req,res){
  res.render('about')
})

app.get('/:customListName', function(req,res){
  const constListName = _.capitalize(req.params.customListName);
  List.findOne({name:constListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //create a new list
        console.log('does not exist')
        const list = new List({
          name:constListName,
          items:defaultItems
        })
        list.save();
        res.redirect("/" + constListName)
      }else{
        //show an existing list
        console.log('exists')
        res.render('list', {listTitle: foundList.name, newAddItem:foundList.items})
      }

    }
  })
})


app.post('/', function(req,res){

  listName = req.body.list;
  itemName = req.body.newItem;

  item = new Item({
    name:itemName
  })
  console.log('I am in the post function')
  if(listName === "Today"){
  item.save();
  res.redirect('/')
}else{
    List.findOne({name:listName}, function(err, foundList){
      foundList.items.push(item)
      foundList.save();
      res.redirect('/' + listName);
    })
  }
  //   console.log(req.body)
  // if (req.body.list === "work"){
  //   item = req.body.newItem;
  //   workList.push(item);
  //   res.redirect('/work');
  // }else{
  //   item = req.body.newItem
  //   items.push(item)
  // res.redirect('/')
  // }

})

app.post('/delete', function(req,res){

  checkedItemId = req.body.checkbox;
  listName = req.body.listName;
  if(listName === "Today"){

  Item.deleteOne({_id:checkedItemId},function(err){
    if(err){console.log(err)}
    else{console.log('succesfuly deleted the item from the list')}
  res.redirect('/')
})
}
else{

  List.findOneAndUpdate({name: listName},{$pull:{items:{_id: checkedItemId}}},function(err){
    if(!err){
      console.log('deleted')
      res.redirect('/' + listName)
}
    })

  }
}

)

app.post('/work', function(req,res){
  item = req.body.newItem
  items.push(item)
  res.redirect('/work')
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Sever is up");
});

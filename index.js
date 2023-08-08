const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

var app = express();
app.set("view engine", "ejs");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
const port = process.env.PORT || 1337;
app.listen(port);
app.use("/assets", express.static("assets"));
var classList = [];
updateClassList();

app.get("/", function(req, res) {
    res.render("index", { classList: classList });
});

app.post("/editpage", urlEncodedParser, function(req, res) {
  var imsaClass = findClass(req.body.currentClass.split("+").join(" "));
  res.render("editpage", { imsaClass: imsaClass, chartString: JSON.stringify(imsaClass.arrayChart)});
});

app.post("/editinfo", urlEncodedParser, function(req, res) {
  var oldClass = findClass(req.body.oldName);
  var newClass = extractData(req.body);
  updateData(JSON.stringify(oldClass), newClass);
  res.render("classpage", { searchValue: "/" + req.body.name.split(" ").join("+"), classList: classList});
});

app.post("/addClass", urlEncodedParser, function(req, res){
  var newClass = extractData(req.body);
  updateData("\n", "\n" + newClass + "\n");
  res.render("classpage", { searchValue: "/" + req.body.name.split(" ").join("+"), classList: classList});
});

app.post("/removeClass", urlEncodedParser, function(req, res){
  var oldClass = findClass(req.body.oldName);
  updateData("\n" + JSON.stringify(oldClass), "");
  res.render("index", { classList: classList });
});

app.get("/classpage", function(req, res) {
  res.render("classpage", { searchValue: req.query.searchValue, classList: classList});
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("*", function(req, res) {
  res.render("404");
});

function extractData(body){
  var units = [];
  var extra = [];
  findParameters(body, body.unitsLength, "units_", units);
  findParameters(body, body.extraLength, "extra_", extra);
  var newClass = '{"name":"' + body.name + '","course":"' + body.course + '","department":"' + body.department + '","arrayChart":' + body.chart + ',"grading":"' + body.grading + '","units":' + JSON.stringify(units) + ',"extra":' + JSON.stringify(extra) + ',"key":"' + body.key + '"}';
  return newClass;
}

function findParameters(obj, len, name_, array){
  for(let i=0; i<len - 1; i++){
    var query = new RegExp(name_ + i.toString(),'i');
    var param = Object.keys(obj).find(function(q){return query.test(q)});
    array.push(obj[param]);
  }
}

function findClass(name){
  var oldClass = { name: "", course: "", department: "", arrayChart: [], grading: "", units: [], extra: [], key: ""};
  classList.forEach(function(item){ 
    if (item.name == name){ 
      oldClass = item; 
    }
  });
  return oldClass;
}

function updateClassList(){
  classesArr = fs.readFileSync(__dirname + "/classes.json", "utf8").split("\n");
  classesArr.forEach(function(item, index){
    classList[index] = JSON.parse(item);
  });
}

function updateData(oldClass, newClass){
  var data = fs.readFileSync(__dirname + "/classes.json", "utf8");
  data = data.replace(oldClass, newClass);
  fs.writeFileSync(__dirname + "/classes.json", data);
  updateClassList();
}

/*
var visited = new Map();
function updateFlowCharts(classString, oldName, newName, visited){
  var chart = classString.toJSON.arrayChart;
  visited.set(classString.toJSON.name, 1);
  chart.forEach(function(item, index){
    if(typeof(item) == 'string' && visited[item] != 1){
      if(item == oldName){
        visited.set(item, 1);
        chart[index] = newName;
      }
      else{
        visited.set(item, 1);
        updateFlowCharts(item, oldName, newName, visited);
      }
    }
    if(typeof(item) == 'object'){
      item.forEach(function(item1, index1){
        if(typeof(item) == 'string' && visited[item] != 1){
          if(item == oldName){
            visited.set(item, 1);
            chart[index] = newName;
          }
          else{
            visited.set(item, 1);
            updateFlowCharts(item, oldName, newName, visited);
          }
        }
      });
    }
  });
}
*/
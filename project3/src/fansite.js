// fansite.js
// create your own fansite using your miniWeb framework
const App = require('./miniWeb.js').App;
const app = new App();

//homepage
app.get('/', function(req, res) {
  res.sendFile("/html/home.html");
});

//homepage image
app.get('/lisahome.gif', function(req, res) {
  res.sendFile("/img/lisahome.gif");
});

//about
app.get('/about', function(req, res) {
  res.sendFile("/html/about.html");
});

//css
app.get('/css/base.css', function(req, res){
  res.sendFile('/css/base.css');
});

//first image
app.get('/image1.jpg', function(req, res) {
  res.sendFile("/img/image1.jpg");
});

//2nd image
app.get('/image2.png', function(req, res) {
  res.sendFile("/img/image2.png");
});

//3rd image
app.get('/image3.gif', function(req, res) {
  res.sendFile("/img/image3.gif");
});

//home redirect
app.get('/home', function(req, res) {
  res.sendFile("/html/home.html");
});

//random
app.get('/random', function(req, res){
  let i = Math.floor(Math.random() * (4) + 1);
  console.log(i);
  let name = "/html/rand" + i + ".html";
    res.sendFile(name);
});

//random images:
app.get('/rand1.gif', function(req, res) {
  res.sendFile("/img/rand1.gif");
});

app.get('/rand2.gif', function(req, res) {
  res.sendFile("/img/rand2.gif");
});

app.get('/rand3.gif', function(req, res) {
  res.sendFile("/img/rand3.gif");
});

app.get('/rand4.gif', function(req, res) {
  res.sendFile("/img/rand4.gif");
});

app.get('/couch.png', function(req, res){
  res.sendFile("/img/couch.png");
})
app.listen(8080, '127.0.0.1');
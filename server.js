const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const galleryRoute = require('./routes/gallery');
const methodOverride = require('method-override');

const PORT = process.env.PORT|| 3000;

const app = express();

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('.hbs', handlebars({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs' );

app.use(express.static(path.join(__dirname, '/public')));

app.use('/gallery', galleryRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})

//SETUP
const express = require(`express`);
const handlebars = require(`express-handlebars`);
const bodyParser = require(`body-parser`);
const path = require(`path`);
const galleryRoute = require('./routes/gallery');
const methodOverride = require('method-override');

const passport = require(`passport`);
const LocalStrategy = require(`passport-local`);
const session = require('express-session');
const bcrypt = require(`bcrypt`);
const Redis = require('connect-redis')(session);
const User = require(`./db/models/User`);

const {isAuthenticated} = require(`./utils/helpers`);


const saltRounds = 12;
const PORT = process.env.PORT || 3000;
const app = express();


app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('.hbs', handlebars({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(session({
  store: new Redis(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, '/public')));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session())

//after login
passport.serializeUser((user,done) => {
  console.log('serializing');
  return done (null, {
    id: user.id,
    username:user.username
  })
})

//after every request
passport.deserializeUser((user,done) => {
  console.log('deserializng');
  new User({id: user.id}).fetch()
  .then(user => {
    if(!user){
      return done(null,false);
    }
    user = user.toJSON();
    return done(null, {
      id: user.id,
      username: user.username
    });
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  return new User({ username: username }).fetch()
  .then ( user => {
    user = user.toJSON();
    console.log(user)
    if (user === null) {
      return done(null, false, {message: 'bad username or password'});
    }
    else {
      console.log(password, user.password);
      bcrypt.compare(password, user.password)
      .then(res => {
        if (res) { return done(null, user); }
        else {
          return done(null, false, {message: 'bad username or password'});
        }
      });
    }
  })
  .catch(err => { console.log('error: ', err); });
}));


app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/'
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

app.post('/register', (req, res) => {
  console.log(req.body);
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) { console.log(err); }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if (err) { console.log(err); }
      new User({
        username: req.body.username,
        password: hash
      })
      .save()
      .then( (user) => {
        console.log(user);
        res.redirect('/gallery');
      })
      .catch((err) => { console.log(err); return res.send('Stupid username'); });
    });
  });
});

app.get('/register', (req, res) => {
  let data = {username, password} = req.body;

  return res.render(`partials/reg`, data);
});

app.get('/login', (req,res)=>{
  let data = {username, password} = req.body;
  return res.render(`partials/login`, data)
})

app.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user id', req.user.id);
  console.log('req.username', req.user.username);
  
  res.send('LOGGED IN');
});


app.use('/gallery', galleryRoute);


app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})


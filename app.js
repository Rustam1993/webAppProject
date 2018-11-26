require('dotenv').config();

const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');
const express         = require('express');
const favicon         = require('serve-favicon');
const hbs             = require('hbs');


hbs.registerHelper('equal', require('handlebars-helper-equal'));



const mongoose        = require('mongoose');
const logger          = require('morgan');
const path            = require('path');


const session         = require('express-session');
const mongoStore      = require('connect-mongo')(session);
const bcrypt          = require('bcryptjs');
const passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const flash           = require('connect-flash');


const User            = require('./models/User');



require('./config/passport');





mongoose
  .connect('mongodb://localhost/webappproject2', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use(flash());


app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());

app.use(passport.session());

app.use(function(req, res, next){
  res.locals.theUser = req.user
  next();
})

const index = require('./routes/index');
app.use('/', index);


const user = require('./routes/userRoutes');
app.use('/', user);


const property = require('./routes/propertyRoutes');
app.use('/', property);


const review  = require('./routes/reviewRoutes');

app.use('/', review)


module.exports = app;

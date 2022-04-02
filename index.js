const express = require('express');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');
const db = require('./config/mongoose');
const sgMail = require('@sendgrid/mail');
// sendgrid api key for the connection validation
sgMail.setApiKey('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');

const expressLayouts = require('express-ejs-layouts');
const sassMiddleware = require('node-sass-middleware');
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    // src: path.join(__dirname, env.asset_path, 'scss'),
    // dest: path.join(__dirname, env.asset_path, 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname + '/uploads'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
app.use(cookieParser());
app.use(session({
    name: 'EverlastNotes',
    secret: 'HelloWorld',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/Everlast_Notes',
        autoRemove: 'disabled'
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMiddleware.setFlash);
app.use('/', require('./routes/index'));
app.listen(port,function(err){
    if(err){
        console.log(`Server not running::${err}`);
    }
    console.log(`Server running on port::${port}`);
});
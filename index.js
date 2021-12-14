const express = require('express');
const app = express();
const port = 8000;
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const passport = require('passport');
// const passportLocal = require('./config/passport-local-strategy');
// const passportGoogle = require('./config/passport-google-oauth2-strategy');
// const crypto = require('crypto');
// const customMiddleware = require('./config/middleware');
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(express.static('./assets'));
app.set('view engine', 'ejs');
app.set('views', './views');
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(cookieParser());
// app.use(session({
//     name: 'EverlastNotes',
//     secret: 'HelloWorld',
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         maxAge: (1000 * 60 * 100)
//     },
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(passport.setAuthenticatedUser);
app.use('/', require('./routes/index'));
app.listen(port,function(err){
    if(err){
        console.log(`Server not running::${err}`);
    }
    console.log(`Server running on port::${port}`);
});
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var pathPublic = __dirname + "/public";

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//route pour toutes les pages de webpages, pour quel ne soit pas accessible
app.get('/pages/*', (req, res) => res.sendFile(path.join(pathPublic+'/pages/notfound.html')));

//chemin d'accès au dossier public
app.use(express.static(pathPublic));

//page d'accueil lorsque l'utilisateur s'est connecté
app.get('/index', (req, res) => {
    res.sendFile(path.join(pathPublic+'/pages/index.html'));
});

//page d'accueil lorsque l'utilisateur s'est connecté
app.get('/', (req, res) => {
  res.sendFile(path.join(pathPublic+'/pages/index.html'));
});

//laissé ces lignes après toutes les routes :  ----------------------------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile(path.join(pathPublic+'/pages/notfound.html'));
});

module.exports = app;

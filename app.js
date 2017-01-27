import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import nconf from 'nconf';
import winston from 'winston';
import nunjucks from 'nunjucks';

import index from './routes/index';
import users from './routes/users';

// Initialize configuration
nconf.file("config.json");
// Initialize and configure logging
winston.add(winston.transports.File,{"filename": nconf.get("logger:loggingFileName"),"level": nconf.get("logger:loggingLevel")});

const app = express();

// Configure templating system
nunjucks.configure("views",
{
  autoescape:true,
  express: app
});
//  winston.info("test log");
//  winston.error("error happen!");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

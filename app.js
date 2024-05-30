var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

const db = require('./dbms');
const jwt = require('jsonwebtoken');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const controll = require('./controllers/DoctorSignup');

app.use('/', indexRouter);
app.use('/users', usersRouter);

const authenticateToken = (req,res,next)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if(!token){
    return res.Status(403).send(err);
  }
  jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
    if(err){
      res.Status(403).send("verify Error.........")
    }
    req.user =user; 
    next();
  })
}

db.connect()
.then(()=>{

  app.post('/signup',controll.signup);
  app.get('/getinf',controll.getUsers);
  app.post('/login',controll.loginuser);
  app.post('/time',controll.avail);
  

  app.get('/posts',authenticateToken,(req,res)=>{

    console.log(req.user);
   res.json({"result": 'Success.......'})
 })



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
        res.render('error');
    });

  })
.catch(()=>{
  console.error('Error connecting to MongoDB:', error);
});

module.exports = app;

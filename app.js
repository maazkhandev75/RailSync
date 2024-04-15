var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sql=require('mssql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { Console } = require('console');


var app = express();
//const routes=app.routes();
const sqlConfig = {
  user:'afaqkhaliq_SampleDB',
  password:'afaq123',
  database:'afaqkhaliq_SampleDB',
  server: 'sql.bsite.net\\MSSQL2016',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  } , options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}
const pool = new sql.ConnectionPool(sqlConfig);
pool.connect((err)=>{
  if(!err)
  console.log("Pool Connected");
  else throw err;
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/home',(req,res)=>{
  const path = "C:/Users/HASSAN/Desktop/DBPrij/NEW FOLDER/main/home.html";
res.sendFile(path);
})
 

app.get('/form', (req, res) => {
  pool.query('SELECT StationName FROM Station')
      .then(result => {
          const StationNames = result.recordset;
          var isSubmitted=false;
          res.render("form", { StationNames ,isSubmitted});
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
});

app.post('/SearchTrain',(req,res)=>{
  var St1=req.body.fromCity;
  var St2=req.body.toCity;
  console.log(St2);
  const request= new sql.Request(pool);
  request.input('fromStation',sql.NVarChar,St1);
  request.input('toStation',sql.NVarChar,St2);
  request.execute('SearchForTrains',(err,result)=>{
    if(err){
    console.error(err);
    res.status(500).send('Internal Server Error');
    }
    else{
      var isSubmitted=true;
      var Trains=result.recordset;
      console.log(Trains);
      // res.render("TrainResult",{Trains},(err)=>{
      //   if (err) throw err;
      // });
      res.render("TrainResult", { Trains});
    }
  })
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;


app.listen(4000,(error)=>{
  if(error)
      console.log("Error listening");
  else{
      console.log("listening Successfully"+__dirname);
  }
})

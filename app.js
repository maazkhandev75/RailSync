//importing necessary modules
var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sql=require('mssql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var SearchTrainRouter = require('./routes/SearchTrain');
const { Console } = require('console');


//configuring a connection pool for MSSQL using the mssql module and connecting to the database
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
app.use(express.static(path.join(__dirname, 'public')));  //set up your Express server to serve static files from public directory..( thats why we have used absolute paths everywhere then )

// Define a route to render an HTML home page
app.get('/home',(req,res)=>{
  const path = "C:/Users/maazk/Downloads/RailSync/main/home.html";
res.sendFile(path);
})

app.get('/decisionPg',(req,res)=>{
  const path = "C:/Users/maazk/Downloads/RailSync/main/decision.html";
res.sendFile(path);
})

app.get('/signupPg',(req,res)=>{
  const path = "C:/Users/maazk/Downloads/RailSync/main/signup.html";
res.sendFile(path);
})

app.get('/loginPg',(req,res)=>{
  const path = "C:/Users/maazk/Downloads/RailSync/main/login.html";
res.sendFile(path);
})

// app.get('/form', (req, res) => {
//   pool.query('SELECT StationName FROM Station')
//       .then(result => {
//           const StationNames = result.recordset;
//           var isSubmitted=false;
//           res.render("form", { StationNames ,isSubmitted});
//       })
//       .catch(err => {
//           console.error(err);
//           res.status(500).send('Internal Server Error');
//       });
// });


// app.get('/admin', (req, res) => {
//   pool.query('SELECT * FROM Train')
//       .then(result => {
//           const Trains = result.recordset;
//           res.render("admin", { Trains });
//       })
//       .catch(err => {
//           console.error(err);
//           res.status(500).send('Internal Server Error');
//       });
// });
 
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/SearchTrain',SearchTrainRouter(pool));
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });


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


// Start the server and listen on port 4000   //write localhost:4000/home to start the website
app.listen(4000,(error)=>{
  if(error)
      console.log("Error listening");
  else{
      console.log("Listening Successfully!  "+__dirname);
  }
})

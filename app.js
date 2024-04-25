//importing necessary modules
const createError = require('http-errors');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sql=require('mssql');
const fs = require('fs');

// Create an instance of the Express application
const app = express();
const port=4000;   //our port

//importing routers
const signupRouter = require('./routes/signup')
const loginRouter = require('./routes/login')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const SearchTrainRouter = require('./routes/SearchTrain');
const SearchCarriage = require('./routes/TD');
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
    idleTimeoutMillis: 3000000
  } , options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}
const pool = new sql.ConnectionPool(sqlConfig);
pool.connect((err)=>{
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connection successful!');
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  //set up your Express server to serve static files from public directory..( thats why we have used absolute paths everywhere then )

// Configure a middleware to load user credentials from JSON file
app.use((req, res, next) => {
  const credentialsFilePath = path.join(__dirname, 'loggedInCredentials.json');
  if (fs.existsSync(credentialsFilePath)) {
    try {

      const fileContent=fs.readFileSync(credentialsFilePath, 'utf8');
      //check if the file is empty
      if(fileContent.trim()==='')
      {
         // If the file is empty, provide a default value or handle it as needed
         res.locals.userDetails = {}; // Default value
      }
      else 
      {
      // If the file is not empty, parse its content as JSON
      const userDetails = JSON.parse(fs.readFileSync(credentialsFilePath));
      res.locals.userDetails = userDetails;
      }
    } catch (error) {
      // If an error occurs during JSON parsing, send an error message
      console.error('Error parsing JSON file (can be invalid format of data):', error);

      //the following has been commented because it prevents the website from even loading if some invalid data is hardcoded in json file so it can't parse properly and displays the error message on client side but in our case we really don't need it because user cannot enter invalid format data from frontend side
      //res.status(500).send('Error parsing loggedInCredentials.json file. Please empty the json first.');
      //return; // Exit the middleware to prevent further execution
    }
  }
  next();
});
// You can access these logged inuser credentials in your route handlers using res.locals.userDetails
///the following issue has been solved effectively and is is still written for learning purpose and understand how to deal with error effectively..
//if you write some illegal format data or empties the json the local server will start encountering 500 http error then you have to first comment out the above code of parsing and making available for others and first you need you write valid data in json format and run server again and then after inserting valid data in json file you can uncomment the above code and can use data for other routes...


// Define a route to render an ejs/html page
app.get('/home',(req,res)=>{
res.render('home.ejs');
})

app.get('/decisionPg',(req,res)=>{
res.render('decision.ejs');
})

app.get('/signupForm',(req,res)=>{
res.render('signup.ejs');
})

app.get('/loginForm',(req,res)=>{
  res.render('login.ejs');
})

app.get('/SearchTrainform', (req, res) => {
  pool.query('SELECT StationName FROM Station')
      .then(result => {
          const StationNames = result.recordset;
          var isSubmitted=false;
          res.render("form.ejs", { StationNames ,isSubmitted});
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
});

app.get('/admin', (req, res) => {
  pool.query('SELECT * FROM Train')
      .then(result => {
          const Trains = result.recordset;
          res.render("admin.ejs", { Trains });
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
});

app.post('/bookTicketNonStop', (req, res) => {  
  console.log(req.body);
  const InputTrackId=req.body.TrackID;
  const request= new sql.Request(pool);
  request.input('TrainId',sql.NVarChar(30),req.body.selectedTrainID);
  request.input('TrackId',sql.NVarChar(30),req.body.TrackID);
  const Class='E';
  request.input('Class',sql.NVarChar(30),Class);
  var TicketAvailInfo="";
  request.execute('BookTicket',(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else{
        TicketAvailInfo=result.recordset[0];
        console.log(TicketAvailInfo);
        if(TicketAvailInfo.length!=0){
          const TicketInfoReq= new sql.Request(pool);
      TicketInfoReq.input('FoundCarriage',sql.NVarChar(30),TicketAvailInfo.CarriageId);
      TicketInfoReq.input('TrainId',sql.NVarChar(30),req.body.selectedTrainID);
      TicketInfoReq.input('FoundSeat',sql.Int,TicketAvailInfo.SeatNo);
      TicketInfoReq.input('TrackId',sql.NVarChar(30),InputTrackId);
      console.log(InputTrackId);
      TicketInfoReq.execute('GetTicketInfo',(err,result2)=>{
        if(err){
          console.error(err);
          res.status(500).send('Internel Server Error');
        }
        else{
          console.log("seat details are: ");
          console.log(result2);
        }
        var TicketInfo=result2.recordset;
        res.render('Ticket',{TicketInfo});
      });
    } 
  }
  })
});

// Use the routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter(pool));   // Pass pool object to signupRouter
app.use('/login', loginRouter(pool));     // Pass pool object to loginRouter
app.use('/SearchTrain', SearchTrainRouter(pool));
app.use('/TD',SearchCarriage(pool));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});







// Export the app and pool objects
module.exports = { app, pool };

// Start the server and listen on port 4000   //write localhost:4000/home to start the website
app.listen(port,(error)=>{
  if(error)
      console.log("Error listening");
  else{
    console.log(`Server is listening on port - ${port}`);
  }
})
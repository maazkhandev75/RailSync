// Load environment variables from .env file
require('dotenv').config();

//importing necessary modules
const createError = require('http-errors');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sql=require('mssql');
const fs = require('fs');
const nodemailer = require('nodemailer');


// Create an instance of the Express application
const app = express();
const port= process.env.PORT || 4000;   //our port


//app.post -> to send data to server
//app.get -> to receive data from server

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

//configuring a connection pool for MSSQL using the mssql module and connecting to the database
const sqlConfig = {
  
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: 'sql.bsite.net\\MSSQL2016',   
  // Here while configuring sql obj we have to write sql.bsite.net\\MSSQL2016 with double back slash 
  // but for connection in both vs code and in ssms we will have to write sql.bsite.net\MSSQL2016
  // with single back slash ( otherwise connection for sql login can never established!)

  // BECAUSE....
  // In JavaScript (and other programming environments that use escape sequences like \n is a newline, \t is a tab, and so on.), a single backslash needs to be escaped with another backslash, hence \\. to write it as backslash
  // In environments like SSMS and VS Code, you can directly use the single backslash without escaping it.


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




function isAuthenticatedUser(req, res, next)
{
  if(req.session.userDetails && req.session.userDetails.cnic){
    //user is authenticated proceed with the request
    next();
  }
  else 
  {
     //redirect an error page
    //console.log('Forbidden: access denied because of authentication bypass!');
    res.redirect('/errorOfSession');
  }
}


function isAuthenticatedAdmin(req, res, next)
{
  if(req.session.AdminDetails && req.session.AdminDetails.cnic){
    //admin is authenticated proceed with the request
    next();
  }
  else 
  {
     //redirect an error page
    //console.log('Forbidden: access denied because of authentication bypass!');
    res.redirect('/errorOfSession');
  }
}


//importing routers
const signupRouter = require('./routes/userSignup')
const loginRouter = require('./routes/userLogin')
const adminLoginRouter = require('./routes/adminLogin')
const adminSignupRouter = require('./routes/adminSignup')
const passwordResetRouter = require('./routes/passwordReset')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const SearchTrainRouter = require('./routes/SearchTrain');
const SearchCarriage = require('./routes/TD');
const userSessionRouter = require('./routes/testSessionUser');
const adminSessionRouter = require('./routes/testSessionAdmin');
const profileUpdateRouter = require('./routes/profileUpdate');
const passwordChangeRouter = require('./routes/passwordChange');


const { Console, dirxml } = require('console');
const { render } = require('ejs');
const log = console.log;   //for ease of use in future ( have used in email code)

// also before deployment we should comment out all console.log statements because it also 
// affect the performance of the website but for debugging and testing we should write or uncomment console.log




// view engine setup
app.set('views', path.join(__dirname, 'views'),path.join(__dirname, 'views/ADMIN'),path.join(__dirname, 'views/ADMIN/partials'),path.join(__dirname, 'views/USER'),path.join(__dirname, 'views/USER/partials'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   //true
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  //set up your Express server to serve static files from public directory..( thats why we have used absolute paths everywhere then )




app.post('/sendEmail', (req, res )=>{
  //send email
  //res.json({ message: 'Message recieved!!'})
  const nm = req.body.name;
  const eml = req.body.email;
  const sbj = req.body.subject;
  const msg = req.body.message;

  var transporter = nodemailer.createTransport({
    
    service:'gmail',
    auth: {
      user: process.env.EMAIL,  //enter the email address whom you want to get mails
      pass: process.env.APP_PASSWORD      //go to your google acc and seach app passwords then create 16 digti pass and use here
      }
  });

  var mailOptions = {
    from: eml,    
    to: process.env.EMAIL,    //enter your email address whom you want to get emails also note that emails'to and from will be same when revieced which is your own email
    cc: 'railsyc',
    subject: 'Message from railsync user ' + nm,
    text: 'Email : ' + eml + '\n\n' + 'Subject : ' + sbj + '\n\n' + 'Message : ' + msg
  };

  transporter.sendMail(mailOptions, function(error, info)
  {
    // different flavours are shown for learning purpose
    if(error)
    {
    console.error('Error: ', error);
    return res.status(500).render('./USER/contact.ejs', { Message: 'Message sending failed!' });  //more optimal due to immediate exit due to return
    //res.render('./USER/contact.ejs', { Message: 'Message sending failed!' }); 
    //res.status(500).send("Error submitting mail");
    } 
    else {
      log("Email sent: " + info.response);
      return res.render('./USER/contact.ejs', { Message: 'Message sent successfully!' });
      //res.render('./USER/contact.ejs', { Message: 'Message sent successfully!' }); 
    }
  });
});



// Define a route to render an ejs/html page
// app.get('/home',(req,res)=>{
// res.render('home.ejs');
// });

app.get("/", (req, res) => {
  res.render('home.ejs');
});



app.get("/",function(req, res){
  //console.log(__dirname);
  res.sendFile(__dirname + "/views/home.ejs");
});

app.get('/decisionPg',(req,res)=>{
res.render('decision.ejs');
});

app.get('/userSignupForm',(req,res)=>{
res.render('userSignup.ejs');
});

app.get('/userLoginForm',(req,res)=>{
  res.render('userLogin.ejs');
});

app.get('/adminLoginForm',(req,res)=>{
  res.render('adminLogin.ejs');
});

app.get('/adminSignupForm', isAuthenticatedAdmin,(req,res)=>{
  res.render('adminSignup.ejs');
});


app.get('/errorOfSession',(req,res)=>{
  res.render('errorSession.ejs');
});



//ADMIN PAGES

app.get('/adminDash', isAuthenticatedAdmin, (req, res) => {
  res.render('./ADMIN/dashboard.ejs');
});

app.get('/trainsData', isAuthenticatedAdmin, (req, res) => {
  pool.query('SELECT * FROM Train')
      .then(result => {
          const Trains = result.recordset;
          res.render("./ADMIN/trainsData.ejs", { Trains });
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
});


app.get('/ticketsData', isAuthenticatedAdmin, async (req, res) => {
  try {
    const result = await pool.request()
    .execute('ShowTickets');
  
    if (result.returnValue === 0) 
    {
      const Tickets = result.recordset; 
      //console.log(Tickets);
      const ticketsUpcoming = [];
      const ticketsPrevious = [];
      const currentTime = new Date();
      // console.log(currentTime);
      Tickets.forEach((ticket) => {

        const deptTime=new Date(ticket.DeptTime);
        if(deptTime >= currentTime)
        {
          ticketsUpcoming.push(ticket);
        }
        else
        {
          ticketsPrevious.push(ticket);
        }
      });

      // Assuming this is how your ticket data is structured
      res.render('./ADMIN/ticketsData.ejs',{ticketsPrevious,ticketsUpcoming}); 
      // Send ticket data as JSON response
    } 
    else
    {
      throw new Error('Failed to retrieve tickets');
    } 
    } 
    catch (error)
    {
    console.error('Error retrieving tickets:', error);
    res.status(500).send('Failed to retrieve tickets');
    }
});


app.get('/usersAndAdminsData', isAuthenticatedAdmin, (req, res) => {
  
  Promise.all([
     
    pool.query('SELECT * FROM [User]'),
    pool.query('SELECT * FROM [Admin]')
  ])
.then(([UserResult,AdminResult]) => {
 
    const Users  = UserResult.recordset;
    const Admins = AdminResult.recordset;
    res.render("./ADMIN/usersAndAdminsData.ejs", { Users, Admins });
})
.catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

});



app.get('/stationsAndTracksData', isAuthenticatedAdmin, (req, res) => {
  const requestStation = new sql.Request(pool);
  const requestTrack = new sql.Request(pool);

  // Execute both queries asynchronously
  Promise.all([
    requestStation.query('SELECT * FROM Station'),
    requestTrack.query('SELECT * FROM Tracks join Fare on Tracks.TrackId=Fare.TrackId')
  ])
  .then(results => {
    const Station = results[0].recordset;
    const Track = results[1].recordset;
    res.render('./ADMIN/stationsAndTracksData.ejs', { Station:Station, Track:Track });
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });
});

app.get('/routesData', isAuthenticatedAdmin, (req, res) => {
     
  pool.query('SELECT * FROM Route as R join Tracks as T on R.TrackId=T.TrackId')
  .then(result => {
 
      const Route =result.recordset;
      //console.log(Route);
      res.render("./ADMIN/routesData.ejs", { Route });
  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
  });
});



app.get('/crewData', isAuthenticatedAdmin, (req, res) => {
  
  Promise.all([
     
      pool.query('SELECT * FROM Pilot as p join Crew as c on c.CrewId=p.CrewId'),
      pool.query('SELECT * FROM Security as s join Crew as c on c.CrewId=s.CrewId')
    ])
  .then(([PilotResult,SecurityResult]) => {
   
      const Pilot = PilotResult.recordset;
      const Security=SecurityResult.recordset;
      res.render("./ADMIN/crewData.ejs", { Pilot,Security });
  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
  });
});


app.get('/addTrain', isAuthenticatedAdmin, (req, res) => {
  pool.query('SELECT * FROM Station')
      .then(result => {
          const Station = result.recordset;

          res.render('./ADMIN/addTrain.ejs', {  Station: Station });

      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
  
});




app.get('/addCarriage', isAuthenticatedAdmin, (req, res) => {
     
  pool.query('SELECT * FROM Train ')
  .then(result => {
      const Train =result.recordset;

      res.render("./ADMIN/addCarriage.ejs", { Train });
  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
  });
});




app.get('/addRoute', isAuthenticatedAdmin, (req, res) => {
  
  Promise.all([
     
      pool.query('SELECT * FROM Train'),
      pool.query('SELECT * FROM Tracks')
    ])
  .then(([TrainResult,TrackResult]) => {
   
      const Train = TrainResult.recordset;
      const Track=TrackResult.recordset;
      res.render("./ADMIN/addRoute.ejs", { Train,Track });
  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
  });
});

app.get('/addStation', isAuthenticatedAdmin, (req, res) => {
  res.render('./ADMIN/addStation.ejs');
});

app.get('/addTrack', isAuthenticatedAdmin, (req, res) => {
  pool.query('SELECT * FROM Station')
  .then(result => {
      const Station = result.recordset;
      res.render('./ADMIN/addTrack.ejs', {Station: Station });

  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
  });
});

app.get('/addCrew', isAuthenticatedAdmin, (req, res) => {
  const stationQuery = pool.query('SELECT * FROM Station');
  const trainQuery = pool.query('SELECT * FROM Train');

  Promise.all([stationQuery, trainQuery])
    .then(results => {
      const stationResult = results[0].recordset;
      const trainResult = results[1].recordset;

      res.render('./ADMIN/addCrew.ejs', {
        Station: stationResult,
        Train: trainResult
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});



app.get('/editTrain', isAuthenticatedAdmin, (req, res) => {
  const TrainId = req.query.TrainID;
  pool.query('SELECT * FROM Station')
      .then(result => {
          const Station = result.recordset;
          res.render('./ADMIN/editTrain.ejs', { TrainId: TrainId, Station: Station });

      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
  
});

app.get('/editRoute', isAuthenticatedAdmin, (req, res) => {
  const TrainID = req.query.TrainID;
  const TrackID=req.query.TrackID;
  res.render('./ADMIN/editRoute.ejs', {TrainID,TrackID });
});

app.get('/editSecurity', (req, res) => {
  const CrewId = req.query.CrewId;
  const CrewName = req.query.CrewName;
  const Address = req.query.Address;
  //console.log(CrewId,CrewName,Address);
  pool.query('SELECT * FROM Station')
  .then(result => {
      const Station = result.recordset;
      res.render('./ADMIN/editSecurity.ejs', {CrewId,CrewName,Address,Station });
  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
  });
  
});

app.get('/editPilot', isAuthenticatedAdmin, (req, res) => {
  const CrewId = req.query.CrewId;
  const CrewName = req.query.CrewName;
  const Address = req.query.Address;
  pool.query('SELECT * FROM Train')
  .then(result => {
      const Train = result.recordset;
      res.render('./ADMIN/editPilot.ejs', {CrewId,CrewName,Address,Train });
  })
  .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
  });
});

app.get('/editUser', isAuthenticatedAdmin, (req, res) => {
  const CNIC = req.query.CNIC;
  const UserName = req.query.UserName;
  const Password = req.query.Password;
  const PhoneNo = req.query.PhoneNo;

  //console.log(CNIC,UserName,Password,PhoneNo);
  res.render('./ADMIN/editUser.ejs', {CNIC,UserName,Password,PhoneNo });
});

app.get('/editAdmin', (req, res) => {
  const CNIC = req.query.CNIC;
  const AdminName = req.query.AdminName;
  const Pin = req.query.Pin;
  const PhoneNo = req.query.PhoneNo;

  //console.log(CNIC,UserName,Password,PhoneNo);
  res.render('./ADMIN/editAdmin.ejs', {CNIC,AdminName,Pin,PhoneNo });
});


app.get('/editTrack', isAuthenticatedAdmin, (req, res) => {

  const TrackID=req.query.TrackID;
  const Economy=req.query.Economy;
  const Business=req.query.Business;
  const FirstClass=req.query.FirstClass;
  res.render('./ADMIN/editTrack.ejs', {TrackID,Economy,Business,FirstClass });
});


app.get('/editStation', isAuthenticatedAdmin, (req, res) => {

  const StationId=req.query.StationId;
  const StationName=req.query.StationName;
  const Address=req.query.Address;
  res.render('./ADMIN/editStation.ejs', {StationId,StationName,Address });
});

app.get('/editCarriage', isAuthenticatedAdmin, (req, res) => {

  const CarriageId=req.query.CarriageId;
  const TrainId=req.query.TrainId;
  
  res.render('./ADMIN/editCarriage.ejs', {CarriageId, TrainId });
});








//USER PAGES


app.get('/userDash', isAuthenticatedUser, (req,res)=>{
  const userData = req.session.userDetails;
  res.render('./USER/dashboard.ejs',{userData});
  })


app.get('/profile', isAuthenticatedUser, async(req,res)=>{
  const cnic=req.session.userDetails.cnic;
  try{
    const result = await pool.request()
    .input('CNIC', sql.NVarChar(255), cnic)
    .execute('GetUserCredentials');

    if (result.returnValue === 0 && result.recordset.length>0) {

      const userCredentials = {
         userId: result.recordset[0].Id,
         username: result.recordset[0].UserName,
         password: result.recordset[0].Password,
         cnic: result.recordset[0].CNIC,
         phone: result.recordset[0].PhoneNo
       }

       //console.log(userCredentials.password);  for testing
        res.render('./USER/profile.ejs',{userCredentials});
    }
    else
    {
      res.status(404).send('user not found');
    }
    }
    catch(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
})



  app.get('/SearchTrainform', isAuthenticatedUser, (req, res) => {
    pool.query('SELECT StationName FROM Station')
        .then(result => {
            const StationNames = result.recordset;
            var isSubmitted=false;
            res.render("USER/tripForm.ejs", { StationNames ,isSubmitted});
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
  });
  
  app.get('/faq', (req, res) => {  
    try
    {
    res.render("./USER/faq.ejs");
    }
    catch(error)
    {
      console.error(err);
      res.status(500).send('Internal Server Error');
    };
  });

  app.get('/forgetPass', (req, res) => {  
    try
    {
    res.render("./passwordReset.ejs");
    }
    catch(error)
    {
      console.error(err);
      res.status(500).send('Internal Server Error');
    };
  });


  app.get('/logout',(req,res)=>{
  
    req.session.destroy(err => {
  
      if(err){
        console.error('error destroying session: ',err);
      }
      else
      {
         res.redirect('/');
      }
    });
  
  });
  
  
  
  
  app.get('/showTicketsOfUser', isAuthenticatedUser, async (req, res) => {
    const cnic = req.session.userDetails.cnic;
      try {
      // Call the stored procedure to fetch booked tickets
      const result = await pool.request()
      .input('CNIC', sql.NVarChar(255), cnic)
      .execute('ShowBookedTickets');
    
      if (result.returnValue === 0) 
      {
        //console.log('Tickets found!');
        const Tickets = result.recordset; 
        //console.log(Tickets)
        const ticketsUpcoming = [];
        const ticketsPrevious = [];
        const currentTime = new Date();
        // console.log(currentTime);
        Tickets.forEach((ticket) => {
  
          const deptTime=new Date(ticket.DeptTime);
          if(deptTime >= currentTime)
          {
            ticketsUpcoming.push(ticket);
          }
          else
          {
            ticketsPrevious.push(ticket);
          }
        });
  
        // Assuming this is how your ticket data is structured
        res.render('./USER/ticketsOfUser.ejs',{ticketsPrevious,ticketsUpcoming}); 
        // Send ticket data as JSON response
      } 
      else
      {
        throw new Error('Failed to retrieve tickets');
      } 
      } 
      catch (error)
      {
      console.error('Error retrieving tickets:', error);
      res.status(500).send('Failed to retrieve tickets');
      }
  });
  
app.get('/contact', isAuthenticatedUser, (req, res) => {
  res.render('./USER/contact.ejs');
});


//HERE WE HAVE WRITTION IN APP.JS INSEAD OF MAKING A SEPARATE ROUTE OR WRITING IN TD.JS
app.post('/UnbookTicket', (req, res) => {
  //console.log(req.body);
  const TrainId = req.body.TrainID;
  const CarriageId = req.body.CarriageID;
  const SeatNo = req.body.SeatNo;
  const TicketId = req.body.TicketId;
  const request = new sql.Request(pool);
  request.input('CarriageId', sql.NVarChar(255), CarriageId);
  request.input('SeatNo', sql.Int, SeatNo);
  request.input('TicketId', sql.Int, TicketId);
  request.input('TrainId', sql.NVarChar(255), TrainId);

  request.execute('CancelTicket', (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
      } else {
          //console.log(result.recordset);
          Message=result.recordset;
          res.json({ Message });
      }
  });
});


// (difference between redirect and render)
// render simply renders the page of that path 
// and redirect request the server to load that page




// Use the routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/userSignup', signupRouter(pool));   // Pass pool object to signupRouter
app.use('/userLogin', loginRouter(pool));     // Pass pool object to loginRouter
app.use('/adminLogin', adminLoginRouter(pool));     // Pass pool object to loginRouter
app.use('/adminSignup', adminSignupRouter(pool));     // Pass pool object to loginRouter   //first argument contain the actual name of the js router file 
app.use('/passwordReset', passwordResetRouter(pool));     // Pass pool object to loginRouter
app.use('/SearchTrain', SearchTrainRouter(pool));
app.use('/TD',SearchCarriage(pool));
app.use('/', userSessionRouter);    //for testing session of user
app.use('/', adminSessionRouter);    //for testing session of admin
app.use('/profileUpdate',profileUpdateRouter(pool))
app.use('/passwordChange',passwordChangeRouter(pool))


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler for 404 errors
app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.status(404).render('error404');
  } else {
    next(err);
  }
});

// Error handler for other errors (500 and any other status codes)
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error500');
});


// Export the app and pool objects
//module.exports = { app, pool };

// Exporting the app for Vercel deployment
module.exports = app;

// Start the server and listen on port 4000   //write localhost:4000/home to start the website
app.listen(port,(error)=>{
  if(error)
      console.log("Error listening");
  else{
    console.log(`Server is listening on port - ${port}`);
  }
})

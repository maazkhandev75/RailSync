const express = require('express');
const router = express.Router();

// Test route to check session
router.get('/sessionCheckUser', (req, res) => {
  // Check if user details are stored in the session
  if (req.session.userDetails) {
    // If user details are stored, display them
    res.send(`

    <html>
    <head>

    
    <title>RailSync</title>
    <link href="/assets/img_and_gif/icon.png" rel="icon">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">

      <style>
        body {
          background-color: #37b800;
          font-family:'Roboto Mono',san-serif;
          text-align: center;
          justify-content:center;
          align-items:center;
          font-weight:400;
          font-size:1.5em;
          padding:5em 2em;
          overflow:hidden;
          *::selection{
            color:white;
          }  
        }

        h1{
          font-size:1.6em;
          font-weight:500;
        }

      </style>
    </head>
    <body>
      <h1>User details stored in session</h1>
      <p>${JSON.stringify(req.session.userDetails)}</p>
    </body>
    </html>

    `);
  } else {
    // If user details are not stored, display a message
    res.send(`

    <html>
    <head>

    
    <title>RailSync</title>
    <link href="/assets/img_and_gif/icon.png" rel="icon">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">


      <style>
        body {
          background-color: #9e0000;
          font-family:'Roboto Mono',san-serif;
          text-align: center;
          justify-content:center;
          align-items:center;
          font-size:2em;
          font-weight:400;
          padding:5em 4em;
          overflow:hidden;
          *::selection{
            color:white;
          }  
        }
        
      </style>
    </head>
    <body>
      <p>No user details found in session</p>
    </body>
    </html>

    `);
  }
});

module.exports = router;

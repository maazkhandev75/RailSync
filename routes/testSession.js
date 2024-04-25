const express = require('express');
const router = express.Router();

// Test route to check session
router.get('/sessionCheck', (req, res) => {
  // Check if user details are stored in the session
  if (req.session.userDetails) {
    // If user details are stored, display them
    res.send(`

    <html>
    <head>
      <style>
        body {
          background-color: #37b800;
          font-size:1.5em;
          font-weight: 900;

          *::selection{
            color:white;
          }  
        }
      </style>
    </head>
    <body>
      <h1>User details stored in session:</h1>
      <p>${JSON.stringify(req.session.userDetails)}</p>
    </body>
    </html>

    `);
  } else {
    // If user details are not stored, display a message
    res.send(`

    <html>
    <head>
      <style>
        body {
          background-color: #9e0000;
          font-size:2.5em;
          font-weight:900;
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

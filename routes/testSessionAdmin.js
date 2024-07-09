const express = require('express');
const router = express.Router();

// Test route to check session
router.get('/sessionCheckAdmin', (req, res) => {
  // Check if user details are stored in the session
  if (req.session.AdminDetails) {
    // If admin details are stored, display them
    res.send(`

    <html>
    <head>
      <style>
        body {
          background-color: #37b800;
          font-size:1.5em;
          font-weight: 900;
          padding:5em 2em;
          overflow:hidden;
          *::selection{
            color:white;
          }  
        }
      </style>
    </head>
    <body>
      <h1>Admin details stored in session:</h1>
      <p>${JSON.stringify(req.session.AdminDetails)}</p>
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
          padding:5em 4em;
          overflow:hidden;
          *::selection{
            color:white;
          }  
        }
        
      </style>
    </head>
    <body>
      <p>No Admin details found in session</p>
    </body>
    </html>

    `);
  }
});

module.exports = router;

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
              background-color: #37b800;
              font-family: 'Roboto Mono', sans-serif;
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              overflow-x: hidden;
          }
          .container {
              text-align: center;
              padding: 0 20px;  /* can also apply to h1 and p to do the same thing */
              box-sizing: border-box;
              width: 100%;
              max-width: 100%;
              overflow-wrap: break-word; /* Prevent text overflow */
              word-wrap: break-word; /* Prevent text overflow */
          }
          h1 {
              font-size: 1.6em;
              font-weight: 500;
          }
          p {
              font-weight: 400;
              font-size: 1.5em;
          }
          @media (max-width: 500px) {
            h1 {
                font-size: 1.5em;
            }
            p {
                font-size: 1.3em;
            }
        }

        @media (max-width: 400px) {
          h1 {
              font-size: 1.3em;
          }
          p {
              font-size: 1.1em;
          }
      }

          *::selection {
              color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>User details stored in session</h1>
          <p>${JSON.stringify(req.session.userDetails)}</p>
        </div>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
              background-color: #9e0000;
              font-family: 'Roboto Mono', sans-serif;
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              overflow-x: hidden;
          }
          .container {
              text-align: center;
              padding: 0 20px;  /* can also apply to h1 and p to do the same thing */
              box-sizing: border-box;
              width: 100%;
              max-width: 100%;
              overflow-wrap: break-word; /* Prevent text overflow */
              word-wrap: break-word; /* Prevent text overflow */
          }
          h1 {
              font-size: 1.6em;
              font-weight: 500;
          }
          p {
              font-weight: 400;
              font-size: 1.5em;
          }
          @media (max-width: 500px) {
            h1 {
                font-size: 1.5em;
            }
            p {
                font-size: 1.3em;
            }
        }

        @media (max-width: 400px) {
          h1 {
              font-size: 1.3em;
          }
          p {
              font-size: 1.1em;
          }
      }

          *::selection {
              color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p>No user details found in session</p>
        </div>
      </body>
      </html>
    `);
  }
});

module.exports = router;

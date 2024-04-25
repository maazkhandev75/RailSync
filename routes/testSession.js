const express = require('express');
const router = express.Router();

// Test route to check session
router.get('/test-session', (req, res) => {
  // Check if user details are stored in the session
  if (req.session.userDetails) {
    // If user details are stored, display them
    res.send(`User details stored in session: ${JSON.stringify(req.session.userDetails)}`);
  } else {
    // If user details are not stored, display a message
    res.send('No user details found in session');
  }
});

module.exports = router;

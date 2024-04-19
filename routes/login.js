const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Route handler for user signup
module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Call the stored procedure to authenticate the user
      const result = await pool.request()
        .input('UserName', sql.NVarChar(255), username)
        .input('Password', sql.NVarChar(255), password)
        .execute('authenticateUser');

      if (result.returnValue === 0) {
        // User account found, render the login form with a success message
        res.render('login', { successMessage: 'User logged in successfully!' });
      } 
	  
    } catch (error) {
		console.error('Error authenticating user:', error);  //for displaying on terminal ( the actual error )
		// Send the error message to the client side for display
		res.render('login', { errorMessage: 'User account not found! Please input valid credendials.' });
    }
  });

  return router;
};

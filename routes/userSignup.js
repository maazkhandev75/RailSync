const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Route handler for user signup
module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { username, cnic, password, phoneNo } = req.body;

    try {
      // Call the stored procedure to create a new user
      const result = await pool.request()
        .input('UserName', sql.NVarChar(255), username)
        .input('CNIC', sql.NVarChar(255), cnic)
        .input('Password', sql.NVarChar(255), password)
        .input('PhoneNo', sql.NVarChar(255), phoneNo)
        .execute('CreateUser');

      if (result.returnValue === 0) {
        // User created successfully, render the signup form with a success message
        res.render('userSignup', { successMessage: 'User created successfully! Now redirecting to LogIn Pg...' });
      }
    } catch (error) {
		//console.error('Error creating user:', error);  //for displaying on terminal ( the actual error )
		// Send the error message to the client side for display
		res.render('userSignup', { errorMessage: error });
    }
  });

  return router;
};

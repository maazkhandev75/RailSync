const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Route handler for user signup
module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { adminname, cnic, adminPin, phoneNo } = req.body;

    try {
      // Call the stored procedure to create a new user
      const result = await pool.request()
        .input('AdminName', sql.NVarChar(255), adminname)
        .input('CNIC', sql.NVarChar(255), cnic)
        .input('PIN', sql.NVarChar(255), adminPin)
        .input('PhoneNo', sql.NVarChar(255), phoneNo)
        .execute('CreateAdmin');

      if (result.returnValue === 0) {
        // User created successfully, render the signup form with a success message
        res.render('adminSignup', { successMessage: 'Admin created successfully! Now this admin has access to Admin Dashboard' });
      }
    } catch (error) {
		//console.error('Error creating user:', error);  //for displaying on terminal ( the actual error )
		// Send the error message to the client side for display
		res.render('adminSignup', { errorMessage: error });
    }
  });

  return router;
};

const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');

// Route handler for user signup
module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { adminPin } = req.body;

    try {
      // Call the stored procedure to authenticate the admin through secret pin
      const result = await pool.request()
        .input('PIN', sql.NVarChar(255), adminPin)
        .execute('AuthenticateAdmin');

      if (result.returnValue === 0)
	   {
        // admin authenitcated
        // we are saying the credentials of the admin user for implementing the functionality of session in the adminDash page
        
        const userDetails = {
          username: result.recordset[0].UserName,
          cnic: result.recordset[0].CNIC
        }; //we have to fetch username and id from database and no need to do this for cnic because we already have it because user entered it in the form

         // Save user details in session
         req.session.userDetails = userDetails;


         //pass success message obj to login.ejs to display success mesg on top
         res.render('adminLogin', { successMessage: 'Admin logged in successfully!' }); 
        } 
    } catch (error) {
		//console.error('Error authenticating user:', error);  //for displaying on terminal ( the actual error )
		// Send the error message to the client side for display
		res.render('adminLogin', { errorMessage: error });
    }
  });

  return router;
};

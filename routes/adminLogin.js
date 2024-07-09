const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');

// Route handler for user signup
module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { cnic, adminPin } = req.body;

    try {
      // Call the stored procedure to authenticate the admin through secret pin
      const result = await pool.request()
      .input('CNIC', sql.NVarChar(255), cnic)
      .input('PIN', sql.NVarChar(255), adminPin)
      .execute('AuthenticateAdmin');

      if (result.returnValue === 0)
	   {
        // admin authenitcated
        // we are saying the credentials of the admin user for implementing the functionality of session in the adminDash page
        
        const AdminDetails = {
          username: result.recordset[0].AdminName,
          cnic: cnic
        };

         // Save user details in session
         req.session.AdminDetails = AdminDetails;


         //pass success message obj to adminLogin.ejs to display success mesg on top
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

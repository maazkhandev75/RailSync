const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');

// Route handler for user signup
module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { password, newpassword } = req.body;
	  const cnic=req.session.userDetails.cnic;
    try {
      // Call the stored procedure to authenticate the user
      const result = await pool.request()
	  	  .input('CNIC', sql.NVarChar(255), cnic)
        .input('newPassword', sql.NVarChar(255), newpassword)
        .execute('ChangePassword');

      if (result.returnValue === 0) 
      {
         // Redirect the user to the profile page with a success message
         //console.log('password change successful!');
         res.redirect('profile');  
      }
      else
      {
      // If the stored procedure did not return 0, handle the error
      throw new Error('password change failed');
      } 

    } 
    catch (error) {
		 // Log and handle the error

     console.error('Error updating profile:', error);
     res.render('USER/passwordChangeDenied');
    //  res.status(500).send('password change failed');
    }
  });

  return router;
};

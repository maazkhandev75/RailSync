const express = require('express');
const router = express.Router();
const sql = require('mssql');
const fs = require('fs');

// Route handler for user signup
module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { name, phone } = req.body;

	const cnic=req.session.userDetails.cnic;
    try {
      // Call the stored procedure to authenticate the user
      const result = await pool.request()
	  	  .input('CNIC', sql.NVarChar(255), cnic)
        .input('UserName', sql.NVarChar(255), name)
        .input('PhoneNo', sql.NVarChar(255), phone)
        .execute('UpdateProfile');

      if (result.returnValue === 0) 
      {
         //console.log('profile update successful!');

          //res.render('USER/profile', { userCredentials });  //this one is for direct ejs loading but we have to again make a userCredentials obj and fetch updated credentials from database  //it also works
          res.redirect('profile');   //this one is for controller redirection //it is more efficient
      }
      else
      {
       // If the stored procedure did not return 0, handle the error
       throw new Error('Profile update failed');
      } 

    } 
    catch (error) 
    {
    // Log and handle the error
    //console.error('Error updating profile:', error);
    res.render('USER/profileUpdateDenied');
    // res.status(500).send('Profile update failed');
    }
  });

  return router;
};

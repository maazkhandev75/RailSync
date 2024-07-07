const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { username, cnic,phoneNo, password} = req.body;

    try {
      // Call the stored procedure to create a new user
      const result = await pool.request()
        .input('UserName', sql.NVarChar(255), username)
        .input('CNIC', sql.NVarChar(255), cnic)
        .input('PhoneNo', sql.NVarChar(255), phoneNo)
        .input('Password', sql.NVarChar(255), password)
        .execute('ResetUserPassword');

      if (result.returnValue === 0) {
        res.render('passwordReset', { successMessage: 'Password changed successfully' });
      }
    } catch (error) {
		res.render('passwordReset', { errorMessage: error });   //notice that we are rendering the page not requesting the server to redirect 
    }
  });

  return router;
};

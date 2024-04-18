const express = require('express');
const router=express.Router();
var sql=require('mssql');

module.exports = function(pool)
{
    router.get('/admin', (req, res) => {
        pool.query('SELECT * FROM Train')
            .then(result => {
                const Trains = result.recordset;
                res.render("admin", { Trains});
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Internal Server Error');
            });
      });

      return router;
};

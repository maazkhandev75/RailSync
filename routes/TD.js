const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = function(pool) {
    router.post('/searchCarriage', (req, res) => {
        console.log(req);
        var TrainID = req.body.searchTerm;

        const request = new sql.Request(pool);
        request.input('ID', sql.NVarChar, TrainID);

        request.execute('SearchForCarriage', (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                var Carriage = result.recordset;
                res.json({ Carriage: Carriage });
            }
        });
    });

    router.post('/searchSeat', (req, res) => {
      console.log(req);
      var CarriageID = req.body.searchTerm;

      const request = new sql.Request(pool);
      request.input('CARRIAGEID', sql.NVarChar, CarriageID);

      request.execute('SearchForSeats', (err, result) => {
          if (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
          } else {
              var Seat = result.recordset;
              res.json({ Seat: Seat });
          }
      });
  });



    return router;
};
